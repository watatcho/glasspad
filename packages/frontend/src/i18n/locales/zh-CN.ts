import type { Translation } from '../types';

export const zhCN: Translation = {
  lang: 'zh-CN',
  langName: '简体中文',
  common: {
    title: 'GlassPad — 发布透明度',
    loading: '加载中…',
    transparencyNote: '以下所有信息均来自区块链，任何人都可以验证。',
    copyAddress: '复制地址',
    copied: '已复制！',
    languageLabel: '语言',
  },
  roles: {
    creator: {
      label: '创建者',
      description: '发起这个 memecoin 的人。',
    },
    protocol: {
      label: '协议',
      description: '执行发布规则的系统。',
    },
    burn: {
      label: '销毁钱包',
      description: '代币被发送到此处，永久从流通中移除。',
    },
    token: {
      label: '代币',
      description: '这个 memecoin 本身，可交易的单位。',
    },
    charity: {
      label: '慈善钱包',
      description: '接收创建者承诺捐款的地址。',
    },
    liquidityVault: {
      label: '流动性金库',
      description: '预留的代币，方便人们买卖。',
    },
    contributor: {
      label: '贡献者',
      description: '公共参与者或流动性提供者。',
    },
  },
  sections: {
    addresses: {
      title: '地址',
      description: '与此发布相关的钱包地址。',
    },
    parameters: {
      title: '发布参数',
      description: '创建者配置的设置。',
    },
    summary: {
      title: '概览',
      description: '发布的整体情况。',
    },
  },
  params: {
    burnAllocation: {
      label: '销毁分配',
      description: '发送到销毁钱包的代币比例。',
    },
    platformFee: {
      label: '平台费用',
      description: 'GlassPad 在每笔交易中收取的比例。',
    },
    charityAllocation: {
      label: '慈善分配',
      description: '为创建者选择的事业保留的代币比例。',
    },
    hardCap: {
      label: '最大募集金额',
      description: '发布期间可以筹集的最高金额。达到后即结束。',
    },
  },
  explain: {
    wallet: '钱包是存放代币的数字账户，每个钱包都有一个唯一的地址。',
    address: '地址是一串字符，用于在区块链上识别一个钱包，就像银行账号一样。',
    blockchain: '区块链是一个公共账本，记录所有交易，任何人都可以查看。',
    burn: '销毁代币意味着将它们发送到一个无人控制的地址，使其永久无法访问并从流通中移除。',
    token: '代币是这个 memecoin 的单位，可以买卖或持有。',
    fee: '费用是平台在每笔交易中收取的少量代币。',
  },
  status: {
    verified: '已验证',
    pending: '待确认',
    unknown: '未知',
  },
};
