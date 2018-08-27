import { Component, OnInit, ViewChild, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { MaterialService, MaterialInstance } from '../shared/services/material.service';
import { OrdersService } from '../shared/services/orders.service';

@Component({
  selector: 'crmsc-order-page',
  templateUrl: './order-page.component.html',
  styleUrls: ['./order-page.component.scss']
})
export class OrderPageComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('modal') modalRef: ElementRef;
  modal: MaterialInstance;
  isRoot: boolean;

  constructor(
    private router: Router,
    private ordersService: OrdersService
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

  submit() {
    this.modal.close();
  }

  ngOnDestroy() {
    this.modal.destroy();
  }

}
