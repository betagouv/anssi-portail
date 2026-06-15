<script lang="ts">
  import type { BoutonAction } from './toaster.store';
  import { glisse } from './transisitons';

  interface Props {
    niveau: 'info' | 'succes' | 'erreur' | 'alerte';
    titre: string;
    contenu: string;
    avecBoutonAction?: BoutonAction;
    avecOmbre?: boolean;
    avecAnimation?: boolean;
    avecFermeture?: boolean;
    onClose?: () => void;
  }

  let {
    niveau,
    titre,
    contenu,
    avecBoutonAction = undefined,
    avecOmbre = true,
    avecAnimation = true,
    avecFermeture = false,
    onClose,
  }: Props = $props();

  const icones = {
    info: 'icone_info',
    succes: 'icone_succes',
    erreur: 'icone_erreur',
    alerte: 'icone_alerte',
  };

  const transitionConditionnelle = (
    noeud: HTMLElement,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    options: Record<string, any>
  ) => {
    if (avecAnimation) return options.fonction(noeud, options);
  };
</script>

<article
  class={niveau}
  class:avecOmbre
  transition:transitionConditionnelle|global={{
    fonction: glisse,
    depuis: 'right',
    duree: 250,
  }}
>
  {#if avecFermeture}
    <button class="fermeture" onclick={() => onClose?.()} title="Fermeture du toast">✕</button>
  {/if}
  <div class="conteneur-icone">
    <div class="icone">
      <img src={`/assets/images/toasts/${icones[niveau]}.svg`} alt="" width="24" height="24" />
    </div>
  </div>
  <div class="conteneur-texte">
    <p class="titre">{titre}</p>
    <p class="texte">
      {contenu}
      {#if avecBoutonAction}
        <dsfr-button
          label={avecBoutonAction.label}
          kind="tertiary"
          size="md"
          has-icon
          icon={avecBoutonAction.icone}
          icon-place="left"
          markup="a"
          type="button"
          href={avecBoutonAction.href}
          target="blank"
        ></dsfr-button>
      {/if}
    </p>
  </div>
</article>

<style lang="scss">
  article {
    font-size: 0.8em;
    --couleur: transparent;
    border: 1px solid var(--couleur);
    display: flex;
    flex-direction: row;
    background: white;
    align-items: stretch;
    width: fit-content;
    min-width: 430px;
    max-width: 790px;
    position: relative;

    &.avecOmbre {
      box-shadow: 0 12px 20px 0 #0000001f;
    }

    &.info {
      --couleur: var(--background-flat-info);
    }

    &.succes {
      --couleur: var(--background-flat-success);
    }

    &.erreur {
      --couleur: var(--background-flat-error);
    }

    .fermeture {
      position: absolute;
      top: 8px;
      right: 12px;
      border: none;
      cursor: pointer;
      margin: 0;
      padding: 0;
      font-size: 0.875rem;
      font-weight: bold;
      color: var(--text-action-high-blue-france);
      background: none;
    }

    .conteneur-icone {
      background: var(--couleur);
      padding: 18px 10px;
    }

    .conteneur-texte {
      text-align: left;
      padding: 16px;

      p {
        margin: 0;
      }

      .titre {
        font-size: 1.25rem;
        font-weight: 700;
        line-height: 1.75rem;
        margin-bottom: 4px;
      }

      .texte {
        font-size: 1rem;
        font-weight: 400;
        line-height: 1.5rem;
      }
    }

    dsfr-button {
      margin-top: 16px;
    }
  }
</style>
