<script lang="ts">
  interface Props {
    dictionnaireAncreLibelle: Record<string, string>;
    mode: 'desktop' | 'mobile';
    tags: string[] | undefined;
  }

  let { dictionnaireAncreLibelle, mode, tags = [] }: Props = $props();
  let detailsElement: HTMLDetailsElement | undefined = $state();

  const fermeSommaire = () => {
    if (detailsElement) {
      detailsElement.open = false;
    }
  };
</script>

{#if mode === 'mobile'}
  <div class="sommaire sommaire-replie">
    <details bind:this={detailsElement}>
      <summary>
        <div class="entete-filtres">
          <img
            class="menu"
            src="/assets/images/icone-menu-lateral.svg"
            alt=""
          />
          <span id="section-active" class="titre-menu">Objectifs</span>
          <img
            class="chevron"
            src="/assets/images/icone-chevron-bas.svg"
            alt=""
          />
        </div>
      </summary>
      <ul>
        {#each Object.entries(dictionnaireAncreLibelle) as [ancre, libelle] (ancre)}
          <li class="actif">
            <a href={`#${ancre}`} onclick={fermeSommaire}>{libelle}</a>
          </li>
        {/each}
      </ul>
    </details>
  </div>
{:else}
  <div class="sommaire sommaire-deplie">
    <ul>
      {#each Object.entries(dictionnaireAncreLibelle) as [ancre, libelle] (ancre)}
        <li class="actif">
          <a href={`#${ancre}`}>{libelle}</a>
        </li>
      {/each}
    </ul>
    <p class="titreTags">tags</p>
    <div class="tags">
      {#each tags as tag (tag)}
        <lab-anssi-tag label={tag} taille="sm" type="defaut"></lab-anssi-tag>
      {/each}
    </div>
  </div>
{/if}

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;

  .sommaire-replie {
    padding: 0;
    border-top: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
    background: white;
    position: sticky;
    top: 0;
    z-index: 2;

    @include a-partir-de(desktop) {
      display: none;
    }

    &:has(details[open]) {
      position: fixed;
      top: 0;
      height: 100vh;
      width: 100%;
      box-sizing: border-box;
      overflow: auto;
    }

    details {
      .entete-filtres {
        padding: 12px 16px;
        background: white;
        color: var(--sommaire-actif-couleur);
        font-size: 1rem;
        font-style: normal;
        font-weight: 500;
        line-height: 1.5rem;
      }

      ul {
        list-style-type: none;
        margin: 0;
        padding: 16px;

        li {
          border-bottom: 1px solid #ddd;
          padding-top: 12px;
          padding-bottom: 12px;

          a {
            border-left: 2px solid transparent;
            text-decoration: none;
            padding-left: 14px;
            display: inline-block;
            border-bottom: none;
            font-size: 1rem;
            font-weight: 700;
            line-height: 1.5rem;
          }

          &.actif {
            a {
              color: var(--sommaire-actif-couleur);
              border-left-color: var(--sommaire-actif-indicateur-couleur);
            }
          }
        }
      }

      &[open] {
        summary {
          .entete-filtres {
            background: var(--sommaire-mobile-fond);

            :global(.chevron) {
              transform: rotate(180deg);
            }
          }
        }
      }

      summary {
        list-style: none;
        &::marker {
          content: '';
        }

        &::-webkit-details-marker {
          display: none;
        }

        .entete-filtres {
          display: flex;
          align-items: center;
          gap: 8px;
        }
      }

      .titre-menu {
        flex-grow: 1;
      }
    }
  }

  .sommaire-deplie {
    display: none;
    width: 282px;
    flex: 0 0 auto;
    align-self: flex-start;

    @include a-partir-de(lg) {
      display: flex;
      flex-direction: column;
      position: sticky;
      top: 0;
    }

    ul {
      list-style-type: none;
      padding: 0;
      margin: 0 0 40px;

      li {
        &.actif {
          a {
            color: var(--sommaire-actif-couleur);
            border-left: 2px solid var(--sommaire-actif-indicateur-couleur);
            padding-left: 6px;
          }
        }

        a {
          width: 100%;
          border-bottom: none;
          text-decoration: none;
          padding: 12px 8px;
          display: inline-block;
          font-size: 1rem;
          font-style: normal;
          font-weight: 700;
          line-height: 1.5rem;

          &:hover {
            background: rgb(0, 0, 0, 4%);
          }

          &:active {
            background: rgb(0, 0, 0, 8%);
          }
        }
      }
    }

    span {
      margin-bottom: 16px;
      font-size: 0.85rem;
      line-height: 1.5rem;
    }

    .titreTags {
      text-transform: uppercase;
      margin-top: 40px 0 0 0;
    }

    .tags {
      display: flex;
      align-items: flex-start;
      align-content: flex-start;
      align-self: stretch;
      flex-wrap: wrap;
      margin-top: 16px 0 0 0;
      gap: 8px;
    }
  }
</style>
