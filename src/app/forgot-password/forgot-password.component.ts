import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/authentication.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {

  errorText = '';
  model = {
    email: '',
    password: ''
  }
  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  verificationResult = {};
  ngOnInit() {
    const { uuid } = this.activatedRoute.snapshot.params;
    this.authService.forgotPasswordVerify({ verification: uuid }).subscribe(verificationResult => {
      this.verificationResult = verificationResult;
      console.log(this.verificationResult);
    }, error => {
      console.error("error");
    })
  }

  resetPassword() {
    this.authService.resetPassword(this.model).subscribe(result => {
      this.router.navigate(['login']);
    }, error => {
      console.error(error);
    })
  }


  navigateToLogin() {
    this.router.navigate(['login']);
  }
}
