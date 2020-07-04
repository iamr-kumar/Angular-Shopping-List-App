import { Component, OnInit, ViewChild} from '@angular/core';
import { Ingredient } from 'src/app/shared/ingredients.model';
import { ShoppingService } from '../shopping.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit { 
  @ViewChild('f', {static: false}) slForm: NgForm;
  newIngredient: Ingredient;
  subscription: Subscription;
  editMode = false;
  editingItemIndex: number;
  editingItem: Ingredient;

  constructor(private slService: ShoppingService) { }

  ngOnInit(): void {
    this.subscription = this.slService.startEditing
      .subscribe(
        (index: number) => {
          this.editingItemIndex = index;
          this.editMode = true;
          this.editingItem = this.slService.getItemToBeEdited(index);
          this.slForm.setValue({
            name: this.editingItem.name,
            amount: this.editingItem.amount
          });
        }
      );
  }

  addIngredients(form: NgForm){
    const value = form.value;
    const newIngredient = new Ingredient(value.name, value.amount);
    if(this.editMode){
      this.slService.updateIngredient(this.editingItemIndex, newIngredient);
    } 
    else{
      this.slService.addIngredient(newIngredient);
    }
    this.editMode = false;
    form.reset();
  }  

  onClear(){
    this.slForm.reset();
    this.editMode = false;    
  }

  onDelete(){
    this.slService.deleteIngredient(this.editingItemIndex);
    this.slForm.reset();
    this.editMode = false;
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

}
