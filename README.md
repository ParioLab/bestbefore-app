# BestBefore App

BestBefore(Bestbfr) is a mobile app for iOS and Android that allows users to scan product barcodes, manually input expiration dates, and receive push notifications when products are nearing expiry. It uses a minimal product database for MVP purposes.

## Features

- **Barcode Scanning**: Quickly scan product barcodes to add items.
- **Manual Entry**: Manually input product details and expiration dates.
- **Expiry Notifications**: Receive push notifications when products are nearing their expiration date.
- **Product Tracking**: Keep a list of your products and their expiry dates.
- **Simple MVP Database**: Utilizes a minimal local product database for core functionality in the MVP.

## Tech Stack

- **React Native**: A framework for building native apps using React.
- **Expo**: A platform for making universal React applications.
- **TypeScript**: For static type-checking to reduce bugs in production.
- **React Navigation**: For routing and navigation.

## Project Structure

The project follows a standard React Native (Expo) structure:

```
bestbefore-app-project/
├── assets/             # Static assets like images and fonts
├── src/                # Main source code
│   ├── components/     # Reusable components
│   ├── screens/        # App screens
│   ├── navigation/     # Navigation logic
│   ├── hooks/          # Custom React hooks
│   └── utils/          # Utility functions
├── App.tsx             # Main app component
├── app.json            # Expo configuration file
└── package.json        # Project dependencies
```

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You will need Node.js and npm installed on your machine. You will also need the Expo Go app on your iOS or Android device, or an emulator/simulator.

### Installation

1.  **Clone the repository**
    ```sh
    git clone <your-repo-url>
    cd bestbefore-app-project
    ```

2.  **Install dependencies**
    ```sh
    npm install
    ```

3.  **Run the application**
    ```sh
    npx expo start
    ```

This will start the Metro Bundler. You can then scan the QR code with the Expo Go app on your phone to run the app on your device. 