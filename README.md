# Warehouse Management Application

## Overview
A robust warehouse inventory management system built with React Native and Expo. The application streamlines inventory management through barcode scanning,comprehensive reporting features.

## Key Features
- Secure authentication with personal access codes
- Barcode scanning for rapid product identification
- Manual barcode entry fallback
- Real-time inventory management (add/remove stock)
- Detailed product listing with comprehensive information
- Advanced search and filtering capabilities
- Analytics dashboard with inventory statistics
- PDF report generation

## Prerequisites
- Node.js (LTS version)
- npm 
- Expo CLI
- JSON Server

## Installation

### 1. Clone the Repository
```bash
git clone https://github.com/erbaiy/Warehouse-Management.git
cd warehouse-management
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up the Backend
Install and start JSON Server:
```bash
npm install -g json-server
npx json-server db.json
```
The server will run at `http://localhost:3000`

### 4. Launch the Application
Start the Expo development server:
```bash
npm start 
or 
npx expo start 
```
Scan the QR code with Expo Go to run the application on your mobile device.

## Core Functionality

### Authentication
- Secure login system with personal access codes

### Product Management
- Barcode scanning using expo-camera
- Manual barcode entry option
- Product operations:
  - View detailed product information
  - Update stock quantities
  - Add new products
  - Track stock levels

### Dashboard
- Value calculations

### Reporting
- PDF report generation via Expo Print
- Customizable report templates
- Export functionality for inventory data

## Project Structure
```
├── app/                    # Main application directory
│   ├── (tabs)/            # Tab navigation screens
│   ├── modal/             # Modal components
│   ├── test/              # Test components
│   │   ├── _layout.tsx
│   │   ├── not-found.tsx
│   │   ├── index.tsx
│   │   ├── login.tsx
│   │   └── Overlay.tsx
├── assets/                # Static resources
├── components/            # Reusable React components
├── config/               # Configuration files
├── constants/            # Application constants
├── hooks/                # Custom React hooks
├── node_modules/         # Dependencies
├── scripts/              # Utility scripts
├── services/             # API and backend services
├── utils/                # Utility functions
├── .expo/                # Expo configuration
├── .vscode/              # VS Code settings
├── .env                  # Environment variables
├── .gitignore           # Git ignore rules
├── app.json             # Expo app configuration
├── babel.config.js      # Babel configuration
├── db.json              # Database configuration
├── expo-env.d.ts        # Expo TypeScript definitions
├── global.css           # Global styles
├── metro.config.js      # Metro bundler configuration
├── nativewind-env.d.ts  # NativeWind TypeScript definitions
├── package-lock.json    # Dependency lock file
├── package.json         # Project dependencies
├── README.md            # Project documentation
├── tailwind.config.js   # Tailwind CSS configuration
└── docker/              # Docker configuration
    ├── containers/      # Docker container configs
    └── images/          # Docker images
```

## Technology Stack
- React Native
- Expo
- expo-barcode-scanner
- expo-print
- axios
- json-server

## Testing
- Comprehensive testing on Android and iOS platforms
- Unit tests for login 

## Future Enhancements
1. Low stock notifications system
2. Enhanced UI/UX design
3. Multi-warehouse support
4. Advanced analytics features
5. Supplier management integration

## Contributing
Contributions are welcome! Please read our contributing guidelines before submitting pull requests.
