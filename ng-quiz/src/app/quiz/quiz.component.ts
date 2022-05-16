import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent {

  constructor(private route: ActivatedRoute) { 
    console.log(this.route.snapshot.params.id)
  }

}
