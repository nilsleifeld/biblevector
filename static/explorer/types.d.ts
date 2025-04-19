export {};

declare global {
  class HTMLPopoverElement extends HTMLElement {
    hidePopover: () => void;
  }

  namespace explorer {
    type Data = {};

    type Window = {
      windowId: string;
      book: number;
      chapter: number;
      selector: {
        book?: number;
      };
    };

    type Book = {
      name: string;
      isNewTestament: boolean;
      chapters: number[];
    };

    namespace api {
      type GetChapterResponse = {
        sections: ChapterSection[];
      };
      type GetChapterReferencesFromChapterResponse = {
        startVerse: number;
        endVerse: number;
        title: string;
        chapter: number;
        book: number;
        sectionId: number;
        references: ChapterReference[];
      };
      type ChapterSection = {
        book: number;
        chapter: number;
        sectionId: number;
        title: string;
        verses: Verse[];
      };
      type ChapterReference = {
        title: string;
        book: number;
        chapter: number;
        sectionId: number;
        startVerse: number;
        endVerse: number;
      };
      type Verse = {
        chapter: number;
        text: string;
        number: number;
      };
    }
  }
}
