import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { CategoriesService } from '../shared/services/categories.service';
import { Category } from '../shared/models/category.model';

@Component({
  selector: 'crmsc-categories-page',
  templateUrl: './categories-page.component.html',
  styleUrls: ['./categories-page.component.scss']
})
export class CategoriesPageComponent implements OnInit {
  categories$: Observable<Category[]>;

  constructor(private categoriesService: CategoriesService) {}

  ngOnInit() {
    this.categories$ = this.categoriesService.getAllCategories();
  }

}
