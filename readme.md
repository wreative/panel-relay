# Panel Relay

A simple relay service for forwarding aaPanel alert payloads to Discord via webhook.

## Features
- Receives aaPanel alert payloads (HTTP POST)
- Extracts relevant fields from the alert
- Forwards formatted alert to a Discord channel using webhook

## Requirements
- Node.js v18 or later
- pnpm (or npm/yarn)
- Discord webhook URL

## Getting Started

### 1. Clone the repository
```sh
git clone https://github.com/wreative/panel-relay.git
cd panel-relay
```

### 2. Install dependencies
```sh
pnpm install
```

### 3. Set environment variable
Create a `.env` file or set the environment variable in your shell:
```
DISCORD_WEBHOOK_URL=your_discord_webhook_url
```

### 4. Development mode
Run the relay in development mode (TypeScript, hot-reload):
```sh
pnpm run dev
```

### 5. Build for production
```sh
pnpm run build
```

## API Endpoint
- **POST** `/api/aapanel`
  - Accepts aaPanel alert payload in the request body
  - Forwards alert to Discord

#### Example Request
```json
{
  "msg_type": "alert",
  "content": {
    "text": "...aaPanel alert text..."
  }
}
```

## Project Structure
```
api/                # API route handler
src/
  config/           # Environment config
  controllers/      # Controller logic
  core/             # Relay core logic
  services/         # Discord webhook service
  types/            # TypeScript types
  utils/            # Utility functions
```

## License
MIT
