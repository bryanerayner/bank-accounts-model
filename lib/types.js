"use strict";
var currency_model_1 = require('@bryanerayner/currency-model');
exports.currencyCodes = currency_model_1.currencyCodes;
function getCurrency(code) {
    var c = currency_model_1.currenciesByCode[code];
    return c ? {
        code: c.code,
        country: c.country
    } : null;
}
exports.getCurrency = getCurrency;
var immutable_model_helpers_1 = require('@bryanerayner/immutable-model-helpers');
var immutable_1 = require('immutable');
(function (BankAccountType) {
    BankAccountType[BankAccountType["NotSet"] = 0] = "NotSet";
    BankAccountType[BankAccountType["Checking"] = 1] = "Checking";
    BankAccountType[BankAccountType["Savings"] = 2] = "Savings";
    BankAccountType[BankAccountType["CreditCard"] = 4] = "CreditCard";
    BankAccountType[BankAccountType["Cash"] = 8] = "Cash";
    BankAccountType[BankAccountType["Mortgage"] = 16] = "Mortgage";
    BankAccountType[BankAccountType["PayPal"] = 32] = "PayPal";
})(exports.BankAccountType || (exports.BankAccountType = {}));
var BankAccountType = exports.BankAccountType;
exports.BankAccountRecord = immutable_model_helpers_1.generateTypedRecord({
    name: '',
    id: '',
    type: BankAccountType.NotSet,
    currency: null,
    owners: []
});
exports.TransactionRecord = immutable_model_helpers_1.generateTypedRecord({
    id: '',
    account: '',
    date: null,
    type: '',
    memo: '',
    amount: {
        debit: 0,
        credit: 0
    }
});
exports.BankAccountsRecord = immutable_model_helpers_1.generateTypedRecord({
    accounts: immutable_1.Map(),
    transactions: immutable_1.Map(),
    transactionsByAccount: immutable_1.Map()
});
