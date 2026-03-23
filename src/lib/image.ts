export async function rasterizeSvg(
  svgUrl: string,
  outContentType: string,
  width: number,
  height: number,
): Promise<Blob> {
  const imageElement = new Image();
  imageElement.decoding = 'async';
  imageElement.src = svgUrl;

  await imageElement.decode();

  const canvas = new OffscreenCanvas(width, height);
  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('Expected a 2D canvas context');
  }

  context.drawImage(imageElement, 0, 0, width, height);

  return await canvas.convertToBlob({ type: outContentType });
}

export function svgElementToFileContents(svgElement: SVGSVGElement): string {
  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(svgElement);
  return `<?xml version="1.0" encoding="UTF-8"?>${svgString}`;
}
