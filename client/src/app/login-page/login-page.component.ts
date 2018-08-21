import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { AuthService } from '../shared/services/auth.service';
import { MaterialService } from '../shared/services/material.service';

@Component({
  selector: 'crmsc-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit, OnDestroy {
  form: FormGroup;
  subscription: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)])
    });

    this.route.queryParams.subscribe((params: Params) => {
      if (params['registered']) {
        MaterialService.toast('Регистрация успешно завершена.');
      } else if (params['accessDenied']) {
        MaterialService.toast('Для дальнейшей работы, авторизуйтесь в системе!');
      } else if (params['sessionExpired']) {
        MaterialService.toast('Пожалуйста войдите в систему заново.');
      }
    });
  }

  onSubmit() {
    this.form.disable();
    this.subscription = this.authService.login(this.form.value).subscribe(
      () => this.router.navigate(['/overview']),
      error => {
        MaterialService.toast(error.error.message);
        this.form.enable();
      }
    );
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
