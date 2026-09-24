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
