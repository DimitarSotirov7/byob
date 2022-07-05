import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { IFormModel } from 'src/app/interfaces/form-model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authState: Observable<any> = this.fireAuth.authState;

  constructor(private fireAuth: AngularFireAuth, private firestore: AngularFirestore) {

  }

  login(input: IFormModel): Promise<any> {
    return this.fireAuth.signInWithEmailAndPassword(input.email.trim(), input.password.trim());
  }

  register(input: IFormModel): Promise<any> {
    return this.fireAuth.createUserWithEmailAndPassword(input.email.trim(), input.password.trim());
  }

  logout(): Promise<any> {
    return this.fireAuth.signOut();
  }

  addUserFirestore(doc: string, input: IFormModel): Promise<void> {
    return this.firestore.collection("users").doc(doc).set({
      isAdmin: input.email === environment.admin.email
    });
  }

  getUserData(doc: string): AngularFirestoreDocument {
    return this.firestore.collection("users").doc(doc);
  }

  setUserFirestore(doc: string, isAdmin: Boolean): void {
    this.firestore.collection("users").doc(doc).update({ isAdmin: isAdmin });
  }
}
