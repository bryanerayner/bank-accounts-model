import { Action } from '@bryanerayner/reducer-helpers';
import { BankAccount, IBankAccountRecord, ITransactionRecord, Transaction } from './types';
export declare const ADD_BANK_ACCOUNT: string;
export declare const UPDATE_BANK_ACCOUNT: string;
export declare const REMOVE_BANK_ACCOUNT: string;
export interface IAddBankAccountAction extends Action {
    payload: IBankAccountRecord;
}
export interface IUpdateBankAccountAction extends Action {
    payload: {
        id: string;
        newValue: IBankAccountRecord;
    };
}
export interface IRemoveBankAccountAction extends Action {
    payload: {
        id: string;
    };
}
export declare const ADD_TRANSACTION: string;
export declare const UPDATE_TRANSACTION: string;
export declare const REMOVE_TRANSACTION: string;
export interface IAddTransactionAction extends Action {
    payload: ITransactionRecord;
}
export interface IUpdateTransactionAction extends Action {
    payload: {
        id: string;
        newValue: ITransactionRecord;
    };
}
export interface IRemoveTransactionAction extends Action {
    payload: {
        id: string;
    };
}
export declare type BankAccountRelatedAction = IAddBankAccountAction | IUpdateBankAccountAction | IRemoveBankAccountAction | IAddTransactionAction | IUpdateTransactionAction | IRemoveTransactionAction;
export declare class BankAccountsActions {
    private ensureId(id?);
    /**
     * Add a bank account
     */
    addBankAccount(account: BankAccount): IAddBankAccountAction;
    updateBankAccount(account: BankAccount): IUpdateBankAccountAction;
    /**
     * Remove a bank account
     */
    removeBankAccount(id: string): IRemoveBankAccountAction;
    /**
     * Add a transaction
     */
    addTransaction(transaction: Transaction): IAddTransactionAction;
    /**
     * Upate an existing transaction
     */
    updateTransaction(transaction: Transaction): IUpdateTransactionAction;
    /**
     * Remove a transaction
     */
    removeTransaction(id: string): IRemoveTransactionAction;
}
