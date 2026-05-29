# Matchday Static Demo

This is a public, no-login version of **Matchday**: [demo-matchdayapp](https://brookrussi.github.io/matchday-static-demo/#demo)

Matchday helps friends plan World Cup games together in one place: what to watch, who’s watching, where to meet, and what everyone thinks the score will be (prediction without the $$$).

The fully deployed app can be found at [matchdayapp.co](https://www.matchdayapp.co/).

## What this static version shows

The static demo embeds the frontend prototype wireframes without a backend:

- Mobile-first Matchday landing page
- Dashboard with watched matches
- World Cup schedule preview
- Match detail page
- Score prediction interaction
- Venue voting interaction
- Comments and reactions preview
- Pod leaderboard
- Profile and team preferences

All users, comments, predictions, venues, and match states are fictional.

## Product concept

World Cup watching is social, but the planning usually happens across scattered group chats, calendars, sports apps, and last-minute venue decisions.

**Matchday** gives a friend group one shared place to answer:

- Which matches are we watching?
- Who else is watching?
- What do we think the score will be?
- Where are we meeting?
- Who is winning our prediction table?

## Real app functionality

The production app includes:

- Passwordless Supabase authentication
- User profiles and timezone preferences
- Personalized watched-match list
- World Cup 2026 match schedule data
- Pod-based social context (groups)
- Match-level score predictions
- Venue proposal and voting
- Comments and emoji reactions
- Leaderboard scoring
- Mobile-first PWA-style interface

## Tech stack

### Real app

- Next.js
- React
- TypeScript
- Supabase
- Tailwind CSS
- Playwright
