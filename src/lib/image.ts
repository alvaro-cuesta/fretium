export async function rasterizeImage(
  svgUrl: HTMLImageElement,
  outContentType: string,
  scale: number,
): Promise<Blob> {
  // width instead of naturalWidth to account for potential CSS scaling applied to the image element
  // including retina pixel ratios, etc.
  const targetWidth = svgUrl.width * scale;
  const targetHeight = svgUrl.height * scale;

  const canvas = new OffscreenCanvas(targetWidth, targetHeight);
  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('Expected a 2D canvas context');
  }

  context.drawImage(svgUrl, 0, 0, targetWidth, targetHeight);

  return await canvas.convertToBlob({ type: outContentType });
}

export function svgElementToFileContents(svgElement: SVGSVGElement): string {
  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(svgElement);
  return `<?xml version="1.0" encoding="UTF-8"?>${svgString}`;
}
