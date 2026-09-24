"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import "@solana/wallet-adapter-react-ui/styles.css";

// ---- Données de démonstration (seront remplacées par @glasspad/core) ----

type RoleCouleur = "violet" | "vert" | "bleu" | "orange" | "rouge" | "gris";

interface AdresseDecodee {
  role: string;
  etiquette: string;
  description: string;
  adresse: string;
  immuable: boolean;
  couleur: RoleCouleur;
}

const DEMO_ADRESSES: AdresseDecodee[] = [
  {
    role: "CREATOR",
    etiquette: "CREATEUR",
    description: "Portefeuille du créateur du memecoin",
    adresse: "CREA7tXk9mQ2vNpLd8wYzF4bHj6rTuE3sGnAqW5cPzVb",
    immuable: true,
    couleur: "violet",
  },
  {
    role: "MINT_TOKEN",
    etiquette: "TOKEN",
    description: "Adresse du token SPL (frappe/brûlage)",
    adresse: "TOKN9mQ2vNpLd8wYzF4bHj6rTuE3sGnAqW5cPzVbCrea7tXk",
    immuable: true,
    couleur: "bleu",
  },
  {
    role: "LIQUIDITY_VAULT",
    etiquette: "VAULT",
    description: "Coffre où est verrouillée la liquidité",
    adresse: "VAUL4bHj6rTuE3sGnAqW5cPzVbCrea7tXk9mQ2vNpLd8wYzF",
    immuable: true,
    couleur: "vert",
  },
  {
    role: "BURN_SINK",
    etiquette: "BURN",
    description: "Réceptacle des tokens brûlés (allocation burn)",
    adresse: "BURN6rTuE3sGnAqW5cPzVbCrea7tXk9mQ2vNpLd8wYzF4bHj",
    immuable: true,
    couleur: "rouge",
  },
  {
    role: "PROTOCOL_TREASURY",
    etiquette: "PROT",
    description: "Trésorerie du protocole (frais de plateforme)",
    adresse: "PROT3sGnAqW5cPzVbCrea7tXk9mQ2vNpLd8wYzF4bHj6rTuE",
    immuable: true,
    couleur: "orange",
  },
  {
    role: "CHARITY_RESERVE",
    etiquette: "CHARITY",
    description: "Réserve caritative déclarée par le créateur",
    adresse: "CHRY5cPzVbCrea7tXk9mQ2vNpLd8wYzF4bHj6rTuE3sGnAqW",
    immuable: true,
    couleur: "vert",
  },
];

const DEMO_MANIFEST = {
  burn_bps: 2000,           // 20 %
  protocol_fee_bps: 300,    // 3 %
  charity_bps: 500,         // 5 %
  dev_allocation_bps: 1000, // 10 %
};

// ---- Petits composants d'affichage ----

const COULEURS: Record<RoleCouleur, string> = {
  violet: "bg-purple-900 text-purple-200 border-purple-600",
  vert: "bg-green-900 text-green-200 border-green-600",
  bleu: "bg-blue-900 text-blue-200 border-blue-600",
  orange: "bg-orange-900 text-orange-200 border-orange-600",
  rouge: "bg-red-900 text-red-200 border-red-600",
  gris: "bg-gray-800 text-gray-300 border-gray-600",
};

function Badge({ children, className }: { children: React.ReactNode; className: string }) {
  return (
    <span className={`inline-block rounded border px-2 py-0.5 text-xs font-bold ${className}`}>
      {children}
    </span>
  );
}

function LigneAdresse({ a }: { a: AdresseDecodee }) {
  return (
    <div className="rounded-lg border border-gray-700 bg-gray-900 p-4">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <Badge className={COULEURS[a.couleur]}>{a.etiquette}</Badge>
        <span className="text-sm font-semibold text-white">{a.role}</span>
        {a.immuable ? (
          <Badge className="bg-gray-800 text-gray-300 border-gray-600">IMMUABLE</Badge>
        ) : (
          <Badge className="bg-yellow-900 text-yellow-200 border-yellow-600">MODIFIABLE</Badge>
        )}
      </div>
      <p className="mb-2 text-sm text-gray-400">{a.description}</p>
      <code className="block break-all rounded bg-black px-3 py-2 font-mono text-xs text-green-400">
        {a.adresse}
      </code>
    </div>
  );
}

function Pourcentage({ libelle, bps }: { libelle: string; bps: number }) {
  return (
    <div className="rounded-lg border border-gray-700 bg-gray-900 p-4">
      <div className="text-sm text-gray-400">{libelle}</div>
      <div className="text-2xl font-bold text-white">{(bps / 100).toFixed(1)} %</div>
    </div>
  );
}

// ---- Page ----

export default function Dashboard() {
  const { publicKey, connected } = useWallet();

  return (
    <main className="min-h-screen bg-gray-950 p-8 text-white">
      <header className="mb-8">
        <div className="mb-4">
          <WalletMultiButton />
        </div>
        <h1 className="text-3xl font-bold">GlassPad</h1>
        <p className="text-gray-400">
          Lanceur de memecoins transparent — chaque adresse est étiquetée et lisible.
        </p>
        <div className="mt-4 text-sm">
          {connected ? (
            <p>
              Portefeuille connecté :{" "}
              <code className="font-mono text-green-400">{publicKey?.toBase58()}</code>
            </p>
          ) : (
            <p className="text-yellow-400">Aucun portefeuille connecté.</p>
          )}
        </div>
      </header>

      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold">Paramètres du manifest (basis points)</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <Pourcentage libelle="Burn" bps={DEMO_MANIFEST.burn_bps} />
          <Pourcentage libelle="Frais protocole" bps={DEMO_MANIFEST.protocol_fee_bps} />
          <Pourcentage libelle="Caritatif" bps={DEMO_MANIFEST.charity_bps} />
          <Pourcentage libelle="Allocation dev" bps={DEMO_MANIFEST.dev_allocation_bps} />
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-xl font-semibold">Registre des adresses</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {DEMO_ADRESSES.map((a) => (
            <LigneAdresse key={a.role} a={a} />
          ))}
        </div>
      </section>
    </main>
  );
}