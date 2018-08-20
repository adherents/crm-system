import { Component, OnInit } from '@angular/core';

import { AuthService } from './shared/services/auth.service';

@Component({
  selector: 'crmsc-root',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent implements OnInit {
  title = 'client';

  constructor(private authService: AuthService) {}

  ngOnInit() {
    const token = localStorage.getItem('auth-token');
    if (token !== null) {
      this.authService.setToken(token);
    }
  }
}
