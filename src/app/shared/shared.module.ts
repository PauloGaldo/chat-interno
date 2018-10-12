import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MaterialModule } from './material.module';
import { ModalErrorComponent } from './modal-error/modal-error.component';
import { FromNowPipe } from './pipes/from-now.pipe';

@NgModule({
    imports: [
        CommonModule,
        HttpClientModule,
        MaterialModule
    ],
    declarations: [
        ModalErrorComponent,
        FromNowPipe
    ],
    exports: [
        MaterialModule,
        FromNowPipe
    ],
    entryComponents: [
        ModalErrorComponent
    ]
})
export class SharedModule { }
