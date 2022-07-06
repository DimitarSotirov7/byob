import { Component, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IQuestionModel } from '../interfaces/question-model';
import { IAnswerModel } from '../interfaces/answer-model';
import { IQuizModel } from '../interfaces/quiz-model';
import { CategoryService } from '../services/category/category.service';
import { QuestionService } from '../services/question/question.service';
import { QuizService } from '../services/quiz/quiz.service';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent {

  id: string = this.route.snapshot.params.id;
  quiz: IQuizModel;
  @Output() currQuestion: IQuestionModel;

  constructor(
    private route: ActivatedRoute,
    private quizService: QuizService,
    private categoryService: CategoryService,
    private questionService: QuestionService) {
    this.quiz = {} as IQuizModel;
    this.currQuestion = {} as IQuestionModel;
    this.load();
  }

  load() {
    this.quizService.get(this.id).subscribe(quizRes => {
      const questions = quizRes.data()?.questions;

      if (quizRes.data()?.categoryId) {
        this.categoryService.get(quizRes.data()?.categoryId).subscribe(res => {
          this.quiz.category = res.data().name;
        });
      }

      if (questions) {
        this.questionService.getAll().get().subscribe(questRes => {
          const questionsRes = questRes.docs.filter(q => questions.includes(q.id.toString()));
          const firstQuestionData = questionsRes[0].data();
          const firstQuestionAnswers = firstQuestionData.answers;
          const firstQuestionCorrect = firstQuestionData.correct;

          this.quiz.currQuestion = { 
            id: questionsRes[0].id,
            text: firstQuestionData.text,
            correct: firstQuestionData.correct,
          } as IQuestionModel;

          const questionToAnswer = [] as { questionId: string, answers: string[] }[];
          this.quiz.questions = [] as IQuestionModel[];
          questionsRes.forEach(q => {
            this.quiz.questions.push({
              id: q.id,
              text: q.data().text,
            } as IQuestionModel); 

            questionToAnswer.push({
              questionId: q.id,
              answers: q.data().answers
            });
          });

          if (firstQuestionAnswers) {
            this.questionService.getAnswers().get().subscribe(answRes => {
              this.quiz.currQuestion.answers = answRes.docs.filter(a => firstQuestionAnswers.includes(a.id)).map(a => {
                return {
                  id: a.id,
                  text: a.data().text
                } as IAnswerModel;
              });

              this.quiz.currQuestion.correct = answRes.docs.filter(a => firstQuestionCorrect === a.id).map(a => {
                return {
                  id: a.id,
                  text: a.data().text
                } as IAnswerModel;
              })[0];

              // answRes.docs.forEach(a => {
              //   const entity = questionToAnswer.filter(qa => qa.answers.includes(a.id));
              //   console.log(entity)
              //   if (questionToAnswer) {
                  
              //   }
              // });

              console.log(questionToAnswer)
              console.log(this.quiz)
            });
          }
        });
      }
    });
  }

  next() {
    console.log(this.currQuestion)
  }

  previous() {
    console.log(this.currQuestion)
  }

  getQuestion(page: number | undefined = undefined) {
    const index = page ? page - 1 : 0;
    return this.quiz?.questions[index];
  }
}
