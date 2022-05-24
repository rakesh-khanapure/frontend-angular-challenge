import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';

import {RouterTestingModule} from '@angular/router/testing';
import { UserService } from '../services';
import { of } from 'rxjs';
import { HomeComponent } from './home.component';
import { User } from '../models/user.model';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let mockUserService;
  let mockUser: User = {firstName: 'Abc', lastName: 'qqq', id: 1, username: 'aqqq', password: '111', token: '' };
  let getUserObserver = of([mockUser]);

  beforeEach(async(() => {
    mockUserService = jasmine.createSpyObj('UserService', ['getAll', 'delete', 'update']);
    mockUserService.getAll.and.returnValue(getUserObserver);
    mockUserService.delete.and.returnValue(of({}));
    mockUserService.update.and.returnValue(of({}));

    TestBed.configureTestingModule({
      declarations: [ HomeComponent ],
      imports: [
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        RouterTestingModule,
      ],
      providers: [
          {
              provide: UserService, useValue: mockUserService
          }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent( HomeComponent );
    component = fixture.componentInstance;
    component.currentUser = {firstName: 'FName'} as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load All the users on Init', () => {
    expect(mockUserService.getAll).toHaveBeenCalled();
    getUserObserver.subscribe(result => {
        expect(component.users.length).toEqual(1);
    })
  });

  it('should show table with one row', () => {
    const compiled = fixture.debugElement.nativeElement;
    
    expect(compiled.querySelectorAll('table tbody tr').length).toEqual(1);
    expect(compiled.querySelectorAll('table tbody tr td')[0].textContent).toContain(mockUser.firstName);
  });

  it('should show update button when edit is called', () => {
    component.editUser(mockUser);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    
    expect(component.state).toEqual('EDIT');
    expect(component.userToEdit).toBeTruthy();
    expect(compiled.querySelectorAll('table tbody tr td:last-child span').length).toEqual(1);
  });

  it('should call user service delete when delete is called', () => {
    component.deleteUser(1);
    
    expect(mockUserService.delete).toHaveBeenCalledWith(1);
    expect(mockUserService.getAll).toHaveBeenCalled();
  });

  it('should call user service update when update is called', () => {
    component.userToEdit = mockUser;
    component.updateUser();
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;

    expect(mockUserService.update).toHaveBeenCalledWith(mockUser);
    expect(component.state).toEqual('VIEW');
    expect(component.userToEdit).toBeNull();
    expect(mockUserService.getAll).toHaveBeenCalled();
    expect(compiled.querySelectorAll('table tbody tr td:last-child span').length).toEqual(2);
  });

});
