export async function rasterizeImage(
  imageElement: HTMLImageElement,
  outContentType: string,
  scale: number,
): Promise<Blob> {
  // naturalWidth and naturalHeight give the actual size of the image, regardless of how it's currently displayed in the
  // page or Retina/OS pixel ratio, so this should make exports consistent and predictable across different devices and
  // screen densities
  const targetWidth = imageElement.naturalWidth * scale;
  const targetHeight = imageElement.naturalHeight * scale;

  const canvas = new OffscreenCanvas(targetWidth, targetHeight);
  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('Expected a 2D canvas context');
  }

  context.drawImage(imageElement, 0, 0, targetWidth, targetHeight);

  return await canvas.convertToBlob({ type: outContentType });
}

export function svgElementToFileContents(svgElement: SVGSVGElement): string {
  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(svgElement);
  return `<?xml version="1.0" encoding="UTF-8"?>${svgString}`;
}
