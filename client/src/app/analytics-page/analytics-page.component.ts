import { Component, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Chart } from 'chart.js';

import { AnalyticsService } from '../shared/services/analytics.service';
import { AnalyticsPage } from '../shared/models/analytics-page.model';

@Component({
  selector: 'crmsc-analytics-page',
  templateUrl: './analytics-page.component.html',
  styleUrls: ['./analytics-page.component.scss']
})
export class AnalyticsPageComponent implements AfterViewInit, OnDestroy {
  @ViewChild('gainChart') gainRef: ElementRef;
  @ViewChild('orderChart') orderRef: ElementRef;

  subscription: Subscription;
  average: number;
  pending = true;

  constructor(private analyticsService: AnalyticsService) {}

  ngAfterViewInit() {
    const gainConfig: any = {
      label: 'Выручка',
      color: 'rgb(255, 99, 132)'
    };

    const orderConfig: any = {
      label: 'Заказы',
      color: 'rgb(54, 162, 235)'
    };

    this.subscription = this.analyticsService.getAnalytics()
      .subscribe((data: AnalyticsPage) => {
        this.average = data.average;

        gainConfig.labels = data.chart.map(item => item.label);
        gainConfig.data = data.chart.map(item => item.gain);

        const gainContext = this.gainRef.nativeElement.getContext('2d');
        gainContext.canvas.height = '300px';

        orderConfig.labels = data.chart.map(item => item.label);
        orderConfig.data = data.chart.map(item => item.order);

        const orderContext = this.orderRef.nativeElement.getContext('2d');
        orderContext.canvas.height = '300px';

        // tslint:disable-next-line:no-unused-expression
        new Chart(gainContext, this.createChartConfig(gainConfig));
        // tslint:disable-next-line:no-unused-expression
        new Chart(orderContext, this.createChartConfig(orderConfig));

        this.pending = false;
      });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  createChartConfig({labels, data, label, color}) {
    return {
      type: 'line',
      options: {
        responsive: true
      },
       data: {
        labels,
        datasets: [{
          label, data,
          borderColor: color,
          steppedLine: false,
          fill: false
        }]
       }
    };
  }

}
