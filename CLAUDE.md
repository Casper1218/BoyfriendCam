# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

BoyfriendCam is an Expo-based React Native mobile application that helps users take better photos by providing contextual photography tips based on photo type (scenario) and location. The app guides users through a wizard flow to select a scenario (portrait full/half body, close-up) and location (outdoors, indoors, restaurant, beach), then opens a camera with relevant photography tips.

## Development Commands

### Setup
```bash
npm install
```

### Development
```bash
# Start development server
npm start
# or
npx expo start

# Run on specific platform
npm run android    # Android emulator
npm run ios        # iOS simulator
npm run web        # Web browser
```

### Code Quality
```bash
npm run lint       # Run ESLint
```

### Reset Project
```bash
npm run reset-project  # Moves starter code to app-example, creates blank app directory
```

## Architecture

### Technology Stack
- **Framework**: Expo SDK 54
- **React**: 19.1.0
- **React Native**: 0.81.5
- **Router**: expo-router v6 (file-based routing)
- **TypeScript**: Strict mode enabled
- **Expo Features**: Camera, Media Library, Haptics, Status Bar

### Navigation Flow
The app uses a wizard-style navigation pattern powered by expo-router:
1. `app/index.tsx` - Scenario selection (portrait-full, portrait-half, close-up)
2. `app/location.tsx` - Location selection (outdoors, indoors, restaurant, beach)
3. `app/camera.tsx` - Camera view with contextual photography tips

Navigation is handled via `expo-router` with URL params passed between screens:
- `scenario` param flows from index → location → camera
- `location` param flows from location → camera

### Camera Tips System
The `camera.tsx` file contains a nested object structure mapping scenarios and locations to specific photography tips:
```typescript
tips[scenario][location]  // e.g., tips['portrait-full']['outdoors']
```
When adding or modifying tips, ensure both scenario and location keys exist in the tips object.

### Project Structure
```
app/                    # File-based routing (expo-router)
  _layout.tsx          # Root layout with Stack navigator
  index.tsx            # Scenario selection screen
  location.tsx         # Location selection screen
  camera.tsx           # Camera interface with tips
components/
  ui/                  # Reusable UI components
constants/             # App-wide constants
hooks/                 # Custom React hooks
assets/                # Images, fonts, icons
```

### Key Configuration Files
- `app.json` - Expo configuration including app name, icons, splash screen, plugins
- `tsconfig.json` - TypeScript config with strict mode and path aliases (`@/*`)
- `eslint.config.js` - ESLint configuration
- `package.json` - Dependencies and scripts

### Path Aliases
TypeScript is configured with the `@/*` path alias mapping to the project root:
```typescript
import { Something } from '@/components/Something';
```

### Expo Features
- **New Architecture**: Enabled via `newArchEnabled: true`
- **React Compiler**: Experimental feature enabled
- **Typed Routes**: Experimental feature for type-safe routing
- **Edge-to-Edge**: Android edge-to-edge enabled
- **Platform Support**: iOS, Android, and Web

### Permissions
The app requires runtime permissions for:
- Camera access (expo-camera)
- Media library access (expo-media-library)

These are requested on-demand in the camera screen.

### Styling Approach
All screens use StyleSheet.create() with inline styles. The app uses a dark theme:
- Background: `#000` (black)
- Secondary background: `#1a1a1a`
- Borders: `#333`
- Text: `#fff` (white)

## Testing Notes

When testing camera functionality:
- iOS Simulator does not support camera hardware; test on physical device or use Expo Go
- Android Emulator can simulate camera; enable virtual camera in AVD settings
- Media library permissions must be granted to save photos
