import Fuse from 'fuse.js';
import { uasdKnowledgeBase } from '../data/knowledge';

// Configure Fuse.js for fuzzy searching the knowledge base
const fuseOptions = {
  includeScore: true,
  threshold: 0.6, // Adjust to make matching more or less strict
  keys: [
    { name: 'question', weight: 0.6 },
    { name: 'keywords', weight: 0.3 },
    { name: 'answer', weight: 0.1 }
  ]
};

const fuse = new Fuse(uasdKnowledgeBase, fuseOptions);

const fallbacks = [
  "Lo siento, no he encontrado información sobre esa consulta en el Estatuto Orgánico de la UASD.",
  "Esa información no parece estar contenida en mi base de conocimientos sobre el Estatuto Orgánico.",
  "Por favor, reformula tu pregunta. Mi conocimiento se limita al Estatuto Orgánico de la UASD."
];

export const generateResponse = async (query: string): Promise<string> => {
  // Simulate network delay for realistic chatbot feel
  await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1000));

  const results = fuse.search(query);
  
  if (results.length > 0 && results[0].score !== undefined && results[0].score < 0.7) {
    return results[0].item.answer;
  }
  
  // Return random fallback
  return fallbacks[Math.floor(Math.random() * fallbacks.length)];
};
