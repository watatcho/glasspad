export type AddressRole =
  | 'CREATOR'
  | 'PROTOCOL_TREASURY'
  | 'CHARITY_RESERVE'
  | 'LIQUIDITY_VAULT'
  | 'BURN_SINK'
  | 'MINT_TOKEN'
  | 'CONTRIBUTOR';

export interface DecodedAddress {
  address: string;
  role: AddressRole;
  label: string;
  description: string;
  isImmutable: boolean;
  badgeColor: string;
}

export interface LaunchManifestSummary {
  manifestAddress: string;
  mint: string;
  creator: string;
  protocolTreasury: string;
  charityWallet?: string;
  vault: string;
  burnSink: string;
  burnBps: number;
  charityBps: number;
  protocolFeeBps: number;
  hardCapLamports: number;
}

export class AddressRegistry {
  private registry: Map<string, DecodedAddress> = new Map();

  constructor(manifest?: LaunchManifestSummary) {
    if (manifest) {
      this.registerManifest(manifest);
    }
  }

  public registerManifest(manifest: LaunchManifestSummary): void {
    this.register({
      address: manifest.creator,
      role: 'CREATOR',
      label: 'Token Creator',
      description: 'Wallet that initialized this memecoin launch. No administrative backdoors.',
      isImmutable: true,
      badgeColor: '#F59E0B',
    });

    this.register({
      address: manifest.protocolTreasury,
      role: 'PROTOCOL_TREASURY',
      label: 'GlassPad Treasury',
      description: `Protocol fee recipient (${(manifest.protocolFeeBps / 100).toFixed(2)}%).`,
      isImmutable: true,
      badgeColor: '#3B82F6',
    });

    if (manifest.charityWallet && manifest.charityBps > 0) {
      this.register({
        address: manifest.charityWallet,
        role: 'CHARITY_RESERVE',
        label: 'Verified Charity',
        description: `Dedicated charitable cause allocation (${(manifest.charityBps / 100).toFixed(2)}%).`,
        isImmutable: true,
        badgeColor: '#10B981',
      });
    }

    this.register({
      address: manifest.vault,
      role: 'LIQUIDITY_VAULT',
      label: 'Launch Vault (PDA)',
      description: 'Program-derived vault holding deposited SOL during raise phase.',
      isImmutable: true,
      badgeColor: '#8B5CF6',
    });

    this.register({
      address: manifest.burnSink,
      role: 'BURN_SINK',
      label: 'Burn Address / Incinerator',
      description: 'Unrecoverable address where burned tokens are permanently removed from supply.',
      isImmutable: true,
      badgeColor: '#EF4444',
    });

    this.register({
      address: manifest.mint,
      role: 'MINT_TOKEN',
      label: 'SPL Token Mint',
      description: 'The native token mint contract governed by this manifest.',
      isImmutable: true,
      badgeColor: '#06B6D4',
    });
  }

  public register(info: DecodedAddress): void {
    this.registry.set(info.address, info);
  }

  public resolve(address: string): DecodedAddress {
    const existing = this.registry.get(address);
    if (existing) {
      return existing;
    }

    return {
      address,
      role: 'CONTRIBUTOR',
      label: `${address.slice(0, 4)}...${address.slice(-4)}`,
      description: 'Public community participant or liquidity contributor.',
      isImmutable: false,
      badgeColor: '#6B7280',
    };
  }

  public getAll(): DecodedAddress[] {
    return Array.from(this.registry.values());
  }
}
