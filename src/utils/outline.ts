import type { Document as AdocDocument, Section } from 'asciidoctor';

export interface Outline {
  id: string;
  title: string;
  level: number;
  sectnum: string | undefined;
  sections: Outline[];
}

function isSection(node: AdocDocument | Section): node is Section {
  return node.getNodeName() === 'section';
}

function getOutline(node: AdocDocument | Section): Outline {
  const sections = node.getSections();
  return {
    id: node.getId(),
    title: node.getTitle() ?? 'ERROR: No title found',
    level: node.getLevel(),
    sectnum: isSection(node) && node.isNumbered() ? node.getSectionNumber() : undefined,
    sections: sections.map((section) => getOutline(section)),
  };
}

export { getOutline };
