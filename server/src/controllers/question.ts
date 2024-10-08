import { ReadingQuestion } from "@prisma/client";
import { askDifferentExplanation, getQuestionTypePrompt, solveQuestionPrompt } from "../common/constants";
import { AIExplanation, Question } from "../common/types";
import { getTrainingData, buildPrompt, promptGroq, getQuestions, getReadingQuestions } from "../common/utils";
import { saveCorrectAnswerIdx, saveExplanation } from "../common/utils/ddbb";


// SOLVE-related controllers
const getQuestionType = async (question: string): Promise<string> => {
    const prompt = `${getQuestionTypePrompt}
    Provided question: "${question}"`;
    return await promptGroq(prompt, 0);
};

const solveQuestion = async (question: string, questionType: string): Promise<string> => {
    const qType = questionType || await getQuestionType(question);
    const trainingData = await getTrainingData(qType); // Get fine-tune data
    const prompt = buildPrompt(solveQuestionPrompt, trainingData, question);

    return await promptGroq(prompt);
};

const provideDifferentExplanation = async (question: string, previousAnswer: string): Promise<string> => {
    const questionType = await getQuestionType(question);
    const trainingData = await getTrainingData(questionType); // Get fine-tune data
    const prompt = buildPrompt(askDifferentExplanation, trainingData, question, previousAnswer);
    return await promptGroq(prompt);
};

// SAVE-related endpoints
const addExplanation = async (questionId: number | undefined, AIexplanation: AIExplanation | null) => {
    if (AIexplanation && questionId) {
        const { answerIdx, explanation } = AIexplanation;
        const result = await saveExplanation(questionId, explanation);

        if (result && answerIdx) {
            return await saveCorrectAnswerIdx(questionId, answerIdx);
        }

        return result;
    }
};


// GET-related endpoints
const getAllQuestions = async (): Promise<Question[]> => {
    const questions = await getQuestions();
    return questions;
};

const getAllReadingQuestions = async (): Promise<ReadingQuestion[]> => {
    const readingQuestions = await getReadingQuestions();
    return readingQuestions;
}

export {
    solveQuestion,
    provideDifferentExplanation,
    addExplanation,
    getAllQuestions,
    getAllReadingQuestions,
};