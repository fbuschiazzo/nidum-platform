# Nidum

Nidum is a full-stack platform for fractional real-estate investment and rental operations.

## Modules

- Investor portal for wallet, holdings, documents, reports, and investment opportunities.
- Rental portal for public apartment discovery and tenant applications.
- Admin portal for properties, units, fundraising, investors, leases, and compliance workflows.
- Prisma data layer with SQLite for local development and a path to Postgres for production.

## Local Setup

```bash
npm.cmd install
Copy-Item .env.example .env
npm.cmd run db:init
npm.cmd run db:seed
npm.cmd run dev
```

Open `http://localhost:3000`.

## Deployment

The repository includes `.gitlab-ci.yml` for GitLab CI deployments to Vercel.
Configure these GitLab CI/CD variables before pushing:

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

For production data, replace local SQLite with a managed Postgres `DATABASE_URL`
and run a proper Prisma migration flow.
