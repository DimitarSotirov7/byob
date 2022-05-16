import { Component } from '@angular/core';
import { FireService } from './services/fire.service';
import { getDatabase } from "firebase/database";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ng-quiz';
}
