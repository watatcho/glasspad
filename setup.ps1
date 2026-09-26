# 0. Gardfou : Node.js requis
if (-not (Get-Command node -ErrorAction SilentlyContinue)) { Write-Host "Node.js manquant - installez Node 20+ depuis nodejs.org"; exit 1 }

# 1. Nettoyage du src vide + scaffold Next.js
Remove-Item .\packages\frontend\src -Recurse -Force -ErrorAction SilentlyContinue
npx --yes create-next-app@latest packages/frontend --ts --eslint --tailwind --app --src-dir --turbopack --import-alias "@/*" --use-npm --yes

# 2. Dependencies Solana (legacy-peer-deps : evite les conflits de peer deps avec React 19)
Set-Location .\packages\frontend
npm install @solana/web3.js @solana/wallet-adapter-base @solana/wallet-adapter-react @solana/wallet-adapter-react-ui --legacy-peer-deps

# 3. Providers Solana (devnet)
$providersContent = @'
"use client";

import { useMemo } from "react";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";

export function Providers({ children }: { children: React.ReactNode }) {
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={[]} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
'@
Set-Content -Path ".\src\app\providers.tsx" -Value $providersContent -Encoding utf8

# 4. Layout racine avec les styles du wallet adapter
$layoutContent = @'
import type { Metadata } from "next";
import "./globals.css";
import "@solana/wallet-adapter-react-ui/styles.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "GlassPad",
  description: "Launchpad memecoin transparent sur Solana",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
'@
Set-Content -Path ".\src\app\layout.tsx" -Value $layoutContent -Encoding utf8

# 5. Page d'accueil du dashboard
$pageContent = @'
"use client";

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

const pillars = [
  {
    title: "Wallets etiquetes",
    desc: "Creator, burn sink, charity, treasury : chaque adresse a un nom lisible.",
  },
  {
    title: "Parametres immuables",
    desc: "Burn, fees et allocations figes on-chain dans le LaunchManifest.",
  },
  {
    title: "Flux financiers clairs",
    desc: "Chaque transaction est decomposee : qui recoit quoi, et pourquoi.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-950 text-gray-100">
      <header className="flex items-center justify-between border-b border-gray-800 px-6 py-4">
        <span className="text-xl font-bold tracking-tight">GlassPad</span>
        <WalletMultiButton />
      </header>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="text-3xl font-semibold">
          Le launchpad memecoin ou rien nest cache
        </h2>
        <p className="mt-4 max-w-2xl text-gray-400">
          Burn, charite, frais de protocole, wallets dedies : tout est configure
          par le createur, affiche publiquement et fige on-chain.
        </p>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {pillars.map((p) => (
            <div key={p.title} className="rounded-xl border border-gray-800 bg-gray-900 p-6">
              <h3 className="font-semibold">{p.title}</h3>
              <p className="mt-2 text-sm text-gray-400">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
'@
Set-Content -Path ".\src\app\page.tsx" -Value $pageContent -Encoding utf8

# 6. Build de verification
npm run build
Set-Location ..