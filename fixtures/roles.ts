import path from 'node:path';

// One saved login (storageState) per role. The setup project writes these files and
// every test that needs a role reads them, so no test logs in through the UI itself.
export const roles = {
  customer: {
    emailVar: 'CUSTOMER_EMAIL',
    passwordVar: 'CUSTOMER_PASSWORD',
    displayName: 'Jane Doe',
  },
  customer2: {
    emailVar: 'CUSTOMER2_EMAIL',
    passwordVar: 'CUSTOMER2_PASSWORD',
    displayName: 'Jack Howe',
  },
  admin: {
    emailVar: 'ADMIN_EMAIL',
    passwordVar: 'ADMIN_PASSWORD',
    displayName: 'John Doe',
  },
} as const;

export type Role = keyof typeof roles;

export const authFile = (role: Role): string =>
  path.join(__dirname, '..', '.auth', `${role}.json`);

export function credentials(role: Role): { email: string; password: string } {
  const { emailVar, passwordVar } = roles[role];
  const email = process.env[emailVar];
  const password = process.env[passwordVar];
  if (!email || !password) {
    throw new Error(`Missing ${emailVar} or ${passwordVar}. Copy env.example to .env.`);
  }
  return { email, password };
}
