import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css']
})
export class NotFoundComponent {
  constructor(private router: Router, private authService: AuthService) { }

  goBack() {
    if (this.authService.displayName)
      this.router.navigate(['/products']);
    else
      this.router.navigate(['/login']);
  }
}
