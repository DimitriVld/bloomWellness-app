# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

BloomWellness is an Expo/React Native wellness tracking app focused on meal logging. Built with TypeScript, Firebase authentication, and Expo Router for file-based routing. All UI text is in French.

## Development Commands

```bash
npm start          # Start Expo development server
npm run ios        # Run on iOS simulator
npm run android    # Run on Android emulator
npm run web        # Run web version
npm run lint       # Run ESLint
```

## Architecture

### Routing (Expo Router v6)
- **File-based routing** in `/app` directory
- **Route groups**: `(auth)` for login/signup flows, `(tabs)` for authenticated main app
- **Flow**: Onboarding → Auth screens → Tab navigation (home, add-meal, account)

### Directory Structure
- `/app` - Route definitions and layouts (Expo Router)
- `/screens` - Screen component implementations (actual UI logic)
- `/components` - Reusable UI components (Button, Input, CustomTabBar)
- `/services` - Business logic (authService.ts for Firebase auth)
- `/hooks` - Custom hooks (useAuth for auth state)
- `/config` - Firebase configuration
- `/style` - Centralized styling (colors, spacing, typography, helpers)
- `/constants` - App-wide constants
- `/types` - TypeScript definitions

### Authentication Pattern
- Firebase Authentication with email/password
- `useAuth` hook subscribes to `onAuthStateChanged`
- Root `_layout.tsx` handles auth routing middleware
- AsyncStorage persists onboarding completion status

### Styling Approach
- Centralized tokens in `/style` (colors.ts, spacing.ts, typography.ts)
- Native `StyleSheet.create()` for performance
- Import helpers from `/style` for common patterns

## Key Configuration

- **Import alias**: Use `@/` for absolute imports (e.g., `@/components/Button`)
- **TypeScript**: Strict mode enabled
- **Environment variables**: Firebase config uses `EXPO_PUBLIC_*` prefix in `.env`
- **VS Code**: Auto-fixes and organizes imports on save

## Current Limitations

- No testing infrastructure (no Jest/testing-library configured)
- Google Sign-In requires a development build (not available in Expo Go)
- API base URL not yet configured for backend integration
