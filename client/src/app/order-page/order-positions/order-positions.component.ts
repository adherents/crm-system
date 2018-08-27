import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

import { PositionsService } from '../../shared/services/positions.service';
import { OrdersService } from '../../shared/services/orders.service';

@Component({
  selector: 'crmsc-order-positions',
  templateUrl: './order-positions.component.html',
  styleUrls: ['./order-positions.component.scss']
})
export class OrderPositionsComponent implements OnInit {
  positions$: Observable<Position[]>;

  constructor(
    private route: ActivatedRoute,
    private positionsService: PositionsService,
    private ordersService: OrdersService
  ) {}

  ngOnInit() {
    this.positions$ = this.route.params
      .pipe(
        switchMap(
          (params: Params) => {
            return this.positionsService.getAllPositionsById(params['id']);
          }
        ),
        map(
          (positions: Position[]) => {
            return positions.map((position: any) => {
              position.quantity = 1;
              return position;
            });
          }
        )
      );
  }

  addToOrder(position: Position) {
    console.log(position);
    this.ordersService.addOrder(position);
  }

}
