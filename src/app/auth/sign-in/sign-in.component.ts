import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../authentication.service';
import { SnackbarUiService } from '../../shared/snackbar-ui.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  signingIn = false;

  constructor(private authService: AuthenticationService, private router: Router, private snackbar: SnackbarUiService) {
  }

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.router.navigateByUrl('/');
    }
  }

  onSubmit(form: NgForm) {
    this.signingIn = true;
    this.authService.signIn(form.value).subscribe(
      res => {
        this.authService.setJWT(res['token']);
        this.router.navigateByUrl('/');
      },
      err => {
        this.signingIn = false;
        this.snackbar.show(err.error.message, 'alert-danger', 3500);
      }
    );
  }

}
