export interface  IAdminQuizModel { 
    name: string, 
    id: string, 
    selected: boolean, 
    questions: string[],
    expire: Date,
}