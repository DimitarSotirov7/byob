import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  
  categoriesColl: string = 'categories';

  constructor(private firestore: AngularFirestore) { }

  getAll(): AngularFirestoreCollection {
    return this.firestore.collection(this.categoriesColl);
  }

  get(doc: string): AngularFirestoreDocument {
    return this.firestore.collection(this.categoriesColl).doc(doc);
  }

  add(data: any): void {
    this.firestore.collection(this.categoriesColl).add(data);
  }

  update(doc: string, data: any): void {
    this.firestore.collection(this.categoriesColl).doc(doc).update(data);
  }

  delete(doc: string): void {
    this.firestore.collection(this.categoriesColl).doc(doc).delete();
  }
}
