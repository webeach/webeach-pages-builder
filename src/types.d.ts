import type * as Mdast from 'mdast';

declare module 'mdast' {
  interface Section {
    type: 'section';
    depth: number;
    children: Mdast.RootContent[];
  }

  interface Widget {
    type: 'widget';
    name: string;
    data?: Record<string, any>;
  }

  interface Code {
    metaData?: Record<string, string | number | boolean | null>;
    valueHtml?: string;
  }

  interface RootContentMap {
    section: Section;
    widget: Widget;
  }
}
