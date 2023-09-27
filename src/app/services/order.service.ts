import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Injectable } from '@angular/core'
import { Order } from '../models/order.model';

@Injectable({ providedIn: 'root' })

export class OrderService {
    constructor(private fireStore: AngularFirestore) { }

    create(_order: Order) {
        return this.fireStore.collection('orders').add({ ..._order });
    }
    getUserOrders(userId: string) {
        return this.fireStore.collection('orders', ref => ref.where('userId', '==', userId)).snapshotChanges();
    }
    getAdminOrders() {
        return this.fireStore.collection('orders').snapshotChanges();
    }
    getById(id: string) {
        return this.fireStore.doc('orders/' + id).valueChanges();
    }
}