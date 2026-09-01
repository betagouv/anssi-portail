<script lang="ts"></script>

<div class="illustration-vrai-faux" aria-hidden="true">
  <div class="reponse faux forme forme-vers-gauche">
    <img src="/assets/images/mini-tests/vrai-faux/pouce-bas.svg" alt="" />
    <span>Faux</span>
  </div>

  <div class="reponse vrai forme forme-vers-droite">
    <img src="/assets/images/mini-tests/vrai-faux/pouce-haut.svg" alt="" />
    <span>Vrai</span>
  </div>

  <div class="carte carte-1 carte-arriere"></div>
  <div class="carte carte-2 carte-gauche">
    <div class="lignes">
      <span></span>
      <span></span>
      <span></span>
    </div>
  </div>
  <div class="carte carte-3 carte-droite">
    <div class="lignes">
      <span></span>
      <span></span>
      <span></span>
    </div>
  </div>

  <div class="reaction reaction-reflexion bulle">
    <img src="/assets/images/mini-tests/vrai-faux/emoji-reflexion.png" alt="" />
  </div>
  <div class="reaction reaction-surprise bulle">
    <img src="/assets/images/mini-tests/vrai-faux/emoji-surpris.png" alt="" />
  </div>
  <div class="reaction reaction-lunettes bulle">
    <img src="/assets/images/mini-tests/vrai-faux/emoji-lunettes.png" alt="" />
  </div>

  <img class="boucle forme" src="/assets/images/mini-tests/vrai-faux/boucle.svg" alt="" />
  <svg class="trait" viewBox="0 0 127.821 60.0981" fill="none" aria-hidden="true">
    <path
      class="trace"
      pathLength="1"
      d="M4.38342 1.50036C-1.47231 14.2621 1.83446 30.5044 12.0992 40.1269C22.3639 49.7494 38.9666 51.9332 51.5048 45.3817C55.9827 42.9932 60.0473 39.5127 62.2518 35.0085C64.4563 30.5044 64.5941 24.7718 61.8384 20.5407C56.9472 12.9655 44.2712 13.3067 38.4844 20.1994C32.6976 27.0922 33.4554 37.9431 38.8289 45.177C44.2023 52.411 53.0893 56.4374 61.9762 57.8705C84.2968 61.4875 106.204 50.9778 126.32 40.8094"
      stroke="#000091"
      stroke-width="3"
      stroke-miterlimit="10"
      stroke-linecap="round"
    />
  </svg>
  <svg class="point" viewBox="0 0 11 11" fill="none" aria-hidden="true">
    <circle
      class="trace"
      pathLength="1"
      cx="5.5"
      cy="5.5"
      r="4"
      stroke="#000091"
      stroke-width="3"
      stroke-miterlimit="10"
      stroke-linecap="round"
    />
  </svg>
  <svg class="cercle" viewBox="0 0 21 21" fill="none" aria-hidden="true">
    <path
      class="trace"
      pathLength="1"
      d="M19.5 19.5C19.5 9.55887 11.4411 1.5 1.5 1.5"
      stroke="#000091"
      stroke-width="3"
      stroke-miterlimit="10"
      stroke-linecap="round"
    />
  </svg>
  <div class="curseur curseur-sur-place">
    <img src="/assets/images/mini-tests/vrai-faux/curseur.svg" alt="" />
  </div>
</div>

