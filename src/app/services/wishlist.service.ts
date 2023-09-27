import { Injectable } from '@angular/core'
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Wishlist } from '../models/wishlist.model';
@Injectable({ providedIn: 'root' })

export class WishlistService {
    constructor(private fireStore: AngularFirestore) { }

    create(_wishlist: Wishlist) {
        return this.fireStore.collection('wishlist').add({ ..._wishlist });
    }
    read(userId: string) {
        return this.fireStore.collection('wishlist', ref => ref.where('userId', '==', userId)).snapshotChanges();
    }
    delete(id: string) {
        return this.fireStore.doc('wishlist/' + id).delete();
    }
}