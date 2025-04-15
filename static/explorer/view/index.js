import { html } from 'lit-html';
import { windows } from './windows.js';
import { references } from './references.js';

/**
 * @param {import('./../ctrl.js').Controllar} ctrl
 */
export function view(ctrl) {
  return html`
    <div class="flex flex-col h-screen">
      <main class="overflow-auto grow flex gap-2 p-2">${windows(ctrl)} ${references(ctrl)}</main>
      <footer
        class="flex rounded-t-lg text-xs mx-2 justify-center items-center p-1 border text-gray-500 border-gray-200"
      >
        © This Bible is copyrighted, however it may be duplicated and used for non-commercial purposes only.
      </footer>
    </div>
  `;
}
