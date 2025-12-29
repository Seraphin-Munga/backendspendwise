# SpendWiseApp

An Expo app built with TypeScript for managing expenses and tracking spending.

## Getting Started

### Prerequisites

- Node.js (v20.19.4 or higher recommended)
- npm or yarn
- Expo CLI (installed globally or via npx)
- iOS Simulator (for iOS development) or Android Emulator (for Android development)

### Installation

```bash
npm install
```

### Running the App

#### Start Development Server

```bash
npm start
```

This will start the Expo development server. You can then:
- Press `i` to open in iOS Simulator
- Press `a` to open in Android Emulator
- Press `w` to open in web browser
- Scan the QR code with Expo Go app on your physical device

#### Alternative Start Methods (for troubleshooting)

If you encounter connection issues with the iOS Simulator:

1. **Use Tunnel Mode** (more reliable but slower):
   ```bash
   npm run start:tunnel
   ```

2. **Use Localhost Mode**:
   ```bash
   npm run start:localhost
   ```

3. **iOS with Tunnel**:
   ```bash
   npm run ios:tunnel
   ```

### Troubleshooting iOS Simulator Issues

If you get a timeout error when opening the app in iOS Simulator:

1. **Make sure the simulator is booted**:
   ```bash
   xcrun simctl boot "iPhone 16 Pro"
   ```

2. **Open Expo Go manually in the simulator**:
   - Open Simulator app
   - Find and open "Expo Go" app
   - The app should automatically connect or you can manually enter the URL

3. **Try tunnel mode** (works better with network issues):
   ```bash
   npm run start:tunnel
   ```

4. **Reset the simulator** (if issues persist):
   ```bash
   xcrun simctl shutdown "iPhone 16 Pro"
   xcrun simctl erase "iPhone 16 Pro"
   xcrun simctl boot "iPhone 16 Pro"
   ```

5. **Check network connectivity**:
   - Make sure your Mac and Simulator can access the same network
   - Try using `localhost` mode if on the same machine

### Available Scripts

- `npm start` - Start Expo development server
- `npm run start:tunnel` - Start with tunnel mode (more reliable)
- `npm run start:localhost` - Start with localhost mode
- `npm run android` - Start and open Android emulator
- `npm run ios` - Start and open iOS simulator
- `npm run ios:tunnel` - Start iOS with tunnel mode
- `npm run web` - Start and open web browser

## Project Structure

```
SpendWiseApp/
├── App.tsx          # Main app component
├── app.json         # Expo configuration
├── package.json     # Dependencies and scripts
├── tsconfig.json    # TypeScript configuration
└── assets/          # Images and other assets
```

## Development

The app uses:
- **Expo SDK** ~54.0.30
- **React Native** 0.81.5
- **React** 19.1.0
- **TypeScript** ~5.9.2

## License

Private project

