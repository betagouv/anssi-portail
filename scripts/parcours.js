
const changeSectionActive = () => {
    const boutons = Array.from(
        document.querySelectorAll(".sommaire .groupe-boutons a"),
    );

    const trouveLesBoutons = (hash) =>
        boutons.filter((bouton) => new URL(bouton.href).hash === hash);

    boutons.forEach((s) => s.classList.remove("actif"));
    if (location.hash) {
        trouveLesBoutons(location.hash).forEach((bouton) =>
            bouton.classList.add("actif"),
        );
    } else {
        boutons[0].classList.add("actif");
    }
};

window.addEventListener("hashchange", changeSectionActive);
window.addEventListener("DOMContentLoaded", changeSectionActive);

// window.addEventListener("scroll", (e) => {
//     const element = document.getElementById("progresser")
//
//     let rect = element.getBoundingClientRect();
//     let ratio = ratioEspaceOccupe({top: rect.top, hauteur: rect.height, hauteurFenetre: window.innerHeight});
//     console.log(ratio);
// });

