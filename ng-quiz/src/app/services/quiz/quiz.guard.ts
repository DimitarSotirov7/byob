import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { QuizService } from './quiz.service';

@Injectable({
  providedIn: 'root'
})
export class QuizGuard implements CanActivate {

  private url: string = '/quizzes';

  constructor(private authService: AuthService, private quizService: QuizService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const { authRequired, redirectUrl, roleRequired } = route.data;
    
    const uid = this.authService.user?.uid;
    if (!uid) {
      this.router.navigate(['user']);
      return false;
    }
    const quizId = route.params.id;
    const quizUsers = (this.quizService.data as any[])?.find(q => q.id === quizId)?.users;

    if (!quizUsers) {
      return true;
    }

    if (!uid || !quizUsers || quizUsers.includes(uid)) {
      this.authService.authMsg.emit('You have already completed it!');
      this.router.navigate([this.url]);
      return false;
    }
    
    return true;
  }
}
