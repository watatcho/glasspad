import type { Translation } from '../types';

export const fr: Translation = {
  lang: 'fr',
  langName: 'Français',
  common: {
    title: 'GlassPad — Transparence du lancement',
    loading: 'Chargement…',
    transparencyNote:
      "Toutes les informations ci-dessous proviennent de la blockchain et peuvent être vérifiées par tout le monde.",
    copyAddress: "Copier l'adresse",
    copied: 'Copié !',
    languageLabel: 'Langue',
  },
  roles: {
    creator: {
      label: 'Créateur',
      description: 'La personne qui a lancé ce memecoin.',
    },
    protocol: {
      label: 'Protocole',
      description: 'Le système qui applique les règles du lancement.',
    },
    burn: {
      label: 'Portefeuille de brûlage',
      description:
        "Adresse où les tokens sont envoyés pour être retirés définitivement de la circulation.",
    },
    token: {
      label: 'Token',
      description: "Le memecoin lui-même, unité échangeable.",
    },
    charity: {
      label: 'Portefeuille caritatif',
      description: "L'adresse qui reçoit les dons promis par le créateur.",
    },
    liquidityVault: {
      label: 'Réserve de liquidité',
      description:
        "Les tokens gardés de côté pour que les gens puissent les acheter et vendre facilement.",
    },
    contributor: {
      label: 'Contributeur',
      description: "Un participant public ou un apporteur de liquidité.",
    },
  },
  sections: {
    addresses: {
      title: 'Adresses',
      description: 'Les adresses des portefeuilles liés à ce lancement.',
    },
    parameters: {
      title: 'Paramètres du lancement',
      description: 'Les réglages configurés par le créateur.',
    },
    summary: {
      title: 'Résumé',
      description: "Vue d'ensemble du lancement.",
    },
  },
  params: {
    burnAllocation: {
      label: 'Allocation brûlée',
      description: 'Part des tokens envoyée au portefeuille de brûlage.',
    },
    platformFee: {
      label: 'Frais de plateforme',
      description: 'Part prélevée par GlassPad à chaque transaction.',
    },
    charityAllocation: {
      label: 'Allocation caritative',
      description:
        "Part des tokens réservée à une cause choisie par le créateur.",
    },
    hardCap: {
      label: 'Montant maximum collecté',
      description:
        "Le plus qu'on peut lever pendant le lancement. Une fois atteint, c'est fini.",
    },
  },
  explain: {
    wallet:
      "Un portefeuille est un compte numérique qui contient des tokens. Chaque portefeuille a une adresse unique.",
    address:
      "Une adresse est une suite de caractères qui identifie un portefeuille sur la blockchain, comme un numéro de compte bancaire.",
    blockchain:
      "La blockchain est un registre public qui enregistre toutes les transactions. Tout le monde peut le consulter.",
    burn:
      "Brûler des tokens, c'est les envoyer à une adresse dont personne ne possède la clé. Ils deviennent inaccessibles et sont retirés de la circulation.",
    token:
      "Un token est une unité de ce memecoin que l'on peut acheter, vendre ou détenir.",
    fee:
      "Les frais sont une petite quantité de tokens prélevée par la plateforme à chaque transaction.",
  },
  status: {
    verified: 'Vérifié',
    pending: 'En attente',
    unknown: 'Inconnu',
  },
};
