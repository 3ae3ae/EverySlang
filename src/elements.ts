//flex 블록
function flex_between(a: string, b: string) {
  return `<div style="display: flex; justify-content: space-between;"><span>${a}</span> <span>${b}</span></div>`;
}

/**
 *
 * @param a 태그
 * @param b text
 * @returns <a>b</a>
 */
function wrapWith(a: string, b: string) {
  return `<${a}>${b}</${a}>`;
}

function wrapImage(src: string) {
  return `<img src="${src}" />`;
}

export { flex_between, wrapImage, wrapWith };
