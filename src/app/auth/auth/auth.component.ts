import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

    isLoginMode = true;
    isLoading: boolean = false;
    error: string;

    constructor(private authService: AuthService, private router: Router) { }

    ngOnInit(): void {
    }

    onSwitchMode(){
        this.isLoginMode = !this.isLoginMode;
    }

    onSubmit(form: NgForm){
        const email = form.value.email;
        const password = form.value.email;
        if(this.isLoginMode){
            this.authService.login(email, password)
            .subscribe(data => {
                this.router.navigate(["/recipes"]);
                console.log(data);   
            }, errorMessage => {
                this.error = errorMessage;
            });
        }
        else{
            this.isLoading = true;
            this.authService.signup(email, password)
                .subscribe(data => {
                    this.router.navigate(["/recipes"]);
                    console.log(data);   
                }, errorMessage => {
                    this.error = errorMessage;
                });
            this.isLoading = false;
        }

        form.reset();
    }

    handleError() {
        this.error = "";
    }

}