<style lang="scss">
  .illustration-vrai-faux {
    aspect-ratio: 3 / 2;
    container-type: inline-size;
    overflow: hidden;
    position: relative;
    width: 100%;
  }

  .reponse {
    align-items: center;
    display: flex;
    flex-direction: column;
    gap: 1.646cqi;
    height: 26.337cqi;
    justify-content: center;
    position: absolute;
    top: 20.165cqi;
    width: 21.399cqi;

    &.forme-vers-gauche,
    &.forme-vers-droite {
      animation-duration: 0.7s;
      animation-timing-function: ease-in-out;
    }

    img {
      height: 6.584cqi;
      width: 6.584cqi;
    }

    span {
      font-size: 2.881cqi;
      font-weight: 500;
      line-height: 4.938cqi;
    }

    &.faux.forme-vers-gauche {
      animation-name: apparition-reponse-gauche;
      background-color: var(--background-contrast-error);
      border-radius: 4.938cqi;
      color: var(--text-default-error);
      left: 0;
    }

    &.vrai.forme-vers-droite {
      animation-name: apparition-reponse-droite;
      background-color: var(--background-contrast-success);
      border-radius: 4.938cqi;
      color: var(--text-default-success);
      right: 0;
    }
  }

  .carte {
    background-color: var(--background-default-grey);
    border: 0.412cqi solid var(--border-default-blue-france);
    border-radius: 2.469cqi;
    box-shadow: 0 1.235cqi 3.704cqi rgba(0, 0, 18, 0.16);
    height: 44.801cqi;
    position: absolute;
    width: 44.801cqi;
  }

  .carte-arriere {
    bottom: 6.173cqi;
    left: 29.012cqi;
    z-index: 1;
  }

  .carte-gauche {
    left: 21.399cqi;
    top: 12.088cqi;
    transform: rotate(-4deg);
    z-index: 2;
  }

  .carte-droite {
    left: 37.813cqi;
    top: 6.379cqi;
    transform: rotate(4deg);
    z-index: 3;
  }

  .lignes {
    display: flex;
    flex-direction: column;
    gap: 2.469cqi;
    left: 2.984cqi;
    position: absolute;
    right: 2.881cqi;
    top: 12.963cqi;

    span {
      background-color: var(--blue-france-925-125);
      border-radius: 1.235cqi;
      height: 3.498cqi;

      &:first-child {
        width: 67%;
      }
    }
  }

  .reaction {
    align-items: center;
    background-color: var(--background-default-grey);
    border-radius: 999px;
    box-shadow: 0 0.412cqi 1.235cqi rgba(0, 0, 18, 0.16);
    display: flex;
    justify-content: center;
    position: absolute;
    z-index: 5;

    img {
      display: block;
    }
  }

  .reaction-reflexion {
    height: 16.461cqi;
    left: 79.835cqi;
    top: 1.646cqi;
    width: 16.461cqi;

    img {
      height: 9.877cqi;
      width: 9.877cqi;
    }
  }

  .reaction-surprise {
    height: 11.523cqi;
    left: 9.465cqi;
    top: 48.971cqi;
    width: 11.523cqi;

    img {
      height: 4.938cqi;
      width: 4.938cqi;
    }
  }

  .reaction-lunettes {
    height: 13.169cqi;
    left: 12.346cqi;
    top: 5.35cqi;
    width: 13.169cqi;

    img {
      height: 6.584cqi;
      width: 6.584cqi;
    }
  }

  .boucle,
  .trait,
  .point,
  .cercle,
  .curseur {
    position: absolute;
    z-index: 4;
  }

  .boucle {
    height: 8.23cqi;
    left: 56.46cqi;
    top: 43.42cqi;
    transform: rotate(20deg);
    width: 8.23cqi;
  }

  .illustration-vrai-faux > .trait {
    bottom: 5cqi;
    height: auto;
    right: 6.17cqi;
    transform: scaleX(-1) rotate(-30deg);
    transform-origin: center;
    width: 26.3cqi;
  }

  .illustration-vrai-faux > .point {
    height: 2.263cqi;
    left: 86.214cqi;
    top: 51.029cqi;
    width: 2.263cqi;
  }

  .illustration-vrai-faux > .cercle {
    height: 4.321cqi;
    left: 37.8cqi;
    top: 2.6cqi;
    transform: rotate(280deg);
    width: 4.321cqi;
  }

  .curseur {
    height: 5.331cqi;
    left: 64cqi;
    top: 45cqi;
    width: 4.98cqi;

    img {
      display: block;
      height: 100%;
      transform: rotate(-32deg);
      width: 100%;
    }
  }

  @keyframes apparition-reponse-gauche {
    0% {
      opacity: 0;
      transform: translateX(39.301cqi) scale(0.96);
    }
    70% {
      opacity: 1;
      transform: translateX(-0.6cqi) scale(1.015);
    }
    100% {
      opacity: 1;
      transform: none;
    }
  }

  @keyframes apparition-reponse-droite {
    0% {
      opacity: 0;
      transform: translateX(-39.301cqi) scale(0.96);
    }
    70% {
      opacity: 1;
      transform: translateX(0.6cqi) scale(1.015);
    }
    100% {
      opacity: 1;
      transform: none;
    }
  }
</style>
