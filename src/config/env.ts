/** Reads a required variable from the environment (.env locally, workflow env in CI). Fails fast if it is missing. */
function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing environment variable ${name}. Copy .env.example to .env.`);
  return value;
}

export const env = {
  get webUrl(): string {
    return required('WEB_URL');
  },
  get apiUrl(): string {
    return required('API_URL');
  },
  get customerEmail(): string {
    return required('CUSTOMER_EMAIL');
  },
  get customerPassword(): string {
    return required('CUSTOMER_PASSWORD');
  },
};
