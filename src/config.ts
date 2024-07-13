import type {
  Document as AdocDocument,
  Asciidoctor,
  ProcessorOptions,
} from 'asciidoctor';


export type AstroAdocxOptions = {
  /**
   * This code block is automatically added to the generated Astro code's fenced code block on each file.
   * `docattrs` and `outline` variables are available to be referenced.
   */
  astroFenced?: string;
  /**
   * Hook to do any initializations with the asciidoctor.js engine.
   * For example to register extensions.
   */
  withAsciidocEngine?: (asciidoctorEngine: Asciidoctor) => Promise<void>;
  /**
   * Hook to do any modifications to the document object,
   * just after loading the file. But before converting it.
   *
   * @param filePath Path of the adoc file
   * @param document Asciidoctor.js document object
   */
  withDocument?: (filePath: string, document: AdocDocument) => Promise<void>;
  /**
   * Hook to do any modifications to the converted asciidoc document.
   * Converted asciidoc document is not necessarily HTML because it can have Astro components like <Image>.
   * Return the modified Astro template.
   *
   * @param filePath Path of the adoc file
   * @param astroTemplate Generated Astro template by converting the adoc file (does not include the Astro fence)
   */
  withConvertedDocument?: (filePath: string, astroTemplate: string) => Promise<string>;
  /**
   * Hook to do any modifications to the final generated Astro component code.
   * Return the modified Astro component code.
   *
   * @param filePath Path of the adoc file
   * @param astroComponent Final generated Astro component code string
   */
  withAstroComponent?: (filePath: string, astroComponent: string) => Promise<string>;
  /**
   * Astro layouts to use in the adoc files.
   * Add `:astro-layout: layoutName` in the document to use a named layout.
   * Defined args string will be passed to the layout as props.
   * ```
   * import AstroLayout from '${path}';
   * <AstroLayout ${args ?? ''} docattrs={docattrs} outline-{outline}>
   * ```
   */
  astroLayouts?: Record<string, {
    path: string;
    args?: string;
  }>;
  /**
   * Paths relative to project root to watch for changes and restart the dev server.
   * Paths must be relative to the project root and should be complete paths to files.
   */
  watchFiles?: string[];
};

export interface AdocOptions extends ProcessorOptions {
  // override attributes because asciidoctor types are wierd
  attributes?: Record<string, string | boolean>;
}
