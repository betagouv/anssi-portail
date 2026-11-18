export class FournisseurHorloge {
  static maintenant = (): Temporal.Instant => Temporal.Now.instant();
}
