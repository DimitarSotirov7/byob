import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { CategoryComponent } from './category/category.component';
import { HomeComponent } from './home/home.component';
import { QuizComponent } from './quiz/quiz.component';
import { QuizzesComponent } from './quizzes/quizzes.component';
import { ResultComponent } from './result/result.component';
import { AuthGuard } from './services/auth/auth.guard';
import { QuizResolverService } from './services/quiz/quiz-resolver.service';
import { QuizGuard } from './services/quiz/quiz.guard';
import { NotFoundComponent } from './shared/not-found/not-found.component';
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
    canActivate: [AuthGuard],
    data: {
      authRequired: true,
    },
  },
  {
    path: 'quiz/:id',
    pathMatch: 'full',
    component: QuizComponent,
    resolve: { quiz: QuizResolverService },
    canActivate: [ AuthGuard, QuizGuard ],
    data: {
      authRequired: true,
    },
  },
  {
    path: 'user',
    pathMatch: 'full',
    component: UserComponent,
    canActivate: [AuthGuard],
    data: {
      authRequired: false,
    },
  },
  {
    path: 'admin',
    pathMatch: 'full',
    component: AdminComponent,
    canActivate: [AuthGuard],
    data: {
      authRequired: true,
      adminRequired: true,
    },
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
  {
    path: 'result/:id',
    pathMatch: 'full',
    component: ResultComponent,
    resolve: { quiz: QuizResolverService },
    canActivate: [ AuthGuard ],
    data: {
      authRequired: true,
    },
  },
  {
    path: '**',
    component: NotFoundComponent
  }
];

export const AppRoutingModule = RouterModule.forRoot(routes);
