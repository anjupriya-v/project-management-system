import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Injectable } from '@angular/core';
import { ProjectService } from '../services/project-service/project.service';
import { AuthService } from '../services/authentication-service/auth.service';
@Injectable()
export class ProjectGuard implements CanActivate {
  constructor(
    private auth: AuthService,
    private projectService: ProjectService,
    private router: Router
  ) {}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.auth.isLoggedIn()) {
      if (this.projectService.isPassKeyAuthenticated()) {
        return true;
      } else {
        this.router.navigate(['/projects']);
        return false;
      }
    } else {
      this.router.navigate(['/login'], {
        queryParams: { redirectURL: state.url },
      });
      return false;
    }
  }
}
