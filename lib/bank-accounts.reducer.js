"use strict";
var types_1 = require('./types');
var immutable_1 = require('immutable');
var lodash_1 = require('lodash');
var uuid = require('node-uuid');
var bank_accounts_actions_1 = require('./bank-accounts.actions');
function throwErr(message) {
    throw new Error(message);
}
;
function newGuid() {
    return uuid.v4();
}
var BankAccountsReducer = (function () {
    function BankAccountsReducer() {
    }
    BankAccountsReducer.prototype.reduce = function (bankAccountsModel, action) {
        switch (action.type) {
            case bank_accounts_actions_1.ADD_BANK_ACCOUNT:
                return this._addBankAccount(bankAccountsModel, action);
            case bank_accounts_actions_1.UPDATE_BANK_ACCOUNT:
                return this._updateBankAccount(bankAccountsModel, action);
            case bank_accounts_actions_1.REMOVE_BANK_ACCOUNT:
                return this._removeBankAccount(bankAccountsModel, action);
            case bank_accounts_actions_1.ADD_TRANSACTION:
                return this._addTransaction(bankAccountsModel, action);
            case bank_accounts_actions_1.UPDATE_TRANSACTION:
                return this._updateTransaction(bankAccountsModel, action);
            case bank_accounts_actions_1.REMOVE_TRANSACTION:
                return this._removeTransaction(bankAccountsModel, action);
        }
        return bankAccountsModel;
    };
    /**
     * Add a bank account
     */
    BankAccountsReducer.prototype._addBankAccount = function (bankAccountsModel, action) {
        if (action.type === bank_accounts_actions_1.ADD_BANK_ACCOUNT) {
            var account = new types_1.BankAccountRecord(action.payload);
            if (!account.id) {
                account = account.set('id', newGuid());
            }
            var existingAccounts = bankAccountsModel.accounts;
            if (existingAccounts.has(account.id)) {
                throwErr('Cannot add a bank account with a pre-existing ID');
            }
            var newAccounts = bankAccountsModel.setIn(['accounts', account.id], account);
            return newAccounts;
        }
        return bankAccountsModel;
    };
    /**
     * Update an existing bank account
     */
    BankAccountsReducer.prototype._updateBankAccount = function (bankAccountsModel, action) {
        var type = action.type, payload = action.payload;
        if (type === bank_accounts_actions_1.UPDATE_BANK_ACCOUNT) {
            var id_1 = payload.id, newValue = payload.newValue;
            var acc = bankAccountsModel.accounts.get(id_1, null);
            if (!acc) {
                throwErr('Cannot update a non-existing account');
            }
            return this._mutateModel(bankAccountsModel, newValue, [
                ['name'],
                ['type'],
                ['currency'],
                ['owners']
            ], function (fieldName, accounts) { return accounts.accounts.getIn([id_1, fieldName]); }, function (fieldName, model) { return model[fieldName]; }, function (segment) { return ['accounts', id_1].concat(segment); });
        }
        return bankAccountsModel;
    };
    /**
     * Remove a bank account
     */
    BankAccountsReducer.prototype._removeBankAccount = function (bankAccountsModel, action) {
        if (action.type === bank_accounts_actions_1.REMOVE_BANK_ACCOUNT) {
            return bankAccountsModel.removeIn(['accounts', action.payload.id]);
        }
        return bankAccountsModel;
    };
    /**
     * Add a transaction
     */
    BankAccountsReducer.prototype._addTransaction = function (bankAccountsModel, action) {
        var type = action.type, payload = action.payload;
        if (type === bank_accounts_actions_1.ADD_TRANSACTION) {
            var transaction_1 = new types_1.TransactionRecord(payload);
            if (!transaction_1.id) {
                transaction_1 = transaction_1.set('id', newGuid);
            }
            var id_2 = transaction_1.id, account_1 = transaction_1.account;
            if (!bankAccountsModel.accounts.has(account_1)) {
                throwErr('There is no bank account matching this transaction');
            }
            if (bankAccountsModel.transactions.has(id_2)) {
                throwErr('The transaction id must be unique');
            }
            bankAccountsModel.transactionsByAccount;
            return bankAccountsModel.withMutations(function (m) {
                m.setIn(['transactions', id_2], transaction_1);
                m.updateIn(['transactionsByAccount', account_1], immutable_1.List(), function (v) { return v.push(transaction_1); });
                return m;
            });
        }
        return bankAccountsModel;
    };
    /**
     * Update a transaction
     */
    BankAccountsReducer.prototype._updateTransaction = function (bankAccountsModel, action) {
        var type = action.type, payload = action.payload;
        if (type === bank_accounts_actions_1.UPDATE_TRANSACTION) {
            var id_3 = payload.id, newValue_1 = payload.newValue;
            if (!bankAccountsModel.transactions.has(id_3)) {
                throwErr('The transaction does not exist');
            }
            var originalTransaction_1 = bankAccountsModel.transactions.get(id_3);
            var originalAccount = originalTransaction_1.account;
            var newAccount = newValue_1.account;
            var accountChanged = newAccount !== originalAccount;
            if (!bankAccountsModel.accounts.has(newAccount)) {
                throwErr('The account does not exist');
            }
            var modifiedTransaction_1 = bankAccountsModel
                .transactions
                .get(id_3)
                .withMutations(function (mV) {
                lodash_1.each(['account', 'date', 'type', 'memo', 'amount'], function (key) {
                    mV.set(key, lodash_1.cloneDeep(newValue_1[key]));
                });
                return mV;
            });
            bankAccountsModel = bankAccountsModel.updateIn(['transactions', id_3], function (v) {
                return modifiedTransaction_1;
            });
            if (accountChanged) {
                var matchesTransactionId_1 = function (t) { return t.id === id_3; };
                bankAccountsModel = bankAccountsModel.updateIn(['transactionsByAccount', originalAccount], immutable_1.List(), function (tByAccount) {
                    return tByAccount.filterNot(matchesTransactionId_1).toList();
                });
                bankAccountsModel = bankAccountsModel.updateIn(['transactionsByAccount', newAccount], immutable_1.List(), function (tByAccount) {
                    return tByAccount
                        .filterNot(matchesTransactionId_1)
                        .toList()
                        .push(modifiedTransaction_1);
                });
            }
            else {
                bankAccountsModel = bankAccountsModel.updateIn(['transactionsByAccount', originalAccount], immutable_1.List(), function (tByAccount) {
                    return tByAccount.update(tByAccount.indexOf(originalTransaction_1), function (v) { return modifiedTransaction_1; });
                });
            }
            return bankAccountsModel;
        }
        return bankAccountsModel;
    };
    /**
     * Remove a transaction
     */
    BankAccountsReducer.prototype._removeTransaction = function (bankAccountsModel, action) {
        var type = action.type, payload = action.payload;
        if (type === bank_accounts_actions_1.REMOVE_TRANSACTION) {
            var id_4 = payload.id;
            if (bankAccountsModel.transactions.has(id_4)) {
                var pathToTransaction = ['transactions', id_4];
                var transaction = bankAccountsModel.transactions.get(id_4);
                bankAccountsModel = bankAccountsModel.removeIn(['transactions', id_4]);
                bankAccountsModel = bankAccountsModel.updateIn(['transactionsByAccount', transaction.account], immutable_1.List(), function (v) {
                    return v.filterNot(function (t) { return t.id === id_4; }).toList();
                });
                return bankAccountsModel;
            }
        }
        return bankAccountsModel;
    };
    BankAccountsReducer.prototype._mutateModel = function (first, second, updates, firstFieldGetter, secondFieldGetter, pathGenerator) {
        return first.withMutations(function (mutable) {
            for (var _i = 0, updates_1 = updates; _i < updates_1.length; _i++) {
                var update = updates_1[_i];
                var field = update[0], equalityChecker = update[1];
                if (!equalityChecker) {
                    equalityChecker = lodash_1.isEqual;
                }
                var newValueField = secondFieldGetter(field, second);
                if (!equalityChecker(firstFieldGetter(field, first), newValueField)) {
                    mutable.setIn(pathGenerator(field), lodash_1.clone(newValueField));
                }
            }
            return mutable;
        });
    };
    return BankAccountsReducer;
}());
exports.BankAccountsReducer = BankAccountsReducer;
