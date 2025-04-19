import { html, nothing } from 'lit-html';
import { getBookDetails } from '../../shared/bible.js';

/**
 * @param {import('./../ctrl.js').Controllar} ctrl
 */
export function references(ctrl) {
  if (!ctrl.sectionIdOfReferences) return nothing;
  const section = ctrl.getSectionReferences(ctrl.sectionIdOfReferences);

  return html`
    <article class="relative flex flex-col min-w-[7rem] h-full border border-gray-200 rounded-lg">
      <header class="p-2 border-b border-gray-200 flex justify-center items-center">
        ${section
          ? html`
              <div class="tooltip tooltip-left" data-tip="${section?.title}">
                <h2 class="text-xs font-bold text-gray-500">
                  ${getBookDetails(section.book).abbreviation}
                  ${section.chapter},${section.startVerse}-${section.endVerse}
                </h2>
              </div>
            `
          : html` <div class="skeleton h-4 w-full"></div> `}
      </header>
      <ul class="flex flex-col grow p-1">
        ${section
          ? section.references.map((ref) => reference(ctrl, ref))
          : html`<div class="skeleton h-full w-full"></div>`}
      </ul>
    </article>
  `;
}

/**
 * @param {import('./../ctrl.js').Controllar} ctrl
 * @param {explorer.api.ChapterReference} ref
 */
function reference(ctrl, ref) {
  const book = getBookDetails(ref.book);

  return html`
    <li>
      <div class="tooltip tooltip-left" data-tip="${ref.title}">
        <button
          class="btn btn-ghost btn-sm h-auto p-1"
          @click="${() => ctrl.openReference(ref.book, ref.chapter, ref.sectionId)}"
        >
          <span>${book.abbreviation} ${ref.chapter},${ref.startVerse}-${ref.endVerse}</span>
        </button>
      </div>
    </li>
  `;
}
