import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError, Subject, BehaviorSubject } from 'rxjs';
import { User } from './user.model';
import { Router } from '@angular/router';

interface AuthResponseData{
    kind: string;
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean;  //not present while signing up, present while logging in
}

@Injectable({providedIn: 'root'})

export class AuthService{

    user = new BehaviorSubject<User>(null);   //The previous emitted value can be accessed, even if subscribed later
    private tokenExpirationTimer: any;

    constructor(private http: HttpClient, private router: Router){}

    signup(email: string, password: string){
        return this.http.post<AuthResponseData>("https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAF8flOmGG2iuVAawIX_qI1njgVx0MHoJs", 
        {
            email: email,
            password: password,
            returnSecureToken: true
        }).pipe(catchError(this.handleError), tap(resData => {
            this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
        }));
    }

    login(email: string, password: string) {
        return this.http.post<AuthResponseData>("https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAF8flOmGG2iuVAawIX_qI1njgVx0MHoJs",
            {
                email: email,
                password: password,
                returnSecureToken: true
            }
        ).pipe(catchError(this.handleError), tap(resData => {
            this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
        }));
    }

    logout() {
        this.user.next(null);
        localStorage.removeItem('userData');
        this.router.navigate(['/auth']);
        if(this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer);
        }
        this.tokenExpirationTimer = null;
    }

    autoLogin() {
       const userData: {
           email: string,
           id: string,
           _token: string,
           _tokenExpirationDate: string
       } = JSON.parse(localStorage.getItem('userData'));
       if(!userData) {
           return;
       }
       else {
            const loadedUser = new User(
                userData.email, 
                userData.id, 
                userData._token, 
                new Date(userData._tokenExpirationDate)
                );
            if(loadedUser.token) {
                this.user.next(loadedUser);
                const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
                this.autoLogout(expirationDuration);
            }
            
       }
    }

    autoLogout(expirationDuration: number) {
        this.tokenExpirationTimer = setTimeout(() => {
            this.logout();
        }, expirationDuration)
    }

    private handleAuthentication(email: string, userId: string, token: string, expiresIn: number) {
        const expirationDate = new Date(
            new Date().getTime() + expiresIn * 1000
        )
        const user = new User(email, userId, token, expirationDate);
        // Store user data in local sotrage in string format
        localStorage.setItem('userData', JSON.stringify(user))
        this.user.next(user);
        this.autoLogout(expiresIn * 1000);
    }


    // Method to handle errors for both login and signup methods
    private handleError(errorRes: HttpErrorResponse) {
        var errorMessage = "Some error occurred!";
            if(!errorRes.error || !errorRes.error.error) {
                return throwError(errorMessage);
            }
            switch(errorRes.error.error) {
                case "EMAIL_EXISTS":
                    errorMessage = "This email already exists!";
                case 'EMAIL_NOT_FOUND':
                    errorMessage = "This email does not exist!";
                case 'INVALID_PASSWORD':
                    errorMessage = "Password is incorrect!";
            }
            return throwError(errorMessage);
    }
}