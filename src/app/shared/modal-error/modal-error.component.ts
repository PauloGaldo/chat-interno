import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
    selector: 'ci-modal-error',
    templateUrl: './modal-error.component.html',
    styleUrls: ['./modal-error.component.scss']
})
export class ModalErrorComponent {

    public message: string;

    constructor(
        public dialogRef: MatDialogRef<ModalErrorComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.message = data.message;
    }

    salirChat() {
        window.close();
    }

}
