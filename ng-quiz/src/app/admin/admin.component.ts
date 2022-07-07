import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CategoryService } from '../services/category/category.service';
import { QuestionService } from '../services/question/question.service';
import { QuizService } from '../services/quiz/quiz.service';
import { ICategoryModel } from '../interfaces/category-model';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private quizService: QuizService,
    private categoryService: CategoryService,
    private questionService: QuestionService
  ) { }

  submit(input: any) {
    console.log(input);

    if (input?.category) {
      this.categoryService.add({ name: input.category } as ICategoryModel).then(res => {
        if (res.id) {
          this.authService.authMsg.emit('Category has been added successfully!');
        }
      });
    }
  }
}
