import {Component, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthenticationService} from '../authentication.service';
import {SnackbarUiService} from '../../shared/snackbar-ui.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

  constructor(private authService: AuthenticationService, private router: Router, private snackbar: SnackbarUiService) {
  }

  ngOnInit() {
  }

  onSubmit(form: NgForm) {
    this.authService.signUp(form.value).subscribe(
      res => {
        this.router.navigateByUrl('/signin');
      },
      err => {
        if (err.status === 422) {
          this.snackbar.show('There was an error with the request. Status: ' + err.status, 'alert-danger', 3500);
        } else {
          this.snackbar.show('There was an error with the request. Status: ' + err.status, 'alert-danger', 3500);
        }
      }
    );
  }

}
