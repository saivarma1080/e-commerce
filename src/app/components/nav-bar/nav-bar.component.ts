import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ShoppingCartService } from 'src/app/services/shopping-cart.service';

@Component({
  selector: 'nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent {
  constructor(private router: Router, public authService: AuthService, public cartService: ShoppingCartService) {

  }
  logout() {
    localStorage.removeItem('displayName');
    localStorage.removeItem('loggedInUserId');
    localStorage.removeItem('isAdmin');

    this.router.navigate(['/products']);
  }
}
