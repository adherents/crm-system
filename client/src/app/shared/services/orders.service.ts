import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Position } from '../models/position.model';
import { OrderPosition } from '../models/orderPosition.model';
import { Order } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  public list: OrderPosition[] = [];
  public price = 0;

  constructor(
    private http: HttpClient
  ) {}

  getAllOrders(params: any = {}): Observable<Order[]> {
    return this.http.get<Order[]>('/api/order', {
      params: new HttpParams({
        fromObject: params
      })
    });
  }

  createOrder(order: Order): Observable<Order> {
    return this.http.post<Order>('/api/order', order);
  }

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

  clearOrder() {
    this.list = [];
    this.price = 0;
  }

  private computePrice() {
    this.price = this.list.reduce((total, item) => {
      return total += item.quantity * item.cost;
    }, 0);
  }
}
