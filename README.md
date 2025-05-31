# WeatherAI Nigeria - Advanced Geospatial Weather Platform

A cutting-edge weather application focused on Nigeria and Africa, featuring real-time weather data, AI-powered chatbot assistance, animal detection capabilities, and interactive 3D mapping.

## Features

- **3D Interactive Map**: Powered by Cesium for immersive geospatial visualization
- **Real-time Weather Data**: Integration with OpenWeather API for accurate weather information
- **AI Chatbot**: DeepSeek AI-powered assistant for weather-related queries
- **Animal Detection**: Google Vision API integration for detecting rodents and wildlife
- **Responsive Design**: Futuristic UI optimized for all devices
- **Docker Support**: Easy deployment with containerization

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **3D Mapping**: Cesium.js
- **APIs**: OpenWeather API, Google Vision API, AI SDK
- **AI**: OpenAI GPT-4 (DeepSeek alternative)
- **Deployment**: Docker, Docker Compose

## Prerequisites

- Node.js 18+
- npm/yarn/pnpm
- Docker (for containerized deployment)

## API Keys Required

1. **OpenWeather API Key**: Get from [OpenWeatherMap](https://openweathermap.org/api)
2. **Cesium Ion Token**: Get from [Cesium Ion](https://cesium.com/ion/) (configured server-side)
3. **Groq API Key**: Get from [Groq](https://console.groq.com/)
4. **Google Cloud Vision API**: Set up from [Google Cloud Console](https://console.cloud.google.com/)

## Installation

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

3. **Set up environment variables**:
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`
   
   Fill in your API keys in `.env.local`:
   \`\`\`env
   OPENWEATHER_API_KEY=your_openweather_api_key
   CESIUM_TOKEN=your_cesium_token
   GROQ_API_KEY=your_groq_api_key
   GOOGLE_APPLICATION_CREDENTIALS={"type":"service_account",...}
   \`\`\`

4. **Run the development server**:
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   \`\`\`

5. **Open your browser** and navigate to `http://localhost:3000`

## Docker Deployment

1. **Build and run with Docker Compose**:
   \`\`\`bash
   docker-compose up --build
   \`\`\`

2. **Or build and run manually**:
   \`\`\`bash
   docker build -t weather-app .
   docker run -p 3000:3000 --env-file .env.local weather-app
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

## Architecture

\`\`\`
├── app/
│   ├── api/
│   │   ├── chat/          # AI chatbot endpoint
│   │   ├── weather/       # Weather data endpoint
│   │   └── vision/        # Animal detection endpoint
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main application page
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── animal-detection.tsx
│   ├── cesium-map.tsx
│   ├── chat-bot.tsx
│   ├── footer.tsx
│   ├── navigation.tsx
│   └── weather-panel.tsx
├── Dockerfile
├── docker-compose.yml
└── package.json
\`\`\`

## API Endpoints

- `GET /api/weather?lat={lat}&lon={lon}` - Get weather data for coordinates
- `POST /api/chat` - AI chatbot conversation endpoint
- `POST /api/vision` - Animal detection from uploaded images

## Performance Optimizations

- Dynamic imports for Cesium to avoid SSR issues
- Image optimization with Next.js
- Efficient API caching
- Responsive design with mobile-first approach
- Optimized bundle size with tree shaking

## Security Features

- Environment variables for API key management
- Input validation and sanitization
- CORS protection
- Rate limiting considerations

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
