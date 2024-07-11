import type { AbstractNode, Asciidoctor, Html5Converter } from 'asciidoctor';
import { builtinNodeConverters } from './nodeConverters/index.js';
import { AstroAdocxOptions, UnsupportedNode, type AdocNodeConverters } from './types.js';

class Converter {
  baseConverter: Html5Converter;
  nodeConverters: AdocNodeConverters;
  backendTraits = {
    supports_templates: false,
  };

  constructor(asciidoctorEngine: Asciidoctor, nodeConverters: AdocNodeConverters) {
    this.baseConverter = asciidoctorEngine.Html5Converter.create();
    this.nodeConverters = nodeConverters;
  }

  convert(node: AbstractNode, transform?: string, opts?: any) {
    const nodeName = transform ?? node.getNodeName();
    // console.log(`Processing ${nodeName}`);
    const nodeConverter = this.nodeConverters[nodeName];
    if (nodeConverter !== undefined) {
      // console.log(`Found node conveter ${nodeName}`);
      // @ts-expect-error: nodeName selector should correctly pick the correct node type
      const converted = nodeConverter(node, opts);
      if (converted !== UnsupportedNode) {
        return converted;
      }
    }
    const builtinNodeConverter = builtinNodeConverters[nodeName];
    if (builtinNodeConverter !== undefined) {
      // console.log(`Found builtin node converter ${nodeName}`);
      // @ts-expect-error: nodeName selector should correctly pick the correct node type
      const converted = builtinNodeConverter(node, opts);
      if (converted !== UnsupportedNode) {
        return converted;
      }
    }
    // console.log(`Using default backend converter for ${nodeName}`);
    return this.baseConverter.convert(node, transform, opts);
  }
}

export const register = (asciidoctorEngine: Asciidoctor, adocxConfig: AstroAdocxOptions) => {
  const converter = new Converter(asciidoctorEngine, adocxConfig.nodeConverters ?? {});
  asciidoctorEngine.ConverterFactory.register(converter, ['html5']);
};
