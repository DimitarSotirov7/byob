import { Component } from '@angular/core';
import { FireService } from '../services/fire.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  categories: any = [];

  constructor(private fireService: FireService) {
    this.fireService.getCategories().get().subscribe(res => {
      this.categories = res.docs.map(c => c.data());
    });
  }
}
