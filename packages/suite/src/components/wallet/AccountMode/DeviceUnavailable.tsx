import React from 'react';
import { useDevice, useActions } from '@suite-hooks';
import * as deviceSettingsActions from '@settings-actions/deviceSettingsActions';
import { NotificationCard, Translation } from '@suite-components';

const DeviceUnavailable = () => {
    const { device, isLocked } = useDevice();
    const { applySettings } = useActions({
        applySettings: deviceSettingsActions.applySettings,
    });

    if (!device?.connected || device.available) return null;

    return (
        <NotificationCard
            variant="info"
            button={{
                children: <Translation id="TR_ACCOUNT_ENABLE_PASSPHRASE" />,
                isLoading: isLocked(),
                onClick: () => applySettings({ use_passphrase: true }),
            }}
        >
            <Translation id="TR_ACCOUNT_PASSPHRASE_DISABLED" />
        </NotificationCard>
    );
};

export default DeviceUnavailable;
