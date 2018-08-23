import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { PositionsService } from '../../../shared/services/positions.service';
import { Position } from '../../../shared/models/position.model';
import { MaterialService, MaterialInstance } from '../../../shared/services/material.service';

@Component({
  selector: 'crmsc-position',
  templateUrl: './position.component.html',
  styleUrls: ['./position.component.scss']
})
export class PositionComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input('categoryId') categoryId: string;
  @ViewChild('modal') modalRef: ElementRef;
  positions: Position[] = [];
  loading = false;
  modal: MaterialInstance;
  form: FormGroup;
  positionId = null;

  constructor(private positionsService: PositionsService) {}

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required),
      cost: new FormControl(null, [Validators.required, Validators.min(0)])
    });

    this.loading = true;
    this.positionsService.getAllPositionsById(this.categoryId)
      .subscribe(positions => {
        this.positions = positions;
        this.loading = false;
      });
  }

  ngAfterViewInit() {
    this.modal = MaterialService.initModal(this.modalRef);
  }

  onModalOpen(position?: Position) {
    this.modal.open();

    if (position) {
      this.positionId = position._id;
      this.form.patchValue({
        name: position.name,
        cost: position.cost
      });
    } else {
      this.positionId = null;
      this.form.reset();
    }

    MaterialService.updateInput();
  }

  onModalClose() {
    this.modal.close();
  }

  onSubmit() {
    this.form.disable();

    const newPosition: Position = {
      name: this.form.value.name,
      cost: this.form.value.cost,
      category: this.categoryId
    };

    const completed = () => {
      this.modal.close();
      this.form.reset();
      this.form.enable();
    };

    if (this.positionId) {
      newPosition._id = this.positionId;
      this.positionsService.editPosition(newPosition)
        .subscribe(position => {
          const index = this.positions.findIndex(p => p._id === position._id);
          this.positions[index] = position;
          MaterialService.toast('Позиция успешно изменена.');
        },
        error => MaterialService.toast(error.error.message),
        completed
        );
    } else {
      this.positionsService.createPosition(newPosition)
        .subscribe(position => {
          MaterialService.toast('Позиция успешно добавлена.');
          this.positions.push(position);
        },
        error => MaterialService.toast(error.error.message),
        completed
        );
    }
  }

  onPositionDelete(event: Event, position: Position) {
    event.stopPropagation();
    const decision = window.confirm(`Вы уверены что хотите удалить позицию "${position.name}"?`);
    if (decision) {
      this.positionsService.deletePosition(position)
        .subscribe(
          response => {
            const index = this.positions.findIndex(p => p._id === position._id);
            this.positions.splice(index, 1);
            MaterialService.toast(response.message);
          },
          error => MaterialService.toast(error.error.message)
        );
    }
  }

  ngOnDestroy() {
    if (this.modal) {
      this.modal.destroy();
    }
  }

}
