import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Position } from '../../shared/models/position.model';
import { Message } from '../models/message.model';

@Injectable({
  providedIn: 'root'
})
export class PositionsService {

  constructor(private http: HttpClient) {}

  getAllPositionsById(categoryId: string): Observable<Position[]> {
    return this.http.get<Position[]>(`/api/position/${categoryId}`);
  }

  createPosition(position: Position): Observable<Position> {
    return this.http.post<Position>('/api/position', position);
  }

  editPosition(position: Position): Observable<Position> {
    return this.http.patch<Position>(`/api/position/${position._id}`, position);
  }

  deletePosition(position: Position): Observable<Message> {
    return this.http.delete<Message>(`/api/position/${position._id}`);
  }
}
