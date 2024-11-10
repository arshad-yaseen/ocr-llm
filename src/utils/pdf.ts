export function convertPDFBase64ToBuffer(base64String: string): ArrayBuffer {
  const data = base64String.split(';base64,').pop() as string;
  const binaryString = window.atob(data);
  const bytes = new Uint8Array(binaryString.length);

  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  return bytes.buffer;
}

export function generatePDFPageRange(start: number, end: number): number[] {
  const range: number[] = [];
  for (let i = start; i <= end; i++) {
    range.push(i);
  }
  return range;
}
