export interface  IAdminQuizModel { 
    name: string, 
    id: string, 
    selected: boolean, 
    questions: string[],
    start: Date,
    end: Date,
}