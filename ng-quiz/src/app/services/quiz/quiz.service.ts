import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuizService {

  data: any;
  quizzesColl: string = 'quizzes';

  constructor(private firestore: AngularFirestore) {
    this.getAll().get().subscribe(res => {
      this.data = res.docs.map(q => ({ ...q.data(), id: q.id }));
    });
  }

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

  addUser(quizId: string, uid: string) {
    this.firestore.collection(this.quizzesColl).doc(quizId).get().subscribe(q => {
      const quiz = q.data() as { users: string[] | undefined };
      const users = quiz?.users === undefined ? [] : quiz?.users;
      if (!users.includes(uid)) {
        users.push(uid);
      }
      this.firestore.collection(this.quizzesColl).doc(quizId).update({ users });
    });
  }
}
