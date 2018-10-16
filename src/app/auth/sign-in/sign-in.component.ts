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

  constructor(private authService: AuthenticationService, private router: Router, private snackbar: SnackbarUiService) {
  }

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.router.navigateByUrl('/');
    }
  }

  onSubmit(form: NgForm) {
    this.authService.signIn(form.value).subscribe(
      res => {
        this.authService.setToken(res['token']);
        this.router.navigateByUrl('/');
      },
      err => {
        this.snackbar.showSnackbar('There was an error with the request. Status: ' + err.status, 'alert-danger', 3500);
      }
    );
  }

}
