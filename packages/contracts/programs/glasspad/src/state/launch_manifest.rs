use anchor_lang::prelude::*;

#[account]
#[derive(Default)]
pub struct LaunchManifest {
    /// Createur du token
    pub creator: Pubkey,
    /// Adresse du mint (Token-2022)
    pub mint: Pubkey,
    /// Vault sequestrant les fonds SOL collectes
    pub sol_vault: Pubkey,
    /// Wallet de reversement des frais protocole
    pub protocol_fee_wallet: Pubkey,
    /// Wallet dedie aux dons caritatifs declares
    pub charity_wallet: Pubkey,

    /// Pourcentage brule a l'emission (en basis points: 100 bps = 1%)
    pub burn_bps: u16,
    /// Pourcentage reserve aux dons caritatifs
    pub charity_bps: u16,
    /// Frais plateforme fixes a la creation
    pub protocol_fee_bps: u16,
    /// Allocation reservee au createur/dev
    pub dev_allocation_bps: u16,

    /// Objectif minimum en lamports
    pub min_raise_lamports: u64,
    /// Plafond maximal en lamports
    pub hard_cap_lamports: u64,
    /// Montant total collecte actuellement
    pub total_raised_lamports: u64,

    /// Timestamp UNIX du debut de la souscription
    pub starts_at: i64,
    /// Timestamp UNIX de fin de souscription
    pub ends_at: i64,

    /// Drapeau d'immuabilite absolue (bloque toute modif apres init)
    pub is_frozen: bool,
    /// Statut final (0: En cours, 1: Succes/Seeded, 2: Echec/Remboursement)
    pub status: u8,
    /// Bump seed PDA
    pub bump: u8,
}

impl LaunchManifest {
    pub const LEN: usize = 8   // discriminator Anchor
        + 32                    // creator
        + 32                    // mint
        + 32                    // sol_vault
        + 32                    // protocol_fee_wallet
        + 32                    // charity_wallet
        + 2                     // burn_bps
        + 2                     // charity_bps
        + 2                     // protocol_fee_bps
        + 2                     // dev_allocation_bps
        + 8                     // min_raise_lamports
        + 8                     // hard_cap_lamports
        + 8                     // total_raised_lamports
        + 8                     // starts_at
        + 8                     // ends_at
        + 1                     // is_frozen
        + 1                     // status
        + 1;                    // bump
}
