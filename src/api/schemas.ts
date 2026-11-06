import { z } from 'zod';

/** Response contracts of the Toolshop API. A test fails if a field disappears or changes type. */

export const ENDPOINTS = {
  login: '/users/login',
  me: '/users/me',
  invoices: '/invoices',
  products: '/products',
  productSearch: '/products/search',
  postcodeLookup: '/postcode-lookup',
  product: (id: string) => `/products/${id}`,
};

export const TOKEN_TYPE = 'bearer';

export const FIRST_PAGE = 1;

export const ProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  price: z.number().positive(),
  in_stock: z.boolean(),
  is_rental: z.boolean(),
  category: z.object({ id: z.string(), name: z.string() }),
  brand: z.object({ id: z.string(), name: z.string() }),
});

export const ProductPageSchema = z.object({
  current_page: z.number().int(),
  per_page: z.number().int().positive(),
  last_page: z.number().int().positive(),
  total: z.number().int().nonnegative(),
  data: z.array(ProductSchema),
});

export const LoginResponseSchema = z.object({
  access_token: z.string().min(1),
  token_type: z.string(),
  expires_in: z.number().positive(),
});

export const HTTP = {
  ok: 200,
  unauthorized: 401,
  notFound: 404,
} as const;
