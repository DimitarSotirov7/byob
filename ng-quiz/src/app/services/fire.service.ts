import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FireService {

  url: string = environment.firebase.dbUrl;

  constructor(private database: AngularFirestore) { }

  get(coll: string) {
    fetch(this.url).then(res => res.json).then(data => {
      console.log(data)
    });
  }
}
