import { Knex } from 'knex';
import {
  UserCreationAttributes,
  UserLocalisation,
  UserProfile,
} from '../../models/User';

export async function seed(knex: Knex): Promise<void> {
  // Supprimer tous les utilisateurs existants
  await knex('users').del();

  const profiles: UserProfile[] = ['gestionnaire', 'reporting', 'it_support'];
  const localisations: UserLocalisation[] = [
    'siège',
    'adamaoua',
    'centre',
    'est',
    'extreme_nord',
    'littoral',
    'nord',
    'nord_ouest',
    'ouest',
    'sud',
    'sud_ouest',
  ];

  const userNames = [
    'Jean-Marie Njikam Ngon',
    'Samuel Mbia Mvondo',
    "Roger Eto'o Fils",
    'Charles Kameni Nomo',
    'Daniel Song Bahanag',
    'Alain Wome Nlend',
    "Marcel N'Gono Onguene",
    'Pierre Idrissou Mbarga',
    "Jacques M'Bida Abouna",
    'Michel Onguene Tchoupo',
    'Joseph Ebosse Bassogog',
    'Thomas Ngadeu Boumal',
    'Ernest Oyongo Onana',
    "Fabrice Siani N'Dip",
    "Georges N'Dip Tchakounte",
    'Laurent Tchoupo Moundi',
    'Patrick Zoua Kana-Biyik',
    "Étienne Boumal N'Doumbé",
    "François N'Jie Fai",
    "Didier Moundi N'Lend",
    "Hervé N'Gadjui Abouna",
    'Bruno Kana-Biyik Mbarga',
    "Jean-Claude N'Doumbé Onguene",
    'Michel Abouna Njikam',
    'Serge Mbarga Mbia',
    "Christian N'Lend N'Gono",
    'Pascal Tchakounte Wome',
    'Sylvain Onana Siani',
    'Cédric Fai Idrissou',
    'Thierry Njikam Ebosse',
  ];

  // Fonction pour générer un login à partir du nom
  function generateLogin(name: string): string {
    const parts = name.toLowerCase().split(/[\s'-]+/);
    return (parts[0][0] + parts[parts.length - 1]).slice(0, 6);
  }

  // Fonction pour générer un email à partir du nom
  function generateEmail(name: string): string {
    const login = generateLogin(name);
    return `${login}@propservice.com`;
  }

  // Fonction pour générer un numéro de téléphone
  function generatePhoneNumber(): string {
    return (
      '6' +
      Math.floor(Math.random() * 100000000)
        .toString()
        .padStart(8, '0')
    );
  }

  // Créer le superadmin
  const superadmin: UserCreationAttributes = {
    username: 'Superadmin',
    login: 'znana',
    password: '$2a$12$PgFQWt62XkPPi0XzwjelT.UTeKjqmXvD3ngLfZE62Y/4luhWVAita', // À changer en production !
    email: 'superadmin@propservice.com',
    phone: generatePhoneNumber(),
    department: null,
    profile: 'gestionnaire',
    localisation: 'siège',
    must_reset_password: false,
    active: true,
    created_by: null,
  };

  // Insérer le superadmin
  const [superadminId] = await knex('users').insert(superadmin).returning('id');

  // Crée les utilisateurs
  const users: UserCreationAttributes[] = userNames.map((name) => ({
    username: name,
    login: generateLogin(name),
    password: 'password123', // À changer en production !
    email: generateEmail(name),
    phone: generatePhoneNumber(),
    department: ['RH', 'IT', 'Finance', 'Marketing', 'Operations'][
      Math.floor(Math.random() * 5)
    ],
    profile: profiles[Math.floor(Math.random() * profiles.length)],
    localisation:
      localisations[Math.floor(Math.random() * localisations.length)],
    must_reset_password: true,
    active: true,
    created_by: superadminId.id,
  }));

  // Insère les utilisateurs dans la base de données
  await knex('users').insert(users);
}
