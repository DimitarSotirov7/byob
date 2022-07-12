import { EventEmitter, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { IFormModel } from 'src/app/interfaces/form-model';
import { IUserModel } from 'src/app/interfaces/user-model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authState: Observable<any> = this.fireAuth.authState;
  user: IUserModel | undefined;
  uid: string | undefined;
  authMsg: EventEmitter<string> = new EventEmitter();

  constructor(private fireAuth: AngularFireAuth, private firestore: AngularFirestore) {
    this.seeder();
    this.fireAuth.user.subscribe(res => {
      this.user = { uid: res?.uid, email: res?.email };
      this.uid = this.user?.uid;
    });
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

  private seeder() {
    // this.fireAuth.currentUser.then(res => console.log(res));
    // const res = this.fireAuth.user.subscribe(res => console.log(res));

    // console.log(res)
  }
}
