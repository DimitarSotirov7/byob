import { RouterModule, Routes } from '@angular/router';
import { CategoryComponent } from './category/category.component';
import { HomeComponent } from './home/home.component';
import { QuizComponent } from './quiz/quiz.component';
import { QuizResolverService } from './services/quiz/quiz-resolver.service';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: HomeComponent,
  },
  {
    path: 'category',
    pathMatch: 'full',
    component: CategoryComponent,
  },
  {
    path: 'quiz/:id',
    pathMatch: 'full',
    component: QuizComponent,
    resolve: { quiz: QuizResolverService },
  },
];

export const AppRoutingModule = RouterModule.forRoot(routes);
