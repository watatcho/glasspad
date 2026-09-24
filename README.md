# GlassPad

> Transparent Solana memecoin launcher with decoded address registry and immutable launch manifests.

## Vision

Unlike opaque launchers and hard-to-read block explorers, GlassPad forces transparency:
- Every address (Creator, Protocol, Charity, Burn Sink, Vault) is labeled and decoded in human language.
- Every launch parameter (`burn_bps`, `charity_bps`, `fee_bps`, `hard_cap`) is frozen in an immutable on-chain `LaunchManifest`.
- Users see exact cash flows and allocations before signing a transaction.

## Architecture

- `packages/contracts`: Solana Anchor program (SPL Token-2022 transfer fee support).
- `packages/core`: AddressRegistry service, token decoding logic, shared types.
- `packages/frontend`: Next.js dashboard, visual cash-flow explorer, launch wizard.
