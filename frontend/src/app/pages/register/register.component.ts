import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { Router } from '@angular/router'; 
import { MatSnackBar } from '@angular/material/snack-bar';
import { matchingPasswords, emailValidator } from 'src/app/theme/utils/app-validators';
import { HttpResponse } from '@angular/common/http';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  public registerForm: FormGroup;
  public hide = true;

  constructor(private authService: AuthService,public fb: FormBuilder, public router:Router, public snackBar: MatSnackBar) { }

  ngOnInit() {
    this.registerForm = this.fb.group({
      username: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
      email: ['', Validators.compose([Validators.required, emailValidator])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
      receiveNewsletter: false                            
    });
  }

  public onRegisterFormSubmit(values:Object):void {
    if (this.registerForm.valid) {
      console.log(values);
      this.authService.signup(values).subscribe((res: HttpResponse<any>) => {
        console.log(res);
        this.router.navigate(['/']);
      this.snackBar.open('You registered successfully!', '×', { panelClass: 'success', verticalPosition: 'top', duration: 3000 });
      });
    
      
      }
    }
  }


