import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Rectangle } from '../../core/services/models/rectangle.model';
import { fromEvent, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TogglePoint } from 'src/app/core/services/models/enums/toggle-point.enum';
import { ApiService } from 'src/app/core/services/api/api.service';

@Component({
  selector: 'app-rectangle',
  templateUrl: './rectangle.component.html',
  styleUrls: ['./rectangle.component.css'],
})
export class RectangleComponent implements AfterViewInit, OnInit, OnDestroy {
  private destroy$: Subject<boolean> = new Subject<boolean>();
  private readonly invisibleBorder: number = 10;

  public rectangle: Rectangle = new Rectangle();
  public rectangleCopy: Rectangle;

  public yResize: number;
  public xResize: number;

  public perimeter: number;

  public canvasHeigth: number = window.innerHeight ?? 600;
  public canvasWidth: number = window.innerWidth ?? 600;

  public isEdited: boolean;
  public isRectangleCreated: boolean = false;

  constructor(
    private rectangleHttpService: ApiService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.rectangleHttpService.getRectangle().subscribe({
      next: (res) => {
        this.rectangle.x1 = res.x1 ?? 0;
        this.rectangle.x2 = res.x2 ?? 0;
        this.rectangle.y1 = res.y1 ?? 0;
        this.rectangle.y2 = res.y2 ?? 0;

        this.isRectangleCreated = true;
        this.perimeter = this.rectangle.getPerimetr();
        this.toastr.success('Data loaded.');
      },
      error: (_) => {
        this.toastr.error('Can not load the data.');
      },
    });
  }

  ngAfterViewInit(): void {
    this.RegisterEvents();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  private mouseDownEvent(event: any) {
    this.rectangleCopy = structuredClone(this.rectangle);
    this.isEdited = true;

    this.xResize = event.clientX;
    this.yResize = event.clientY;

  }

  private mouseUpEvent(event: any) {
    this.isEdited = false;
    this.isRectangleCreated = !Rectangle.isRectanglesEqual(this.rectangle, new Rectangle());

    if (!Rectangle.isRectanglesEqual(this.rectangle, this.rectangleCopy))
      this.SaveRectangle();
    this.perimeter = this.rectangle.getPerimetr();
  }

  private mouseMoveEvent(event: any) {
    if (this.isEdited)
      if (!this.isRectangleCreated) {
        if (
          event.clientX + this.invisibleBorder < this.canvasHeigth &&
          event.clientX - this.invisibleBorder > 0
        )
          this.rectangle.x2 = event.clientX;
        if (
          event.clientY + this.invisibleBorder < this.canvasWidth &&
          event.clientY - this.invisibleBorder > 0
        )
          this.rectangle.y2 = event.clientY;
      } else {
        const speed = 1;
        const xChange = (this.xResize - event.clientX) / speed;
        const yChange = (this.yResize - event.clientY) / speed;

        let touchedResizePoint = TogglePoint.NoPoint;
        let width = this.rectangle.getWidth() / 2;
        let heigth = this.rectangle.getHeigth() / 2;
        
        if (
          Math.abs(this.rectangle.x1 - event.clientX) < width &&
          Math.abs(this.rectangle.y1 - event.clientY) < heigth
        ) {
          touchedResizePoint = TogglePoint.TopLeft;
        } else if (
          Math.abs(this.rectangle.x2 - event.clientX) < width &&
          Math.abs(this.rectangle.y1 - event.clientY) < heigth
        ) {
          touchedResizePoint = TogglePoint.TopRight;
        } else if (
          Math.abs(this.rectangle.x1 - event.clientX) < width &&
          Math.abs(this.rectangle.y2 - event.clientY) < heigth
        ) {
          touchedResizePoint = TogglePoint.BottomLeft;
        } else if (
          Math.abs(this.rectangle.x2 - event.clientX) < width &&
          Math.abs(this.rectangle.y2 - event.clientY) < heigth
        ) {
          touchedResizePoint = TogglePoint.BottomRight;
        }

        //resize
        console.log(touchedResizePoint);
        
        switch (touchedResizePoint) {
          case TogglePoint.TopLeft:
            if (this.CheckForChange(xChange, this.canvasHeigth))
              this.rectangle.x1 = this.rectangle.x1 - xChange;
            if (this.CheckForChange(yChange, this.canvasWidth))
              this.rectangle.y1 = this.rectangle.y1 - yChange;
            break;
          case TogglePoint.TopRight:
            if (this.CheckForChange(xChange, this.canvasHeigth))
              this.rectangle.x2 = this.rectangle.x2 - xChange;
            if (this.CheckForChange(yChange, this.canvasWidth))
              this.rectangle.y1 = this.rectangle.y1 - yChange;
            break;
          case TogglePoint.BottomLeft:
            if (this.CheckForChange(xChange, this.canvasHeigth))
              this.rectangle.x1 = this.rectangle.x1 - xChange;

            if (this.CheckForChange(yChange, this.canvasWidth))
              this.rectangle.y2 = this.rectangle.y2 - yChange;
            break;
          case TogglePoint.BottomRight:
            if (this.CheckForChange(xChange, this.canvasHeigth))
              this.rectangle.x2 = this.rectangle.x2 - xChange;

            if (this.CheckForChange(yChange, this.canvasWidth))
              this.rectangle.y2 = this.rectangle.y2 - yChange;
            break;
          default:
            break;
        }

        this.xResize = event.clientX;
        this.yResize = event.clientY;
      }
  }

  private CheckForChange(change: number, canvas: number): boolean {

    let x = this.rectangle.y2 + change + this.invisibleBorder < canvas ;
    console.log( this.rectangle.y2 + change + this.invisibleBorder);
    console.log(canvas);
    
    
    let y = this.rectangle.y2 - change - this.invisibleBorder > 0
    console.log(this.rectangle.y2 - change - this.invisibleBorder);
    
    return x && y;
  
  }

  private RegisterEvents() {
    fromEvent(document, 'mousedown')
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => this.mouseDownEvent(res));
    fromEvent(document, 'mouseup')
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => this.mouseUpEvent(res));
    fromEvent(document, 'mousemove')
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => this.mouseMoveEvent(res));
  }

  private SaveRectangle() {
    this.rectangleHttpService.saveRectangle(this.rectangle).subscribe({
      next: (_) => {
        this.toastr.success('Data saved.');
      },
      error: (_) => {
        this.toastr.error('Error , can not save data.');
      },
    });
  }
}

