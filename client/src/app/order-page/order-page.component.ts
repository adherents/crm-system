import { Component, OnInit, ViewChild, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';

import { MaterialService, MaterialInstance } from '../shared/services/material.service';
import { OrdersService } from '../shared/services/orders.service';
import { OrderPosition } from '../shared/models/orderPosition.model';
import { Order } from '../shared/models/order.model';

@Component({
  selector: 'crmsc-order-page',
  templateUrl: './order-page.component.html',
  styleUrls: ['./order-page.component.scss']
})
export class OrderPageComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('modal') modalRef: ElementRef;
  modal: MaterialInstance;
  isRoot: boolean;
  isPending = false;
  subscription: Subscription;

  constructor(
    private router: Router,
    public ordersService: OrdersService
  ) {}

  ngOnInit() {
    this.isRoot = this.router.url === '/order';
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isRoot = this.router.url === '/order';
      }
    });
  }

  ngAfterViewInit() {
    this.modal = MaterialService.initModal(this.modalRef);
  }

  onModalOpen() {
    this.modal.open();
  }

  onModalClose() {
    this.modal.close();
  }

  onRemovePosition(orderPosition: OrderPosition) {
    this.ordersService.removeOrder(orderPosition);
  }

  submit() {
    this.isPending = true;

    const order: Order = {
      list: this.ordersService.list.map(item => {
        delete item._id;
        return item;
      })
    };

    this.subscription = this.ordersService.createOrder(order)
      .subscribe(newOrder => {
        MaterialService.toast(`Заказ №${newOrder.order} был добавлен.`);
        this.ordersService.clearOrder();
      },
      error => MaterialService.toast(error.error.message),
      () => {
        this.modal.close();
        this.isPending = false;
      }
    );
  }

  ngOnDestroy() {
    if (this.modal) {
      this.modal.destroy();
    }
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
