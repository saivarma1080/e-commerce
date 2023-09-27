import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'un-authorized',
  templateUrl: './un-authorized.component.html',
  styleUrls: ['./un-authorized.component.css']
})
export class UnAuthorizedComponent {

  constructor(private router: Router, private authService: AuthService) { }

  goBack() {
    if (this.authService.displayName)
      this.router.navigate(['/products']);
    else
      this.router.navigate(['/login']);
  }
}
