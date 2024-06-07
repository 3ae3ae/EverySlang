import { elementOption } from "./model";

export const makeElement = (name: string, option?: elementOption) => {
  const $e = document.createElement(name);
  if (!option) return $e;
  if (option.textContent) $e.textContent = option.textContent;
  if (option.child)
    if (option.child instanceof Node) $e.appendChild(option.child);
    else $e.append(...option.child);
  if (option.attribute && option.value) {
    if (
      typeof option.attribute === "string" &&
      typeof option.value === "string"
    ) {
      option.attribute = [option.attribute];
      option.value = [option.value];
    }
    for (let i = 0; i < option.attribute.length; ++i)
      $e.setAttribute(option.attribute[i], option.value[i]);
  }
  if (option.class) {
    if (typeof option.class === "string") option.class = [option.class];
    for (const c of option.class) {
      $e.classList.add(c);
    }
  }
  return $e;
};

export function cleanURL() {
  if (window.location.pathname.includes("index.html")) {
    history.replaceState(null, "", "/");
  }
  if (window.location.pathname.includes(".html")) {
    history.replaceState(
      null,
      "",
      window.location.pathname.replace(".html", "")
    );
  }
}
