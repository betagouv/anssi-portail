<script lang="ts">
  import Lien from '../../../../ui/Lien.svelte';
  import ÉtapeProcédure from '../EtapeProcedure.svelte';
  import ÉtapesProcédure from '../EtapesProcedure.svelte';
  import OutilKitDeSensibilisationInterne from './outils/OutilKitDeSensibilisationInterne.svelte';
  import OutilMiniTestCrise from './outils/OutilMiniTestCrise.svelte';
  import OutilMiniTestExposition from './outils/OutilMiniTestExposition.svelte';
  import OutilMiniTestHameconnage from './outils/OutilMiniTestHameconnage.svelte';
  import OutilMiniTestMaturite from './outils/OutilMiniTestMaturite.svelte';
  import OutilMiniTestVraiFaux from './outils/OutilMiniTestVraiFaux.svelte';
</script>

<div>
  <h2>Sensibiliser ses collaborateurs (TPE/PME)</h2>
  <p class="texte-mention-xs mention">
    Cette démarche est proposée à titre indicatif. Vous êtes libre de l’adapter à votre contexte et de mobiliser les
    outils et méthodes de votre choix.
  </p>

  <ÉtapesProcédure>
    <ÉtapeProcédure titre="Sensibilisez vos équipes dirigeantes aux risques cyber">
      <div class="contenu-etape">
        <p>
          Avant toute chose, assurez-vous que les équipes dirigeantes ont conscience des risques cyber pour votre
          organisation et sont convaincues de la nécessité d’agir pour sa cybersécurité. Les ressources présentées
          ci-dessous peuvent être également utilisées pour sensibiliser les équipes.
        </p>
        <p>Vous pouvez partager plusieurs tests cyber en ligne, gratuits et anonymes&nbsp;:</p>
        <div class="cartes-tests">
          <div class="carte-test">
            <OutilMiniTestMaturite />
          </div>
          <div class="carte-test">
            <OutilMiniTestExposition />
          </div>
          <div class="carte-test">
            <OutilMiniTestCrise />
          </div>
        </div>
        <p>
          Invitez vos équipes dirigeantes à participer à notre formation «&nbsp;dirigeants&nbsp;» sur les cybermenaces
          (bientôt).
        </p>
        <p>
          Formation&nbsp;: inscrivez-vous ou vos équipes à notre formation en ligne, gratuite sur les risques cyber
          (bientôt).
        </p>
      </div>
    </ÉtapeProcédure>

    <ÉtapeProcédure titre="Réalisez une première action de sensibilisation à destination des équipes">
      <div class="contenu-etape">
        <p>
          Pour commencer à sensibiliser l’ensemble des collaborateurs aux risques cyber et aux bonnes pratiques
          individuelles, vous pouvez, par exemple&nbsp;:
        </p>
        <ul>
          <li>
            Réaliser une campagne d’affichage sur les risques et les bonnes pratiques.
            <div class="outil-liste">
              <OutilKitDeSensibilisationInterne />
            </div>
          </li>
          <li>
            Six thématiques à partager par mail et par affiche. Les affiches sont personnalisables avec votre logo.
          </li>
          <li>Organiser une session de sensibilisation réunissant l’ensemble des collaborateurs.</li>
          <li>
            Tester les connaissances des bonnes pratiques de cybersécurité.
            <div class="outil-liste">
              <OutilMiniTestVraiFaux />
            </div>
          </li>
          <li>
            Réaliser une campagne de faux mails de hameçonnage (phishing) consistant à «&nbsp;tester&nbsp;» la capacité
            des utilisateurs à détecter un mail piégé.
            <div class="outil-liste">
              <OutilMiniTestHameconnage />
            </div>
          </li>
          <li>
            Réaliser des sensibilisations auprès de publics cibles (ex. service achat ou finance pour les risques
            d’escroquerie au faux ordre de virement et fraude au président, nouveaux arrivants).
          </li>
        </ul>
        <Lien
          blank
          href="/documents-ressources/ReflexesCyber%20-%20Fiches%20Reflexes.pdf"
          libelle="8 fiches réflexes cyber — responsable com’, responsable RH, financier, DSI&nbsp;: adoptez les bons réflexes"
        />
      </div>
    </ÉtapeProcédure>

    <ÉtapeProcédure titre="Sensibilisez vos équipes de manière régulière">
      <div class="contenu-etape">
        <p>Sensibiliser régulièrement, même de manière allégée, les collaborateurs est important, par exemple&nbsp;:</p>
        <ul>
          <li>Un mail par mois couvrant les thèmes suivants&nbsp;: mot de passe, phishing, sauvegardes…</li>
          <li>
            Un test de hameçonnage (phishing) tous les 2 ou 3 mois, à intervalle irrégulier (un test prévisible perd
            toute valeur)&nbsp;;
          </li>
          <li>
            En cas de clic&nbsp;: pas de sanction, mais demander de suivre les modules SecNumAcadémie correspondants.
          </li>
        </ul>
        <p>
          La formation aux enjeux de cybersécurité est également un excellent moyen de renforcer la prise de conscience
          des risques cyber et l’adoption des bonnes pratiques. Pour cela, découvrez SecNumAcadémie, le MOOC créé par
          l’ANSSI.
        </p>
        <Lien
          blank
          href="https://secnumacademie.gouv.fr/"
          libelle="Le MOOC de l’ANSSI — Formez-vous à la cybersécurité avec le MOOC SecNumAcadémie"
        />
        <p>
          Des solutions du marché existent également afin de faire passer à l’échelle votre démarche de sensibilisation
          et de vous aider à superviser le niveau de prise en compte des bonnes pratiques par vos collaborateurs.
        </p>
      </div>
    </ÉtapeProcédure>
  </ÉtapesProcédure>
</div>

<style lang="scss">
  .mention {
    font-style: italic;
  }

  .contenu-etape {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;

    p,
    ul {
      margin: 0;
    }
  }

  .cartes-tests {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(222px, 1fr));
    grid-auto-rows: 1fr;
    gap: 1.5rem;
  }

  ul {
    list-style-type: disc;
    padding-left: 1.5rem;

    li + li {
      margin-top: 0.5rem;
    }
  }

  .outil-liste {
    margin: 1.5rem 0 1.5rem -1.5rem;
  }
</style>
