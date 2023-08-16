import { Component } from '@angular/core';
import { NzButtonSize } from 'ng-zorro-antd/button';
import { AuthService } from 'src/app/services/authentication-service/auth.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  public strategy = 'transform-no-loop';
  public array = [1, 2, 3, 4];
  size: NzButtonSize = 'large';
  filledNav: String = '';
  currentUser: any = JSON.parse(this.auth.getCurrentUser());
  slides: any[] = new Array(3).fill({
    id: -1,
    src: '',
    title: '',
    subtitle: '',
  });
  constructor(public auth: AuthService) {}
  ngOnInit(): void {
    this.slides[0] = {
      id: 0,
      src: 'https://images.unsplash.com/photo-1603201667141-5a2d4c673378?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1196&q=80',
      title: 'Team Work',
      subtitle: 'Promotes Co-ordination which improves the project outcome.',
    };
    this.slides[1] = {
      id: 1,
      src: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      title: 'Pass key System',
      subtitle: 'Helps to keep the project information safe and secure.',
    };
    this.slides[2] = {
      id: 2,
      src: 'https://images.pexels.com/photos/669996/pexels-photo-669996.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      title: 'Productivity',
      subtitle: "Keep track of user's progress in private dashboard.",
    };
  }
}
