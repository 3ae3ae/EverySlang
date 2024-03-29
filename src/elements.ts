//flex 블록
function flex_between(a: String, b: String) {
  return `<div style="display: flex; justify-content: space-between;"><span>${a}</span> <span>${b}</span></div>`;
}

/**
 *
 * @param a 태그
 * @param b text
 * @returns <a>b</a>
 */
function wrapWith(a: String, b: String) {
  return `<${a}>${b}</${a}>`;
}

function wrapImage(src: String) {
  return `<img src="${src}" />`;
}

export { flex_between, wrapImage, wrapWith };
