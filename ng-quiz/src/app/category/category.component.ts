import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Base } from '../common/base';
import { ICategoryModel } from '../interfaces/category-model';
import { AuthService } from '../services/auth/auth.service';
import { CategoryService } from '../services/category/category.service';
import { TranslateService } from '../services/translate/translate.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent extends Base {

  categories: ICategoryModel[] = [];
  menu: any = this._menu.category;

  constructor(
    router: Router,
    authService: AuthService,
    translateService: TranslateService,
    private categoryService: CategoryService
  ) {
    super(router, authService, translateService);
    this.getAll();
    this.subscriptionListener();
  }

  getAll() {
    this.categoryService.getAll().get().subscribe(res => {
      this.categories = res.docs.map(c => ({ ...c.data(), id: c.id })) as ICategoryModel[];
    });
  }

  addCateg() {
    this.categoryService.add({ name: 'asd' });
  }

  private subscriptionListener(): void {
    this.event.push(this.translateService.onChange.subscribe(res => {
      this.menu = this.translateService.state.category;
    }));
  }
}