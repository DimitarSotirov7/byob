import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { ITimeModel } from 'src/app/interfaces/time-model';

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

  updateExpire(quizId: string, expire: Date) {
    this.firestore.collection(this.quizzesColl).doc(quizId).update({ expire });
  }

  getDate(date: Date) {
    const newDate = new Date((date as any)?.seconds*1000);
    if (newDate.toString() === 'Invalid Date') { return '' };
    const dateParts = newDate.toDateString().split(' ');
    return `${dateParts[1]} ${dateParts[2]}`;
  }

  setTime(questions: any): ITimeModel | undefined {
    if (!questions || questions?.length === 0) {
      return undefined;
    }

    const count = questions?.length;
    const SecPerQuest = 20;
    const time = count * SecPerQuest;
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);

    return { minutes, seconds };
  }

  getTimer(time: ITimeModel | undefined): string {
    if (!time) {
      return '00:00';
    }
    return `${(time.minutes as number) < 10 ? '0' + time.minutes : 
      time.minutes}:${(time.seconds as number) < 10 ? '0' + time.seconds : time.seconds}`;
  }
}
