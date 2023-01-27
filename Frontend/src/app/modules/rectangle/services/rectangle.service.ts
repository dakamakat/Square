import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BASE_PATH } from '../../../shared/variables';
import { Observable } from 'rxjs';
import { Rectangle } from '../rectangle.model';

@Injectable()
export class RectangleService {

  private basePath = '/';

  constructor(private httpClient: HttpClient, @Inject (BASE_PATH) basePath: string) {
    if (basePath) {
      this.basePath = basePath;
    }
  }

  public getRectangle(): Observable<Rectangle> {
    return this.httpClient.get<Rectangle>(`${this.basePath}/Api/GetRectangle`);
  }

  public saveRectangle(rectangle: Rectangle) {
    return this.httpClient.post(`${this.basePath}/Api/SaveRectangle`, rectangle);
  }
}
