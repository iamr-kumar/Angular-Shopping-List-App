import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap, take, exhaustMap } from 'rxjs/operators';

import { Recipe } from '../recipe/recipe.model';
import { RecipeService } from '../recipe/recipe.service';
import { AuthService } from '../auth/auth.service';

@Injectable({providedIn: "root"})

export class DataStorageService{

    constructor(private http: HttpClient, private recipeService: RecipeService, private authService: AuthService){}

    storeRecipes(){
        const recipes = this.recipeService.getRecipe();
        this.http.put('https://my-recipe-book-a9b70.firebaseio.com/recipes.json', recipes)
            .subscribe(response => console.log(response));
    }

    fetchRecipes(){
            return this.http.get<Recipe[]>(
                'https://my-recipe-book-a9b70.firebaseio.com/recipes.json?'
            )
            .pipe(
                map(recipes => {
                    return recipes.map(recipe => {
                        return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []};
                    });
                }), 
                tap(recipes => {
                    this.recipeService.setRecipes(recipes);
                })
            )

    }

}