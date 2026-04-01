export interface GenerateurImage {
  depuisPdf(pdfOriginal: Buffer): Promise<Buffer>;
}
