import { generateSlug } from 'random-word-slugs';

export function generateRandomSessionName() {
  return generateSlug(2, {
    format: 'kebab',
    partsOfSpeech: ['adjective', 'noun'],
    categories: {
      adjective: ['color', 'personality'],
      noun: ['animals'],
    },
  });
}
