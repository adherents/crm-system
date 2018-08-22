import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

import { CategoriesService } from '../../shared/services/categories.service';
import { MaterialService } from '../../shared/services/material.service';

@Component({
  selector: 'crmsc-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  form: FormGroup;
  isNew = true;

  constructor(
    private route: ActivatedRoute,
    private categoriesService: CategoriesService
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required)
    });

    this.form.disable();

    this.route.params
      .pipe(
        switchMap(
          (params: Params) => {
            if (params['id']) {
              this.isNew = false;
              return this.categoriesService.getCategoryById(params['id']);
            }

            return of(null);
          }
        )
      )
      .subscribe(
        category => {
          if (category) {
            this.form.patchValue({
              name: category.name
            });
            MaterialService.updateInput();
          }
          this.form.enable();
        },
        error => MaterialService.toast(error.error.message)
      );
  }

  onSubmit() {
  }

}
