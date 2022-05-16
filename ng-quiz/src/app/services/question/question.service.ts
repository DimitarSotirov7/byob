import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  questionsColl: string = 'questions';

  constructor(private firestore: AngularFirestore) { }

  getAll(): AngularFirestoreCollection {
    return this.firestore.collection(this.questionsColl);
  }

  get(doc: string): Observable<any> {
    return this.firestore.collection(this.questionsColl).doc(doc).get();
  }
}
