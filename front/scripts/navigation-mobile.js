const monteZoneIdentificationMobile = () => {
  document.getElementById('zone-identification-mobile').appendChild(document.getElementById('zone-identification'));
}

const afficheOuMasque = (declencheur) => {
  document.querySelector(declencheur).addEventListener("click", () => {
    document.querySelector("#menu-mobile").classList.toggle("invisible");
    if (declencheur === "#menu-mobile-ouvrir") monteZoneIdentificationMobile()
  });
};

window.addEventListener("DOMContentLoaded", () => {
  afficheOuMasque("#menu-mobile-ouvrir");
  afficheOuMasque("#menu-mobile-fermer");
});
