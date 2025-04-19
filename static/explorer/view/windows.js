import { html } from 'lit-html';
import { canOpenNextChapter, chapterKeyShort, getBookDetails, newBooks, oldBooks } from '../../shared/bible.js';
import { cn } from '../../shared/cn.js';
import { isCssAnchorSupport } from '../../shared/anchor.js';

/**
 * @param {import('./../ctrl.js').Controllar} ctrl
 */
export function windows(ctrl) {
  return html` <div class="flex grow justify-center gap-2">${ctrl.windows.map((w) => win(ctrl, w))}</div> `;
}

/**
 * @param {import('./../ctrl.js').Controllar} ctrl
 * @param {explorer.Window} win
 */
export function win(ctrl, { windowId, book, chapter, selector }) {
  let sections = ctrl.getChapter(book, chapter)?.sections;
  const chapterSelectorId = `popover-chapter-selector-${windowId}`;
  const tabsName = `popover-chapter-selector-tabs-name-${windowId}`;

  const selectedBook = selector.book ?? book;
  const selectedBookDetails = getBookDetails(selectedBook);

  return html`
    <div
      popover
      id="${chapterSelectorId}"
      style="top: anchor(--${chapterSelectorId} bottom); left: anchor(--${chapterSelectorId} center);"
      class="${cn('rounded-lg bg-base-100 border border-base-300', {
        'mt-1 -translate-x-1/2': isCssAnchorSupport(),
        'fixed inset-y-0 mx-auto my-auto': !isCssAnchorSupport(),
      })}"
    >
      <div class="tabs tabs-lift w-3xs">
        <input type="radio" name="${tabsName}" data-id="book" value="book" class="tab" aria-label="Buch" checked />
        <div class="tab-content bg-base-100 border-base-300 max-h-[15rem] overflow-y-scroll">
          <div class="grid grid-cols-2 p-1">
            ${[
              {
                title: 'AT',
                books: oldBooks,
              },
              {
                title: 'NT',
                books: newBooks,
              },
            ].map(
              (c) => html`
                <div>
                  <h5 class="text-lg px-2 py-2">${c.title}</h5>
                  <div class="flex flex-col">
                    ${c.books.map(
                      (b) => html`
                        <button
                          class="${cn('btn btn-sm p-2 justify-start', {
                            'btn-neutral btn-outline': b.number === selectedBook,
                            'btn-ghost': b.number !== selectedBook,
                          })}"
                          @click="${() => {
                            /** @type{HTMLInputElement | null} */
                            const chapterTab = document.querySelector(`input[name="${tabsName}"][value="chapter"]`);
                            if (!chapterTab) {
                              throw new Error('Chapter tab not found');
                            }
                            // jump to the chapter tab
                            chapterTab.checked = true;

                            ctrl.selectBookBySelector(windowId, b.number);
                          }}"
                          ?disabled="${b.number === selectedBook}"
                        >
                          ${b.name}
                        </button>
                      `,
                    )}
                  </div>
                </div>
              `,
            )}
          </div>
        </div>

        <input type="radio" name="${tabsName}" value="chapter" class="tab" aria-label="Kapitel" />
        <div class="tab-content bg-base-100 border-base-300 max-h-[15rem] overflow-y-scroll">
          <div class="flex flex-wrap justify-center p-2">
            ${Array.from({ length: selectedBookDetails.chapters }, (_, i) => i + 1).map(
              (chapter) => html`
                <button
                  class="btn btn-ghost btn-sm justify-center items-center size-8"
                  @click="${() => {
                    /** @type{HTMLPopoverElement | null} */
                    const popover = document.querySelector(`#${chapterSelectorId}`);
                    if (!popover) {
                      throw new Error('Popover not found');
                    }
                    // close the selector
                    popover.hidePopover();

                    /** @type{HTMLInputElement | null} */
                    const bookTab = document.querySelector(`input[name="${tabsName}"][data-id="book"]`);
                    if (!bookTab) {
                      throw new Error('Book tab not found');
                    }
                    // jump back to the book tab so that the book tab
                    // is open the next time you open it
                    bookTab.checked = true;

                    ctrl.openChapterBySelector(windowId, chapter);
                  }}"
                >
                  ${chapter}
                </button>
              `,
            )}
          </div>
        </div>
      </div>
    </div>
    <article
      class="relative flex flex-col w-full max-w-3xl min-w-2sm h-full overflow-y-scroll scrollbar border border-base-300 rounded-lg"
    >
      <header class="flex sticky p-1 top-0 bg-base-100 justify-between items-center">
        <div>
          <button
            class="btn btn-ghost p-2"
            @click="${() => ctrl.openPrevChapter(windowId)}"
            .disabled="${book === 1 && chapter === 1}"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="size-5"
              viewBox="0 0 16 16"
            >
              <path
                fill-rule="evenodd"
                d="M12 8a.5.5 0 0 1-.5.5H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5a.5.5 0 0 1 .5.5"
              />
            </svg>
          </button>
          <button
            class="btn btn-ghost p-2"
            @click="${() => ctrl.openNextChapter(windowId)}"
            .disabled="${!canOpenNextChapter(book, chapter)}"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="size-5"
              viewBox="0 0 16 16"
            >
              <path
                fill-rule="evenodd"
                d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8"
              />
            </svg>
          </button>
        </div>
        <button
          popovertarget="${chapterSelectorId}"
          class="btn btn-ghost px-2 text-sm"
          style="anchor-name: --${chapterSelectorId};"
        >
          ${chapterKeyShort(book, chapter)}
        </button>
        <div>
          <button
            class="btn btn-ghost p-2"
            ?disabled="${ctrl.windows.length <= 1}"
            @click="${() => ctrl.closeWindow(windowId)}"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="size-5"
              viewBox="0 0 16 16"
            >
              <path
                d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"
              />
            </svg>
          </button>
        </div>
      </header>
      <div class="px-5 pb-5 grow">
        ${sections
          ? sections.map(
              (section) => html`
                <section id="${ctrl.windowChapterSectionId(windowId, section.sectionId)}">
                  <h2>
                    <button
                      class="btn btn-ghost px-0 py-1 text-start h-auto text-lg my-3 font-bold"
                      @click="${() => ctrl.openReferences(section.sectionId)}"
                    >
                      ${section.title}
                    </button>
                  </h2>
                  <p class="text-justify">
                    ${section.verses.map(
                      (verse) => html`
                        <span>
                          <span class="text-xs text-gray-500">${verse.number}</span>
                          ${verse.text}
                        </span>
                      `,
                    )}
                  </p>
                </section>
              `,
            )
          : html`<div class="skeleton h-full w-full"></div>`}
      </div>
    </article>
  `;
}
