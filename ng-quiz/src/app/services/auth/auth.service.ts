import { EventEmitter, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { IFormModel } from 'src/app/interfaces/form-model';
import { IUserModel } from 'src/app/interfaces/user-model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user: IUserModel;
  get state(): string | undefined {
    return this.getCookie();
  }
  authMsg: EventEmitter<string> = new EventEmitter();
  preUrl: any;

  constructor(private fireAuth: AngularFireAuth, private firestore: AngularFirestore) {
    this.user = {} as IUserModel;
    this.load();
    // this.logout()
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

  addUserFirestore(user: any) {
    const uid = user?.uid;
    const email = user?.email;
    if (!uid || !email) {
      return;
    }
    this.firestore.collection("users").doc(uid).set({
      admin: email === environment.admin.email
    });
  }

  private load() {
    this.fireAuth.user.subscribe(authRes => {
      this.user = { uid: authRes?.uid, email: authRes?.email, admin: false };
      console.log(this.user?.uid)
      this.firestore.collection("users").doc(authRes?.uid).get().subscribe(storeRes => {
        (this.user as IUserModel).admin = (storeRes.data() as { admin: boolean })?.admin;
      });
    });
  }

  setUserFirestore(doc: string, isAdmin: Boolean): void {
    this.firestore.collection("users").doc(doc).update({ isAdmin: isAdmin });
  }

  setCookie(uid: string) {
    document.cookie = `${environment.cookieName}=${uid}`;
  }

  removeCookie(key: string | undefined = undefined) {
    key = key ? key : environment.cookieName;
    const curr = new Date();
    const previous = new Date(curr.getTime());
    previous.setDate(curr.getDate() - 1);
    document.cookie = `${key}=; expires=${previous}`;
  }

  private getCookie(key: string | undefined = undefined): string | undefined {
    const separator = '; ';
    const cookies = document.cookie.split(separator)
      .map(c => c.split('=')
        .reduce((acc, curr, idx) => {
          if (idx === 0) { acc.key = curr }
          else { acc.value = curr }
          return acc;
        }, {} as { key: string, value: string }));

    key = key ? key : environment.cookieName;
    const item = cookies.find(c => c.key === key);
    return item?.value;
  }
}
