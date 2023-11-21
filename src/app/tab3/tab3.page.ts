import { Component } from '@angular/core';
import { CartService } from '../services/cart.service';
import { Cart } from '../models/product.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  public cart:Observable<Cart[]>;

  constructor(private cartService: CartService) {
    this.cart = this.cartService.gethistoCrt();
  }

  public getCarts(){ 
    return this.cart
  }
}
