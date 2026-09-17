<script lang="ts">
  interface Props {
    urlBase: string;
  }

  let { urlBase }: Props = $props();
</script>

<div class="entete-principale">
  <a href={urlBase}>
    <img src={`${urlBase}/assets/images/marianne-dark.svg`} class="marianne" alt="Marianne" crossorigin="anonymous" />
  </a>
  <a href="https://cyber.gouv.fr" aria-label="Site de l’ANSSI">
    <img class="logo-anssi" src={`${urlBase}/assets/images/logo-anssi.svg`} alt="Logo ANSSI" crossorigin="anonymous" />
  </a>
  <a href={urlBase} class="titre-msc" aria-label="Site MesServicesCyber">
    <div class="titre-site-msc">
      <p class="site-msc">MesServicesCyber</p>
      <p class="organisation-anssi">Innovation ANSSI</p>
    </div>
  </a>
</div>

<style lang="scss">
  .entete-principale {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin-top: 1.5rem;

    .titre-msc {
      display: flex;
    }

    a.titre-msc {
      text-decoration: none;
    }

    .marianne {
      width: 67px;
      height: 67px;
      transform: translateX(-9px);
    }

    .logo-anssi {
      width: 49.5px;
      height: 49.5px;
      margin: 9px;
    }

    .titre-site-msc {
      p {
        margin: 0;
      }
      .site-msc {
        color: var(--text-title-grey);
        font-size: 1rem;
        font-weight: 700;
        line-height: 1.4rem;
        min-height: auto;
      }
      .organisation-anssi {
        color: var(--text-default-grey);
        font-size: 0.75rem;
        line-height: 1.125rem;
      }
    }
  }
</style>
