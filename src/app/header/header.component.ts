import { Component, OnInit, OnDestroy} from '@angular/core';
import { DataStorageService } from '../shared/data-storage.service';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
	private userSub: Subscription;
	isAuthenticated: boolean = false;

	constructor(private dataStorageService: DataStorageService, private authService: AuthService) { }

	ngOnInit(): void {
		this.userSub = this.authService.user.subscribe(user => {
			// if we have a user, we are logged in
			this.isAuthenticated = !user ? false : true;   // set false if no user, otherwise true
		});
	}

	onSaveData(){
		this.dataStorageService.storeRecipes();
	}

	onFetchData(){
		this.dataStorageService.fetchRecipes().subscribe();
	}

	ngOnDestroy(): void {
		this.userSub.unsubscribe();
	}

	onLogout() {
		this.authService.logout();
	}

}
