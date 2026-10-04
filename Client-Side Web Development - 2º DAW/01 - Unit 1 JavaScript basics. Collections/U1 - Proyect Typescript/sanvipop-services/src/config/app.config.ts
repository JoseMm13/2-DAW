export default () => ({
  port: parseInt(process.env.PORT ?? '0', 10) || 3000,
  basePath: process.env.BASE_PATH || '',
  database: {
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT ?? '0', 10) || 5432,
  },
  google_id: process.env.GOOGLE_ID || '',
  baseUrl: process.env.BASE_URL || 'http://localhost:3000',
  jwtSecret: process.env.JWT_SECRET || 'super_secret_jwt_key_sanvipop_educational_2026',
  jwtExpiresIn: '7d',
});

