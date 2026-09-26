export type Locale = 'fr' | 'en' | 'zh-CN';

export interface LabeledText {
  label: string;
  description: string;
}

export interface SectionText {
  title: string;
  description: string;
}

export interface Translation {
  lang: Locale;
  langName: string;
  common: {
    title: string;
    loading: string;
    transparencyNote: string;
    copyAddress: string;
    copied: string;
    languageLabel: string;
  };
  roles: {
    creator: LabeledText;
    protocol: LabeledText;
    burn: LabeledText;
    token: LabeledText;
    charity: LabeledText;
    liquidityVault: LabeledText;
    contributor: LabeledText;
  };
  sections: {
    addresses: SectionText;
    parameters: SectionText;
    summary: SectionText;
  };
  params: {
    burnAllocation: LabeledText;
    platformFee: LabeledText;
    charityAllocation: LabeledText;
    hardCap: LabeledText;
  };
  explain: {
    wallet: string;
    address: string;
    blockchain: string;
    burn: string;
    token: string;
    fee: string;
  };
  status: {
    verified: string;
    pending: string;
    unknown: string;
  };
}