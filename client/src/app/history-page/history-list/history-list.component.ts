import { Component, Input, ViewChild, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';

import { Order } from '../../shared/models/order.model';
import { MaterialInstance, MaterialService } from '../../shared/services/material.service';

@Component({
  selector: 'crmsc-history-list',
  templateUrl: './history-list.component.html',
  styleUrls: ['./history-list.component.scss']
})
export class HistoryListComponent implements OnDestroy, AfterViewInit {
  @Input() orders: Order[];
  @ViewChild('modal') modalRef: ElementRef;
  modal: MaterialInstance;
  selectedOrder: Order;

  ngOnDestroy() {
    if (this.modal) {
      this.modal.destroy();
    }
  }

  ngAfterViewInit() {
    this.modal = MaterialService.initModal(this.modalRef);
  }

  computePrice(order: Order): number {
    return order.list.reduce((total, item) => {
      return total += item.quantity * item.cost;
    }, 0);
  }

  openOrderDetails(order: Order) {
    this.selectedOrder = order;
    this.modal.open();
  }

  onModalClose() {
    this.modal.close();
  }

}