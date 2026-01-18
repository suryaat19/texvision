export function getWordCount(text: string): number {
  if (!text) return 0;
  const matches = text.trim().match(/\S+/g);
  return matches ? matches.length : 0;
}

export function getSentenceCount(text: string): number {
  if (!text) return 0;
  const matches = text.match(/[^\.!\?]+[\.!\?]+/g);
  return matches ? matches.length : 0;
}

export function getCharacterCount(text: string): number {
  return text.length;
}

export function getAverageWordLength(text: string): number {
  const words = text.match(/\w+/g);

  if (!words || words.length === 0) {
    return 0;
  }

  const totalLength = words.reduce((sum, word) => sum + word.length, 0);
  return totalLength / words.length;
}

export function getTextArea(text: string): string {
  if (!text) return "";

  return text
    .replace(/\r\n/g, "\n")      // normalize line breaks
    .replace(/\n{3,}/g, "\n\n")  // remove excessive empty lines
    .trim();
}
