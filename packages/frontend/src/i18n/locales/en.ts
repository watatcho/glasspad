import type { Translation } from '../types';

export const en: Translation = {
  lang: 'en',
  langName: 'English',
  common: {
    title: 'GlassPad — Launch Transparency',
    loading: 'Loading…',
    transparencyNote:
      'All information below comes from the blockchain and can be verified by anyone.',
    copyAddress: 'Copy address',
    copied: 'Copied!',
    languageLabel: 'Language',
  },
  roles: {
    creator: {
      label: 'Creator',
      description: 'The person who launched this memecoin.',
    },
    protocol: {
      label: 'Protocol',
      description: 'The system that enforces the launch rules.',
    },
    burn: {
      label: 'Burn Wallet',
      description:
        'Address where tokens are sent to be permanently removed from circulation.',
    },
    token: {
      label: 'Token',
      description: 'The memecoin itself, a tradable unit.',
    },
    charity: {
      label: 'Charity Wallet',
      description: 'The address that receives the promised donations.',
    },
    liquidityVault: {
      label: 'Liquidity Vault',
      description: 'Tokens set aside so people can buy and sell easily.',
    },
    contributor: {
      label: 'Contributor',
      description: 'A public participant or liquidity provider.',
    },
  },
  sections: {
    addresses: {
      title: 'Addresses',
      description: 'The wallet addresses tied to this launch.',
    },
    parameters: {
      title: 'Launch Parameters',
      description: 'The settings configured by the creator.',
    },
    summary: {
      title: 'Summary',
      description: 'An overview of the launch.',
    },
  },
  params: {
    burnAllocation: {
      label: 'Burn Allocation',
      description: 'The share of tokens sent to the burn wallet.',
    },
    platformFee: {
      label: 'Platform Fee',
      description: 'The share taken by GlassPad on each transaction.',
    },
    charityAllocation: {
      label: 'Charity Allocation',
      description:
        'The share of tokens set aside for a cause chosen by the creator.',
    },
    hardCap: {
      label: 'Maximum Amount Raised',
      description:
        "The most that can be raised during the launch. Once reached, it's over.",
    },
  },
  explain: {
    wallet:
      'A wallet is a digital account that holds tokens. Each wallet has a unique address.',
    address:
      'An address is a string of characters that identifies a wallet on the blockchain, like a bank account number.',
    blockchain:
      'The blockchain is a public ledger that records every transaction. Anyone can read it.',
    burn:
      'Burning tokens means sending them to an address no one controls. They become permanently inaccessible and are removed from circulation.',
    token:
      'A token is a unit of this memecoin that can be bought, sold, or held.',
    fee:
      'Fees are a small amount of tokens taken by the platform on each transaction.',
  },
  status: {
    verified: 'Verified',
    pending: 'Pending',
    unknown: 'Unknown',
  },
};
