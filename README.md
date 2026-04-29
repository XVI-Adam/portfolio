# Zo Space Portfolio

Space-themed portfolio at [verticalsushi.zo.space](https://verticalsushi.zo.space) featuring:

- **Home page** (`/`) - Space-themed portfolio with parallax aliens, HUD readouts, missions/projects, contact, and resume sections
- **Stack Tower game** (`/stack`) - Block-cutting game with platform movement, gem rewards, difficulty scaling, and customizable themes
- **Gem Shop** (`/gems`) - Purchase gems via Stripe for the Stack Tower game
- **Tips page** (`/tips`) - Send tips to support the platform

## API Endpoints

- `POST /api/create-checkout` - Create Stripe checkout sessions
- `GET /api/user-gems/:userId` - Get user's gem balance
- `GET /api/tip-history` - Get tip leaderboard
- `POST /api/stripe-webhook` - Handle Stripe payment events

## Environment Variables

Set these in [Settings > Advanced](/?t=settings&s=advanced):

- `STRIPE_SECRET_KEY` - Stripe secret key
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook signing secret

## Local Development

```bash
bun install
bun run dev
```

## Stack Tower Game Mechanics

- Click/tap to freeze the moving platform
- Perfect placements align exactly with the block below
- Imperfect placements cut the block to the overlap portion
- Streak bonuses: every 5 perfect placements = wider base
- Difficulty increases as blocks are placed (faster speed, narrower platforms)
- Earn gems: 1 per block placed, 10 bonus for perfect placements, 1 per 10 points