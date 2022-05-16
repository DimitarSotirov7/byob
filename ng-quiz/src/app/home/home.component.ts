import { Component, OnInit } from '@angular/core';
import { getDatabase } from 'firebase/database';
import { FireService } from '../services/fire.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  database = getDatabase();

  constructor(private fireService: FireService) {
  }

}
