// Shared configuration constants
export const config = {
  app: {
    name: 'Talepo',
    version: '1.0.0',
  },
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  },
  database: {
    url: process.env.DATABASE_URL || '',
  },
} as const

