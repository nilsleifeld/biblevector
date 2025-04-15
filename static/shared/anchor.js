export function isCssAnchorSupport() {
  return CSS.supports('top', 'anchor(--test center)');
}
