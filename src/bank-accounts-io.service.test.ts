import {
    BankAccountsIoService
} from './bank-accounts-io.service';

import {
    BankAccounts,
    BankAccountRecord,
    TransactionRecord,
    BankAccountsRecord,
    BankAccountType,
    TransactionType,
    BankAccountsRecordType,
    currencyCodes,
    getCurrency,
    IBankAccountRecord,
    BankAccount,
    ITransactionRecord,
    Transaction
} from './types';

import {
    Map,
    List
} from 'immutable';

import test from 'ava';

function getService(){
    return new BankAccountsIoService();
}

test('Bank Accounts IO Service should serialize a BankAccountsRecordType', t=>{

    let expectedAccount :BankAccounts = {
        accounts: {
            'a': {
                id:'a',
                name:'1',
                type:BankAccountType.Checking,
                currency:getCurrency( currencyCodes.USD),
                owners:['q', 'z']
            },
            'b': {
                id:'b',
                name:'2',
                type:BankAccountType.Savings,
                currency: getCurrency( currencyCodes.CAD),
                owners: ['q', 'w']
            }
        },
        transactions:{
            'a1': {
                id: 'a1',
                account: 'a',
                date: new Date(2016,0,1),
                type: TransactionType.StartingBalance,
                customType:'',
                memo:'',
                amount: {
                    debit: {
                        amount: 0,
                        currencyCode: currencyCodes.USD
                    },
                    credit:null
                }
            },
            'b1': {
                id: 'b1',
                account: 'b',
                date: new Date(2016,0,1),
                type: TransactionType.StartingBalance,
                customType:'',
                memo:'',
                amount: {
                    debit: {
                        amount: 0,
                        currencyCode: currencyCodes.CAD
                    },
                    credit:null
                }
            }
        },
        transactionsByAccount: {
            'a': [{
                id: 'a1',
                account: 'a',
                date: new Date(2016,0,1),
                type: TransactionType.StartingBalance,
                customType:'',
                memo:'',
                amount: {
                    debit: {
                        amount: 0,
                        currencyCode: currencyCodes.USD
                    },
                    credit:null
                }
            }],
            'b':[
                {
                id: 'b1',
                account: 'b',
                date: new Date(2016,0,1),
                type: TransactionType.StartingBalance,
                customType:'',
                memo:'',
                amount: {
                    debit: {
                        amount: 0,
                        currencyCode: currencyCodes.CAD
                    },
                    credit:null
                }
            }
            ]
        }
    }

    let initialAccount = new BankAccountsRecord({
        accounts: Map<string, IBankAccountRecord>({
            'a': new BankAccountRecord({
                id:'a',
                name:'1',
                type:BankAccountType.Checking,
                currency:getCurrency( currencyCodes.USD),
                owners:['q', 'z']
            }),
            'b': new BankAccountRecord({
                id:'b',
                name:'2',
                type:BankAccountType.Savings,
                currency: getCurrency( currencyCodes.CAD),
                owners: ['q', 'w']
            })
        }),
        transactions: Map<string, ITransactionRecord>({
            'a1': new TransactionRecord({
                id: 'a1',
                account: 'a',
                date: new Date(2016,0,1),
                type: TransactionType.StartingBalance,
                customType:'',
                memo:'',
                amount: {
                    debit: {
                        amount: 0,
                        currencyCode: currencyCodes.USD
                    },
                    credit:null
                }

            }),
            'b1': new TransactionRecord({
                id: 'b1',
                account: 'b',
                date: new Date(2016,0,1),
                type: TransactionType.StartingBalance,
                customType:'',
                memo:'',
                amount: {
                    debit: {
                        amount: 0,
                        currencyCode: currencyCodes.CAD
                    },
                    credit:null
                }
            })
        }),
        transactionsByAccount: Map<string, List<ITransactionRecord>>({
            'a': List<ITransactionRecord>([
                new TransactionRecord({
                id: 'a1',
                account: 'a',
                date: new Date(2016,0,1),
                type: TransactionType.StartingBalance,
                customType:'',
                memo:'',
                amount: {
                    debit: {
                        amount: 0,
                        currencyCode: currencyCodes.USD
                    },
                    credit:null
                }

            })
            ]),
            'b': List<ITransactionRecord>([
                new TransactionRecord({
                id: 'b1',
                account: 'b',
                date: new Date(2016,0,1),
                type: TransactionType.StartingBalance,
                customType:'',
                memo:'',
                amount: {
                    debit: {
                        amount: 0,
                        currencyCode: currencyCodes.CAD
                    },
                    credit:null
                }
            })
            ])
        })
    });

    let service = getService();

    let output = service.bankAccountsModelToObject(initialAccount);

    t.deepEqual(output, expectedAccount, 'The accounts should be the same');

});


test('Bank Accounts IO Service should serialize a TransactionRecord', t=>{

    let expected :Transaction = {
        id:'b1',
        account:'b',
        date: new Date(2016, 0, 1),
        type: TransactionType.StartingBalance,
        customType: '',
        memo: '',
        amount: {
            debit: {
                amount:0,
                currencyCode: currencyCodes.USD
            },
            credit:null
        }
    };
    let initial = new TransactionRecord({
        id:'b1',
        account:'b',
        date: new Date(2016, 0, 1),
        type: TransactionType.StartingBalance,
        customType: '',
        memo: '',
        amount: {
            debit: {
                amount:0,
                currencyCode:currencyCodes.USD
            },
            credit: null
        }
    });
    let service = getService();

    let output = service.transactionModelToObject(initial);

    t.deepEqual(output, expected, 'The transaction should be the same');

});