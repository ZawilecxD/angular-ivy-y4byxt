import { Component, ViewContainerRef } from '@angular/core';
import { Observable, Subject, switchMap, takeUntil, tap, zip, of } from 'rxjs';
import { ModalComponent } from './modal.component';
import { ModalService } from './modal.service';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  componentDestroyed = new Subject<void>();

  constructor(
    private modalService: ModalService,
    private viewRef: ViewContainerRef
  ) {}

  ngOnInit() {
    this.modalService.modalRequested
      .pipe(
        takeUntil(this.componentDestroyed),
        tap((data) => {
          console.log(
            `AppComponent Asking modal ${JSON.stringify(data.title)}`
          );
        }),
        switchMap(
          (data) => {
            return this.createModal(data.title, data.text);
          },
          (outerValue, innerValue) => ({
            modalRequest: outerValue,
            confirmed: innerValue,
          })
        )
      )
      .subscribe(({ modalRequest, confirmed }) => {
        modalRequest.responseSub.next(confirmed);
      });
  }

  createModal(title: string, text: string): Observable<boolean> {
    const componentRef = this.viewRef.createComponent(ModalComponent);
    componentRef.instance.title = title;
    componentRef.instance.text = text;
    return componentRef.instance.answered$.pipe(
      tap(() => {
        componentRef.destroy();
      })
    );
  }

  ngOnDestroy() {
    this.componentDestroyed.next();
    this.componentDestroyed.complete();
  }
}
