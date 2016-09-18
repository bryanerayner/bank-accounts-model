import {
    BankAccounts,
    BankAccountsRecordType,
    IBankAccountRecord,
    BankAccount,
    ITransactionRecord,
    Transaction
} from './types';

import {
    clone
} from 'lodash';

/**
 * Handles saving bank accounts to and from disk, or real time databases like Firebase
 */
export class BankAccountsIoService {

    constructor() {

    }

    /**
     * Convert a Bank Accounts model to a plain Javascript object
     */
    bankAccountsModelToObject(model: BankAccountsRecordType): BankAccounts {

        let accounts: { [accountId: string]: BankAccount } = {};
        let transactions: { [transactionId: string]: Transaction } = {};
        let transactionsByAccount: { [accountId: string]: Array<Transaction> } = {};

        if (model.accounts) {
            model.accounts.forEach((v, k)=>{
                let m = this.bankAccountModelToObject(v);
                if (m){
                    accounts[k] = m;
                    transactionsByAccount[k] = [];
                }
            });
        }

        if (model.transactions) {
            model.transactions.forEach((v, k)=>{
                let m = this.transactionModelToObject(v);
                if (m){
                    transactions[k] = m;
                    transactionsByAccount[m.account].push(m);
                }
            });
        }

        return {
            accounts,
            transactions,
            transactionsByAccount
        }
    }

    bankAccountModelToObject(model:IBankAccountRecord):BankAccount {
        if (!model){
            return null;
        }
        let {
            name,
            id,
            type,
            currency,
            owners
        } = model;

        return {
            name,
            id,
            type,
            currency,
            owners: clone(owners)
        };
    }

    transactionModelToObject(model: ITransactionRecord): Transaction {
        if (!model){
            return null;
        }
        let {
            id,
            account,
            date,
            type,
            customType,
            memo,
            amount
        } = model;

        let {
            debit,
            credit
        } = amount;
        
        return {
            id,
            account,
            date: clone(date),
            type,
            customType: customType,
            memo,
            amount: {
                debit: clone(debit),
                credit: clone(credit)
            }
        };
    }
}