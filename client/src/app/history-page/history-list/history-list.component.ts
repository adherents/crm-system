import { Component, OnInit, Input } from '@angular/core';

import { Order } from '../../shared/models/order.model';

@Component({
  selector: 'crmsc-history-list',
  templateUrl: './history-list.component.html',
  styleUrls: ['./history-list.component.scss']
})
export class HistoryListComponent implements OnInit {
  @Input() orders: Order[];

  constructor() { }

  ngOnInit() {
  }

}
