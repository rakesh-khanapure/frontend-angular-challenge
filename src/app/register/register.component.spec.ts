import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterComponent } from './register.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {RouterTestingModule} from '@angular/router/testing';
import { UserService } from '../services';
import { of } from 'rxjs';
import { Router } from '@angular/router';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let userService, userServiceSpy;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisterComponent ],
      imports: [
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        RouterTestingModule,
      ]
    })
    .compileComponents();
    router = TestBed.get(Router);
    userService = TestBed.get(UserService);
    userServiceSpy = spyOn(userService, 'register').and.returnValue(of({}))
    spyOn(router, 'navigate').and.stub();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create formgroup with 4 controls on Init', () => {
    expect(Object.keys(component.registerForm.controls).length).toEqual(4);
  });

  it('should not call login service after form submit if username or password are invalid', () => {
    component.onSubmit();
    expect(component.submitted).toBe(true);
    expect(userServiceSpy).not.toHaveBeenCalled();
  });

  it('should call login service after form submit if username or password are valid', () => {
    component.registerForm.controls.firstName.setValue('Abc');
    component.registerForm.controls.lastName.setValue('Xyz');
    component.registerForm.controls.username.setValue('test');
    component.registerForm.controls.password.setValue('test123');
    component.onSubmit();
    expect(component.submitted).toBe(true);
    expect(userServiceSpy).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should show the error when forms are validated', () => {
    component.registerForm.controls.firstName.setValue('Abc');
    component.registerForm.controls.lastName.setValue('Xyz');
    component.onSubmit();
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelectorAll('.invalid-feedback').length).toBe(2);
  });


});
