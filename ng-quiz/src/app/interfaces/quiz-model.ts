import { IQuestionModel } from "./question-model";

export interface  IQuizModel {
    id: string,
    name: string,
    category: string,
    questions: IQuestionModel[],
}