import React from 'react';

import { Translation } from '@suite-components';
import * as routerActions from '@suite-actions/routerActions';
import { useActions } from '@suite-hooks';

import { Banner } from './Banner';

const UpdateBridge = () => {
    const { goto } = useActions({
        goto: routerActions.goto,
    });

    return (
        <Banner
            variant="info"
            body={<Translation id="TR_NEW_TREZOR_BRIDGE_IS_AVAILABLE" />}
            action={{
                label: <Translation id="TR_SHOW_DETAILS" />,
                onClick: () => goto('suite-bridge'),
                'data-test': '@notification/update-bridge/button',
            }}
        />
    );
};

export default UpdateBridge;
