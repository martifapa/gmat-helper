import axios from 'axios';
import { BASE_URL } from '../common/constants';
import { AiAnswer, FullQuestion, FullQuestionRequest, ReadingQuestion } from '../common/types/question';


// SOLVE questions
const solveQuestion = async (question: string, questionType: string): Promise<AiAnswer> => {
    const response = await axios.post(
        `${BASE_URL}/question/solve`,
        { question, questionType }
    );
    
    return response.data;
};

const getNewAnswer = async (question: string, previousAnswer: string): Promise<AiAnswer> => {
    const response = await axios.post(
        `${BASE_URL}/question/solve/new`,
        { question, previousAnswer }
    );
    
    return response.data.answer;
};

// GET questions
const getAllQuestions = async (): Promise<FullQuestion[]> => {
    const response = await axios.get(`${BASE_URL}/question/all`);

    return response.data;
};

const getAllReadingQuestions = async (): Promise<ReadingQuestion[]> => {
    const response = await axios.get(`${BASE_URL}/question/all/reading`);

    return response.data;
}

// CREATE questions
const createQuestion = async (questionRequest: FullQuestionRequest): Promise<FullQuestion> => {
    const response = await axios.post(
        `${BASE_URL}/question/save/one`,
        questionRequest,
    );

    return response.data;
}

export {
    solveQuestion,
    getNewAnswer,
    getAllQuestions,
    getAllReadingQuestions,
    createQuestion,
};