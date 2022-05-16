import { RouterModule, Routes } from '@angular/router';
import { CategoryComponent } from './category/category.component';
import { HomeComponent } from './home/home.component';
import { QuizComponent } from './quiz/quiz.component';

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
  },
];

export const AppRoutingModule = RouterModule.forRoot(routes);
