import { IBankAccountsRecord, BankAccountsRecordType } from './types';
import { BankAccountRelatedAction, IAddBankAccountAction, IUpdateBankAccountAction, IRemoveBankAccountAction, IAddTransactionAction, IUpdateTransactionAction } from './bank-accounts.actions';
import { Reducer, Action } from '@bryanerayner/reducer-helpers';
import { TypedRecord } from '@bryanerayner/immutable-model-helpers';
export declare class BankAccountsReducer implements Reducer<BankAccountsRecordType> {
    constructor();
    reduce(bankAccountsModel: BankAccountsRecordType, action: BankAccountRelatedAction): TypedRecord<IBankAccountsRecord> & IBankAccountsRecord;
    /**
     * Add a bank account
     */
    _addBankAccount(bankAccountsModel: BankAccountsRecordType, action: IAddBankAccountAction): TypedRecord<IBankAccountsRecord> & IBankAccountsRecord;
    /**
     * Update an existing bank account
     */
    _updateBankAccount(bankAccountsModel: BankAccountsRecordType, action: IUpdateBankAccountAction): BankAccountsRecordType;
    /**
     * Remove a bank account
     */
    _removeBankAccount(bankAccountsModel: BankAccountsRecordType, action: IRemoveBankAccountAction): TypedRecord<IBankAccountsRecord> & IBankAccountsRecord;
    /**
     * Add a transaction
     */
    _addTransaction(bankAccountsModel: BankAccountsRecordType, action: IAddTransactionAction): TypedRecord<IBankAccountsRecord> & IBankAccountsRecord;
    /**
     * Update a transaction
     */
    _updateTransaction(bankAccountsModel: BankAccountsRecordType, action: IUpdateTransactionAction): BankAccountsRecordType;
    /**
     * Remove a transaction
     */
    _removeTransaction(bankAccountsModel: BankAccountsRecordType, action: Action): BankAccountsRecordType;
    private _mutateModel<TModel, TSecondModel>(first, second, updates, firstFieldGetter, secondFieldGetter, pathGenerator);
}
