import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class QuizService {

  quizzesColl: string = 'quizzes';

  constructor(private firestore: AngularFirestore) { }

  getAll(): AngularFirestoreCollection {
    return this.firestore.collection(this.quizzesColl);
  }

  get(doc: string): AngularFirestoreDocument {
    return this.firestore.collection(this.quizzesColl).doc(doc);
  }
}
