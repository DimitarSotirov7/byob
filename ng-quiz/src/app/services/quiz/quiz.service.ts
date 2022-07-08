import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuizService {

  quizzesColl: string = 'quizzes';

  constructor(private firestore: AngularFirestore) { }

  getAll(): AngularFirestoreCollection {
    return this.firestore.collection(this.quizzesColl);
  }

  get(doc: string): Observable<any> {
    return this.firestore.collection(this.quizzesColl).doc(doc).get();
  }

  add(data: any): Promise<any> {
    return this.firestore.collection(this.quizzesColl).add(data);
  }

  addQuestion(quizId: string, id:string): void {
    this.firestore.collection(this.quizzesColl).doc(quizId).get().subscribe(q => {
      const quiz = q.data() as { questions: string[] | undefined };
      const questions = quiz?.questions === undefined ? [] : quiz?.questions;
      questions.push(id);
      this.firestore.collection(this.quizzesColl).doc(quizId).update({ questions });
    });
  }
}
