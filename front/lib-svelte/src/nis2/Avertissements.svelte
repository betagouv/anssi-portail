<script lang="ts">
  import { clic } from '../directives/actions.svelte';
  import Modale from '../ui/Modale.svelte';

  type Props = {
    estBureau: boolean;
  };
  const { estBureau }: Props = $props();
  let detailsReCyFOuvert = $state<boolean>(false);
</script>

{#if !estBureau}
  <dsfr-alert type="info" size="sm" hasTitle={false}>
    <p slot="description" class="contenu">
      Cette page n’est pas optimisée pour un affichage mobile.
    </p>
  </dsfr-alert>
{/if}

<dsfr-alert type="info" size="sm" hasTitle={false} dismissible>
  <p slot="description" class="contenu">
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce blandit
    blandit mattis. Duis convallis orci dolor, in vulputate neque ultricies
    cursus. Vestibulum tempus quam quis scelerisque viverra. Vestibulum at
    luctus tortor, eu eleifend justo. Vivamus posuere diam ac ultricies gravida. <dsfr-link
      label="En savoir plus sur le référentiel ReCyF"
      href="#exigences"
      use:clic={() => {
        detailsReCyFOuvert = true;
      }}
    ></dsfr-link>
  </p>
</dsfr-alert>
{#if detailsReCyFOuvert}
  <Modale bind:estOuverte={detailsReCyFOuvert}>
    <h4>À propos de NIS&nbsp;2</h4>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Porta nam turpis
      ut amet faucibus porttitor. Metus, nisi, mauris condimentum id cursus eget
      purus feugiat leo. Praesent dictum purus ullamcorper eget vitae felis,
      sagittis vel pharetra. Pharetra, sit duis suspendisse risus, consequat,
      vitae, tristique egestas arcu. Velit praesent nulla eu et amet, eleifend
      ut nullam lorem. Condimentum gravida dui at pharetra ut. Dolor, ipsum
      nullam ac dis ac nunc, facilisis faucibus. Magna nulla ut eget duis eu
      lorem malesuada. Dignissim amet, nulla dolor viverra at mauris
      pellentesque faucibus. Porta at mi velit, et volutpat tincidunt urna in
      orci. Ut dui erat cras leo tempor vitae. Placerat amet quam porta odio
      laoreet quam amet, tellus non. Lectus sed tortor condimentum egestas leo.
      Tempus in elementum quis sed. Commodo, ullamcorper magna a, lectus metus,
      risus morbi. Adipiscing tincidunt lorem hendrerit orci, senectus sed
      lorem. Imperdiet nunc, ut ipsum non nulla nunc, adipiscing. Ultrices enim
      eu, consectetur augue sit laoreet aliquam venenatis. Eget leo vitae
      egestas nisi in nec cursus lobortis. Viverra sit turpis nunc convallis.
      Etiam vel sit lectus non, vitae aenean nisl cursus. Vitae ac purus, tempor
      velit urna volutpat vestibulum semper. Semper in fringilla tellus sapien
      scelerisque nisl, nisi. Viverra purus molestie malesuada viverra volutpat
      orci.
    </p>
  </Modale>
{/if}

<style lang="scss">
  dsfr-alert {
    margin-bottom: 1.5rem;
  }

  .contenu {
    margin: 0px 0 4px;
  }
</style>
