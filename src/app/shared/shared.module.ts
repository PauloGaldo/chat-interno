import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MaterialModule } from './material.module';
import { ModalErrorComponent } from './modal-error/modal-error.component';

@NgModule({
    imports: [
        CommonModule,
        HttpClientModule,
        MaterialModule
    ],
    declarations: [ModalErrorComponent],
    exports: [
        MaterialModule
    ],
    entryComponents: [
        ModalErrorComponent
    ]
})
export class SharedModule { }
