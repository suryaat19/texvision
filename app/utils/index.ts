import fs from 'fs';
import path from 'path';
import { 
  getWordCount, 
  getSentenceCount, 
  getCharacterCount, 
  getAverageWordLength 
} from './stats';

function analyzeFile(filePath: string) {
  try {
    const rawText = fs.readFileSync(path.resolve(filePath), 'utf-8');

    const analysis = {
      wordCount: getWordCount(rawText),
      sentenceCount: getSentenceCount(rawText),
      charCount: getCharacterCount(rawText),
      avgWordLength: getAverageWordLength(rawText)
    };

    console.log("File Analysis:", analysis);
    return analysis;

  } catch (error) {
    console.error("Error reading file:", error);
    return null;
  }
}