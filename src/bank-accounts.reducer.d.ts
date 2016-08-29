import { IBankAccountsRecord } from './types';
import { Reducer, Action } from '@bryanerayner/reducer-helpers';
export declare class BankAccountsReducer implements Reducer<IBankAccountsRecord> {
    constructor();
    reduce(bankAccountsModel: IBankAccountsRecord, action: Action): IBankAccountsRecord;
}
