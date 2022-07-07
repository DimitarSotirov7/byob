import { RouterModule, Routes } from '@angular/router';
import { CategoryComponent } from './category/category.component';
import { HomeComponent } from './home/home.component';
import { QuizComponent } from './quiz/quiz.component';
import { QuizzesComponent } from './quizzes/quizzes.component';
import { AuthGuard } from './services/auth/auth.guard';
import { QuizResolverService } from './services/quiz/quiz-resolver.service';
import { UserComponent } from './user/user.component';

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
    // resolve: { quiz: QuizResolverService },
    canActivate: [AuthGuard],
    data: {
      authRequired: true,
    },
  },
  {
    path: 'user',
    pathMatch: 'full',
    component: UserComponent,
  },
  {
    path: 'quizzes',
    pathMatch: 'full',
    component: QuizzesComponent,
  },
  {
    path: 'quizzes/:id',
    component: QuizzesComponent,
  },
];

export const AppRoutingModule = RouterModule.forRoot(routes);
