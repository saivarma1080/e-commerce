import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { AuthService } from "src/app/services/auth.service";

@Injectable()

export class AdminGuard implements CanActivate {

    constructor(private authService: AuthService, private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if (this.authService.displayName && this.authService.isAdmin) {
            return true;
        }
        else {
            this.router.navigate(['un-authorized']);
            return false;
        }
    }
}
