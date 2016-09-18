"use strict";
var lodash_1 = require('lodash');
/**
 * Handles saving bank accounts to and from disk, or real time databases like Firebase
 */
var BankAccountsIoService = (function () {
    function BankAccountsIoService() {
    }
    /**
     * Convert a Bank Accounts model to a plain Javascript object
     */
    BankAccountsIoService.prototype.bankAccountsModelToObject = function (model) {
        var _this = this;
        var accounts = {};
        var transactions = {};
        var transactionsByAccount = {};
        if (model.accounts) {
            model.accounts.forEach(function (v, k) {
                var m = _this.bankAccountModelToObject(v);
                if (m) {
                    accounts[k] = m;
                    transactionsByAccount[k] = [];
                }
            });
        }
        if (model.transactions) {
            model.transactions.forEach(function (v, k) {
                var m = _this.transactionModelToObject(v);
                if (m) {
                    transactions[k] = m;
                    transactionsByAccount[m.account].push(m);
                }
            });
        }
        return {
            accounts: accounts,
            transactions: transactions,
            transactionsByAccount: transactionsByAccount
        };
    };
    BankAccountsIoService.prototype.bankAccountModelToObject = function (model) {
        if (!model) {
            return null;
        }
        var name = model.name, id = model.id, type = model.type, currency = model.currency, owners = model.owners;
        return {
            name: name,
            id: id,
            type: type,
            currency: currency,
            owners: lodash_1.clone(owners)
        };
    };
    BankAccountsIoService.prototype.transactionModelToObject = function (model) {
        if (!model) {
            return null;
        }
        var id = model.id, account = model.account, date = model.date, type = model.type, customType = model.customType, memo = model.memo, amount = model.amount;
        var debit = amount.debit, credit = amount.credit;
        return {
            id: id,
            account: account,
            date: lodash_1.clone(date),
            type: type,
            customType: customType,
            memo: memo,
            amount: {
                debit: lodash_1.clone(debit),
                credit: lodash_1.clone(credit)
            }
        };
    };
    return BankAccountsIoService;
}());
exports.BankAccountsIoService = BankAccountsIoService;
