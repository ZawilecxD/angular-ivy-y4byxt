import { Component } from '@angular/core';
import { ModalService } from './modal.service';

@Component({
  selector: 'app-child',
  template: `
    <button (click)="openModal()">Open modal</button>
    <p *ngIf="lastConfirm !== null">Last modal answer was {{lastConfirm ? 'YES' : 'NO'}}</p>
  `,
})
export class ChildComponent {
  lastConfirm: boolean | null = null;
  constructor(private modalService: ModalService) {}

  openModal() {
    this.modalService
      .openModal('This is modal title', 'Do you understand this modal?')
      .subscribe((resp) => {
        console.log('ChildComponent RESPONSED WITH ', resp);
        this.lastConfirm = resp;
      });
  }
}
