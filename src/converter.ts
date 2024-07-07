import type { AbstractNode, Asciidoctor, Html5Converter } from 'asciidoctor';
import { UnsupportedNode, type Template } from './types.js';
import { builtinTemplates } from './templates/index.js';

class Converter {
  baseConverter: Html5Converter;
  templates: Record<string, Template | undefined>;
  backendTraits = {
    supports_templates: false,
  };

  constructor(asciidoctorEngine: Asciidoctor, templates: Record<string, Template>) {
    this.baseConverter = asciidoctorEngine.Html5Converter.create();
    this.templates = templates;
  }

  convert(node: AbstractNode, transform?: string, opts?: any) {
    const nodeName = transform ?? node.getNodeName();
    // console.log(`Processing ${nodeName}`);
    const template = this.templates[nodeName];
    if (template !== undefined) {
      // console.log(`Found template ${nodeName}`);
      const converted = template.convert(node, opts);
      if (converted !== UnsupportedNode) {
        return converted;
      }
    }
    const builtinTemplate = builtinTemplates[nodeName];
    if (builtinTemplate !== undefined) {
      // console.log(`Found builtin template ${nodeName}`);
      const converted = builtinTemplate.convert(node, opts);
      if (converted !== UnsupportedNode) {
        return converted;
      }
    }
    // console.log(`No template found for ${nodeName}`);
    return this.baseConverter.convert(node, transform, opts);
  }
}

export const register = (asciidoctorEngine: Asciidoctor, templates: Record<string, Template>) => {
  const converter = new Converter(asciidoctorEngine, templates);
  asciidoctorEngine.ConverterFactory.register(converter, ['html5']);
};
