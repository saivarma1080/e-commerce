import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  userDetail = new User();
  imgUrl: string = 'assets/login-register-bg.png';
  constructor(private auth: AuthService, private toastr: ToastrService, private router: Router, private activeRouter: ActivatedRoute) { }
  login() {
    this.auth.validate(this.userDetail.email, this.userDetail.password)
      .subscribe({
        next: this.handleSuccess.bind(this),
        error: this.handleError.bind(this),
      });
  }
  handleSuccess(response: any) {
    let users = response.map((data: any) => {
      return {
        id: data.payload.doc.id,
        ...(data.payload.doc.data() as User)
      }
    });

    if (users && users.length > 0) {
      let userDetail = users.shift();

      localStorage.setItem('displayName', userDetail!.displayName);
      localStorage.setItem('loggedInUserId', userDetail!.id);
      localStorage.setItem('isAdmin', userDetail!.isAdmin ? 'true' : 'false');

      this.toastr.success('Login successful.');
      let returnUrl = this.activeRouter.snapshot.queryParamMap.get('returnUrl') || '/';
      this.router.navigateByUrl(returnUrl);
    } else {
      this.toastr.error('In-valid credentials.');
    }
  }
  handleError(response: any) {
    this.toastr.error('In-valid credentials.');
  }
}
