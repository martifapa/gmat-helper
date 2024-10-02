import { AIExplanation } from "../types";

export const AIAnswerToObject = (text: string): AIExplanation | null => {
  try { // text correctly formatted as JSON
    const json = JSON.parse(text);
    return json;
  } catch (error) { // malformatted JSON -> try to parse with regex
    try {
      const answerIdxRegex = /"answerIdx":\s*([0-4])/; // matches 0 to 4 after "answerIdx"
      const explanationRegex = /(?<="explanation":\s*")[\s\S]*?(?=")/;  // matches EVERYTHING after "explanation"
      
      const answerIdxMatch =  text.match(answerIdxRegex);
      const explantionMatch = text.match(explanationRegex);

      if (answerIdxMatch && explantionMatch) { // first explanation call
        const answerIdx = parseInt(answerIdxMatch[1], 10); // Get capture group and convert to number
        const explanation = explantionMatch[0];

        return { answerIdx, explanation };
      } else if (explantionMatch) { // new explanation call
        const explanation = explantionMatch[0];

        return { explanation };
      } {
        console.log('Regex match failed');
        return null;
      }
    } catch (finalError) {
      console.log(finalError);
      return null
    }
  }
};

export const parseFullQuestionType = (type: string) => {
  const types = ['Verbal Reasoning - Sentence Correction', 'Verbal Reasoning - Reading Comprehension', 'Verbal Reasoning - Critical Reasoning', 'Quantitative Reasoning - Data Sufficiency', 'Quantitative Reasoning - Problem Solving']

  return types.find(t => t.toLowerCase().includes(type.toLowerCase()));
};