import { IAnswerModel } from "./answer-model";

export interface  IQuestionModel {
    id: string,
    text: string,
    correct: string,
    answers: IAnswerModel[],
}