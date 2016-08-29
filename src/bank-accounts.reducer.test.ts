import test from 'ava';

import {
    BankAccountsActions
} from './bank-accounts.actions';

import {
    BankAccountsReducer
} from './bank-accounts.reducer';

import {
    BankAccountsRecord,
    BankAccountType,
    BankAccountRecord,
    CurrencyCode,
    currencyCodes,
    getCurrency,
    TransactionRecord
} from './types';

function newBankAccountReducer() {
    return new BankAccountsReducer();
}

function blankBankAccountState() {
    return new BankAccountsRecord();
}

function getActions() {
    return new BankAccountsActions();
}

test('Bank Accounts Reducer should save bank accounts added to the state', t => {


    let reducer = newBankAccountReducer();
    let actions = getActions();
    let newState = reducer.reduce(blankBankAccountState(), actions.addBankAccount({
        id: null,
        name: 'test',
        type: BankAccountType.Checking,
        currency: getCurrency(currencyCodes.USD),
        owners: ['a', 'b', 'c']
    }));

    t.is(newState.accounts.size, 1);

    let account = newState.accounts.first();

    t.is((typeof account.id === 'string'), true);

    t.is(account.name, 'test');
    t.is(account.type, BankAccountType.Checking);
    t.deepEqual(account.currency, getCurrency(currencyCodes.USD));
    t.deepEqual(account.owners, ['a', 'b', 'c']);

});