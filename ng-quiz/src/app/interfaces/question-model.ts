import { IAnswerModel } from "./answer-model";

export interface  IQuestionModel {
    id: string,
    text: string,
    correct: IAnswerModel,
    answers: IAnswerModel[],
    selected: string | undefined,
    users: { uid: string, selected: string }[]
}