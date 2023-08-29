import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/services/authentication-service/auth.service';
@Injectable()
export class RoleAuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let currentUser = JSON.parse(this.auth.getCurrentUser() || '{}');
    let action = route.data['action'];
    if (
      route &&
      route.routeConfig &&
      route.routeConfig.path != 'projects/project-dashboard/:projectId' &&
      route.routeConfig.path != 'projects/project-forms'
    ) {
      sessionStorage.clear();
    }
    if (this.auth.isLoggedIn()) {
      if (action == 'Create Project') {
        if (
          currentUser['role'] == 'Admin' ||
          currentUser['role'] == 'Team Lead'
        ) {
          return true;
        }
      }
      if (action == 'Registered Users') {
        if (currentUser['role'] == 'Admin') {
          return true;
        }
      }
      this.router.navigate(['/']);
      return false;
    } else {
      this.router.navigate(['/login'], {
        queryParams: { redirectURL: state.url },
      });
      return false;
    }
  }
}
