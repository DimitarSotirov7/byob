import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  questionsColl: string = 'questions';
  answersColl: string = 'answers';

  constructor(private firestore: AngularFirestore) { }

  getAll(): AngularFirestoreCollection {
    return this.firestore.collection(this.questionsColl);
  }

  get(doc: string): Observable<any> {
    return this.firestore.collection(this.questionsColl).doc(doc).get();
  }

  add(data: any): Promise<any> {
    return this.firestore.collection(this.questionsColl).add(data);
  }

  updateAnswers(questionId: string, answerIds: string[]): void {
    this.firestore.collection(this.questionsColl).doc(questionId).update({ answers: answerIds });
  }

  // Answers

  getAnswers(): AngularFirestoreCollection {
    return this.firestore.collection(this.answersColl);
  }

  addAnswers(answerTexts: string[]): Promise<any> {
    return Promise.all(answerTexts.map(text => this.firestore.collection(this.answersColl).add({ text })));
  }

  deleteAnswers(answerIds: string[]): Promise<any> {
    console.log(answerIds)
    return Promise.all(answerIds.map(id => this.firestore.collection(this.answersColl).doc(id).delete()));
  }
}
