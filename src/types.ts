import {
    CurrencyCode,
    currenciesByCode,
    currencyCodes
} from '@bryanerayner/currency-model';

export {
    CurrencyCode,
    currencyCodes
};

export function getCurrency(code: string): CurrencyCode {
    let c = currenciesByCode[code];

    return c ? {
        code: c.code,
        country: c.country
    } : null;
}

import {
    TypedRecord,
    generateTypedRecord
} from '@bryanerayner/immutable-model-helpers';

import {
    Map,
    List
} from 'immutable';

export enum  BankAccountType {
    NotSet = 0,
    Checking = 1,
    Savings = 2,
    CreditCard = 4,
    Cash = 8,
    Mortgage = 16,
    PayPal = 32
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

export interface IBankAccountRecord extends BankAccount, TypedRecord<BankAccount>{}

export const BankAccountRecord = generateTypedRecord<BankAccount>({
    name:'',
    id:'',
    type:BankAccountType.NotSet,
    currency: null,
    owners: []
});

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
    account:string;

    /**
     * The date of the transaction
     */
    date: Date;

    /**
     * The type of the transaction
     */
    type: string;

    /**
     * A basic memo of the transaction
     */
    memo: string;

    /**
     * The amount of the transaction 
     */
    amount: TransactionAmounts;
}

export interface ITransactionRecord extends TypedRecord<ITransactionRecord>, Transaction {}

export const TransactionRecord = generateTypedRecord<Transaction>({
    id:'',
    account:'',
    date:null,
    type:'',
    memo:'',
    amount: {
        debit:0,
        credit:0
    }
});

export interface TransactionAmounts {
    /**
     * The amount debited
     */
    debit: number;
    /**
     * The amount credited
     */
    credit: number;
}

export interface IBankAccountsRecord {
    accounts: Map<string, IBankAccountRecord>;
    transactions: Map<string, ITransactionRecord>;
    transactionsByAccount: Map<string, List< ITransactionRecord>>;
}

export interface IBankAccountsRecordClass extends IBankAccountsRecord {
    new(defaults?: IBankAccountsRecord):IBankAccountsRecordClass;
}

var baseBankAccountsRecord : IBankAccountsRecordClass  = generateTypedRecord<IBankAccountsRecord>({
    accounts: Map<string, IBankAccountRecord>(),
    transactions: Map<string, ITransactionRecord>(),
    transactionsByAccount: Map<string, List<ITransactionRecord>>()
}) as any;

export class BankAccountsRecord  extends (baseBankAccountsRecord) {

    accounts: Map<string, IBankAccountRecord>;
    transactions: Map<string, ITransactionRecord>;
    transactionsByAccount: Map<string, List< ITransactionRecord>>;

    constructor(defaults?:IBankAccountsRecord){
        super(defaults);
    }

    /**
     * Whether or not a transaction is linked to another transaction
     * @param transactionId The transaction to investigate
     */
    transactionIsLinked(transactionId:string){

    }
}