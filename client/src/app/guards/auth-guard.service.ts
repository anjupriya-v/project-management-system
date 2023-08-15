import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/services/authentication-service/auth.service';
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.auth.isLoggedIn()) {
      return true;
    } else {
      this.router.navigate(['/login'], {
        queryParams: { redirectURL: state.url },
      });
      return false;
    }
  }
}
