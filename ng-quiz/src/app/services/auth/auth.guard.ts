import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  private url: string = 'user';

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const { authRequired, redirectUrl, adminRequired } = route.data;

    // Success: no auth restriction
    if (authRequired === undefined) { return true; } 

    // Denied: must be logged but NOT
    else if (authRequired === true && !this.authService.user?.uid) {
      this.authService.preUrl = '';
      route.url?.forEach(u => this.authService.preUrl += u.path + '/' );
      const last = this.authService.preUrl?.lastIndexOf('/');
      if (last) {
        this.authService.preUrl = this.authService.preUrl.slice(0, -1)
      }
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
