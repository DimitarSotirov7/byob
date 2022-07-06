import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { QuizService } from './quiz.service';

@Injectable({
  providedIn: 'root'
})
export class QuizResolverService {
    
  constructor(private quizService: QuizService) {}

  resolve<T>(router: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    const index = state.url.lastIndexOf('/');
    const quizId = state.url.slice(index + 1);
  }
}