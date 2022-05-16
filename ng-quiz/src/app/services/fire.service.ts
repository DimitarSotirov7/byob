import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FireService {

  url: string = environment.firebase.dbUrl;
  
  categoriesColl: string = 'categories';

  constructor(private firestore: AngularFirestore) { }

  getCategories(): AngularFirestoreCollection {
    return this.firestore.collection(this.categoriesColl);
  }
}
