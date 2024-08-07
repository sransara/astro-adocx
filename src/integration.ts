// import fs from 'node:fs';
import appRoot from 'app-root-path';
import type { Asciidoctor, ProcessorOptions } from 'asciidoctor';
import asciidoctor from 'asciidoctor';
import type { AstroIntegration } from 'astro';
import { type CompileAstroResult } from 'astro/dist/vite-plugin-astro/compile.js';
import { register as postprocessorLayoutRegisterHandle } from '#src/extensions/postprocessorAstroLayout';
import subSpecialchars from '#src/patches/sub_specialchars';
import { getOutline } from '#src/utils/outline';
import { decodeSpecialChars } from '#src/utils/string';
import type { AdocOptions, AstroAdocxOptions } from '#src/config';

const adocxExtension = '.adoc';

async function compileAdoc(
  asciidoctorEngine: Asciidoctor,
  fileId: string,
  adocxConfig: AstroAdocxOptions,
  asciidoctorConfig: ProcessorOptions,
) {
  const document = asciidoctorEngine.loadFile(fileId, asciidoctorConfig);
  if (adocxConfig.withDocument) {
    await adocxConfig.withDocument(fileId, document);
  }
  let converted = document.convert();
  if (adocxConfig.withConvertedDocument) {
    converted = await adocxConfig.withConvertedDocument(fileId, converted);
  }
  const docattrs = document.getAttributes() as Record<string, string | undefined>;
  const outline = getOutline(document);
  // Astro component's fenced code declared in the config
  const adocxConfigAstroFenced = adocxConfig.astroFenced ?? '';
  // Astro component's fenced code added by the templates
  const astroFenced = decodeSpecialChars(document.getAttribute('astro-fenced') ?? '');
  // Astro component's fenced code declared in the document itself
  const frontMatter = decodeSpecialChars(document.getAttribute('front-matter') ?? '');

  let astroComponent = `---
let docattrs = ${JSON.stringify(docattrs)};
let outline = ${JSON.stringify(outline)};
${adocxConfigAstroFenced.trim()}
${astroFenced.trim()}
${frontMatter.trim()}
---
${converted.trim()}
`;
  if (adocxConfig.withAstroComponent) {
    astroComponent = await adocxConfig.withAstroComponent(fileId, astroComponent);
  }
  return astroComponent;
}

export function adocx(
  adocxConfig: AstroAdocxOptions,
  asciidoctorConfig: AdocOptions,
): AstroIntegration {
  let _compileAdoc: (filename: string) => Promise<string>;
  let _compileAstro: (code: string, filename: string) => Promise<CompileAstroResult>;
  return {
    name: '@sransara/astro-adocx',
    hooks: {
      async 'astro:config:setup'({
        config: astroConfig,
        updateConfig,
        // @ts-expect-error: `addPageExtension` is part of the private api
        addPageExtension,
        logger,
        addWatchFile,
        isRestart
      }) {
        // astro/dist/vite-plugin-astro is not exported by the astro package,
        // so try to workaround by dynamically importing file through node_modules
        const { compileAstro } = await import(
          /* @vite-ignore */ appRoot.resolve('node_modules/astro/dist/vite-plugin-astro/compile.js')
        );

        // Tell Astro to handle .adoc files as page routes
        addPageExtension(adocxExtension);

        // Opal.Asciidoctor implementation is a global object, and doesn't get reloaded on restarts
        let asciidoctorEngine: Asciidoctor;
        if (!isRestart) {
          asciidoctorEngine = asciidoctor();
          subSpecialchars.patch();
        }
        else {
          // @ts-expect-error: Opal is a global object
          asciidoctorEngine = Opal.Asciidoctor;
          // on soft restarts the extensions are preserved, so we need to unregister them to avoid duplicate extensions
          asciidoctorEngine.Extensions.unregisterAll();
        }

        postprocessorLayoutRegisterHandle(asciidoctorEngine.Extensions, adocxConfig);
        await adocxConfig.withAsciidocEngine?.(asciidoctorEngine);

        // Default asciidoctor config that makes sense in this context
        asciidoctorConfig.standalone = false;
        asciidoctorConfig.safe = 'server';
        asciidoctorConfig.backend = 'html5';
        if (asciidoctorConfig.attributes === undefined) {
          asciidoctorConfig.attributes = {};
        }
        // allow astro code fences at the beginning
        asciidoctorConfig.attributes['skip-front-matter'] = true;

        _compileAdoc = async (filename) => {
          return compileAdoc(asciidoctorEngine, filename, adocxConfig, asciidoctorConfig);
        };

        adocxConfig.watchFiles?.forEach((file) => {
          addWatchFile(new URL(file, astroConfig.root));
        });

        updateConfig({
          vite: {
            plugins: [
              {
                name: 'vite-astro-adocx',
                enforce: 'pre',
                configResolved(viteConfig) {
                  _compileAstro = async (code, filename) => {
                    const result = await compileAstro({
                      compileProps: {
                        astroConfig,
                        viteConfig,
                        preferences: new Map() as any, // not sure how to get this from astro
                        filename,
                        source: code,
                      },
                      astroFileToCompileMetadata: new Map(),
                      logger: logger as any, // not sure if we can do any better here
                    });
                    return result;
                  };
                },
                async load(fileId) {
                  if (!fileId.endsWith(adocxExtension)) {
                    return;
                  }
                  // console.log('Loading', fileId);
                  try {
                    const astroComponent = await _compileAdoc(fileId);
                    // fs.writeFileSync(`${fileId}.debug.astro`, astroComponent);
                    return {
                      code: astroComponent,
                      map: { mappings: '' },
                    };
                  } catch (e) {
                    console.error(e);
                    throw new Error(`Error processing adoc file: ${fileId}: ${e}`);
                  }
                },
                async transform(source, fileId) {
                  if (!fileId.endsWith(adocxExtension)) {
                    return;
                  }
                  // console.log('Transforming', fileId);
                  const astroComponent = source;
                  let transformResult: CompileAstroResult;
                  try {
                    transformResult = await _compileAstro(astroComponent, fileId);
                    const astroMetadata = {
                      clientOnlyComponents: transformResult.clientOnlyComponents,
                      hydratedComponents: transformResult.hydratedComponents,
                      scripts: transformResult.scripts,
                      containsHead: transformResult.containsHead,
                      propagation: transformResult.propagation ? 'self' : 'none',
                      pageOptions: {},
                    };
                    return {
                      code: transformResult.code,
                      map: transformResult.map,
                      meta: {
                        astro: astroMetadata,
                        vite: {
                          // Setting this vite metadata to `ts` causes Vite to resolve .js
                          // extensions to .ts files.
                          lang: 'ts',
                        },
                      },
                    };
                  } catch (err) {
                    // @ts-expect-error: Inject a fake file id to the error object
                    err.loc.file = `${fileId}.debug.astro`;
                    // @ts-expect-error: Try to inject a file content to the error object
                    err.fullCode = astroComponent;
                    throw err;
                  }
                },
              },
            ],
          },
        });
      },
    },
  };
}
