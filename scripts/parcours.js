import { elementLePlusVisible } from "./scroll.js";

window.addEventListener("scroll", () => {
  const sections = document.getElementsByClassName("action");
  const laPlusVisible = elementLePlusVisible([...sections], window.innerHeight);

  if (!laPlusVisible) return;

  document
    .querySelectorAll(".sommaire a")
    .forEach((element) => element.classList.remove("actif"));

  const idPourSurlignage = `#${laPlusVisible.id}`;
  const cible = document.querySelector(
    `.sommaire a[href='${idPourSurlignage}']`,
  );
  cible.classList.add("actif");
});
