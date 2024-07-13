/**
 * This module provides a set of functions to create JSX-like strings.
 * Custom solution like this is useful because we are producing JSX-like strings
 * that can have expressions which are uncommon in HTML.
 * - for example to generate a string like: `<img src={import("image.jpg")}>`
 */

type child = string | false | undefined;

export interface Aprops {
  children?: child[];
  [key: string]: unknown;
}

export interface AfragProps {
  children: child[];
  slot?: string;
}

const VOIDS = new Set([
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'source',
  'track',
  'wbr',
]);

export class Aexpr {
  value: string;
  constructor(value: string) {
    this.value = value;
  }
  toString() {
    return this.value;
  }
}

/**
 * Useful to pass an expression as a string.
 * for example: `attr={aexpr('import("image.jpg")')}`
 * will produce: `attr={image("import.jpg")}`
 */
export function aexpr(value: any) {
  return new Aexpr(value);
}

function childrenToString(children: child[]) {
  return (children ?? [])
    .filter((child) => child !== false && child !== undefined && child !== null)
    .map((child: any): string => {
      if (Array.isArray(child)) return childrenToString(child);
      if (typeof child === 'object') return JSON.stringify(child);
      return child;
    })
    .join('');
}

/**
 * Create a JSX-like string.
 * - false / undefined / null children are skipped
 * - false / undefined / null attributes are skipped
 * - expression strings need to be wrapped in aexpr
 */
export function atag(tag: string, props: Aprops) {
  let attrs = '';
  const { children = [], ...rest } = props;
  for (let [key, val] of Object.entries(rest)) {
    if (val === true) {
      attrs += ' ' + key;
    } else if (val === false || val === undefined || val === null) {
      continue;
    } else if (typeof val === 'string' || val instanceof String) {
      attrs += ` ${key}="${val}"`;
    } else if (val instanceof Aexpr) {
      attrs += ` ${key}={${val}}`;
    } else {
      attrs += ` ${key}={${JSON.stringify(val)}}`;
    }
  }
  if (VOIDS.has(tag)) return `<${tag}${attrs}>`;
  return `<${tag}${attrs}>${childrenToString(children)}</${tag}>`;
}

export function afrag(props: AfragProps) {
  if (props.slot) {
    return atag('Fragment', { slot: props.slot, children: props.children });
  } else {
    return childrenToString(props.children);
  }
}
