import { Injectable } from '@angular/core';

import { Position } from '../models/position.model';
import { OrderPosition } from '../models/orderPosition.model';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  public list: OrderPosition[] = [];
  public price = 0;

  addOrder(position: Position) {
    const orderPosition: OrderPosition = Object.assign({}, {
      name: position.name,
      cost: position.cost,
      quantity: position.quantity,
      _id: position._id
    });

    const candidate = this.list.find(p => p._id === position._id);

    if (candidate) {
      candidate.quantity += orderPosition.quantity;
    } else {
      this.list.push(orderPosition);
    }

    this.computePrice();
  }

  removeOrder(orderPosition: OrderPosition) {
    const index = this.list.findIndex(p => p._id === orderPosition._id);
    this.list.splice(index, 1);
    this.computePrice();
  }

  private computePrice() {
    this.price = this.list.reduce((total, item) => {
      return total += item.quantity * item.cost;
    }, 0);
  }
}
