const afficheOuMasque = (declencheur) => {
  document.querySelector(declencheur).addEventListener("click", () => {
    document.querySelector("#menu-mobile").classList.toggle("invisible");
  });
};

window.addEventListener("DOMContentLoaded", () => {
  afficheOuMasque("#menu-mobile-ouvrir");
  afficheOuMasque("#menu-mobile-fermer");
});
