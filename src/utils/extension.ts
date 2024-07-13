import type { Extensions } from 'asciidoctor';

export function isExtensionRegistrySingleton(registry: any): registry is typeof Extensions {
  return typeof registry.register === 'function';
}
