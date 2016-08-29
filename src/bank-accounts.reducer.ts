
import {
IBankAccountsRecord
} from './types';

import {
    ADD_BANK_ACCOUNT,
    UPDATE_BANK_ACCOUNT,
    REMOVE_BANK_ACCOUNT,
    ADD_TRANSACTION,
    UPDATE_TRANSACTION,
    REMOVE_TRANSACTION,
    BankAccountRelatedAction,
    IAddBankAccountAction,
    IUpdateBankAccountAction,
    IRemoveBankAccountAction,
    IAddTransactionAction,
    IUpdateTransactionAction,
    IRemoveTransactionAction
} from './bank-accounts.actions';

import {
    Reducer,
    Action
} from '@bryanerayner/reducer-helpers';



export class BankAccountsReducer implements Reducer<IBankAccountsRecord> {

    constructor() {

    }

    reduce(bankAccountsModel: IBankAccountsRecord, action: BankAccountRelatedAction) {

        switch (action.type) {
            case ADD_BANK_ACCOUNT:
                return this._addBankAccount(bankAccountsModel, action as IAddBankAccountAction);
                
            case UPDATE_BANK_ACCOUNT:
                return this._updateBankAccount(bankAccountsModel, action as IUpdateBankAccountAction);
                
            case REMOVE_BANK_ACCOUNT:
                return this._removeBankAccount(bankAccountsModel, action as IRemoveBankAccountAction);

            case ADD_TRANSACTION:
                return this._addTransaction(bankAccountsModel, action as IAddTransactionAction);
                
            case UPDATE_TRANSACTION:
                return this._updateTransaction(bankAccountsModel, action as IUpdateTransactionAction);
                
            case REMOVE_TRANSACTION:
                return this._removeTransaction(bankAccountsModel, action as IRemoveTransactionAction);                
        }
        return bankAccountsModel;
    }

    /**
     * Add a bank account
     */
    _addBankAccount(bankAccountsModel: IBankAccountsRecord, action: IAddBankAccountAction) {

    }
    /**
     * Update an existing bank account
     */
    _updateBankAccount(bankAccountsModel: IBankAccountsRecord, action: Action) {

    }
    /**
     * Remove a bank account
     */
    _removeBankAccount(bankAccountsModel: IBankAccountsRecord, action: Action) {

    }

    /**
     * Add a transaction
     */
    _addTransaction(bankAccountsModel: IBankAccountsRecord, action: Action){

    }
    /**
     * Update a transaction
     */
    _updateTransaction(bankAccountsModel: IBankAccountsRecord, action: Action){

    }
    /**
     * Remove a transaction
     */
    _removeTransaction(bankAccountsModel: IBankAccountsRecord, action: Action){

    }
}