import { CurrencyCode, CurrencyAmount, currencyCodes } from '@bryanerayner/currency-model';
export { CurrencyCode, CurrencyAmount, currencyCodes };
export declare function getCurrency(code: string): CurrencyCode;
import { TypedRecord } from '@bryanerayner/immutable-model-helpers';
import { Map, List } from 'immutable';
export declare enum BankAccountType {
    NotSet = 0,
    Checking = 1,
    Savings = 2,
    CreditCard = 4,
    Cash = 8,
    Mortgage = 16,
    PayPal = 32,
}
export interface BankAccount {
    /**
     * The name of the bank account
     */
    name: string;
    /**
     * A GUID for the bank account
     */
    id?: string;
    /**
     * The type of account
     */
    type: BankAccountType;
    /**
     * The currency of the bank account
     */
    currency: CurrencyCode;
    /**
     * A list of user IDs which own the account
     */
    owners: string[];
}
export interface IBankAccountRecord extends BankAccount, TypedRecord<BankAccount> {
}
export declare const BankAccountRecord: TypedRecord<BankAccount>;
export declare const enum TransactionType {
    NotSet = 0,
    StartingBalance = 1,
    Deposit = 2,
    Withdrawl = 3,
}
/**
 * A single transaction in a bank account
 */
export interface Transaction {
    /**
     * The ID of the transaction
     */
    id?: string;
    /**
     * The ID of the account to which this transaction belongs
     */
    account: string;
    /**
     * The date of the transaction
     */
    date: Date;
    /**
     * The type of the transaction
     */
    type: TransactionType;
    /**
     * A custom type which may be provided by the financial institution
     */
    customType?: string;
    /**
     * A basic memo of the transaction
     */
    memo: string;
    /**
     * The amount of the transaction
     */
    amount: TransactionAmounts;
}
export interface ITransactionRecord extends TypedRecord<ITransactionRecord>, Transaction {
}
export declare const TransactionRecord: TypedRecord<Transaction>;
export interface TransactionAmounts {
    /**
     * The amount debited
     */
    debit: CurrencyAmount;
    /**
     * The amount credited
     */
    credit: CurrencyAmount;
}
export interface IBankAccountsRecord {
    /**
     * Accounts by account ID.
     */
    accounts: Map<string, IBankAccountRecord>;
    transactions: Map<string, ITransactionRecord>;
    transactionsByAccount: Map<string, List<ITransactionRecord>>;
}
export interface IBankAccountsRecordInstanceMethods {
}
export interface BankAccountsRecordType extends TypedRecord<IBankAccountsRecord>, IBankAccountsRecord {
}
export declare const BankAccountsRecord: BankAccountsRecordType;
