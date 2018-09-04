import { Component, OnInit, ViewChild, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs';

import { AnalyticsService } from '../shared/services/analytics.service';
import { OverviewPage } from '../shared/models/overview-page.model';
import { MaterialInstance, MaterialService } from '../shared/services/material.service';

@Component({
  selector: 'crmsc-overview-page',
  templateUrl: './overview-page.component.html',
  styleUrls: ['./overview-page.component.scss']
})
export class OverviewPageComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('tapTarget') tapTargetRef: ElementRef;
  tapTarget: MaterialInstance;
  data$: Observable<OverviewPage>;
  yesterday = new Date();

  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit() {
    this.data$ = this.analyticsService.getOverview();

    this.yesterday.setDate(this.yesterday.getDate() - 1);
  }

  ngOnDestroy() {
    if (this.tapTarget) {
      this.tapTarget.destroy();
    }
  }

  ngAfterViewInit() {
    this.tapTarget = MaterialService.initTapTarget(this.tapTargetRef);
  }

  onOpenInfo() {
    this.tapTarget.open();
  }

}
