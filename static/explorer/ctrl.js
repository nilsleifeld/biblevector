import { canOpenNextChapter, getBookDetails } from '../shared/bible.js';
import { randomID } from '../shared/id.js';
import { getBooksSections, getChapterReferencesFromSection, getData } from './api.js';
import { QueryClient } from '../shared/query.js';

export class Controllar {
  /** @type {number?} */
  sectionIdOfReferences = null;
  /** @type {explorer.Window[]} */
  windows = [];

  /**
   * @param {() => void} redraw
   */
  constructor(redraw) {
    this.redraw = redraw;
    this.data = getData();
    this.query = new QueryClient(redraw);
  }

  /**
   * @param {number} book
   * @param {number} chapter
   */
  getChapter(book, chapter) {
    return this.query.get({
      queryKey: ['books', book, 'chapters', chapter],
      queryFn: () => getBooksSections(book, chapter),
      enabled: !!book && !!chapter,
    });
  }

  /**
   * @param {number} book
   * @param {number} chapter
   */
  async openWindow(book, chapter) {
    this.windows.push({
      windowId: randomID(),
      book: book,
      chapter: chapter,
      selector: {},
    });
    this.redraw();
  }

  /**
   * @param {string} windowId
   */
  openNextChapter(windowId) {
    const win = this.getWindow(windowId);
    const book = getBookDetails(win.book);

    if (!canOpenNextChapter(win.book, win.chapter)) {
      return;
    }
    if (win.chapter === book.chapters) {
      win.book++;
      win.chapter = 1;
    } else {
      win.chapter++;
    }
    this.redraw();
  }

  /**
   * @param {string} windowId
   */
  openPrevChapter(windowId) {
    const win = this.getWindow(windowId);
    if (win.chapter !== 1) {
      win.chapter--;
      this.redraw();
      return;
    }
    if (win.book !== 1) {
      win.book--;
      win.chapter = getBookDetails(win.book).chapters;
      this.redraw();
    }
  }

  /**
   * @param {number} sectionId
   */
  getSectionReferences(sectionId) {
    return this.query.get({
      queryKey: ['sections', sectionId, 'references'],
      queryFn: () => getChapterReferencesFromSection(sectionId),
      enabled: !!sectionId,
    });
  }

  /**
   * @param {number} sectionId
   */
  openReferences(sectionId) {
    this.sectionIdOfReferences = sectionId;
    this.redraw();
  }

  /**
   * @param {string} windowId
   */
  closeWindow(windowId) {
    this.windows = this.windows.filter((w) => w.windowId !== windowId);
    this.redraw();
  }

  /**
   * @param {string} windowId
   * @param {number} chapter
   */
  openChapterBySelector(windowId, chapter) {
    const win = this.getWindow(windowId);
    const book = win.selector.book ?? win.book;
    win.selector.book = undefined;
    win.book = book;
    win.chapter = chapter;
    this.redraw();
  }

  /**
   * @param {string} windowId
   */
  getWindow(windowId) {
    const win = this.windows.find((w) => w.windowId === windowId);
    if (!win) {
      throw new Error(`Window with id ${windowId} not found`);
    }
    return win;
  }

  /**
   * @param {string} windowId
   * @param {number} book
   */
  selectBookBySelector(windowId, book) {
    const win = this.getWindow(windowId);
    win.selector.book = book;
    this.redraw();
  }
}
