
import {
    Action
} from '@bryanerayner/reducer-helpers';

import * as uuid from 'node-uuid';

import {
    BankAccount,
    BankAccountRecord,
    IBankAccountRecord,
    ITransactionRecord,
    TransactionRecord,
    Transaction,
} from './types';


export const ADD_BANK_ACCOUNT = 'ADD_BANK_ACCOUNT';
export const UPDATE_BANK_ACCOUNT = 'UPDATE_BANK_ACCOUNT';
export const REMOVE_BANK_ACCOUNT = 'REMOVE_BANK_ACCOUNT';

export interface IAddBankAccountAction extends Action {
    payload: IBankAccountRecord
}

export interface IUpdateBankAccountAction extends Action {
    payload: {
        id: string;
        newValue: IBankAccountRecord;
    }
}

export interface IRemoveBankAccountAction extends Action {
    payload: {
        id: string;
    }
}



export const ADD_TRANSACTION = 'ADD_TRANSACTION';
export const UPDATE_TRANSACTION = 'UPDATE_TRANSACTION';
export const REMOVE_TRANSACTION = 'REMOVE_TRANSACTION';

export interface IAddTransactionAction extends Action {
    payload: ITransactionRecord
};

export interface IUpdateTransactionAction extends Action {
    payload: {
        id:string;
        newValue: ITransactionRecord;     
    }
};

export interface IRemoveTransactionAction extends Action {
    payload: {
        id:string;     
    }
};

export type BankAccountRelatedAction = IAddBankAccountAction |  IUpdateBankAccountAction | IRemoveBankAccountAction | IAddTransactionAction |     IUpdateTransactionAction |IRemoveTransactionAction; 

export class BankAccountsActions {

    private ensureId(id?:string){
        return id || uuid.v4();
    }

    /**
     * Add a bank account
     */
    addBankAccount(account: BankAccount): IAddBankAccountAction {
        let b = new BankAccountRecord({
            id: this.ensureId(account.id),
            name: account.name,
            type: account.type,
            currency:account.currency,
            owners:account.owners
        });

        return {
            type:ADD_BANK_ACCOUNT,
            payload:b
        };
    }

    /**
     * Add a transaction
     */
    addTransaction(transaction: Transaction): IAddTransactionAction {
        let t = new TransactionRecord({
            id:transaction.id || uuid.v4(),
            account:transaction.account,
            date:transaction.date,
            type:transaction.type,
            memo:transaction.memo,
            amount:transaction.amount,
        });

        return {
            type: ADD_TRANSACTION,
            payload: t
        };
    }
    
    /**
     * Upate an existing transaction
     */
    updateTransaction(transaction: Transaction): IUpdateTransactionAction {
        if (!transaction.id){
            throw new Error('Must have an ID to update a transaction');
        }
        let t = new TransactionRecord(transaction);
        return {
            type: UPDATE_TRANSACTION,
            payload: {
                id: t.id,
                newValue: t
            }
        };
    }

    /**
     * Remove a transaction
     */
    removeTransaction(id: string): IRemoveTransactionAction {
        return {
            type: REMOVE_TRANSACTION,
            payload: {
                id: id
            }
        };
    }
}