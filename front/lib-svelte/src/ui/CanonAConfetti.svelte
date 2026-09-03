<!--
  ** Utilisation manuelle **

  <script lang="ts">
  import CanonAConfetti, { type RéférenceCanonÀConfetti } from './CanonAConfetti.svelte';
  let canon = $state<RéférenceCanonÀConfetti>();
  $effect(() => {
    if (canon) canon.déclenche();
  });
  </script>
  <CanonAConfetti bind:ref={canon} />

  ** Utilisation en mode lecture automatique **

  <CanonAConfetti lectureAutomatique={true} />
-->
<script lang="ts">
  export interface RéférenceCanonÀConfetti {
    déclenche: () => void;
  }

  type Props = {
    couleurs?: string[];
    lectureAutomatique?: boolean;
    ref?: RéférenceCanonÀConfetti;
  };

  const couleursParDéfaut = [
    '#FF3F6A',
    '#FF4E50',
    '#FC913A',
    '#F9D423',
    '#EAE065',
    '#43E8D5',
    '#33CCFF',
    '#4C51BF',
    '#9B6DFE',
    '#E0A3F2',
  ];

  let { lectureAutomatique: autoplay = false, couleurs = couleursParDéfaut, ref = $bindable() }: Props = $props();

  let canevas = $state<HTMLCanvasElement | null>(null);
  let ctx: CanvasRenderingContext2D | null = null;
  let w: number = 0;
  let h: number = 0;
  let dpr: number = 1;
  let particules: Confetti[] = [];
  let idAnimation: number | null = null;
  let expirations: ReturnType<typeof setTimeout>[] = [];

  // Utilitaires mathématiques typés
  const aléatoire = (min: number, max: number): number => Math.random() * (max - min) + min;
  const entierAléatoire = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min;
  const degVersRad = (deg: number): number => deg * (Math.PI / 180);

  class Confetti {
    x: number;
    y: number;
    vx: number;
    vy: number;
    gravité: number;
    trainée: number;
    taille: number;
    couleur: string;
    forme: 'rect' | 'circle';
    oscillation: number;
    vitesseDOscillation: number;
    rotation: number;
    vitesseAngulaire: number;
    opacité: number;
    vitesseDEstompe: number;

    constructor(largeurCanevas: number, hauteurCanevas: number, paletteDeCouleurs: string[]) {
      // Origine : Point unique de départ
      this.x = largeurCanevas / 2;
      this.y = (hauteurCanevas * 3) / 4 - 50;

      // Éjection vers le haut (-90°) avec une forte dispersion aléatoire (+/- 55°)
      const angle = degVersRad(-90) + degVersRad(aléatoire(-55, 55));
      const puissance = aléatoire(18, 42);

      this.vx = Math.cos(angle) * puissance;
      this.vy = Math.sin(angle) * puissance;

      // Paramètres physiques
      this.gravité = 0.42;
      this.trainée = aléatoire(0.95, 0.98);

      // Apparence
      this.taille = aléatoire(6, 16);
      this.couleur = paletteDeCouleurs[entierAléatoire(0, paletteDeCouleurs.length - 1)] ?? '#FF3F6A';
      this.forme = Math.random() > 0.4 ? 'rect' : 'circle';

      // Oscillation 3D & rotation
      this.oscillation = Math.random() * Math.PI * 2;
      this.vitesseDOscillation = aléatoire(0.04, 0.16);
      this.rotation = Math.random() * Math.PI * 2;
      this.vitesseAngulaire = aléatoire(-0.2, 0.2);

      // Fondu
      this.opacité = 1;
      this.vitesseDEstompe = aléatoire(0.003, 0.011);
    }

    metÀJour(maxW: number, maxH: number): boolean {
      this.vx *= this.trainée;
      this.vy *= this.trainée;
      this.vy += this.gravité;
      this.x += this.vx;
      this.y += this.vy;

      this.oscillation += this.vitesseDOscillation;
      this.rotation += this.vitesseAngulaire;

      if (this.vy > 0) {
        this.opacité -= this.vitesseDEstompe;
      }

      return this.opacité > 0 && this.y < maxH + 100 && this.x > -100 && this.x < maxW + 100;
    }

    dessine(context: CanvasRenderingContext2D): void {
      context.save();
      context.translate(this.x, this.y);
      context.rotate(this.rotation);

      // Effet d'oscillation pseudo-3D
      const scaleX = Math.cos(this.oscillation);
      context.scale(scaleX, 1);

      context.fillStyle = this.couleur;
      context.globalAlpha = Math.max(0, this.opacité);

      if (this.forme === 'rect') {
        context.fillRect(-this.taille / 2, -this.taille / 4, this.taille, this.taille / 2);
      } else {
        context.beginPath();
        context.arc(0, 0, this.taille / 2, 0, Math.PI * 2);
        context.fill();
      }

      context.restore();
    }
  }

  function redimensionneLeCanevas(): void {
    if (!canevas) return;
    dpr = window.devicePixelRatio || 1;
    w = window.innerWidth;
    h = window.innerHeight;
    canevas.width = w * dpr;
    canevas.height = h * dpr;
    if (ctx) ctx.scale(dpr, dpr);
  }

  function boucleDeRendu(): void {
    if (!ctx) return;
    ctx.clearRect(0, 0, w, h);

    for (let i = particules.length - 1; i >= 0; i--) {
      const particule = particules[i];
      if (particule && particule.metÀJour(w, h)) {
        particule.dessine(ctx);
      } else {
        particules.splice(i, 1);
      }
    }

    if (particules.length > 0) {
      idAnimation = requestAnimationFrame(boucleDeRendu);
    } else {
      if (idAnimation !== null) {
        cancelAnimationFrame(idAnimation);
      }
      idAnimation = null;
      ctx.clearRect(0, 0, w, h);
    }
  }

  function déclencheExplosion(count: number): void {
    for (let i = 0; i < count; i++) {
      particules.push(new Confetti(w, h, couleurs));
    }
    if (idAnimation === null) {
      idAnimation = requestAnimationFrame(boucleDeRendu);
    }
  }

  export function déclenche(): void {
    const compteur = entierAléatoire(2, 3);

    for (let b = 0; b < compteur; b++) {
      const délai = b * entierAléatoire(130, 200);
      const minuteurExpiration = setTimeout(() => {
        const particleCount = entierAléatoire(90, 150);
        déclencheExplosion(particleCount);
      }, délai);
      expirations.push(minuteurExpiration);
    }
  }

  $effect(() => {
    ref = { déclenche };
  });

  $effect(() => {
    if (!canevas) return;

    ctx = canevas.getContext('2d');
    redimensionneLeCanevas();
    window.addEventListener('resize', redimensionneLeCanevas);

    if (autoplay) déclenche();

    return () => {
      window.removeEventListener('resize', redimensionneLeCanevas);
      if (idAnimation !== null) {
        cancelAnimationFrame(idAnimation);
      }
      expirations.forEach(clearTimeout);
      particules = [];
    };
  });
</script>

<!-- Canvas plein écran non bloquant -->
<canvas bind:this={canevas} class="confetti-canvas"></canvas>

<style lang="scss">
  .confetti-canvas {
    position: fixed;
    inset: 0;
    width: 100dvw;
    height: 100dvh;
    pointer-events: none;
    user-select: none;
    z-index: 999999;
  }
</style>
