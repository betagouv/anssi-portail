export class Mesure {
  constructor(
    readonly id: string,
    readonly titre: string,
    readonly phraseAccroche: string,
    readonly explications: string,
    readonly actionPrioritaire: string,
    readonly actionFacileAFaire: string,
    readonly ordre: number
  ) {}
}
