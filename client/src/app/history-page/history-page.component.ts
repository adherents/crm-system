import { Component, OnInit, ViewChild, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { MaterialInstance, MaterialService } from '../shared/services/material.service';
import { OrdersService } from '../shared/services/orders.service';
import { Order } from '../shared/models/order.model';

const STEP = 2;

@Component({
  selector: 'crmsc-history-page',
  templateUrl: './history-page.component.html',
  styleUrls: ['./history-page.component.scss']
})
export class HistoryPageComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('tooltip') tooltipRef: ElementRef;
  tooltip: MaterialInstance;
  isFilterVisible = false;
  offset = 0;
  limit = STEP;
  subscription: Subscription;
  orders: Order[] = [];
  isLoading = false;
  isReloading = false;
  ordersEnded = false;

  constructor(
    private ordersService: OrdersService
  ) {}

  ngOnInit() {
    this.isReloading = true;
    this.getListData();
  }

  ngOnDestroy() {
    if (this.tooltip) {
      this.tooltip.destroy();
    }
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  ngAfterViewInit() {
    this.tooltip = MaterialService.initTooltip(this.tooltipRef);
  }

  private getListData() {
    const params = {
      offset: this.offset,
      limit: this.limit
    };
    this.subscription = this.ordersService.getAllOrders(params)
      .subscribe(orders => {
        this.orders = this.orders.concat(orders);
        this.ordersEnded = orders.length < STEP;
        this.isLoading = false;
        this.isReloading = false;
      });
  }

  loadMore() {
    this.offset += STEP;
    this.isLoading = true;
    this.getListData();
  }

}
