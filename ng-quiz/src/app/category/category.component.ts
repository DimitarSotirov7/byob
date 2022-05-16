import { Component } from '@angular/core';
import { ICategoryModel } from '../interfaces/category-model';
import { CategoryService } from '../services/category/category.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent {

  categories: ICategoryModel[] = [];

  constructor(private categoryService: CategoryService) {
    this.getAll();
  }

  getAll() {
    this.categoryService.getAll().get().subscribe(res => {
      this.categories = res.docs.map(c => ({ ...c.data(), id: c.id })) as ICategoryModel[];
    });
  }

  addCateg() {
    this.categoryService.add({ name: 'asd' });
  }
}
