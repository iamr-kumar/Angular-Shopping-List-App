import { Injectable, EventEmitter } from "@angular/core";
import { Recipe } from './recipe.model';

import { Ingredient } from '../shared/ingredients.model';
import { ShoppingService } from '../shopping-list/shopping.service';
import { Subject } from 'rxjs';

@Injectable()

export class RecipeService{
    // recipes: Recipe[] = [
    //     new Recipe('Chicken Biryani', 'The Best chicke dish!','https://www.indianhealthyrecipes.com/wp-content/uploads/2019/02/chicken-biryani-recipe-500x500.jpg',
    //         [
    //             new Ingredient('Rice', 500),
    //             new Ingredient('Chicken', 500),
    //             new Ingredient('Spices', 1000)
    //         ]),
    //     new Recipe('Rajmaa Chawal', 'One of the most loved dishes!', 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQkE1t5sTWRLXPEIIVY-dbmcRAmrm-Bt0BiBmmUDcKtvdNEPo8Z&usqp=CAU',
    //     [
    //         new Ingredient('Rajmaa', 500),
    //         new Ingredient('Rice', 350)
    //     ])
    // ];

    recipes: Recipe[] = [];

    recipesChanged = new Subject<Recipe[]>();

    constructor(private slService: ShoppingService){}

    getRecipe(){
        return this.recipes.slice();
    }

    addToShoppingList(ingredients: Ingredient[]){
        this.slService.addIngredients(ingredients);
    }

    getSingleRecipe(index: number){
        return this.recipes[index];
    }

    addRecipe(recipe: Recipe){
        this.recipes.push(recipe);
        this.recipesChanged.next(this.recipes.slice());
    }

    updateRecipe(index: number, newRecipe: Recipe){
        this.recipes[index] = newRecipe;
        this.recipesChanged.next(this.recipes.slice());
    }

    deleteRecipe(index: number){
        this.recipes.splice(index, 1);
        this.recipesChanged.next(this.recipes.slice());
    }

    setRecipes(recipes: Recipe[]){
        this.recipes = recipes;
        this.recipesChanged.next(this.recipes.slice());
    }

}