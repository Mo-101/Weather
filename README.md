# WeatherAI Nigeria - Advanced Geospatial Weather Platform

A cutting-edge weather application focused on Nigeria and Africa, featuring real-time weather data, AI-powered chatbot assistance, animal detection capabilities, and interactive 3D mapping.

## Features

- **3D Interactive Map**: Powered by Cesium Ion with premium satellite imagery and terrain
- **Real-time Weather Data**: Integration with OpenWeather API for accurate weather information
- **AI Chatbot**: Groq AI-powered assistant for weather-related queries
- **Animal Detection**: Google Vision API integration for detecting rodents and wildlife
- **Responsive Design**: Futuristic UI optimized for all devices
- **Docker Support**: Easy deployment with containerization

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **3D Mapping**: Cesium.js with Ion premium features
- **APIs**: OpenWeather API, Google Vision API, AI SDK
- **AI**: Groq Llama 3.3 70B model
- **Deployment**: Docker, Docker Compose

## Prerequisites

- Node.js 18+
- npm/yarn/pnpm
- Docker (for containerized deployment)

## Quick Start

1. **Clone the repository**:
   \`\`\`bash
   git clone <repository-url>
   cd nigeria-weather-app
   \`\`\`

2. **Install dependencies**:
   \`\`\`bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   \`\`\`

3. **Run the development server**:
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   \`\`\`

4. **Open your browser** and navigate to `http://localhost:3000`

## API Keys

All necessary API keys are hardcoded into the application for immediate functionality:

- ✅ **Cesium Ion Token**: Hardcoded for premium 3D terrain and imagery
- ✅ **OpenWeather API Key**: Hardcoded for weather data access
- ✅ **Groq API Key**: Hardcoded for AI chatbot functionality
- 🔧 **Google Vision API**: Optional - requires setup for animal detection

## Docker Deployment

1. **Build and run with Docker Compose**:
   \`\`\`bash
   docker-compose up --build
   \`\`\`

2. **Or build and run manually**:
   \`\`\`bash
   docker build -t weather-app .
   docker run -p 3000:3000 weather-app
   \`\`\`

## Usage

### Weather Data
- Click anywhere on the 3D map to get weather information for that location
- View detailed weather metrics including temperature, humidity, wind speed, and pressure
- Weather stations are pre-marked for major Nigerian cities

### AI Chatbot
- Click the chat icon to open the weather assistant
- Ask questions about weather patterns, climate conditions, or general weather information
- The AI is specialized in Nigerian and African weather patterns

### Animal Detection
- Upload images to detect animals, particularly rodents
- Uses Google Vision API for accurate detection and classification
- Results show detected animals with confidence scores

### Navigation
- Use the 3D map controls to navigate around Nigeria and Africa
- Click on weather station markers for quick city weather data
- Responsive design works on desktop, tablet, and mobile devices

## Map Features

The application uses Cesium Ion with premium features:
- **High-resolution satellite imagery**: Global coverage with detailed imagery
- **3D terrain**: Accurate elevation data for realistic visualization
- **Interactive navigation**: Full 3D controls with smooth animations
- **Weather station markers**: Pre-placed markers for major Nigerian cities

## Architecture

\`\`\`
├── app/
│   ├── api/
│   │   ├── chat/          # AI chatbot endpoint
│   │   ├── weather/       # Weather data endpoints
│   │   └── vision/        # Animal detection endpoint
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main application page
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── animal-detection.tsx
│   ├── cesium-map.tsx
│   ├── chat-bot.tsx
│   ├── control-panel.tsx
│   ├── footer.tsx
│   ├── navigation.tsx
│   └── weather-panel.tsx
├── Dockerfile
├── docker-compose.yml
└── package.json
\`\`\`

## API Endpoints

- `GET /api/weather?lat={lat}&lon={lon}` - Get weather data for coordinates
- `GET /api/weather/forecast?lat={lat}&lon={lon}` - Get 5-day weather forecast
- `GET /api/weather/alerts?lat={lat}&lon={lon}` - Get weather alerts
- `GET /api/weather/historical?lat={lat}&lon={lon}` - Get historical weather data
- `POST /api/chat` - AI chatbot conversation endpoint
- `POST /api/vision` - Animal detection from uploaded images

## Performance Optimizations

- Dynamic imports for Cesium to avoid SSR issues
- Image optimization with Next.js
- Efficient API caching
- Responsive design with mobile-first approach
- Optimized bundle size with tree shaking

## Security Features

- Input validation and sanitization
- CORS protection
- Rate limiting considerations
- Hardcoded API keys for immediate functionality

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please open an issue on the GitHub repository.
