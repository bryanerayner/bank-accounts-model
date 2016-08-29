import { IBankAccountsModel } from './types';
import { Reducer, Action } from '@bryanerayner/reducer-helpers';
export declare class BankAccountsReducer implements Reducer<IBankAccountsModel> {
    constructor();
    reduce(bankAccountsModel: IBankAccountsModel, action: Action): any;
}
