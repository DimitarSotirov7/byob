import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { IAnswerModel } from 'src/app/interfaces/answer-model';
import { IQuestionModel } from 'src/app/interfaces/question-model';
import { IQuizModel } from 'src/app/interfaces/quiz-model';
import { ITimeModel } from 'src/app/interfaces/time-model';

@Injectable({
  providedIn: 'root'
})
export class QuizService {

  data: any;
  quizzesColl: string = 'quizzes';
  SecPerQuest: number = 20;

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
      const quiz = q.data() as { users: { uid: string, start: Date }[] | undefined };
      const users = quiz?.users === undefined ? [] : quiz?.users;
      if (!users.find(u => u.uid === uid)) {
        users.push({ uid: uid, start: new Date()});
      }
      this.firestore.collection(this.quizzesColl).doc(quizId).update({ users });
    });
  }

  removeUser(quizId: string, uid: string) {
    this.firestore.collection(this.quizzesColl).doc(quizId).get().subscribe(q => {
      const quiz = q.data() as { users: { uid: string, start: Date }[] | undefined };
      const users = quiz?.users === undefined ? [] : quiz?.users;
      const index = users.findIndex(u => u?.uid === uid);
      if (index >= 0) {
        users.splice(index, 1);
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

  getTimer(time: ITimeModel | undefined): string {
    if (!time) {
      return '00:00';
    }
    return `${(time.minutes as number) < 10 ? '0' + time.minutes : 
      time.minutes}:${(time.seconds as number) < 10 ? '0' + time.seconds : time.seconds}`;
  }

  randomize(questions: any) {
    const tempQuestions = [] as IQuestionModel[] | [];
    const qLength = questions.length;
    for (let i = 0; i < qLength; i++) {
      const qRandom = Math.floor(Math.random()*questions.length);
      const question = questions.splice(qRandom, 1)[0];

      const tempAnswers = [] as IAnswerModel[] | [];
      const aLength = question.answers.length;
      for (let j = 0; j < aLength; j++) {
        const aRandom = Math.floor(Math.random()*question.answers.length);
        const answers = question.answers.splice(aRandom, 1)[0];
        (tempAnswers as IAnswerModel[]).push(answers);
      }
      question.answers = tempAnswers;

      (tempQuestions as IQuestionModel[]).push(question);
    }
    return tempQuestions;
  }
}
