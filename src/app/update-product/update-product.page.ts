import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormGroup,Validators,ReactiveFormsModule} from '@angular/forms';
import { ProductService } from '../services/product.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-update-product',
  templateUrl: './update-product.page.html',
  styleUrls: ['./update-product.page.scss'],
})
export class UpdateProductPage  {
  public productForm: FormGroup;

  constructor(private toastController: ToastController,private formBuilder: FormBuilder, private productService: ProductService, private router: Router) { 
    this.productForm = this.formBuilder.group({
      name: [this.productService.productwhere.name, Validators.required],
      price: [this.productService.productwhere.price, Validators.required],
      description: [this.productService.productwhere.description],
      photo: [this.productService.productwhere.photo],
      type: [this.productService.productwhere.type, Validators.required]
    });
  }

  async updateProduct() {
    if (this.productForm.valid) {
      const product = this.productForm.value;
      product.id = this.productService.productwhere.id;
      this.productService.updateProduct(product)
      .then(async(result) => {
        if (result === 'success') {
          console.log('Producto actualizado exitosamente');
          const toast = await this.toastController.create({
            message: 'Producto actualizado correctamente',
            duration: 2000, 
            position: 'top'
          });
          toast.present();
          this.router.navigate(['/tabs/tab1']);
        } else {
          console.error('Error al actualizar el producto');
        }
      })
      .catch((error) => {
        console.error("Error");
      })
    }
  }
}
