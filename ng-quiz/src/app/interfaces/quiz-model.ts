import { IQuestionModel } from "./question-model";

export interface  IQuizModel {
    id: string,
    name: string,
    categoryId: string,
    category: string,
    questions: IQuestionModel[],
    currQuestion: IQuestionModel,
    users: string[],
    points: number,
    expire: Date,
}