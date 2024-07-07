import type {
  AbstractNode,
  Document as AdocDocument,
  Asciidoctor,
  Extensions,
  ProcessorOptions,
} from 'asciidoctor';

export const UnsupportedNode: unique symbol = Symbol('UnsupportedNode');

export type Template<N = AbstractNode> = {
  convert: (node: N, opts?: any) => string | typeof UnsupportedNode;
};

export type AstroAdocxOptions = {
  astroFenced?: string;
  withAsciidocEngine?: (asciidoctorEngine: Asciidoctor) => void;
  withDocument?: (filePath: string, document: AdocDocument) => void;
  templates?: Record<string, Template>;
};

export interface AdocOptions extends ProcessorOptions {
  // override attributes because asciidoctor types are wierd
  attributes?: Record<string, string | boolean>;
}

export function isExtensionSingleton(registry: any): registry is typeof Extensions {
  return typeof registry.register === 'function';
}
