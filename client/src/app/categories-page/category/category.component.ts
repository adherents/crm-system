import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
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
  messageSuccess: string;

  constructor(
    private route: ActivatedRoute,
    private categoriesService: CategoriesService,
    private router: Router
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

  deleteCategory() {
    const decision = window.confirm(`Вы уверены что хотите удалить категорию "${this.category.name}"?`);
    if (decision) {
      this.categoriesService.deleteCategory(this.category._id)
        .subscribe(
          response => {
            MaterialService.toast(response.message);
          },
          error => {
            MaterialService.toast(error.error.message);
          },
          () => {
            this.router.navigate(['/categories']);
          }
        );
    }
  }

  onSubmit() {
    let obs$;
    this.form.disable();
    if (this.isNew) {
      obs$ = this.categoriesService.createCategory(this.form.value.name, this.image);
      this.messageSuccess = 'Категория успешно добавлена.';
    } else {
      obs$ = this.categoriesService.editCategory(this.category._id, this.form.value.name, this.image);
      this.messageSuccess = 'Изменения успешно сохранены.';
    }

    obs$.subscribe(
      category => {
        this.category = category;
        MaterialService.toast(this.messageSuccess);
        this.form.enable();
      },
      error => {
        MaterialService.toast(error.error.message);
        this.form.enable();
      },
      () => {
        this.router.navigate(['/categories']);
      }
    );
  }

}
