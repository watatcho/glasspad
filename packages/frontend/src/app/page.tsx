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
