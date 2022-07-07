import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IQuizModel } from '../interfaces/quiz-model';
import { QuizService } from '../services/quiz/quiz.service';

@Component({
  selector: 'app-quizzes',
  templateUrl: './quizzes.component.html',
  styleUrls: ['./quizzes.component.css']
})
export class QuizzesComponent {

  quizzes: IQuizModel[] = [];
  categoryId: string = this.route.snapshot.params.id;

  constructor(private quizService: QuizService, private router: Router, private route: ActivatedRoute) {
    this.getQuizzes();
    console.log(this.categoryId)
  }
  
  getQuizzes() {
    this.quizService.getAll().get().subscribe(res => {
      this.quizzes = res.docs.map(c => ({ ...c.data(), id: c.id })) as IQuizModel[];
      if (this.categoryId) {
        this.quizzes = this.quizzes.filter(q => q?.categoryId === this.categoryId);
      }
    });
  }

  openQuiz(id: string) {
    this.router.navigate(['/quiz', id]);
  }
}
