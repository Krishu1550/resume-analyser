import { fromPath } from "pdf2pic";

/**
 * Convert a PDF page to a PNG image in memory
 * @param pdfPath - Local path to PDF
 * @param pageNumber - Page number to convert (1-indexed)
 * @returns Promise<Buffer> - PNG image buffer
 * heeloo
 */
 export async function pdfPageToImage(pdfPath: string, pageNumber: number = 1): Promise<Buffer> {
  const options = {
    density: 100,
    format: "png",
    width: 600,
    height: 800,
    saveFilename: "unused", // ignored for in-memory
    savePath: "./images",    // ignored for in-memory
  };

  const converter = fromPath(pdfPath, options);

  // Convert page to PNG buffer
  const result = await converter(pageNumber, { responseType: "buffer" });

  // If the converter returned a Buffer directly
  if (Buffer.isBuffer(result)) {
    return result;
  }

  // Try common response shapes returned by pdf2pic and convert to Buffer
  if (result && typeof result === "object") {
    // Some versions return { buffer: Buffer }
    if ("buffer" in result && Buffer.isBuffer((result as any).buffer)) {
      return (result as any).buffer;
    }

    // Some versions return base64 string in { base64: string }
    if ("base64" in result && typeof (result as any).base64 === "string") {
      return Buffer.from((result as any).base64, "base64");
    }

    // Some shapes may include raw data as Uint8Array or number[]
    if ("data" in result) {
      const data = (result as any).data;
      if (data instanceof Uint8Array) {
        return Buffer.from(data);
      }
      if (Array.isArray(data)) {
        return Buffer.from(data);
      }
    }
  }

  // Fallback attempt to create a Buffer from the value
  try {
    return Buffer.from(result as any);

   
  } catch (e) {
    console.error("Failed to convert PDF page to image buffer:", e);
    throw new Error("Failed to convert PDF page to image buffer");
  }
}