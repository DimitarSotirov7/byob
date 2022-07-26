import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Base } from 'src/app/common/base';
import { AuthService } from '../auth/auth.service';
import { TranslateService } from '../translate/translate.service';
import { QuizService } from './quiz.service';

@Injectable({
  providedIn: 'root'
})
export class QuizGuard extends Base implements CanActivate {

  private url: string = '/result/';

  constructor(
    router: Router,
    authService: AuthService,
    translateService: TranslateService, 
    private quizService: QuizService,
  ) {
    super(router, authService, translateService);
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const { authRequired, redirectUrl, roleRequired } = route.data;
    
    const uid = this.authService.state;
    if (!uid) {
      this.router.navigate(['user']);
      return false;
    }

    const quiz = (this.quizService.data as any[])?.find(q => q.id === route.params.id);
    if (!quiz) {
      this.router.navigateByUrl('/quizzes');
    }
    const expired = this.getTimestamp(quiz.expire, 1) <= new Date().getTime();
    if (expired) {
      this.router.navigateByUrl('/quizzes');
      return false;
    }

    const timeLeft = this.getTime(quiz);

    if (timeLeft <= 0) {
      this.router.navigateByUrl(this.url + `${route.params.id}`);
      return false;
    }
    
    return true;
  }
}
