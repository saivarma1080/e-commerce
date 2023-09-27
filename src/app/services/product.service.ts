import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Injectable } from '@angular/core'
import { Product } from '../models/product.model';
@Injectable({ providedIn: 'root' })
export class ProductService {
    constructor(private fireStore: AngularFirestore) { }

    create(product: Product) {
        return this.fireStore.collection('product').add({ ...product });
    }
    read(searchTerm: string, category: string = '') {
        if (searchTerm && category)
            return this.fireStore.collection('product', ref => ref.where('category', '==', category).orderBy('title').startAt(searchTerm).endAt(`${searchTerm}\uf8ff`)).snapshotChanges();
        else if (category)
            return this.fireStore.collection('product', ref => ref.where('category', '==', category)).snapshotChanges();
        else if (searchTerm)
            return this.fireStore.collection('product', ref => ref.orderBy('title').startAt(searchTerm).endAt(`${searchTerm}\uf8ff`)).snapshotChanges();
        else
            return this.fireStore.collection('product').snapshotChanges();
    }

    update(id: string, product: Product) {
        return this.fireStore.doc('product/' + id).update({ ...product });
    }
    delete(id: string) {
        return this.fireStore.doc('product/' + id).delete();
    }
    getById(id: string) {
        return this.fireStore.doc('product/' + id).valueChanges();
    }
}