import { BankAccounts, BankAccountsRecordType, IBankAccountRecord, BankAccount, ITransactionRecord, Transaction } from './types';
/**
 * Handles saving bank accounts to and from disk, or real time databases like Firebase
 */
export declare class BankAccountsIoService {
    constructor();
    /**
     * Convert a Bank Accounts model to a plain Javascript object
     */
    bankAccountsModelToObject(model: BankAccountsRecordType): BankAccounts;
    bankAccountModelToObject(model: IBankAccountRecord): BankAccount;
    transactionModelToObject(model: ITransactionRecord): Transaction;
}
