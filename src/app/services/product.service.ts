import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Product } from '../models/product.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { ToastController } from '@ionic/angular';
@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private products: Observable<Product[]>;
  public favorites: Observable<Product[]>;
  public pos = 0;
  public productwhere: Product = {
    id: "",
    name: "",
    price: 0,
    description: "",
    type: "",
    photo: ""
  };
  public productCollection: AngularFirestoreCollection<Product>;
  public favoritesCollection: AngularFirestoreCollection<Product>;

  constructor(private firestore: AngularFirestore, public toastController: ToastController) {
    this.productCollection = this.productCollection = this.firestore.collection<Product>('products');
    this.products = this.products = this.productCollection.valueChanges();

    this.favoritesCollection = this.firestore.collection<Product>('favorites');
    this.favorites = this.favoritesCollection.valueChanges();
  }

  saveProduct(product: Product): Promise<string> {
    return this.productCollection.add(product)
      .then((docRef) => {
        const productId = docRef.id;
        console.log('Producto añadido con ID: ' + productId);
        return productId;
      })
      .catch((error) => {
        console.error('Error al añadir el producto: ' + error);
        throw error;  // Puedes manejar el error según tus necesidades
      });
  }
  
  async saveFavorite(product: Product): Promise<string> {
    // Realizar una consulta para verificar si el producto ya existe en favoritos
    const query = this.favoritesCollection.ref.where('name', '==', product.name);

    return query.get().then(async (querySnapshot) => {
      // Si ya existe, no lo añadimos nuevamente
      if (!querySnapshot.empty) {
        // El producto ya existe en favoritos, mostrar Toast
        const toast = await this.toastController.create({
          message: 'El producto ya está en la lista de favoritos.',
          duration: 3000,
          position: 'bottom'
        });
        toast.present();
        return 'exist';
      }

      // Si no existe, lo añadimos
      return this.favoritesCollection.add(product)
        .then((docRef) => {
          const productId = docRef.id;
          const toast = this.toastController.create({
            message: 'El producto ha sido anadido a favoritos.',
            duration: 3000,
            position: 'bottom'
          })
          toast.then(toast => toast.present());
          return productId;
        })
        .catch((error) => {
          console.error('Error al añadir el producto: ' + error);
          throw error;
        });
    }).catch((error) => {
      console.error('Error al verificar la existencia del producto: ' + error);
      throw error;
    });
  }
  
  deleteProduct(product:Product): Promise<string> {
    return this.productCollection.doc(product.id).delete()
    .then((doc)=>{
      console.log('Producto eliminado con id'+ product.id);
      return 'success'
    })
    .catch((error)=>{
      console.log('Error al eliminar producto'+ error);
      return 'Error'
    });
  }

  deleteFavorite(product:Product): Promise<string> {
    return this.favoritesCollection.doc(product.id).delete()
    .then((doc)=>{
      console.log('Producto eliminado con id'+ product.id);
      return 'success'
    })
    .catch((error)=>{
      console.log('Error al eliminar el producto'+ error);
      return 'Error'
    });
  }
  
  updateProduct(product: Product): Promise<string> {
    return this.productCollection.doc(product.id).update(product)
    .then((doc)=>{
      console.log('Producto actualizado con id'+ product.id);
      return 'success'
    })
    .catch((error)=>{
      console.log('Error al actualizar el producto'+ error);
      return 'Error'
    });
  }
  getProducts(): Observable<Product[]> {
    return this.products;
  }

  getFavorites(): Observable<Product[]> {
    return this.favorites;
  }
}
