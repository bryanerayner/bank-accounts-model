
import {
    IBankAccountsRecord,
    IBankAccountRecord,
    BankAccountRecord,
    BankAccount,
    BankAccountsRecordType,
    TransactionRecord,
    ITransactionRecord
} from './types';

import {
    Map,
    List
} from 'immutable';

import {
    isEqual,
    each,
    clone,
    cloneDeep
} from 'lodash';


import * as uuid from 'node-uuid';

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

import {
    TypedRecord,
    generateTypedRecord
} from '@bryanerayner/immutable-model-helpers';

function throwErr(message: string) {
    throw new Error(message);
}

type BankAccountAccessorFn = (bankAccount: BankAccount) => any;
type EqualityChecker = <T>(a: T, b: T) => boolean;

interface CheckArray extends Array<any> {
    [0]: string;
    [1]?: EqualityChecker;
};

function newGuid(){
    return uuid.v4();
}

export class BankAccountsReducer implements Reducer<BankAccountsRecordType> {

    constructor() {

    }

    reduce(bankAccountsModel: BankAccountsRecordType, action: BankAccountRelatedAction) {

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
    _addBankAccount(bankAccountsModel: BankAccountsRecordType, action: IAddBankAccountAction) {

        if (action.type === ADD_BANK_ACCOUNT) {
            let account = new BankAccountRecord(action.payload);

            if (!account.id) {
                account = account.set('id', newGuid());
            }

            let existingAccounts = bankAccountsModel.accounts;

            if (existingAccounts.has(account.id)) {
                throwErr('Cannot add a bank account with a pre-existing ID');
            }

            let newAccounts = bankAccountsModel.setIn(['accounts', account.id], account);

            return newAccounts;
        }
        return bankAccountsModel;
    }
    /**
     * Update an existing bank account
     */
    _updateBankAccount(bankAccountsModel: BankAccountsRecordType, action: IUpdateBankAccountAction) {

        let {
            type,
            payload
        } = action;

        if (type === UPDATE_BANK_ACCOUNT) {

            let {
                id,
                newValue
            } = payload;

            let acc = bankAccountsModel.accounts.get(id, null);

            if (!acc) {
                throwErr('Cannot update a non-existing account');
            }

            return this._mutateModel<BankAccountsRecordType, IBankAccountRecord>(
                bankAccountsModel,
                newValue,
                [
                    ['name'],
                    ['type'],
                    ['currency'],
                    ['owners']
                ],
                (fieldName, accounts)=>accounts.accounts.getIn([id, fieldName]),
                (fieldName, model)=>model[fieldName],
                (segment: string) => ['accounts', id].concat(segment)
            );

        }
        return bankAccountsModel;
    }
    /**
     * Remove a bank account
     */
    _removeBankAccount(bankAccountsModel: BankAccountsRecordType, action: IRemoveBankAccountAction) {
        if (action.type === REMOVE_BANK_ACCOUNT) {
            return bankAccountsModel.removeIn(['accounts', action.payload.id]);
        }
        return bankAccountsModel;
    }

    /**
     * Add a transaction
     */
    _addTransaction(bankAccountsModel: BankAccountsRecordType, action: IAddTransactionAction) {
        let {
            type,
            payload
        } = action;
        if (type === ADD_TRANSACTION){
            let transaction = new TransactionRecord(payload);
            if (!transaction.id){
                transaction = transaction.set('id', newGuid);
            }
            let {
                id,
                account
            } = transaction;
            if (!bankAccountsModel.accounts.has(account)){
                throwErr('There is no bank account matching this transaction');
            }

            if (bankAccountsModel.transactions.has(id)){
                throwErr('The transaction id must be unique');
            }

            bankAccountsModel.transactionsByAccount

            return bankAccountsModel.withMutations((m)=>{
                
                m.setIn(['transactions', id], transaction);

                m.updateIn(
                    ['transactionsByAccount', account], 
                    List<ITransactionRecord>(),
                    (v:List<ITransactionRecord>)=>v.push(transaction));

                return m;
            });
        }
        return bankAccountsModel;
    }
    /**
     * Update a transaction
     */
    _updateTransaction(bankAccountsModel: BankAccountsRecordType, action: IUpdateTransactionAction) {
        let {
            type,
            payload
        } = action;
        if (type === UPDATE_TRANSACTION) {
            let {
                id,
                newValue
            } = payload;

            if (!bankAccountsModel.transactions.has(id)){
                throwErr('The transaction does not exist');
            }
            let originalTransaction = bankAccountsModel.transactions.get(id);
            let originalAccount = originalTransaction.account;
            let newAccount = newValue.account;
            let accountChanged = newAccount !== originalAccount;

            if (!bankAccountsModel.accounts.has(newAccount)){
                throwErr('The account does not exist');
            }

            let modifiedTransaction = bankAccountsModel
                .transactions
                .get(id)
                .withMutations((mV)=>{
                    each(['account', 'date', 'type', 'memo', 'amount'],
                    (key)=>{
                        mV.set(key, cloneDeep( newValue[key]));
                    });
                    return mV; 
                });

            bankAccountsModel = bankAccountsModel.updateIn(['transactions', id], (v:ITransactionRecord)=>{
                return modifiedTransaction;
            });

            if (accountChanged){
                let matchesTransactionId = (t:ITransactionRecord)=>t.id === id;

                bankAccountsModel = bankAccountsModel.updateIn(
                    ['transactionsByAccount', originalAccount], 
                    List<ITransactionRecord>(), 
                    (tByAccount:List<ITransactionRecord>)=>{
                        return tByAccount.filterNot(matchesTransactionId).toList();
                    });
                    bankAccountsModel = bankAccountsModel.updateIn(
                        ['transactionsByAccount', newAccount],
                        List<ITransactionRecord>(),
                        (tByAccount:List<ITransactionRecord>)=>{
                            return tByAccount
                                .filterNot(matchesTransactionId)
                                .toList()
                                .push(modifiedTransaction);
                        }
                    );
            }else{
                bankAccountsModel = bankAccountsModel.updateIn(
                    ['transactionsByAccount', originalAccount],
                    List<ITransactionRecord>(),
                    (tByAccount: List<ITransactionRecord>)=>{
                        return tByAccount.update(tByAccount.indexOf(originalTransaction),
                                                 (v)=>modifiedTransaction);
                    }
                );
            }
            return bankAccountsModel;
        }
        return bankAccountsModel;
    }
    /**
     * Remove a transaction
     */
    _removeTransaction(bankAccountsModel: BankAccountsRecordType, action: IRemoveTransactionAction) {
        let {
            type,
            payload
        } = action;
        if (type === REMOVE_TRANSACTION) {
            let {
                id
            } = payload;
            if (bankAccountsModel.transactions.has(id)){
                let pathToTransaction = ['transactions', id];

                let transaction: ITransactionRecord = bankAccountsModel.transactions.get(id);

                bankAccountsModel = bankAccountsModel.removeIn(['transactions', id]);

                bankAccountsModel = bankAccountsModel.updateIn(
                    ['transactionsByAccount', transaction.account],
                    List<ITransactionRecord>(),
                    (v: List<ITransactionRecord>)=>{
                        return v.filterNot((t)=>t.id === id).toList();
                    });

                return bankAccountsModel;
            }
        }
        return bankAccountsModel;
    }



    private _mutateModel<TModel extends TypedRecord<any>, TSecondModel >(
        first: TModel,
        second: TSecondModel,
        updates: CheckArray[],
        firstFieldGetter: (fieldName: string, val: TModel) => any,
        secondFieldGetter: (fieldName: string, val: TSecondModel) => any,
        pathGenerator: (fieldName: string) => Array<any>): TModel {
        return first.withMutations((mutable) => {


            for (let update of updates) {
                let [field, equalityChecker] = update;

                if (!equalityChecker) {
                    equalityChecker = isEqual
                }
                
                let newValueField = secondFieldGetter(field, second);
                if (!equalityChecker(firstFieldGetter(field, first), newValueField)) {
                    mutable.setIn(pathGenerator(field), clone(newValueField));
                }
            }

            return mutable;
        }) as TModel;
    }

}