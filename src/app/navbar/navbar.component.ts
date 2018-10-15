import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../auth/authentication.service';
import { SnackbarUiService } from '../shared/snackbar-ui.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  userDetails;

  constructor(public authService: AuthenticationService, private router: Router) {
  }

  ngOnInit() {
    this.authService.getUser().subscribe(
      res => {
        this.userDetails = res['user'];
        // console.log(this.userDetails);
      },
      err => {
        this.userDetails = false;
        // console.log('Error:', err);
      }
    );
  }

  logout() {
    this.authService.deleteToken();
    this.router.navigate(['/signin']);
  }

}
