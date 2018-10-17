import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../auth/authentication.service';

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
        this.userDetails = null;
        // console.log('Error:', err);
      }
    );
  }

  logOut() {
    this.authService.removeJWT();
    this.router.navigate(['/']);
  }

}
