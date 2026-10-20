<script lang="ts">
  let { urlBase = '' }: { urlBase?: string } = $props();
</script>

<div class="illustration-hameconnage" aria-hidden="true">
  <div class="pastille alerte forme">
    <img crossorigin="anonymous" src={`${urlBase}/assets/images/mini-tests/hameconnage/alerte.svg`} alt="" />
  </div>
  <div class="pastille verifie forme">
    <img crossorigin="anonymous" src={`${urlBase}/assets/images/mini-tests/hameconnage/courriel-verifie.svg`} alt="" />
  </div>

  <div class="courriel carte carte-1 courriel-arriere">
    <div class="entete">
      <img crossorigin="anonymous" src={`${urlBase}/assets/images/mini-tests/hameconnage/courriel-carte.svg`} alt="" />
    </div>
    <div class="lignes">
      <span></span>
      <span></span>
      <span></span>
    </div>
  </div>
  <div class="courriel carte carte-2 courriel-gauche">
    <div class="entete">
      <img crossorigin="anonymous" src={`${urlBase}/assets/images/mini-tests/hameconnage/courriel-carte.svg`} alt="" />
    </div>
    <div class="lignes">
      <span></span>
      <span></span>
      <span></span>
    </div>
  </div>
  <div class="courriel carte carte-3 courriel-avant">
    <div class="entete">
      <img crossorigin="anonymous" src={`${urlBase}/assets/images/mini-tests/hameconnage/courriel-carte.svg`} alt="" />
    </div>
    <div class="lignes">
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>
  </div>

  <div class="reaction reaction-poisson bulle"><span>🐟</span></div>
  <div class="reaction reaction-surprise bulle"><span>😮</span></div>
  <div class="reaction reaction-canne bulle"><span>🎣</span></div>

  <svg class="arc" viewBox="0 0 21 21" fill="none" aria-hidden="true">
    <path
      class="trace"
      pathLength="1"
      d="M1.5 19.5C1.5 9.55887 9.55887 1.5 19.5 1.5"
      stroke="#000091"
      stroke-width="3"
      stroke-miterlimit="10"
      stroke-linecap="round"
    />
  </svg>
  <svg class="point" viewBox="0 0 8 8" fill="none" aria-hidden="true">
    <circle
      class="trace"
      pathLength="1"
      cx="4"
      cy="4"
      r="2.75"
      stroke="#000091"
      stroke-width="2.5"
      stroke-miterlimit="10"
      stroke-linecap="round"
    />
  </svg>
</div>

<style lang="scss">
  // Cotes issues de la maquette (cadre de 486 x 324 px), converties en cqi : 1 px = 0,2058 cqi.
  .illustration-hameconnage {
    aspect-ratio: 3 / 2;
    container-type: inline-size;
    overflow: hidden;
    position: relative;
    width: 100%;
  }

  .pastille {
    align-items: center;
    border-radius: 7cqi;
    display: flex;
    height: 24.897cqi;
    justify-content: center;
    position: absolute;
    width: 24.897cqi;
    z-index: 1;

    img {
      height: 6.584cqi;
      width: 6.584cqi;
    }

    &.alerte {
      background-color: var(--background-contrast-error);
      left: 6.379cqi;
      top: 5.35cqi;
    }

    &.verifie {
      background-color: var(--background-contrast-success);
      left: 73.457cqi;
      top: 22.222cqi;
    }
  }

  .courriel {
    background-color: var(--background-default-grey);
    border: 0.412cqi solid var(--border-default-blue-france);
    border-radius: 2.469cqi;
    box-shadow: 0 1.235cqi 3.704cqi rgba(0, 0, 18, 0.16);
    overflow: hidden;
    position: absolute;
  }

  .courriel-arriere {
    height: 37.654cqi;
    left: 37.474cqi;
    top: 13.169cqi;
    transform: rotate(4deg);
    width: 44.033cqi;
    z-index: 2;
  }

  .courriel-gauche {
    height: 36.214cqi;
    left: 24.691cqi;
    top: 17.49cqi;
    transform: rotate(-8deg);
    width: 44.444cqi;
    z-index: 3;
  }

  .courriel-avant {
    height: 37.243cqi;
    left: 31.852cqi;
    top: 18.642cqi;
    transform: rotate(2.5deg);
    width: 43.827cqi;
    z-index: 4;
  }

  .entete {
    background-color: var(--background-alt-grey);
    border-bottom: 0.206cqi solid var(--border-default-grey);
    box-sizing: border-box;
    height: 12.5cqi;
    padding: 3.292cqi;

    img {
      display: block;
      height: 5.35cqi;
      width: 5.35cqi;
    }
  }

  .lignes {
    display: flex;
    flex-direction: column;
    gap: 0.823cqi;
    padding: 2.058cqi 3.292cqi 0;

    span {
      background-color: var(--blue-france-925-125);
      border-radius: 1.235cqi;
      height: 2.058cqi;
      width: 84%;

      &:first-child {
        background-color: var(--border-default-grey);
        width: 44%;
      }

      &:last-child {
        width: 65%;
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

    span {
      font-family: 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', sans-serif;
      line-height: 1;
    }
  }

  .reaction-poisson {
    height: 14.198cqi;
    left: 76.749cqi;
    top: 4.63cqi;
    width: 14.198cqi;

    span {
      font-size: 6.173cqi;
    }
  }

  .reaction-surprise {
    height: 11.523cqi;
    left: 9.465cqi;
    top: 48.971cqi;
    width: 11.523cqi;

    span {
      font-size: 4.938cqi;
    }
  }

  .reaction-canne {
    height: 12.346cqi;
    left: 63.58cqi;
    top: 54.321cqi;
    width: 12.346cqi;

    span {
      font-size: 5.761cqi;
    }
  }

  .illustration-hameconnage > .arc,
  .illustration-hameconnage > .point {
    position: absolute;
    z-index: 5;
  }

  .illustration-hameconnage > .arc {
    height: 3.951cqi;
    left: 33.169cqi;
    top: 15.486cqi;
    width: 3.951cqi;
  }

  .illustration-hameconnage > .point {
    height: 1.646cqi;
    left: 86.214cqi;
    top: 51.029cqi;
    width: 1.646cqi;
  }
</style>
