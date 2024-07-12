import type {
  Document as AdocDocument,
  Asciidoctor,
  Extensions,
  ProcessorOptions,
} from 'asciidoctor';


export type AstroAdocxOptions = {
  astroFenced?: string;
  withAsciidocEngine?: (asciidoctorEngine: Asciidoctor) => void;
  withDocument?: (filePath: string, document: AdocDocument) => void;
  astroLayouts?: Record<string, {
    path: string;
    args?: string;
  }>;
};

export interface AdocOptions extends ProcessorOptions {
  // override attributes because asciidoctor types are wierd
  attributes?: Record<string, string | boolean>;
}

export function isExtensionSingleton(registry: any): registry is typeof Extensions {
  return typeof registry.register === 'function';
}
