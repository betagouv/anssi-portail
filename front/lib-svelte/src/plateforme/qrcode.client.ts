import qrcode from 'qrcode';

export const peintUnQRCode = async (
  canvas: HTMLCanvasElement | undefined,
  lien: string,
  options: { width: number; margin: number }
): Promise<void> => {
  await qrcode.toCanvas(canvas, lien, options);
};
