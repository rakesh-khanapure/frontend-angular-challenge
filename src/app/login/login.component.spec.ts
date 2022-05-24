import { async, ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';

import { LoginComponent } from './login.component';
import {RouterTestingModule} from '@angular/router/testing';
import { AuthenticationService } from '../services';
import { Router, RouterModule } from '@angular/router';
import { of } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authenticationService: AuthenticationService;
  let router: Router;
  let authLoginSpy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginComponent ],
      imports: [
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        RouterTestingModule,
      ]
    })
    .compileComponents();
    router = TestBed.get(Router);
    authenticationService = TestBed.get(AuthenticationService);
    spyOnProperty(authenticationService, 'currentUserValue', 'get').and.returnValue('user');
    authLoginSpy = spyOn(authenticationService, 'login').and.returnValue(of({}))
    spyOn(router, 'navigate').and.stub();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent( LoginComponent );
    component = fixture.componentInstance;
    fixture.detectChanges();

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should redirect to Home if already logged in', () => {
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should reset the form at init', () => {
    expect(component.f.username.value).toEqual('');
    expect(component.f.password.value).toEqual('');
  });

  it('should render title in a h1 tag', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Welcome to The HRS Angular Coding Challenge!');
  });

  it('should not call login service after form submit if username or password are invalid', () => {
    component.onSubmit();
    expect(component.submitted).toBe(true);
    expect(authLoginSpy).not.toHaveBeenCalled();
  });

  it('should call login service after form submit if username or password are valid', () => {
    component.loginForm.controls.username.setValue('test');
    component.loginForm.controls.password.setValue('test');
    component.onSubmit();
    expect(component.submitted).toBe(true);
    expect(authLoginSpy).toHaveBeenCalled();
  });

});
