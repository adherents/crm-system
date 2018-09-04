import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { OverviewPage } from '../models/overview-page.model';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  constructor(private http: HttpClient) {}

  getOverview(): Observable<OverviewPage> {
    return this.http.get<OverviewPage>('/api/analytics/overview');
  }

  getAnalytics() {}
}
