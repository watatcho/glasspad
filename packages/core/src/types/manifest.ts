import { PublicKey } from "@solana/web3.js";

/**
 * Constantes et bornes de securite pour GlassPad (en Basis Points : 100 bps = 1%)
 */
export const MANIFEST_CONSTRAINTS = {
  MAX_BPS: 10_000,
  MAX_DEV_ALLOCATION_BPS: 1_500,  // Max 15% pour le createur (anti-dump)
  MAX_PROTOCOL_FEE_BPS: 500,      // Max 5% pour la plateforme
  MIN_BURN_BPS: 0,
  MAX_BURN_BPS: 2_000,            // Max 20% de burn automatique
} as const;

export interface LaunchManifestOnChain {
  creator: PublicKey;
  mint: PublicKey;
  vault: PublicKey;
  charityWallet: PublicKey;
  protocolFeeWallet: PublicKey;
  burnBps: number;
  charityBps: number;
  protocolFeeBps: number;
  devAllocationBps: number;
  hardCapLamports: bigint;
  minRaiseLamports: bigint;
  durationSeconds: bigint;
  createdAt: bigint;
  isFinalized: boolean;
}

export interface LaunchManifestInput {
  creator: string;
  charityWallet: string;
  protocolFeeWallet: string;
  burnBps: number;
  charityBps: number;
  protocolFeeBps: number;
  devAllocationBps: number;
  hardCapSol: number;
  minRaiseSol: number;
  durationHours: number;
}

export interface ManifestValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Valide les parametres de creation avant l'envoi de la transaction Anchor
 */
export function validateLaunchManifest(input: LaunchManifestInput): ManifestValidationResult {
  const errors: string[] = [];

  const totalAllocatedBps = input.burnBps + input.charityBps + input.protocolFeeBps + input.devAllocationBps;
  if (totalAllocatedBps > MANIFEST_CONSTRAINTS.MAX_BPS) {
    errors.push(`Le total des allocations (${totalAllocatedBps} bps) depasse le maximum autorise de 10 000 bps (100%).`);
  }

  if (input.devAllocationBps > MANIFEST_CONSTRAINTS.MAX_DEV_ALLOCATION_BPS) {
    errors.push(`L'allocation createur (${input.devAllocationBps} bps) depasse le plafond de securite de ${MANIFEST_CONSTRAINTS.MAX_DEV_ALLOCATION_BPS} bps (15%).`);
  }

  if (input.protocolFeeBps > MANIFEST_CONSTRAINTS.MAX_PROTOCOL_FEE_BPS) {
    errors.push(`Les frais de protocole (${input.protocolFeeBps} bps) depassent le plafond de ${MANIFEST_CONSTRAINTS.MAX_PROTOCOL_FEE_BPS} bps (5%).`);
  }

  if (input.hardCapSol <= 0) {
    errors.push("Le Hard Cap doit etre strictement superieur a 0 SOL.");
  }

  if (input.minRaiseSol > input.hardCapSol) {
    errors.push("Le seuil minimal (Min Raise) ne peut pas etre superieur au Hard Cap.");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
