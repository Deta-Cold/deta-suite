import React from 'react';
import styled from 'styled-components';
import { CoinLogo, variables } from '@trezor/components';
import { Modal, Translation } from '@suite-components';
import { NETWORKS } from '@wallet-config';
import { NetworkSymbol } from '@suite/types/wallet';
import { CustomBackends } from './components/CustomBackends';

const Section = styled.div`
    display: flex;
    flex-direction: column;
`;

const Heading = styled.div`
    display: flex;
    align-items: center;
    line-height: initial;

    > * + * {
        margin-left: 16px;
    }
`;

const Header = styled.div`
    display: flex;
    flex-direction: column;
`;

const Subheader = styled.span`
    font-size: ${variables.FONT_SIZE.NORMAL};
    font-weight: ${variables.FONT_WEIGHT.MEDIUM};
    color: ${({ theme }) => theme.TYPE_LIGHT_GREY};
`;

interface AdvancedCoinSettingsProps {
    coin: NetworkSymbol;
    onCancel: () => void;
}

export const AdvancedCoinSettings = ({ coin, onCancel }: AdvancedCoinSettingsProps) => {
    const network = NETWORKS.find(network => network.symbol === coin);

    if (!network) {
        return null;
    }

    return (
        <Modal
            isCancelable
            onCancel={onCancel}
            heading={
                <Heading>
                    <CoinLogo symbol={network.symbol} />

                    <Header>
                        <span>{network.name}</span>

                        {network.label && (
                            <Subheader>
                                <Translation id={network.label} />
                            </Subheader>
                        )}
                    </Header>
                </Heading>
            }
        >
            <Section>
                <CustomBackends network={network} onCancel={onCancel} />
            </Section>
        </Modal>
    );
};
