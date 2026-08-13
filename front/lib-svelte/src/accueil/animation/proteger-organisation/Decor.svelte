<script lang="ts">
  const LARGEUR_PISTE = 188;

  const { progression = 0 }: { progression?: number } = $props();

  const largeurRemplie = $derived(Math.round(Math.max(0, Math.min(1, progression)) * LARGEUR_PISTE * 100) / 100);
</script>

<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="-14 0 621 395"
  ><g class="cartes-groupe"
    ><rect width="360" height="244" x="114" y="74" fill="#fff" rx="16" /><g
      ><rect width="102" height="102" x="127" y="87" stroke="#cacafb" stroke-width="2" rx="9" /><circle
        cx="158"
        cy="118"
        r="15"
        fill="#fff"
        stroke="#cacafb"
        stroke-width="2"
      /><g fill="#e3e3fd"
        ><rect width="72" height="6" x="142" y="144" rx="3" /><rect width="72" height="6" x="142" y="156" rx="3" /><rect
          width="33"
          height="6"
          x="142"
          y="168"
          rx="3"
        /></g
      ></g
    ><g
      ><rect width="102" height="102" x="243" y="87" stroke="#cacafb" stroke-width="2" rx="9" /><circle
        cx="274"
        cy="118"
        r="15"
        fill="#fff"
        stroke="#cacafb"
        stroke-width="2"
      /><g fill="#e3e3fd"
        ><rect width="72" height="6" x="258" y="144" rx="3" /><rect width="72" height="6" x="258" y="156" rx="3" /><rect
          width="33"
          height="6"
          x="258"
          y="168"
          rx="3"
        /></g
      ></g
    ><g
      ><rect width="102" height="102" x="359" y="87" stroke="#cacafb" stroke-width="2" rx="9" /><circle
        cx="390"
        cy="118"
        r="15"
        fill="#fff"
        stroke="#cacafb"
        stroke-width="2"
      /><g fill="#e3e3fd"
        ><rect width="72" height="6" x="374" y="144" rx="3" /><rect width="72" height="6" x="374" y="156" rx="3" /><rect
          width="33"
          height="6"
          x="374"
          y="168"
          rx="3"
        /></g
      ></g
    ><g
      ><rect width="102" height="102" x="127" y="203" stroke="#cacafb" stroke-width="2" rx="9" /><circle
        cx="158"
        cy="234"
        r="15"
        fill="#fff"
        stroke="#cacafb"
        stroke-width="2"
      /><g fill="#e3e3fd"
        ><rect width="72" height="6" x="142" y="260" rx="3" /><rect width="72" height="6" x="142" y="272" rx="3" /><rect
          width="33"
          height="6"
          x="142"
          y="284"
          rx="3"
        /></g
      ></g
    ><g
      ><rect width="102" height="102" x="243" y="203" stroke="#cacafb" stroke-width="2" rx="9" /><circle
        cx="274"
        cy="234"
        r="15"
        fill="#fff"
        stroke="#cacafb"
        stroke-width="2"
      /><g fill="#e3e3fd"
        ><rect width="72" height="6" x="258" y="260" rx="3" /><rect width="72" height="6" x="258" y="272" rx="3" /><rect
          width="33"
          height="6"
          x="258"
          y="284"
          rx="3"
        /></g
      ></g
    ><g
      ><rect width="102" height="102" x="359" y="203" stroke="#cacafb" stroke-width="2" rx="9" /><circle
        cx="390"
        cy="234"
        r="15"
        fill="#fff"
        stroke="#cacafb"
        stroke-width="2"
      /><g fill="#e3e3fd"
        ><rect width="72" height="6" x="374" y="260" rx="3" /><rect width="72" height="6" x="374" y="272" rx="3" /><rect
          width="33"
          height="6"
          x="374"
          y="284"
          rx="3"
        /></g
      ></g
    ></g
  ><g class="progression"
    ><rect width="200" height="24" x="194" y="38" fill="#fff" rx="12" /><g
      ><rect width="188" height="12" x="200" y="44" fill="#e3e3fd" rx="6" /><rect
        width={largeurRemplie}
        height="12"
        x="200"
        y="44"
        fill="#6a6af4"
        class="remplissage"
        rx="6"
      /></g
    ></g
  ></svg
>

<style lang="scss">
  .remplissage {
    transition: width 0.6s ease;
  }

  @media (prefers-reduced-motion: reduce) {
    .remplissage {
      transition: none;
    }
  }
</style>
