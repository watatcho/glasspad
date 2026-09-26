'use client';

import { useState, useEffect, useMemo } from 'react';
import { AddressRegistry } from '@glasspad/core';
import type { AddressRole } from '@glasspad/core';
import {
  translations,
  detectLocale,
  getTranslation,
  formatPercent,
  defaultLocale,
} from '../i18n';
import type { Translation } from '../i18n/types';
import { mockManifest } from '../lib/mockManifest';

const roleKeyMap: Record<AddressRole, keyof Translation['roles']> = {
  CREATOR: 'creator',
  PROTOCOL_TREASURY: 'protocol',
  BURN_SINK: 'burn',
  MINT_TOKEN: 'token',
  CHARITY_RESERVE: 'charity',
  LIQUIDITY_VAULT: 'liquidityVault',
  CONTRIBUTOR: 'contributor',
};

function lamportsToSol(lamports: number): number {
  return lamports / 1_000_000_000;
}

export default function Dashboard() {
  const [locale, setLocale] = useState(defaultLocale);
  const [copiedAddr, setCopiedAddr] = useState<string | null>(null);
  const t = getTranslation(locale);

  useEffect(() => {
    setLocale(detectLocale());
  }, []);

  const registry = useMemo(() => new AddressRegistry(mockManifest), []);
  const addresses = useMemo(() => registry.getAll(), [registry]);

  const handleCopy = async (address: string) => {
    try {
      await navigator.clipboard.writeText(address);
      setCopiedAddr(address);
      setTimeout(() => setCopiedAddr(null), 2000);
    } catch {
      /* clipboard non disponible */
    }
  };

  const params = [
    { key: 'burnAllocation' as const, bps: mockManifest.burnBps, color: '#EF4444' },
    { key: 'platformFee' as const, bps: mockManifest.protocolFeeBps, color: '#3B82F6' },
    { key: 'charityAllocation' as const, bps: mockManifest.charityBps, color: '#10B981' },
  ];

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-3xl">

        {/* En-tete + selecteur de langue */}
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">{t.common.title}</h1>
            <div className="flex gap-2">
              {Object.values(translations).map((tr) => (
                <button
                  key={tr.lang}
                  onClick={() => setLocale(tr.lang)}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition ${
                    locale === tr.lang
                      ? 'bg-gray-900 text-white'
                      : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  {tr.langName}
                </button>
              ))}
            </div>
          </div>
          <p className="mt-3 text-sm text-gray-500">{t.common.transparencyNote}</p>
        </header>

        {/* Section Adresses */}
        <section className="mb-8">
          <h2 className="mb-1 text-lg font-semibold text-gray-900">
            {t.sections.addresses.title}
          </h2>
          <p className="mb-4 text-sm text-gray-500">{t.sections.addresses.description}</p>
          <div className="space-y-3">
            {addresses.map((addr) => {
              const roleKey = roleKeyMap[addr.role];
              const roleInfo = t.roles[roleKey];
              return (
                <div
                  key={addr.address}
                  className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-block h-3 w-3 rounded-full"
                      style={{ backgroundColor: addr.badgeColor }}
                    />
                    <span className="font-medium text-gray-900">{roleInfo.label}</span>
                    {addr.isImmutable && (
                      <span className="rounded bg-green-100 px-2 py-0.5 text-xs text-green-700">
                        {t.status.verified}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-gray-500">{roleInfo.description}</p>
                  <button
                    onClick={() => handleCopy(addr.address)}
                    className="mt-2 font-mono text-sm text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    {addr.address}
                  </button>
                  {copiedAddr === addr.address && (
                    <span className="ml-2 text-xs text-green-600">{t.common.copied}</span>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Section Parametres */}
        <section className="mb-8">
          <h2 className="mb-1 text-lg font-semibold text-gray-900">
            {t.sections.parameters.title}
          </h2>
          <p className="mb-4 text-sm text-gray-500">{t.sections.parameters.description}</p>
          <div className="space-y-4">
            {params.map((param) => {
              const info = t.params[param.key];
              const pct = (param.bps / 10000) * 100;
              return (
                <div
                  key={param.key}
                  className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">{info.label}</span>
                    <span className="font-mono text-sm text-gray-600">
                      {formatPercent(param.bps / 10000, locale)}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">{info.description}</p>
                  <div className="mt-3 h-2 w-full rounded-full bg-gray-100">
                    <div
                      className="h-2 rounded-full"
                      style={{ width: `${pct}%`, backgroundColor: param.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Section Resume */}
        <section className="mb-8">
          <h2 className="mb-1 text-lg font-semibold text-gray-900">
            {t.sections.summary.title}
          </h2>
          <p className="mb-4 text-sm text-gray-500">{t.sections.summary.description}</p>
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-900">{t.params.hardCap.label}</span>
              <span className="font-mono text-sm text-gray-600">
                {lamportsToSol(mockManifest.hardCapLamports).toLocaleString(locale)} SOL
              </span>
            </div>
            <p className="mt-1 text-sm text-gray-500">{t.params.hardCap.description}</p>
          </div>
        </section>

      </div>
    </main>
  );
}
