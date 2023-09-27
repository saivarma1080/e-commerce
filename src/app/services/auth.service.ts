import { Injectable } from "@angular/core";
import { User } from "../models/user.model";
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({ providedIn: 'root' })

export class AuthService {
    constructor(private fireStore: AngularFirestore) { }

    validate(email: string, password: string) {
        return this.fireStore.collection('user', ref => ref.where('email', '==', email).where('password', '==', password)).snapshotChanges();
    }
    register(userModel: User) {
        return this.fireStore.collection('user').add({ ...userModel });
    }
    get displayName() {
        return localStorage.getItem('displayName');
    }
    get loggedInUserId() {
        return localStorage.getItem('loggedInUserId');
    }
    get isAdmin(): boolean {
        return localStorage.getItem('isAdmin') === 'true';
    }
}