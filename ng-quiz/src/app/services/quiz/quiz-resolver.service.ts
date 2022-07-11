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
    const path = router.routeConfig?.path;
    if (path === 'quizzes') {
      return this.quizService.getAll().get();
    } else {
      const quizId: string = router.params.id;
      return this.quizService.get(quizId);
    }
  }
}