import { elementLePlusVisible } from "./scroll.js";

const sectionsSommaireReplie = () =>
  Array.from(document.querySelectorAll(".sommaire.sommaire-replie ul li"));

const trouveLesLiDuSommaireReplie = (hash) =>
  sectionsSommaireReplie().filter(
    (li) => new URL(li.querySelector("a").href).hash === hash,
  );

const trouveLesLiDesSommaires = (hash) =>
  Array.from(document.querySelectorAll(".sommaire ul li")).filter(
    (li) => new URL(li.querySelector("a").href).hash === hash,
  );

const trouveLeTexte = (hash) =>
  trouveLesLiDuSommaireReplie(hash)[0].textContent;

const desactiveTousLesItems = () => {
  const sections = Array.from(document.querySelectorAll(".sommaire ul li"));
  sections.forEach((s) => s.classList.remove("actif"));
};

const activeItems = (idPourSurlignage) =>
  trouveLesLiDesSommaires(idPourSurlignage).forEach((li) =>
    li.classList.add("actif"),
  );

const metsAJourLeTexteDeLaSectionActive = (hash) => {
  document.querySelector("#section-active").textContent =
    trouveLeTexte(hash) ?? "";
};

const metsAJourSectionActive = (hashSectionActive) => {
  desactiveTousLesItems();
  metsAJourLeTexteDeLaSectionActive(hashSectionActive);
  activeItems(hashSectionActive);
};

const changeSectionActive = () => {
  document.querySelector("details").removeAttribute("open");
  if (location.hash) metsAJourSectionActive(location.hash);
};

let scrollEnAttenteDeMiseAJour = false;

const scrolle = () => {
  if (!scrollEnAttenteDeMiseAJour) {
    scrollEnAttenteDeMiseAJour = true;
    setTimeout(() => {
      const sections = document.querySelectorAll(".article .contenu section");
      const laPlusVisible = elementLePlusVisible(
        [...sections],
        window.innerHeight,
      );

      if (!laPlusVisible) return;
      metsAJourSectionActive(`#${laPlusVisible.id}`);
      scrollEnAttenteDeMiseAJour = false;
    }, 400);
  }
};

window.addEventListener("hashchange", changeSectionActive);
window.addEventListener("DOMContentLoaded", changeSectionActive);
window.addEventListener("scroll", scrolle);

window.ouvreModaleVideo = (lien) => {
  document.getElementById("modale-video").style.display = "block";
  let video = document.querySelector("#modale-video video");
  video.setAttribute("src", lien);
  video.play();
};

window.fermeModaleVideo = () => {
  document.getElementById("modale-video").style.display = "none";
  const video = document.querySelector("#modale-video video");
  video.pause();
  video.currentTime = 0;
};
