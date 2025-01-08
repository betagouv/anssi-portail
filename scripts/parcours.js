const changeSectionActive = () => {
  const boutons = Array.from(
    document.querySelectorAll(".sommaire .groupe-boutons a"),
  );

  const trouveLesBoutons = (hash) =>
    boutons.filter((bouton) => new URL(bouton.href).hash === hash);

  boutons.forEach((s) => s.classList.remove("actif"));
  trouveLesBoutons(location.hash).forEach((bouton) =>
    bouton.classList.add("actif"),
  );
};

window.addEventListener("hashchange", changeSectionActive);
window.addEventListener("DOMContentLoaded", changeSectionActive);
