import { WalletAccountTransaction } from '@suite-common/wallet-types';

export const transactionWithTargetInOutputs: WalletAccountTransaction = {
    descriptor:
        'zpub6rszzdAK6RuafeRwyN8z1cgWcXCuKbLmjjfnrW4fWKtcoXQ8787214pNJjnBG5UATyghuNzjn6Lfp5k5xymrLFJnCy46bMYJPyZsbpFGagT',
    deviceState: 'mvbu1Gdy8SUjTenqerxUaZyYjmveZvt33q@C906E19794613145E3DF45F4:0',
    symbol: 'btc',
    type: 'recv',
    internalTransfers: [],
    txid: 'd6c42e965f9e9a69b9eb1d48d09e787cae8020d86ed952548058c857f7bcfb7e',
    blockTime: 1639707387,
    blockHeight: 714458,
    blockHash: '00000000000000000000d761e44feb99d03e42ead4a82eeb870cce1077ca4a2a',
    amount: '0.00045716',
    fee: '0.00019938',
    targets: [
        {
            n: 62,
            addresses: ['3QpCQP3A2q7kCr8QgsWuqG1Bg1P6RySonw'],
            isAddress: true,
            amount: '0.00118444',
            isAccountTarget: true,
        },
    ],
    tokens: [],
    details: {
        vin: [
            {
                txid: '851ee19aec76f2c823f2f181740942a41cc24de75ff7fac42e9b0d663358516b',
                vout: 50,
                sequence: 4294967295,
                n: 0,
                addresses: [
                    'bc1q39kuc35n722fmy0nw3qqhpvg0ch8f0a6rt22xs',
                    'bc346cd7c787e903ac4b41e4fd2e038a81cb696d5dbf87',
                ],
                isAddress: true,
                value: '4.03102789',
            },
        ],
        vout: [
            {
                value: '0.00642597',
                n: 0,
                hex: 'a9146cd7c787e903ac4b41e4fd2e038a81cb696d5dbf87',
                addresses: ['3BcXPstZ4ZHhvLxPFkjFocuFySKt8nsGgs'],
                isAddress: true,
            },
            {
                value: '0.00118444',
                n: 1,
                hex: 'a914fda68d9016d07280d410a1e930ea03445694d16887',
                addresses: ['3QpCQP3A2q7kCr8QgsWuqG1Bg1P6RySonw'],
                isAddress: true,
            },
        ],
        size: 2582,
        totalInput: '4.03102789',
        totalOutput: '4.03082851',
    },
    rates: {
        aed: 175440,
        ars: 4866099,
        aud: 66517,
        bch: 108.804,
        bdt: 4087605,
        bhd: 18007.08,
        bits: 1000368,
        bmd: 47764,
        bnb: 90.154,
        brl: 271712,
        btc: 1,
        cad: 61070,
        chf: 43911,
        clp: 40432292,
        cny: 304168,
        czk: 1068260,
        dkk: 313686,
        dot: 1840,
        eos: 14759,
        eth: 12.030073,
        eur: 42184,
        gbp: 35837,
        hkd: 372687,
        huf: 15548457,
        idr: 686746842,
        ils: 147935,
        inr: 3639104,
        jpy: 5431032,
        krw: 56621308,
        kwd: 14483.71,
        link: 2526,
        lkr: 9627823,
        ltc: 319.559,
        mmk: 84843048,
        mxn: 994174,
        myr: 200941,
        ngn: 19590205,
        nok: 429639,
        nzd: 70338,
        php: 2385764,
        pkr: 8493451,
        pln: 195415,
        rub: 3521604,
        sar: 179254,
        sats: 100036758,
        sek: 431798,
        sgd: 65168,
        thb: 1593868,
        try: 749266,
        twd: 1328876,
        uah: 1297140,
        usd: 47764,
        vef: 4782.56,
        vnd: 1100232539,
        xag: 2118.31,
        xau: 26.5,
        xdr: 34047,
        xlm: 183366,
        xrp: 58875,
        yfi: 1.924846,
        zar: 760839,
    },
};
