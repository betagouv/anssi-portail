<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { ClassValue } from 'svelte/elements';
  import FilAriane, { type Props as PropriétésFilAriane } from './FilAriane.svelte';
  import type { Badge } from './badge.type';
  import GroupeDeBadges from './GroupeDeBadges.svelte';

  type Props = {
    actions?: Snippet;
    badges?: Badge[];
    description: string;
    illustration: Snippet;
    propriétésFilAriane?: PropriétésFilAriane;
    titre?: string;
    titreHtml?: Snippet;
    variante: 'bleu-clair' | 'vert-clair' | 'cafe-creme';
    mentionAdditionnelle?: string;
    class?: ClassValue;
  };

  const {
    actions,
    badges = [],
    description,
    illustration,
    propriétésFilAriane,
    titre,
    titreHtml,
    variante,
    mentionAdditionnelle,
    class: className,
  }: Props = $props();
</script>

<dsfr-container
  class={['conteneur', variante, className]}
  class:avecMentionAdditionnelle={!!mentionAdditionnelle}
  class:avecFilAriane={!!propriétésFilAriane}
>
  {#if propriétésFilAriane}
    <FilAriane {...propriétésFilAriane} />
  {/if}
  <div class="contenu-heros">
    <div class="contenu">
      <GroupeDeBadges {badges} />
      <h1 class="titre alternatif-md">
        {#if titreHtml}
          {@render titreHtml()}
        {:else}
          {titre}
        {/if}
      </h1>
      <p class="description texte-chapo-xl">{description}</p>
      {#if actions}
        <div class="actions">
          {@render actions()}
        </div>
      {/if}
    </div>
    <div class="illustration">
      {@render illustration()}
    </div>
  </div>
</dsfr-container>
{#if mentionAdditionnelle}
  <dsfr-container class="mention-additionnelle">
    {mentionAdditionnelle}
  </dsfr-container>
{/if}

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;
  @use '../../../assets/styles/grille' as *;

  .mention-additionnelle {
    background-color: var(--background-alt-brown-cafe-creme);
    color: #666666;
    font-size: 0.75rem;
    line-height: 1.25rem;
    padding-bottom: 2rem;
  }

  .conteneur {
    display: flex;
    padding-bottom: 6rem;

    &.avecMentionAdditionnelle {
      padding-bottom: 2rem;
    }

    &.bleu-clair {
      background: {
        image: url('/assets/images/motif-fond-heros-bleu-clair.avif'),
          linear-gradient(172deg, var(--blue-france-925-125) 0%, var(--blue-france-850-200) 87.91%);
        position:
          -139px -212px,
          center;
        repeat: no-repeat, no-repeat;
        size:
          1207px 1145px,
          cover;
      }

      @include a-partir-de(lg) {
        background: {
          position:
            calc(50% - 55px) -471px,
            center;
          size:
            1460px 1386px,
            cover;
        }
      }
    }

    &.cafe-creme {
      background-color: var(--background-alt-brown-cafe-creme);
      &.avec-image-fond {
        background: {
          image: url('/assets/images/motif-fond-heros-cafe-creme-mobile.avif');
          repeat: no-repeat;
          position: right -236px top;
        }

        @include a-partir-de(lg) {
          background-image: url('/assets/images/motif-fond-heros-cafe-creme.avif');
          background-position: left -296px top -188px;
        }
      }
    }

    &.vert-clair {
      background: {
        color: var(--background-contrast-green-bourgeon);
        image: url('/assets/images/motif-fond-heros-vert-clair.avif');
        position: calc(50% + 216px) -41px;
        repeat: no-repeat;
        size: 1660px 1162px;
      }

      @include a-partir-de(md) {
        background-size: 1546px 1082px;
        background-position-x: calc(50% + 335px);
      }

      @include a-partir-de(lg) {
        background-size: auto;
        background-position: right -286px top -214px;
      }
    }

    &.avecFilAriane {
      padding-top: 0;
    }

    .contenu-heros {
      display: grid;
      align-content: center;
      grid-template-areas:
        'contenu'
        'illustration';
      @include a-partir-de(lg) {
        grid-template-areas: 'contenu illustration';
        column-gap: 1.5rem;
        grid-template-columns: auto taille-pour-colonnes(5);
      }

      .contenu {
        grid-area: contenu;
        display: flex;
        flex-direction: column;
        justify-content: center;

        .titre {
          margin-bottom: 1rem;
          @include a-partir-de(lg) {
            margin-bottom: 1.5rem;
          }
        }

        .description {
          margin-bottom: 2rem;
        }

        .actions {
          display: flex;
          flex-direction: column;
          margin-bottom: 3rem;
          @include a-partir-de(md) {
            flex-direction: row;
          }
          @include a-partir-de(lg) {
            margin-bottom: 0;
          }
        }
      }
      .illustration {
        display: flex;
        margin: auto;
      }
    }
  }
</style>
