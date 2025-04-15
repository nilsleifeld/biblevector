/**
 * @param {number} book
 * @param {number} chapter
 * @returns {Promise<explorer.api.GetChapterResponse>}
 */
export function getBooksSections(book, chapter) {
  return fetch(`/explorer/api/books/${book}/chapters/${chapter}/sections`)
    .then((response) => response.json())
    .catch((error) => console.error('Error fetching books:', error));
}

/**
 * @param {number} sectionId
 * @returns {Promise<explorer.api.GetChapterReferencesFromChapterResponse>}
 */
export function getChapterReferencesFromSection(sectionId) {
  return fetch(`/explorer/api/sections/${sectionId}/references`)
    .then((response) => response.json())
    .catch((error) => console.error('Error fetching books:', error));
}

/**
 * @returns {explorer.Data}
 */
export function getData() {
  const scriptDataElement = document.querySelector('#data');
  if (!scriptDataElement) {
    throw new Error('Script data element not found');
  }
  const json = scriptDataElement.innerHTML;
  // TODO: Fix backend to return actual JSON instead of a double-serialized string – this double parse is a workaround
  return JSON.parse(JSON.parse(json));
}
