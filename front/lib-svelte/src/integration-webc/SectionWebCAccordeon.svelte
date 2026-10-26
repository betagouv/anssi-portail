<script lang="ts">
  import Bouton from '../ui/Bouton.svelte';
  import Lien from '../ui/Lien.svelte';

  type Props = {
    fichierPhp: string;
    lienDémo: string;
    lienProd: string;
  };
  const { fichierPhp, lienDémo, lienProd }: Props = $props();

  const copyTexte = (texte: string) => {
    try {
      navigator.clipboard.writeText(texte).then(() => {
        alert('Code copié dans le presse-papier.');
      });
    } catch {
      alert('Échec de la copie dans le presse-papier.');
    }
  };
</script>

{#snippet blocDeCode(code: string)}
  <div class="code-a-copier">
    {code}
    <Bouton icone="clipboard-line" libelle="copier" surClic={() => copyTexte(code)} type="tertiaire-sans-bordure"
    ></Bouton>
  </div>
{/snippet}

<h2 class="fr-h4">Installation</h2>

<h3 class="texte-article-lg">WordPress</h3>
<p>
  Télécharger le fichier <code>{fichierPhp}</code> en fonction de l'environnement cible&nbsp;:
</p>
<p><Lien href={lienDémo} libelle="Démo" /> | <Lien href={lienProd} libelle="Prod" /></p>
<p>
  Copier le fichier <code>{fichierPhp}</code> dans le répertoire
  <code>wp-content/themes/&lt;votre-thème&gt;/lab-anssi</code> de votre installation WordPress.
</p>
<p>
  Ouvrir le fichier <code>wp-content/themes/&lt;votre-thème&gt;/functions.php</code> et ajouter cette ligne à la fin&nbsp;:
</p>
{@render blocDeCode(`require_once( get_stylesheet_directory() . '/lab-anssi/${fichierPhp}' );`)}

<hr />
<h3 class="texte-article-lg">Intégration dans les pages HTML</h3>
{@render blocDeCode('<lab-anssi-mini-test-maturite></lab-anssi-mini-test-maturite>')}

<style lang="scss">
  hr {
    margin: 1.5rem 0;
    height: 1px;
    border: 0;
    background-color: var(--border-default-grey);
  }

  code {
    padding: 0.25rem;
    border-radius: 0.25rem;
    background-color: var(--brown-cafe-creme-975-75);
  }

  .code-a-copier {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 1rem;
    background-color: var(--background-alt-grey);
  }
</style>
