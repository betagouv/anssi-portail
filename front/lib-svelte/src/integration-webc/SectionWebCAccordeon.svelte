<script lang="ts">
  import Lien from '../ui/Lien.svelte';
  import BlocDeCode from './BlocDeCode.svelte';

  type Props = {
    fichierPhp: string;
    lienDémo: string;
    lienProd: string;
    nomDuWebComponent: string;
  };
  const { fichierPhp, lienDémo, lienProd, nomDuWebComponent }: Props = $props();
</script>

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
<BlocDeCode code={`require_once( get_stylesheet_directory() . '/lab-anssi/${fichierPhp}' );`} />

<hr />
<h3 class="texte-article-lg">Intégration dans les pages HTML</h3>
<BlocDeCode code={`<${nomDuWebComponent}></${nomDuWebComponent}>`} />

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
</style>
