// Vercel Serverless Function Entry Point
// This file wraps the Express app for Vercel deployment

// Register tsconfig paths for @/ aliases
import 'tsconfig-paths/register'

// Load environment variables
import 'dotenv/config'

// Import the Express app
import { App } from '../src/app'

const application = new App()
application.initialize()

// Export Express app for Vercel Serverless
export default application.app

