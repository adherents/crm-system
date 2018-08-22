import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

import { CategoriesService } from '../../shared/services/categories.service';
import { MaterialService } from '../../shared/services/material.service';
import { Category } from '../../shared/models/category.model';

@Component({
  selector: 'crmsc-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  @ViewChild('input') inputRef: ElementRef;
  form: FormGroup;
  isNew = true;
  image: File;
  imagePreview;
  category: Category;

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
        (category: Category) => {
          if (category) {
            this.category = category;
            this.form.patchValue({
              name: category.name
            });
            this.imagePreview = category.imageSrc;
            MaterialService.updateInput();
          }
          this.form.enable();
        },
        error => MaterialService.toast(error.error.message)
      );
  }

  triggerClick() {
    this.inputRef.nativeElement.click();
  }

  onFileUpload(event: Event) {
    const file = (<HTMLInputElement>event.target).files[0];
    this.image = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);
  }

  onSubmit() {
    let obs$;
    this.form.disable();
    if (this.isNew) {
      obs$ = this.categoriesService.createCategory(this.form.value.name, this.image);
    } else {
      obs$ = this.categoriesService.editCategory(this.category._id, this.form.value.name, this.image);
    }

    obs$.subscribe(
      category => {
        this.category = category;
        MaterialService.toast('Изменения успешно сохранены.');
        this.form.enable();
      },
      error => {
        MaterialService.toast(error.error.message);
        this.form.enable();
      }
    );
  }

}
