import { Component, Output, EventEmitter, ViewChild, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';

import { Filter } from '../../shared/models/filter.model';
import { MaterialService } from '../../shared/services/material.service';
import { Datepicker } from '../../shared/models/datepicker.model';

@Component({
  selector: 'crmsc-history-filter',
  templateUrl: './history-filter.component.html',
  styleUrls: ['./history-filter.component.scss']
})
export class HistoryFilterComponent implements OnDestroy, AfterViewInit {
  @Output() filterApply = new EventEmitter<Filter>();
  @ViewChild('start') startRef: ElementRef;
  @ViewChild('end') endRef: ElementRef;
  order: number;
  start: Datepicker;
  end: Datepicker;
  isValid = true;

  ngOnDestroy() {
    if (this.start) {
      this.start.destroy();
    }
    if (this.end) {
      this.end.destroy();
    }
  }

  ngAfterViewInit() {
    this.start = MaterialService.initDatepicker(this.startRef, this.validate.bind(this));
    this.end = MaterialService.initDatepicker(this.endRef, this.validate.bind(this));
  }

  validate() {
    if (!this.start.date || !this.end.date) {
      this.isValid = true;
      return;
    }

    this.isValid = this.start.date < this.end.date;
  }

  onFilterSubmit() {
    const filter: Filter = {};

    if (this.order) {
      filter.order = this.order;
    }

    if (this.start.date) {
      filter.start = this.start.date;
    }

    if (this.end.date) {
      filter.end = this.end.date;
    }

    this.filterApply.emit(filter);
  }

}
