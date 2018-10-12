import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
import 'moment/min/locales';

@Pipe({
    name: 'fromNow'
})
export class FromNowPipe implements PipeTransform {
    transform(value: any, args: Array<any>): string {
        moment().locale('es').format('LLLL')
        return moment(value).fromNow();
    }
}