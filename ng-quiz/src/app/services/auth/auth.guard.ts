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
    const { authRequired, redirectUrl, adminRequired } = route.data;

    // Success: no auth restriction
    if (authRequired === undefined) { return true; } 

    // Denied: must be NOT logged but Yes
    else if (authRequired === false && this.authService.state) {
    }

    // Denied: must be logged but NOT
    else if (authRequired === true && !this.authService.state) {
      this.url = 'user';
    }

    // Success: no role restriction
    else if (adminRequired === true && !this.authService.user?.admin) { 
      this.authService.authMsg.emit('You are not authorized!');
    }
    
    // Success
    else { return true; }
    
    this.router.navigate([redirectUrl ? redirectUrl : this.url]);
    return false;
  }
}
