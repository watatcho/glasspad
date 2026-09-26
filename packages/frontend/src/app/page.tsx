'use client';

import { useEffect, useState } from 'react';
import { fr } from '../../src/i18n/locales/fr';
import { en } from '../../src/i18n/locales/en';
import { zhCN } from '../../src/i18n/locales/zh-CN';
import type { Translation } from '../../src/i18n/types';

type Locale = 'fr' | 'en' | 'zh-CN';

const translations: Record<Locale, Translation> = { fr, en, 'zh-CN': zhCN };

const localeOrder: Locale[] = ['fr', 'en', 'zh-CN'];

function detectLocale(): Locale {
  if (typeof navigator === 'undefined') return 'fr';
  const lang = (navigator.language || '').toLowerCase();
  if (lang.startsWith('zh')) return 'zh-CN';
  if (lang.startsWith('fr')) return 'fr';
  return 'en';
}

const demoTokenName = 'GLASS';
const demoTokenMint = 'GlassTokenMint1111111111111111111111111111';

type RoleKey =
  | 'creator'
  | 'protocol'
  | 'burn'
  | 'token'
  | 'charity'
  | 'liquidityVault'
  | 'contributor';

const demoAddresses: { role: RoleKey; address: string }[] = [
  { role: 'creator', address: 'GlassCreator1111111111111111111111111111111' },
  { role: 'protocol', address: 'GlassProtocol11111111111111111111111111111' },
  { role: 'burn', address: 'GlassBurn111111111111111111111111111111111' },
  { role: 'token', address: demoTokenMint },
  { role: 'charity', address: 'GlassCharity111111111111111111111111111111' },
  { role: 'liquidityVault', address: 'GlassLiquidity1111111111111111111111111111' },
  { role: 'contributor', address: 'GlassContributor11111111111111111111111111' },
];

type ParamKey = 'burnAllocation' | 'platformFee' | 'charityAllocation' | 'hardCap';

const demoParams: { key: ParamKey; value: string }[] = [
  { key: 'burnAllocation', value: '50 %' },
  { key: 'platformFee', value: '1 %' },
  { key: 'charityAllocation', value: '5 %' },
  { key: 'hardCap', value: '100 SOL' },
];

export default function Page() {
  const [locale, setLocale] = useState<Locale>('fr');
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    setLocale(detectLocale());
  }, []);

  const t: Translation = translations[locale];
  const explainEntries: string[] = Object.values(t.explain);

  function handleCopy(address: string) {
    navigator.clipboard
      .writeText(address)
      .then(() => {
        setCopied(address);
        window.setTimeout(() => setCopied(null), 2000);
      })
      .catch(() => {
        // clipboard indisponible : on ignore silencieusement
      });
  }

  return (
    <main className="mx-auto min-h-screen max-w-3xl bg-white px-4 py-10">
      <div className="mb-8 flex items-center justify-end gap-2">
        <span className="text-sm text-gray-500">{t.common.languageLabel}</span>
        {localeOrder.map((code) => (
          <button
            key={code}
            type="button"
            onClick={() => setLocale(code)}
            className={
              code === locale
                ? 'rounded-md border border-indigo-600 bg-indigo-600 px-3 py-1 text-sm font-semibold text-white'
                : 'rounded-md border border-gray-300 bg-white px-3 py-1 text-sm text-gray-700 hover:bg-gray-100'
            }
          >
            {translations[code].langName}
          </button>
        ))}
      </div>

      <h1 className="mb-3 text-3xl font-bold text-gray-900">{t.common.title}</h1>
      <p className="mb-8 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
        {t.common.transparencyNote}
      </p>

      <div className="mb-8 flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4">
        <div>
          <p className="text-lg font-semibold text-gray-900">{demoTokenName}</p>
          <p className="break-all font-mono text-xs text-gray-500">{demoTokenMint}</p>
        </div>
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
          {t.status.verified}
        </span>
      </div>

      <section className="mb-8">
        <h2 className="mb-1 text-xl font-semibold text-gray-900">{t.sections.addresses.title}</h2>
        <p className="mb-3 text-sm text-gray-500">{t.sections.addresses.description}</p>
        <ul className="space-y-2">
          {demoAddresses.map((entry) => {
            const roleText = t.roles[entry.role];
            const isCopied = copied === entry.address;
            return (
              <li key={entry.role} className="rounded-lg border border-gray-200 bg-white p-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900">{roleText.label}</p>
                    <p className="text-xs text-gray-500">{roleText.description}</p>
                    <p className="mt-1 break-all font-mono text-xs text-gray-700">{entry.address}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(entry.address)}
                    className="shrink-0 rounded-md border border-gray-300 px-2 py-1 text-xs text-gray-700 hover:bg-gray-100"
                  >
                    {isCopied ? t.common.copied : t.common.copyAddress}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="mb-1 text-xl font-semibold text-gray-900">{t.sections.parameters.title}</h2>
        <p className="mb-3 text-sm text-sm text-gray-500">{t.sections.parameters.description}</p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {demoParams.map((param) => (
            <div key={param.key} className="rounded-lg border border-gray-200 bg-white p-3">
              <p className="text-sm font-semibold text-gray-900">{t.params[param.key].label}</p>
              <p className="mt-1 text-2xl font-bold text-indigo-600">{param.value}</p>
              <p className="mt-1 text-xs text-gray-500">{t.params[param.key].description}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="border-t border-gray-200 pt-6">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {explainEntries.map((text) => (
            <div key={text} className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-600">
              {text}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}