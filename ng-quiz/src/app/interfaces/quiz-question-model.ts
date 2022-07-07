import { IQuestionModel } from "./question-model";

export interface  IQuizQuestionModel {
    index: number,
    questions: IQuestionModel[],
}