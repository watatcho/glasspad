warning: in the working copy of 'packages/frontend/next.config.ts', LF will be replaced by CRLF the next time Git touches it
[1mdiff --git a/packages/frontend/next.config.ts b/packages/frontend/next.config.ts[m
[1mindex 9e00c11..7fe15f8 100644[m
[1m--- a/packages/frontend/next.config.ts[m
[1m+++ b/packages/frontend/next.config.ts[m
[36m@@ -4,6 +4,7 @@[m [mconst nextConfig: NextConfig = {[m
   turbopack: {[m
     root: __dirname,[m
   },[m
[32m+[m[32m  transpilePackages: ["@glasspad/core"],[m
 };[m
 [m
 export default nextConfig;[m
\ No newline at end of file[m
[1mdiff --git a/setup.ps1 b/setup.ps1[m
[1mindex 0ba804e..14f4345 100644[m
[1m--- a/setup.ps1[m
[1m+++ b/setup.ps1[m
[36m@@ -1,160 +1,116 @@[m
[31m-# GlassPad - setup.ps1 : cree les dossiers, le README et le service AddressRegistry[m
[31m-# (ASCII uniquement, compatible Windows PowerShell 5.1)[m
[31m-[m
[31m-# 1) Nettoyage d'un eventuel collage precedent[m
[31m-Remove-Item packages -Recurse -Force -ErrorAction SilentlyContinue[m
[31m-[m
[31m-# 2) Arborescence (mkdir -p n'existe pas en PowerShell 5.1, on utilise New-Item)[m
[31m-New-Item -ItemType Directory -Force -Path packages\core\src, packages\frontend\src, packages\contracts | Out-Null[m
[31m-[m
[31m-# 3) README.md[m
[31m-@'[m
[31m-# GlassPad[m
[31m-[m
[31m-> Transparent Solana memecoin launcher with decoded address registry and immutable launch manifests.[m
[31m-[m
[31m-## Vision[m
[31m-[m
[31m-Unlike opaque launchers and hard-to-read block explorers, GlassPad forces transparency:[m
[31m-- Every address (Creator, Protocol, Charity, Burn Sink, Vault) is labeled and decoded in human language.[m
[31m-- Every launch parameter (`burn_bps`, `charity_bps`, `fee_bps`, `hard_cap`) is frozen in an immutable on-chain `LaunchManifest`.[m
[31m-- Users see exact cash flows and allocations before signing a transaction.[m
[31m-[m
[31m-## Architecture[m
[31m-[m
[31m-- `packages/contracts`: Solana Anchor program (SPL Token-2022 transfer fee support).[m
[31m-- `packages/core`: AddressRegistry service, token decoding logic, shared types.[m
[31m-- `packages/frontend`: Next.js dashboard, visual cash-flow explorer, launch wizard.[m
[31m-'@ | Out-File -Encoding utf8 README.md[m
[31m-[m
[31m-# 4) AddressRegistry (coeur de la valeur UX : decoder chaque adresse en role lisible)[m
[31m-@'[m
[31m-export type AddressRole =[m
[31m-  | 'CREATOR'[m
[31m-  | 'PROTOCOL_TREASURY'[m
[31m-  | 'CHARITY_RESERVE'[m
[31m-  | 'LIQUIDITY_VAULT'[m
[31m-  | 'BURN_SINK'[m
[31m-  | 'MINT_TOKEN'[m
[31m-  | 'CONTRIBUTOR';[m
[31m-[m
[31m-export interface DecodedAddress {[m
[31m-  address: string;[m
[31m-  role: AddressRole;[m
[31m-  label: string;[m
[31m-  description: string;[m
[31m-  isImmutable: boolean;[m
[31m-  badgeColor: string;[m
[32m+[m[32m# 0. Gardfou : Node.js requis[m
[32m+[m[32mif (-not (Get-Command node -ErrorAction SilentlyContinue)) { Write-Host "Node.js manquant - installez Node 20+ depuis nodejs.org"; exit 1 }[m
[32m+[m
[32m+[m[32m# 1. Nettoyage du src vide + scaffold Next.js[m
[32m+[m[32mRemove-Item .\packages\frontend\src -Recurse -Force -ErrorAction SilentlyContinue[m
[32m+[m[32mnpx --yes create-next-app@latest packages/frontend --ts --eslint --tailwind --app --src-dir --turbopack --import-alias "@/*" --use-npm --yes[m
[32m+[m
[32m+[m[32m# 2. Dependencies Solana (legacy-peer-deps : evite les conflits de peer deps avec React 19)[m
[32m+[m[32mSet-Location .\packages\frontend[m
[32m+[m[32mnpm install @solana/web3.js @solana/wallet-adapter-base @solana/wallet-adapter-react @solana/wallet-adapter-react-ui --legacy-peer-deps[m
[32m+[m
[32m+[m[32m# 3. Providers Solana (devnet)[m
[32m+[m[32m$providersContent = @'[m
[32m+[m[32m"use client";[m
[32m+[m
[32m+[m[32mimport { useMemo } from "react";[m
[32m+[m[32mimport { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";[m
[32m+[m[32mimport { WalletAdapterNetwork } from "@solana/wallet-adapter-base";[m
[32m+[m[32mimport { WalletModalProvider } from "@solana/wallet-adapter-react-ui";[m
[32m+[m[32mimport { clusterApiUrl } from "@solana/web3.js";[m
[32m+[m
[32m+[m[32mexport function Providers({ children }: { children: React.ReactNode }) {[m
[32m+[m[32m  const network = WalletAdapterNetwork.Devnet;[m
[32m+[m[32m  const endpoint = useMemo(() => clusterApiUrl(network), [network]);[m
[32m+[m
[32m+[m[32m  return ([m
[32m+[m[32m    <ConnectionProvider endpoint={endpoint}>[m
[32m+[m[32m      <WalletProvider wallets={[]} autoConnect>[m
[32m+[m[32m        <WalletModalProvider>{children}</WalletModalProvider>[m
[32m+[m[32m      </WalletProvider>[m
[32m+[m[32m    </ConnectionProvider>[m
[32m+[m[32m  );[m
 }[m
[31m-[m
[31m-export interface LaunchManifestSummary {[m
[31m-  manifestAddress: string;[m
[31m-  mint: string;[m
[31m-  creator: string;[m
[31m-  protocolTreasury: string;[m
[31m-  charityWallet?: string;[m
[31m-  vault: string;[m
[31m-  burnSink: string;[m
[31m-  burnBps: number;[m
[31m-  charityBps: number;[m
[31m-  protocolFeeBps: number;[m
[31m-  hardCapLamports: number;[m
[32m+[m[32m'@[m
[32m+[m[32mSet-Content -Path ".\src\app\providers.tsx" -Value $providersContent -Encoding utf8[m
[32m+[m
[32m+[m[32m# 4. Layout racine avec les styles du wallet adapter[m
[32m+[m[32m$layoutContent = @'[m
[32m+[m[32mimport type { Metadata } from "next";[m
[32m+[m[32mimport "./globals.css";[m
[32m+[m[32mimport "@solana/wallet-adapter-react-ui/styles.css";[m
[32m+[m[32mimport { Providers } from "./providers";[m
[32m+[m
[32m+[m[32mexport const metadata: Metadata = {[m
[32m+[m[32m  title: "GlassPad",[m
[32m+[m[32m  description: "Launchpad memecoin transparent sur Solana",[m
[32m+[m[32m};[m
[32m+[m
[32m+[m[32mexport default function RootLayout({ children }: { children: React.ReactNode }) {[m
[32m+[m[32m  return ([m
[32m+[m[32m    <html lang="fr">[m
[32m+[m[32m      <body>[m
[32m+[m[32m        <Providers>{children}</Providers>[m
[32m+[m[32m      </body>[m
[32m+[m[32m    </html>[m
[32m+[m[32m  );[m
 }[m
[31m-[m
[31m-export class AddressRegistry {[m
[31m-  private registry: Map<string, DecodedAddress> = new Map();[m
[31m-[m
[31m-  constructor(manifest?: LaunchManifestSummary) {[m
[31m-    if (manifest) {[m
[31m-      this.registerManifest(manifest);[m
[31m-    }[m
[31m-  }[m
[31m-[m
[31m-  public registerManifest(manifest: LaunchManifestSummary): void {[m
[31m-    this.register({[m
[31m-      address: manifest.creator,[m
[31m-      role: 'CREATOR',[m
[31m-      label: 'Token Creator',[m
[31m-      description: 'Wallet that initialized this memecoin launch. No administrative backdoors.',[m
[31m-      isImmutable: true,[m
[31m-      badgeColor: '#F59E0B',[m
[31m-    });[m
[31m-[m
[31m-    this.register({[m
[31m-      address: manifest.protocolTreasury,[m
[31m-      role: 'PROTOCOL_TREASURY',[m
[31m-      label: 'GlassPad Treasury',[m
[31m-      description: `Protocol fee recipient (${(manifest.protocolFeeBps / 100).toFixed(2)}%).`,[m
[31m-      isImmutable: true,[m
[31m-      badgeColor: '#3B82F6',[m
[31m-    });[m
[31m-[m
[31m-    if (manifest.charityWallet && manifest.charityBps > 0) {[m
[31m-      this.register({[m
[31m-        address: manifest.charityWallet,[m
[31m-        role: 'CHARITY_RESERVE',[m
[31m-        label: 'Verified Charity',[m
[31m-        description: `Dedicated charitable cause allocation (${(manifest.charityBps / 100).toFixed(2)}%).`,[m
[31m-        isImmutable: true,[m
[31m-        badgeColor: '#10B981',[m
[31m-      });[m
[31m-    }[m
[31m-[m
[31m-    this.register({[m
[31m-      address: manifest.vault,[m
[31m-      role: 'LIQUIDITY_VAULT',[m
[31m-      label: 'Launch Vault (PDA)',[m
[31m-      description: 'Program-derived vault holding deposited SOL during raise phase.',[m
[31m-      isImmutable: true,[m
[31m-      badgeColor: '#8B5CF6',[m
[31m-    });[m
[31m-[m
[31m-    this.register({[m
[31m-      address: manifest.burnSink,[m
[31m-      role: 'BURN_SINK',[m
[31m-      label: 'Burn Address / Incinerator',[m
[31m-      description: 'Unrecoverable address where burned tokens are permanently removed from supply.',[m
[31m-      isImmutable: true,[m
[31m-      badgeColor: '#EF4444',[m
[31m-    });[m
[31m-[m
[31m-    this.register({[m
[31m-      address: manifest.mint,[m
[31m-      role: 'MINT_TOKEN',[m
[31m-      label: 'SPL Token Mint',[m
[31m-      description: 'The native token mint contract governed by this manifest.',[m
[31m-      isImmutable: true,[m
[31m-      badgeColor: '#06B6D4',[m
[31m-    });[m
[31m-  }[m
[31m-[m
[31m-  public register(info: DecodedAddress): void {[m
[31m-    this.registry.set(info.address, info);[m
[31m-  }[m
[31m-[m
[31m-  public resolve(address: string): DecodedAddress {[m
[31m-    const existing = this.registry.get(address);[m
[31m-    if (existing) {[m
[31m-      return existing;[m
[31m-    }[m
[31m-[m
[31m-    return {[m
[31m-      address,[m
[31m-      role: 'CONTRIBUTOR',[m
[31m-      label: `${address.slice(0, 4)}...${address.slice(-4)}`,[m
[31m-      description: 'Public community participant or liquidity contributor.',[m
[31m-      isImmutable: false,[m
[31m-      badgeColor: '#6B7280',[m
[31m-    };[m
[31m-  }[m
[31m-[m
[31m-  public getAll(): DecodedAddress[] {[m
[31m-    return Array.from(this.registry.values());[m
[31m-  }[m
[32m+[m[32m'@[m
[32m+[m[32mSet-Content -Path ".\src\app\layout.tsx" -Value $layoutContent -Encoding utf8[m
[32m+[m
[32m+[m[32m# 5. Page d'accueil du dashboard[m
[32m+[m[32m$pageContent = @'[m
[32m+[m[32m"use client";[m
[32m+[m
[32m+[m[32mimport { WalletMultiButton } from "@solana/wallet-adapter-react-ui";[m
[32m+[m
[32m+[m[32mconst pillars = [[m
[32m+[m[32m  {[m
[32m+[m[32m    title: "Wallets etiquetes",[m
[32m+[m[32m    desc: "Creator, burn sink, charity, treasury : chaque adresse a un nom lisible.",[m
[32m+[m[32m  },[m
[32m+[m[32m  {[m
[32m+[m[32m    title: "Parametres immuables",[m
[32m+[m[32m    desc: "Burn, fees et allocations figes on-chain dans le LaunchManifest.",[m
[32m+[m[32m  },[m
[32m+[m[32m  {[m
[32m+[m[32m    title: "Flux financiers clairs",[m
[32m+[m[32m    desc: "Chaque transaction est decomposee : qui recoit quoi, et pourquoi.",[m
[32m+[m[32m  },[m
[32m+[m[32m];[m
[32m+[m
[32m+[m[32mexport default function Home() {[m
[32m+[m[32m  return ([m
[32m+[m[32m    <main className="min-h-screen bg-gray-950 text-gray-100">[m
[32m+[m[32m      <header className="flex items-center justify-between border-b border-gray-800 px-6 py-4">[m
[32m+[m[32m        <span className="text-xl font-bold tracking-tight">GlassPad</span>[m
[32m+[m[32m        <WalletMultiButton />[m
[32m+[m[32m      </header>[m
[32m+[m
[32m+[m[32m      <section className="mx-auto max-w-5xl px-6 py-16">[m
[32m+[m[32m        <h2 className="text-3xl font-semibold">[m
[32m+[m[32m          Le launchpad memecoin ou rien nest cache[m
[32m+[m[32m        </h2>[m
[32m+[m[32m        <p className="mt-4 max-w-2xl text-gray-400">[m
[32m+[m[32m          Burn, charite, frais de protocole, wallets dedies : tout est configure[m
[32m+[m[32m          par le createur, affiche publiquement et fige on-chain.[m
[32m+[m[32m        </p>[m
[32m+[m
[32m+[m[32m        <div className="mt-12 grid gap-4 md:grid-cols-3">[m
[32m+[m[32m          {pillars.map((p) => ([m
[32m+[m[32m            <div key={p.title} className="rounded-xl border border-gray-800 bg-gray-900 p-6">[m
[32m+[m[32m              <h3 className="font-semibold">{p.title}</h3>[m
[32m+[m[32m              <p className="mt-2 text-sm text-gray-400">{p.desc}</p>[m
[32m+[m[32m            </div>[m
[32m+[m[32m          ))}[m
[32m+[m[32m        </div>[m
[32m+[m[32m      </section>[m
[32m+[m[32m    </main>[m
[32m+[m[32m  );[m
 }[m
[31m-'@ | Out-File -Encoding utf8 packages\core\src\addressRegistry.ts[m
[32m+[m[32m'@[m
[32m+[m[32mSet-Content -Path ".\src\app\page.tsx" -Value $pageContent -Encoding utf8[m
 [m
[31m-Write-Host ""[m
[31m-Write-Host "=== Verification ===" -ForegroundColor Cyan[m
[31m-Get-Item README.md, packages\core\src\addressRegistry.ts | Format-Table FullName, Length[m
[31m-Write-Host "Workspace pret." -ForegroundColor Green[m
\ No newline at end of file[m
[32m+[m[32m# 6. Build de verification[m
[32m+[m[32mnpm run build[m
[32m+[m[32mSet-Location ..[m
\ No newline at end of file[m
