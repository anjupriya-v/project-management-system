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
  projectTitle: any;
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
        if (route.params['projectId']) {
          this.projectService.getProjectDetails().subscribe((data: any) => {
            if (data.status) {
              console.log(data.projectDetails);
              data.projectDetails.forEach((project: any): any => {
                if (project._id == route.params['projectId']) {
                  this.projectTitle = project.projectTitle;
                  this.router.navigate([
                    '/projects/auth/pass-key-system',
                    route.params['projectId'],
                    this.projectTitle,
                  ]);
                }
              });
            }
          });
        }
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
