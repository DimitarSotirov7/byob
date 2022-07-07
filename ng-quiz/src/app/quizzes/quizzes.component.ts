import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IQuizModel } from '../interfaces/quiz-model';
import { QuizService } from '../services/quiz/quiz.service';

@Component({
  selector: 'app-quizzes',
  templateUrl: './quizzes.component.html',
  styleUrls: ['./quizzes.component.css']
})
export class QuizzesComponent {

  quizzes: IQuizModel[] = [];

  constructor(private quizService: QuizService, private router: Router) {
    this.getQuizzes();
  }
  
  getQuizzes() {
    this.quizService.getAll().get().subscribe(res => {
      this.quizzes = res.docs.map(c => ({ ...c.data(), id: c.id })) as IQuizModel[];
    });
  }

  openQuiz(id: string) {
    this.router.navigate(['/quiz', id]);
  }
}
