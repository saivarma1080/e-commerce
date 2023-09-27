import { Component } from "@angular/core";
import { User } from "src/app/models/user.model";
import { AuthService } from "src/app/services/auth.service";
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from "@angular/router";

@Component({
    selector: 'registration',
    templateUrl: './registration.component.html',
    styleUrls: ['./registration.component.css']
})

export class RegistrationComponent {
    userDetail = new User();
    constructor(private authService: AuthService, private toastr: ToastrService, private router: Router, private activeRouter: ActivatedRoute) { }

    registerAccount() {
        this.authService.register(this.userDetail)
            .then(response => {
                this.toastr.success('Registration successful.');
                let returnUrl = this.activeRouter.snapshot.queryParamMap.get('returnUrl') || '/';
                this.router.navigateByUrl(returnUrl);
            })
            .catch(error => {
                this.toastr.error('Internal server error.');
            })
    }
  }
