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
