# DeenAI – Mobile

> A warm, intelligent, and faith-centered digital companion designed to help Muslims build a peaceful, consistent, and emotionally supportive relationship with the Qur'an.

## 📖 What is DeenAI?

DeenAI brings together AI-guided reflections, a clean Qur'an reading experience, and essential daily worship tools, all in one calming, distraction-free space. It's designed to provide peace, clarity, and emotional support rooted in Qur'anic wisdom.

**DeemAI solves these challenges** by offering a unified, peaceful spiritual companion that centers everything around the Qur'an.

## 📦 Installation & Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (Mac) or Android Emulator

### Quick Start

1. **Clone the repository**

```bash
git clone https://github.com/hngprojects/deenAI-Mobile
cd deenai
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
```

3. **Configure environment variables**

```bash
cp .env.example .env
# Edit .env with your API keys and configuration
```

4. **Start the development server**

```bash
npx expo start
```

5. **Run on your platform**

- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR code with Expo Go app on your device

## 🏗️ Project Structure

```
deenai/
├── src/
│   ├── components/          # Reusable UI components
│   ├── screens/             # App screens
│   ├── navigation/          # Navigation configuration
│   ├── services/            # API and backend services
│   ├── hooks/               # Custom React hooks
│   ├── utils/               # Utility functions
│   ├── types/               # TypeScript definitions
│   ├── constants/           # App constants
│   └── assets/              # Images, fonts, icons
├── App.tsx                  # Root component
├── app.json                 # Expo configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # Dependencies
```

## 🤝 Contributing

We welcome contributions that align with DeenAI's mission of providing a gentle, respectful, and authentic Islamic experience.

### How to Contribute

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Guidelines

- Follow the existing code style and TypeScript conventions
- Write meaningful commit messages
- Test your changes thoroughly
- Ensure accessibility standards are met
- Respect the spiritual and cultural sensitivity of the app

---

**Built with ♥ for the Ummah** | _"And We send down of the Qur'an that which is healing and mercy for the believers"_ (17:82)
