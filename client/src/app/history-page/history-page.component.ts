import { Component, OnInit, ViewChild, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';

import { MaterialInstance, MaterialService } from '../shared/services/material.service';

@Component({
  selector: 'crmsc-history-page',
  templateUrl: './history-page.component.html',
  styleUrls: ['./history-page.component.scss']
})
export class HistoryPageComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('tooltip') tooltipRef: ElementRef;
  tooltip: MaterialInstance;
  isFilterVisible = false;

  constructor() { }

  ngOnInit() {
  }

  ngOnDestroy() {
    if (this.tooltip) {
      this.tooltip.destroy();
    }
  }

  ngAfterViewInit() {
    this.tooltip = MaterialService.initTooltip(this.tooltipRef);
  }

}
