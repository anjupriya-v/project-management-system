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
    console.log(route, route.routeConfig, route.routeConfig?.path);

    if (
      route &&
      route.routeConfig &&
      route.routeConfig.path != 'projects/project-dashboard/:projectId' &&
      route.routeConfig.path != 'projects/project-forms'
    ) {
      sessionStorage.clear();
    }
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
