import React, { useMemo } from 'react';
import styled from 'styled-components';
import { InputError } from '@wallet-components';
import { isDecimalsValid, getInputState } from '@suite-common/wallet-utils';
import { useCoinmarketExchangeFormContext } from '@wallet-hooks/useCoinmarketExchangeForm';
import { Translation, NumberInput } from '@suite-components';
import FiatSelect from './FiatSelect';
import BigNumber from 'bignumber.js';
import { MAX_LENGTH } from '@suite-constants/inputs';
import { CRYPTO_INPUT, FIAT_INPUT } from '@suite/types/wallet/coinmarketExchangeForm';
import { TypedValidationRules } from '@wallet-types/form';

const StyledInput = styled(NumberInput)`
    border-left: 0;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
`;

const FiatInput = () => {
    const {
        control,
        network,
        clearErrors,
        errors,
        trigger,
        updateSendCryptoValue,
        setValue,
        getValues,
    } = useCoinmarketExchangeFormContext();

    const amountError = errors.outputs?.[0]?.amount;
    const fiatError = errors.outputs?.[0]?.fiat;

    const { outputs } = getValues();
    const fiat = outputs?.[0]?.fiat;

    const fiatInputRules = useMemo<TypedValidationRules>(
        () => ({
            validate: (value: any) => {
                if (value) {
                    const amountBig = new BigNumber(value);
                    if (amountBig.isNaN()) {
                        return 'AMOUNT_IS_NOT_NUMBER';
                    }

                    if (!isDecimalsValid(value, 2)) {
                        return (
                            <Translation
                                id="AMOUNT_IS_NOT_IN_RANGE_DECIMALS"
                                values={{ decimals: 2 }}
                            />
                        );
                    }

                    if (amountBig.lte(0)) {
                        return 'AMOUNT_IS_TOO_LOW';
                    }
                }
            },
        }),
        [],
    );

    return (
        <StyledInput
            control={control}
            onFocus={() => {
                trigger([FIAT_INPUT]);
            }}
            onChange={value => {
                setValue('setMaxOutputId', undefined);
                if (fiatError) {
                    setValue(CRYPTO_INPUT, '');
                } else {
                    updateSendCryptoValue(value, network.decimals);
                    clearErrors(FIAT_INPUT);
                }
            }}
            inputState={getInputState(fiatError || amountError, fiat)}
            name={FIAT_INPUT}
            noTopLabel
            maxLength={MAX_LENGTH.AMOUNT}
            rules={fiatInputRules}
            bottomText={<InputError error={fiatError} />}
            innerAddon={<FiatSelect />}
            data-test="@coinmarket/exchange/fiat-input"
        />
    );
};

export default FiatInput;
