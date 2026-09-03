export interface AdaptateurStatistiqueMiniTests {
  nombreDeMiniTestsRéalisés(): Promise<{ vraiFaux: number }>;
}
