import moment from 'moment';
import { Logger } from '../../logger/logger';
import { DI } from '../../di/diContainer';

export class GenericUtil {

    private logger: Logger;
    constructor() {
        this.logger = DI.get(Logger);
    }

    getFormattedDate(date: Date, format: string): string {
        return moment(date).format(format);
    }

    getDefaultFormattedDate(date: Date): string {
        return this.getFormattedDate(date, 'YYYY-MM-DD');
    }

    getDefaultLongFormattedDate(date: Date): string {
        return this.getFormattedDate(date, 'YYYY-MM-DD HH:mm:ss');
    }

    getLocalDateFromDefaultFormat(dateStr: string): Date {
        return this.getLocalDateFromString(dateStr, 'YYYY-MM-DD');
    }

    getLocalDateFromString(dateStr: string, format: string): Date {
        this.logger.debug('GetLocalDate', dateStr, format);
        const date = moment(dateStr, format).toDate();
        this.logger.debug('GetLocalDate Formatted', date);
        return this.getLocalDate(date);
    }

    getLocalDate(date: Date): Date {
        return new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
    }

    jsonToQueryString(json: any) {
        return '?' +
            Object.keys(json).map(function (key) {
                return encodeURIComponent(key) + '=' +
                    encodeURIComponent(json[key]);
            }).join('&');
    }

}
