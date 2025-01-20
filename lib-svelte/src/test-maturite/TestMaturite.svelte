<script lang="ts">
  type Question = {
    titre: string;
    question: string;
    propositions: string[];
  };

  const questions: Question[] = [
    {
      titre: "Prise en compte du risque",
      question:
        "Quelle est la perception des risques cyber au sein de votre organisation&nbsp;?",
      propositions: [
        "Les responsables considèrent que leur organisation n'est pas concernée par le risque de cyberattaques.",
        "Les responsables ont conscience que leur organisation peut être victime de cyberattaques, comme d'autres avant elle, sans savoir exactement lesquelles ni les conséquences qu’elles entraîneraient.",
        "Les données et les processus à protéger en priorité contre les risques cyber les plus courants ont été identifiés.",
        "Une analyse de risque approfondie de l'organisation a été menée et un plan détaillé de traitement des risques a été établi.",
        "Les objectifs de réduction des risques d'origine cyber sont intégrés dans la stratégie globale de gestion des risques de l'organisation.",
      ],
    },
    {
      titre: "Posture à l’égard de la cyber",
      question:
        "Quelle est la posture des responsables de votre organisation sur la cybersécurité&nbsp;?",
      propositions: [
        "Le renforcement de la cybersécurité de l'organisation n'est pas une priorité.",
        "Les responsables de l'organisation autorisent le/les responsables informatiques à agir mais perçoivent le sujet comme avant tout technique.",
        "Les responsables manifestent un réel intérêt pour le renforcement de la cybersécurité et les directions métiers sont sensibilisées.",
        "La cybersécurité est un sujet prioritaire évoqué en CODIR, les directions métiers sont responsabilisées sur le sujet et les agents sensibilisés.",
        "Les responsables souhaitent influer au-delà de leur organisation pour un renforcement de la cyber sécurité de leur écosystème voire de leur secteur d’activité.",
      ],
    },
  ];

  let questionCourante = 0;
  let reponseDonnee: number | null = null;

  const toutesReponses: number[] = [];

  function reponds() {
    toutesReponses.push(reponseDonnee!);
    questionCourante++;
    reponseDonnee = null;
  }
</script>

<h1>Testez votre maturité Cyber</h1>

<p>Étape {questionCourante + 1} sur 7</p>
<h5>{questions[questionCourante].titre}</h5>
<hr />
{reponseDonnee}
<hr />
<h4>{@html questions[questionCourante].question}</h4>
{#each questions[questionCourante].propositions as proposition, index}
  <label>
    <input type="radio" bind:group={reponseDonnee} value={index} />
    {proposition}
  </label>
{/each}

<input
  type="button"
  class="bouton primaire"
  value="Question suivante"
  disabled={reponseDonnee === null}
  on:click={reponds}
/>
