import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { IQuestionModel } from 'src/app/interfaces/question-model';

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
    this.firestore.collection(this.questionsColl).doc(questionId).update({ correct: answerIds[0], answers: answerIds });
  }

  addUser(questionId: string, uid: string, selected: string) {
    this.firestore.collection(this.questionsColl).doc(questionId).get().subscribe(q => {
      const question = q.data() as { users: { uid: string, selected: string }[] | undefined };
      let users = question?.users === undefined ? [] : question?.users;
      const user = users.find(u => u.uid === uid);
      if (!user) {
        users.push({ uid, selected });
      } else {
        users = users.map(u => {
          if (u.uid === uid) {
            u.selected = selected;
          }
          return u;
        });
      }
      this.firestore.collection(this.questionsColl).doc(questionId).update({ users });
    });
  }

  removeUser(questions: string[], uid: string) {
    this.firestore.collection(this.questionsColl).get().subscribe(q => {
      const questionsFound = (q.docs as any[]).filter(x => questions.includes(x.id)).map(x => ({ id: x.id, users: x.data()?.users }));
      Promise.all(questionsFound.map(x => {
        const users = (x.users as { uid: string }[])?.filter(u => u.uid !== uid);
        this.firestore.collection(this.questionsColl).doc(x.id).update({ users })
      }));
    });
  }

  // Answers

  getAnswers(): AngularFirestoreCollection {
    return this.firestore.collection(this.answersColl);
  }

  addAnswers(answerTexts: string[]): Promise<any> {
    return Promise.all(answerTexts.map(text => this.firestore.collection(this.answersColl).add({ text })));
  }

  deleteAnswers(answerIds: string[]): Promise<any> {
    return Promise.all(answerIds.map(id => this.firestore.collection(this.answersColl).doc(id).delete()));
  }
}
