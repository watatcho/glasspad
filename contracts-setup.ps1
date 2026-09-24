# contracts-setup.ps1 - initialisation du package Anchor

# 1. Structure de dossiers
$baseDir = "packages\contracts"
New-Item -ItemType Directory -Force -Path "$baseDir\programs\glasspad\src\state" | Out-Null
New-Item -ItemType Directory -Force -Path "$baseDir\programs\glasspad\src\instructions" | Out-Null

# 2. Anchor.toml
@"
[toolchain]
anchor_version = "0.30.1"

[features]
resolution = true
skip-lint = false

[programs.localnet]
glasspad = "GLASSpad11111111111111111111111111111111111"

[programs.devnet]
glasspad = "GLASSpad11111111111111111111111111111111111"

[registry]
url = "https://api.apr.dev"

[provider]
cluster = "devnet"
wallet = "~/.config/solana/id.json"

[scripts]
test = "yarn run ts-mocha -p ./tsconfig.json -t 1000000 tests/**/*.ts"
"@ | Set-Content -Path "$baseDir\Anchor.toml" -Encoding UTF8

# 3. Cargo.toml (racine du workspace Anchor)
@"
[workspace]
members = [
    "programs/*"
]
resolver = "2"

[profile.release]
overflow-checks = true
lto = "fat"
codegen-units = 1
"@ | Set-Content -Path "$baseDir\Cargo.toml" -Encoding UTF8

# 4. Cargo.toml du programme glasspad
@"
[package]
name = "glasspad"
version = "0.1.0"
description = "Transparent Solana memecoin launcher"
edition = "2021"

[lib]
crate-type = ["cdylib", "lib"]
name = "glasspad"

[features]
no-entrypoint = []
no-idl = []
no-log-ix-name = []
cpi = ["no-entrypoint"]
default = []

[dependencies]
anchor-lang = "0.30.1"
anchor-spl = "0.30.1"
solana-program = "=1.18.26"
"@ | Set-Content -Path "$baseDir\programs\glasspad\Cargo.toml" -Encoding UTF8

# 5. errors.rs
@"
use anchor_lang::prelude::*;

#[error_code]
pub enum GlasspadError {
    #[msg("Total allocation basis points exceeds 10,000 (100%)")]
    AllocationExceedsLimit,

    #[msg("Platform fee exceeds allowed maximum (1,000 bps / 10%)")]
    PlatformFeeTooHigh,

    #[msg("Burn allocation exceeds allowed maximum (5,000 bps / 50%)")]
    BurnExceedsLimit,

    #[msg("Minimum raise must be lower than or equal to hard cap")]
    InvalidRaiseTargets,

    #[msg("Launch duration must be between 1 hour and 14 days")]
    InvalidDuration,

    #[msg("Launch manifest is frozen and immutable")]
    ManifestFrozen,
}
"@ | Set-Content -Path "$baseDir\programs\glasspad\src\errors.rs" -Encoding UTF8

# 6. state/launch_manifest.rs
@"
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
"@ | Set-Content -Path "$baseDir\programs\glasspad\src\state\launch_manifest.rs" -Encoding UTF8

# 7. state/mod.rs
@"
pub mod launch_manifest;
pub use launch_manifest::*;
"@ | Set-Content -Path "$baseDir\programs\glasspad\src\state\mod.rs" -Encoding UTF8

# 8. lib.rs
@"
use anchor_lang::prelude::*;

pub mod errors;
pub mod state;

use errors::GlasspadError;
use state::*;

declare_id!("GLASSpad11111111111111111111111111111111111");

#[program]
pub mod glasspad {
    use super::*;

    pub fn initialize_manifest(
        ctx: Context<InitializeManifest>,
        burn_bps: u16,
        charity_bps: u16,
        protocol_fee_bps: u16,
        dev_allocation_bps: u16,
        min_raise_lamports: u64,
        hard_cap_lamports: u64,
        duration_seconds: i64,
    ) -> Result<()> {
        // Garde-fous d'integrite (anti-rug transparent)
        require!(
            (burn_bps + charity_bps + protocol_fee_bps + dev_allocation_bps) <= 10_000,
            GlasspadError::AllocationExceedsLimit
        );
        require!(protocol_fee_bps <= 1_000, GlasspadError::PlatformFeeTooHigh);
        require!(burn_bps <= 5_000, GlasspadError::BurnExceedsLimit);
        require!(min_raise_lamports <= hard_cap_lamports, GlasspadError::InvalidRaiseTargets);
        require!(
            duration_seconds >= 3600 && duration_seconds <= 14 * 86400,
            GlasspadError::InvalidDuration
        );

        let clock = Clock::get()?;
        let manifest = &mut ctx.accounts.manifest;

        manifest.creator = ctx.accounts.creator.key();
        manifest.mint = ctx.accounts.mint.key();
        manifest.sol_vault = ctx.accounts.sol_vault.key();
        manifest.protocol_fee_wallet = ctx.accounts.protocol_fee_wallet.key();
        manifest.charity_wallet = ctx.accounts.charity_wallet.key();

        manifest.burn_bps = burn_bps;
        manifest.charity_bps = charity_bps;
        manifest.protocol_fee_bps = protocol_fee_bps;
        manifest.dev_allocation_bps = dev_allocation_bps;

        manifest.min_raise_lamports = min_raise_lamports;
        manifest.hard_cap_lamports = hard_cap_lamports;
        manifest.total_raised_lamports = 0;

        manifest.starts_at = clock.unix_timestamp;
        manifest.ends_at = clock.unix_timestamp + duration_seconds;

        manifest.is_frozen = true;
        manifest.status = 0;
        manifest.bump = ctx.bumps.manifest;

        msg!("Glasspad: LaunchManifest immutablement grave pour {}", manifest.mint);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeManifest<'info> {
    #[account(
        init,
        payer = creator,
        space = LaunchManifest::LEN,
        seeds = [b"manifest", mint.key().as_ref()],
        bump
    )]
    pub manifest: Account<'info, LaunchManifest>,

    /// CHECK: Mint Token-2022 associe
    pub mint: AccountInfo<'info>,

    /// CHECK: Vault SOL cree pour sequestrer les fonds
    #[account(
        seeds = [b"sol_vault", manifest.key().as_ref()],
        bump
    )]
    pub sol_vault: AccountInfo<'info>,

    /// CHECK: Wallet de tresorerie du protocole
    pub protocol_fee_wallet: AccountInfo<'info>,

    /// CHECK: Wallet caritatif specifie par le createur
    pub charity_wallet: AccountInfo<'info>,

    #[account(mut)]
    pub creator: Signer<'info>,

    pub system_program: Program<'info, System>,
}
"@ | Set-Content -Path "$baseDir\programs\glasspad\src\lib.rs" -Encoding UTF8

Write-Host "Scaffold Anchor cree avec succes dans packages/contracts !" -ForegroundColor Green