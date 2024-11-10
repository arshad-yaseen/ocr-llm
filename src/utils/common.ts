export function extractBase64FromDataURL(dataURL: string): string {
  const base64Index = dataURL.indexOf(';base64,') + ';base64,'.length;
  return dataURL.substring(base64Index);
}
