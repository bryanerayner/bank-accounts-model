"use strict";
var uuid = require('node-uuid');
var types_1 = require('./types');
exports.ADD_BANK_ACCOUNT = 'ADD_BANK_ACCOUNT';
exports.UPDATE_BANK_ACCOUNT = 'UPDATE_BANK_ACCOUNT';
exports.REMOVE_BANK_ACCOUNT = 'REMOVE_BANK_ACCOUNT';
exports.ADD_TRANSACTION = 'ADD_TRANSACTION';
exports.UPDATE_TRANSACTION = 'UPDATE_TRANSACTION';
exports.REMOVE_TRANSACTION = 'REMOVE_TRANSACTION';
;
;
;
var BankAccountsActions = (function () {
    function BankAccountsActions() {
    }
    BankAccountsActions.prototype.ensureId = function (id) {
        return id || uuid.v4();
    };
    /**
     * Add a bank account
     */
    BankAccountsActions.prototype.addBankAccount = function (account) {
        var b = new types_1.BankAccountRecord({
            id: this.ensureId(account.id),
            name: account.name,
            type: account.type,
            currency: account.currency,
            owners: account.owners
        });
        return {
            type: exports.ADD_BANK_ACCOUNT,
            payload: b
        };
    };
    BankAccountsActions.prototype.updateBankAccount = function (account) {
        var u = new types_1.BankAccountRecord({
            id: account.id,
            name: account.name,
            type: account.type,
            currency: account.currency,
            owners: account.owners
        });
        return {
            type: exports.UPDATE_BANK_ACCOUNT,
            payload: {
                id: account.id,
                newValue: u
            }
        };
    };
    /**
     * Remove a bank account
     */
    BankAccountsActions.prototype.removeBankAccount = function (id) {
        return {
            type: exports.REMOVE_BANK_ACCOUNT,
            payload: {
                id: id
            }
        };
    };
    /**
     * Add a transaction
     */
    BankAccountsActions.prototype.addTransaction = function (transaction) {
        var t = new types_1.TransactionRecord({
            id: transaction.id || uuid.v4(),
            account: transaction.account,
            date: transaction.date,
            type: transaction.type,
            memo: transaction.memo,
            amount: transaction.amount
        });
        return {
            type: exports.ADD_TRANSACTION,
            payload: t
        };
    };
    /**
     * Upate an existing transaction
     */
    BankAccountsActions.prototype.updateTransaction = function (transaction) {
        if (!transaction.id) {
            throw new Error('Must have an ID to update a transaction');
        }
        var t = new types_1.TransactionRecord(transaction);
        return {
            type: exports.UPDATE_TRANSACTION,
            payload: {
                id: t.id,
                newValue: t
            }
        };
    };
    /**
     * Remove a transaction
     */
    BankAccountsActions.prototype.removeTransaction = function (id) {
        return {
            type: exports.REMOVE_TRANSACTION,
            payload: {
                id: id
            }
        };
    };
    return BankAccountsActions;
}());
exports.BankAccountsActions = BankAccountsActions;
