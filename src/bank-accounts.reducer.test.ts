import test from 'ava';

import {
    isString
} from 'lodash';

import {
    BankAccountsActions
} from './bank-accounts.actions';

import {
    BankAccountsReducer
} from './bank-accounts.reducer';

import {
    BankAccountsRecord,
    TransactionType,
    BankAccountType,
    BankAccountsRecordType,
    BankAccount,
    IBankAccountRecord,
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

/**
 * Run the "ADD_BANK_ACCOUNT" action on a bank accounts state
 */
function addAccount(reducer: BankAccountsReducer, bankAccountState: BankAccountsRecordType, newAccount: BankAccount ){
    return reducer.reduce(bankAccountState, getActions().addBankAccount(newAccount)); 
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

test('Bank Accounts Reducer should allow multiple accounts to be added', t=>{


    let reducer = newBankAccountReducer();
    let actions = getActions();
    let newState = reducer.reduce(blankBankAccountState(), actions.addBankAccount({
        id: null,
        name: 'test',
        type: BankAccountType.Checking,
        currency: getCurrency(currencyCodes.USD),
        owners: ['a', 'b', 'c']
    }));
    let lastState = reducer.reduce(newState, actions.addBankAccount({
        id: null,
        name: 'test 2',
        type: BankAccountType.Savings,
        currency: getCurrency(currencyCodes.USD),
        owners: ['a', 'b', 'c']
    }));

    t.is(lastState.accounts.size, 2);

    let account = lastState.accounts.first(),
        secondAccount = lastState.accounts.last();

    t.is((typeof account.id === 'string'), true);

    t.is(account.name, 'test');
    t.is(account.type, BankAccountType.Checking);
    t.deepEqual(account.currency, getCurrency(currencyCodes.USD));
    t.deepEqual(account.owners, ['a', 'b', 'c']);


    t.is((typeof secondAccount.id === 'string'), true);

    t.is(secondAccount.name, 'test 2');
    t.is(secondAccount.type, BankAccountType.Savings);
    t.deepEqual(secondAccount.currency, getCurrency(currencyCodes.USD));
    t.deepEqual(secondAccount.owners, ['a', 'b', 'c']);

});

test('Bank Accounts Reducer should throw errors if a bank account is added with a matching ID', t => {

    let reducer = newBankAccountReducer();
    let actions = getActions();
    let newState = reducer.reduce(blankBankAccountState(), actions.addBankAccount({
        id:null,
        name:'test',
        type: BankAccountType.Checking,
        currency: getCurrency(currencyCodes.USD),
        owners: ['a']
    }));

    let firstAccount = newState.accounts.first();

    t.throws(()=>{
        reducer.reduce(newState, actions.addBankAccount({
            id: firstAccount.id,
            name:'test err',
            type: BankAccountType.Mortgage,
            currency: getCurrency(currencyCodes.CAD),
            owners:['a']
        }));
    },
    'Cannot add a bank account with a pre-existing ID',
    'Adding the same ID twice should be an error.'
    );
    
    // , 'Cannot add a bank account with a pre-existing ID');
});


///////////////////////////////////////////////////////////////////////////
//                       Update Bank Account
///////////////////////////////////////////////////////////////////////////

test('Bank Accounts Reducer should allow the name of a bank account to be changed', t=>{


    let reducer = newBankAccountReducer();
    let actions = getActions();
    
    let existingAccountState = addAccount(reducer, blankBankAccountState(), {
        id: '123',
        name:'test account',
        type: BankAccountType.Cash,
        currency: getCurrency(currencyCodes.USD),
        owners: ['b']
    });

    t.throws(()=>{
        let updatedAccount = reducer.reduce(existingAccountState, actions.updateBankAccount({
            id: '1234',
            name: 'test account 2',
            type: BankAccountType.Cash,
            currency: getCurrency(currencyCodes.USD),
            owners: ['b']
        }));
    },
    'Cannot update a non-existing account',
    'An ID that doesn\'t exist shouldn\'t be able to be added.');
});

test('Bank Accounts Reducer should allow the bank account type to be changed', t=>{

    let reducer = newBankAccountReducer();
    let actions = getActions();
    
    let existingAccountState = addAccount(reducer, blankBankAccountState(), {
        id: '123',
        name:'test account',
        type: BankAccountType.Cash,
        currency: getCurrency(currencyCodes.USD),
        owners: ['b']
    });

    let updatedAccount = reducer.reduce(existingAccountState, actions.updateBankAccount({
        id: '123',
        name: 'test account',
        type: BankAccountType.Checking,
        currency: getCurrency(currencyCodes.USD),
        owners: ['b']
    }));

    t.same(updatedAccount.accounts.first().type, BankAccountType.Checking);
});

test('Bank Accounts Reducer should allow the bank account currency to be changed', t=>{

    let reducer = newBankAccountReducer();
    let actions = getActions();
    
    let existingAccountState = addAccount(reducer, blankBankAccountState(), {
        id: '123',
        name:'test account',
        type: BankAccountType.Cash,
        currency: getCurrency(currencyCodes.USD),
        owners: ['b']
    });

    let updatedAccount = reducer.reduce(existingAccountState, actions.updateBankAccount({
        id: '123',
        name: 'test account',
        type: BankAccountType.Cash,
        currency: getCurrency(currencyCodes.CAD),
        owners: ['b']
    }));

    t.deepEqual(updatedAccount.accounts.first().currency, getCurrency(currencyCodes.CAD));
});

test('Bank Accounts Reducer should allow the bank account owners to be changed', t=>{

    let reducer = newBankAccountReducer();
    let actions = getActions();
    
    let existingAccountState = addAccount(reducer, blankBankAccountState(), {
        id: '123',
        name:'test account',
        type: BankAccountType.Cash,
        currency: getCurrency(currencyCodes.USD),
        owners: ['b']
    });

    let updatedAccount = reducer.reduce(existingAccountState, actions.updateBankAccount({
        id: '123',
        name: 'test account',
        type: BankAccountType.Cash,
        currency: getCurrency(currencyCodes.CAD),
        owners: ['b', 'a']
    }));

    t.deepEqual(updatedAccount.accounts.first().owners, ['b', 'a']);
});


///////////////////////////////////////////////////////////////////////////
//                       Remove Bank Account
///////////////////////////////////////////////////////////////////////////

test('Bank Accounts Reducer should allow bank accounts to be removed', t=>{

    let reducer = newBankAccountReducer();
    let actions = getActions();
    
    let existingAccountState = addAccount(reducer, blankBankAccountState(), {
        id: '123',
        name:'test account',
        type: BankAccountType.Cash,
        currency: getCurrency(currencyCodes.USD),
        owners: ['b']
    });

    let updatedAccount = reducer.reduce(existingAccountState, actions.removeBankAccount('123'));

    t.falsy(updatedAccount.accounts.find((a)=>a.id === '123'));
});

///////////////////////////////////////////////////////////////////////////
//                       Add Transaction
///////////////////////////////////////////////////////////////////////////

test('Bank Accounts Reducer should allow transactions to be added, provided that there is a matching bank account.', t=>{

    let reducer = newBankAccountReducer();
    let actions = getActions();

    let existingAccountState = addAccount(reducer, blankBankAccountState(), {
        id: '12345',
        name: 'Test Account',
        type: BankAccountType.Checking,
        currency: getCurrency(currencyCodes.USD),
        owners: ['b']
    });

    let updatedAccount = reducer.reduce(existingAccountState, actions.addTransaction(
        {
            account: '12345',
            date: new Date(2016, 0, 1),
            type: TransactionType.StartingBalance,
            memo: '',
            amount: {
                debit: {
                    amount: 0,
                    currencyCode: currencyCodes.USD
                },
                credit: null
            }
        }));
    t.truthy(updatedAccount.transactions.first());
    let firstTransaction = updatedAccount.transactions.find((v)=>v.account==='12345');
    t.true(isString(firstTransaction.id));
    t.is(firstTransaction.account, '12345');
    t.is(firstTransaction.date.getTime(), new Date(2016, 0, 1).getTime());
    t.is(firstTransaction.type, TransactionType.StartingBalance);
    t.is(firstTransaction.memo, '');
    t.is(firstTransaction.amount.debit.amount, 0);
    t.is(firstTransaction.amount.debit.currencyCode, currencyCodes.USD);
    t.is(firstTransaction.amount.credit, null);

    let transactionsByAccount = updatedAccount.transactionsByAccount.get('12345');

    t.deepEqual(firstTransaction, transactionsByAccount.first());
});

test('Bank Accounts Reducer should index transactions by account ID', t=>{

    let reducer = newBankAccountReducer();
    let actions = getActions();

    let existingAccountState = addAccount(reducer, blankBankAccountState(), {
        id: '12345',
        name: 'Test Account',
        type: BankAccountType.Checking,
        currency: getCurrency(currencyCodes.USD),
        owners: ['b']
    });

    let updatedAccount = reducer.reduce(existingAccountState, actions.addTransaction(
        {
            account: '12345',
            date: new Date(2016, 0, 1),
            type: TransactionType.Withdrawl,
            memo: '',
            amount: {
                credit: {
                    amount: 0,
                    currencyCode: currencyCodes.USD
                },
                debit: null
            }
        }));
    let firstTransaction = updatedAccount.transactions.find((v)=>v.account==='12345');
    let transactions = updatedAccount.transactionsByAccount.get('12345');
    let theOtherTransaction = transactions.first();

    t.deepEqual(firstTransaction, theOtherTransaction);
});


///////////////////////////////////////////////////////////////////////////
//                       Update Transaction
///////////////////////////////////////////////////////////////////////////

test('Bank Accounts Reducer should allow transactions to be modified.', t=>{
        let reducer = newBankAccountReducer();
    let actions = getActions();

    let existingAccountState = addAccount(reducer, blankBankAccountState(), {
        id: '12345',
        name: 'Test Account',
        type: BankAccountType.Checking,
        currency: getCurrency(currencyCodes.USD),
        owners: ['b']
    });

    let updatedAccount = reducer.reduce(existingAccountState, actions.addTransaction(
        {
            account: '12345',
            date: new Date(2016, 0, 1),
            type: TransactionType.StartingBalance,
            memo: '',
            amount: {
                debit: {
                    amount: 0,
                    currencyCode: currencyCodes.USD
                },
                credit: null
            }
        }));
    
    let transaction = updatedAccount.transactionsByAccount.get('12345').first();

    let updatedAccount2 = reducer.reduce(updatedAccount, actions.updateTransaction({
        id: transaction.id,
        account: '12345',
        date: new Date(2015, 0, 1),
        type: TransactionType.StartingBalance,
        memo:'',
        amount: {
            debit: {
                amount:0,
                currencyCode: currencyCodes.USD
            },
            credit:null
        }
    }));
    t.is(updatedAccount2.transactions.get(transaction.id).date.getTime(),
         new Date(2015, 0, 1).getTime());
    let updatedAccount3 = reducer.reduce(updatedAccount, actions.updateTransaction({
        id: transaction.id,
        account:'12345',
        date: new Date(2016, 0, 1),
        type: TransactionType.Deposit,
        memo:'1234567890',
        amount:{
            debit:{
                amount:0,
                currencyCode:currencyCodes.USD
            },
            credit:null
        }
    }));
    t.is(updatedAccount3.transactions.get(transaction.id).type,
         TransactionType.Deposit);
    let updatedAccount4 = reducer.reduce(updatedAccount, actions.updateTransaction({
        id: transaction.id,
        account:'12345',
        date:new Date(2016,0,1),
        type: TransactionType.StartingBalance,
        memo:'',
        amount: {
            debit: {
                amount: 100,
                currencyCode: currencyCodes.USD
            },
            credit:null
        }
    }));
    t.is(updatedAccount4.transactions.get(transaction.id).amount.debit.amount,
         100);

    let updatedAccount5 = reducer.reduce(updatedAccount, actions.updateTransaction({
        id: transaction.id,
        account:'12345',
        date:new Date(2016,1,1),
        type: TransactionType.Withdrawl,
        memo:'1234',
        amount: {
            debit: null,
            credit:{
                amount: 100,
                currencyCode: currencyCodes.USD
            }
        }
    }));
    let updatedTransaction = updatedAccount5.transactions.get(transaction.id); 
    t.is(updatedTransaction.date.getTime(),
         new Date(2016, 1,1).getTime());
    t.is(updatedTransaction.type, TransactionType.Withdrawl);
    t.is(updatedTransaction.memo, '1234');
    t.is(updatedTransaction.amount.debit, null);
    t.is(updatedTransaction.amount.credit.amount, 100);
    t.is(updatedTransaction.amount.credit.currencyCode, currencyCodes.USD);
});

test('Bank Accounts Reducer should not allow the account of a transaction to be modified, to an account which doesn\'t exist.', t=>{
        let reducer = newBankAccountReducer();
    let actions = getActions();

    let existingAccountState = addAccount(reducer, blankBankAccountState(), {
        id: '12345',
        name: 'Test Account',
        type: BankAccountType.Checking,
        currency: getCurrency(currencyCodes.USD),
        owners: ['b']
    });

    let accountsState = reducer.reduce(existingAccountState, actions.addBankAccount({
        id: 'abc',
        name: 'Test Account 3',
        type: BankAccountType.Checking,
        currency: getCurrency(currencyCodes.USD),
        owners: ['b']
    }));

    let updatedAccount = reducer.reduce(accountsState, actions.addTransaction(
        {
            id: '456',
            account: '12345',
            date: new Date(2016, 0, 1),
            type: TransactionType.StartingBalance,
            memo: '',
            amount: {
                debit: {
                    amount: 0,
                    currencyCode: currencyCodes.USD
                },
                credit: null
            }
        }));
    t.throws(()=>{
        let updatedAccount2 = reducer.reduce(updatedAccount, actions.updateTransaction({
            id: '456',
            account: 'abcdw324',
            date: new Date(2016, 0, 1),
            type: TransactionType.StartingBalance,
            memo:'',
            amount: {
                debit: {
                    amount:0,
                    currencyCode:currencyCodes.USD
                },
                credit: null
            }
        }));
    }, 'The account does not exist');
        
});

test('Bank Accounts Reducer should allow the account of a transaction to be modified, to an account which exists.', t=>{
        let reducer = newBankAccountReducer();
    let actions = getActions();

    let existingAccountState = addAccount(reducer, blankBankAccountState(), {
        id: '12345',
        name: 'Test Account',
        type: BankAccountType.Checking,
        currency: getCurrency(currencyCodes.USD),
        owners: ['b']
    });

    let accountsState = reducer.reduce(existingAccountState, actions.addBankAccount({
        id: 'abcd',
        name: 'Test Account 3',
        type: BankAccountType.Checking,
        currency: getCurrency(currencyCodes.USD),
        owners: ['b']
    }));

    let updatedAccount = reducer.reduce(accountsState, actions.addTransaction(
        {
            id: '456',
            account: '12345',
            date: new Date(2016, 0, 1),
            type: TransactionType.StartingBalance,
            memo: '',
            amount: {
                debit: {
                    amount: 0,
                    currencyCode: currencyCodes.USD
                },
                credit: null
            }
        }));

        

    t.notThrows(()=>{
        let updatedAccount2 = reducer.reduce(updatedAccount, actions.updateTransaction({
            id: '456',
            account: 'abcd',
            date: new Date(2016, 0, 1),
            type: TransactionType.StartingBalance,
            memo:'',
            amount: {
                debit: {
                    amount:0,
                    currencyCode:currencyCodes.USD
                },
                credit: null
            }
        }));
    });
        
});
///////////////////////////////////////////////////////////////////////////
//                       Remove Transaction
///////////////////////////////////////////////////////////////////////////

test('Bank Accounts Reducer should allow the account of a transaction to be modified, to an account which exists.', t=>{
        let reducer = newBankAccountReducer();
    let actions = getActions();

    let existingAccountState = addAccount(reducer, blankBankAccountState(), {
        id: '12345',
        name: 'Test Account',
        type: BankAccountType.Checking,
        currency: getCurrency(currencyCodes.USD),
        owners: ['b']
    });

    let updatedAccount = reducer.reduce(existingAccountState, actions.addTransaction(
        {
            id: '456',
            account: '12345',
            date: new Date(2016, 0, 1),
            type: TransactionType.Deposit,
            memo: '',
            amount: {
                debit: {
                    amount: 0,
                    currencyCode: currencyCodes.USD
                },
                credit: null
            }
        }));
    let updatedAccount2 = reducer.reduce(updatedAccount, actions.removeTransaction('456'));
    t.is(updatedAccount2.transactions.size, 0);
    t.is(updatedAccount2.transactionsByAccount.get('12345').size, 0);
});