import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  private url: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const { authRequired, redirectUrl, roleRequired } = route.data;

    // Success: no auth restriction
    if (authRequired === undefined) { return true; } 

    // Denied: must be logged but NOT
    else if (authRequired === true && !this.authService.uid) { 
      this.url = redirectUrl ? redirectUrl : '';
      this.authService.authMsg.emit('You must sign in first!');
    }

    // Success: no role restriction
    else if (roleRequired === undefined) { return true; }
    
    // Success
    else { return true; }
    
    this.router.navigate([this.url]);
    return false;
  }
}
