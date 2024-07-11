import type {
  Block as AdocBlock,
  Document as AdocDocument,
  Inline as AdocInline,
  Asciidoctor,
  Extensions,
  ProcessorOptions,
} from 'asciidoctor';

export const UnsupportedNode: unique symbol = Symbol('UnsupportedNode');

export type AdocNodeConverter<N extends AdocBlock | AdocInline | AdocDocument> = (node: N, opts?: any) => string | typeof UnsupportedNode;
export type AdocNodeConverters = Record<string, AdocNodeConverter<AdocBlock> | AdocNodeConverter<AdocInline> | AdocNodeConverter<AdocDocument>>;

export type AstroAdocxOptions = {
  astroFenced?: string;
  withAsciidocEngine?: (asciidoctorEngine: Asciidoctor) => void;
  withDocument?: (filePath: string, document: AdocDocument) => void;
  nodeConverters?: AdocNodeConverters;
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
