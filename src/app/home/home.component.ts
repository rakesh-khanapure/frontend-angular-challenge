import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { User } from '../models/user.model';
import { UserService, AuthenticationService } from '../services';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  currentUser: User;
  users = [];
  state: 'EDIT' | 'VIEW' = 'VIEW';
  userToEdit;
  loading: boolean = false;

  constructor(
      private authenticationService: AuthenticationService,
      private userService: UserService
  ) {
    this.currentUser = this.authenticationService.currentUserValue;
  }

  ngOnInit() {
    this.loadAllUsers();
  }

  deleteUser(id: number) {
    this.userService.delete(id)
        .pipe(first())
        .subscribe(() => this.loadAllUsers());
  }

  editUser(user: User) {
    this.state = 'EDIT';
    this.userToEdit = {...user};
  }

  updateUser() {
    this.loading = true;
    this.userService.update(this.userToEdit)
    .pipe(first())
    .subscribe(() => {
      this.state = 'VIEW';
      this.userToEdit = null;
      this.loadAllUsers();
      this.loading = false;
    });
  }

  private loadAllUsers() {
    this.userService.getAll()
        .pipe(first())
        .subscribe(users => this.users = users);
  }

}
