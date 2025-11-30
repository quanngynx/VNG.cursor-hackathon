#!/usr/bin/env npx ts-node

/**
 * Script to convert Firebase service account JSON to environment variables
 * 
 * Usage:
 *   npx ts-node scripts/json-to-env.ts [path-to-json-file]
 * 
 * Output:
 *   - Prints env variables to console
 *   - Creates .env.firebase file in server directory
 */

import fs from 'fs'
import path from 'path'

interface ServiceAccount {
  type: string
  project_id: string
  private_key_id: string
  private_key: string
  client_email: string
  client_id: string
  auth_uri: string
  token_uri: string
  auth_provider_x509_cert_url: string
  client_x509_cert_url: string
  universe_domain: string
}

const DEFAULT_JSON_PATH = '../cursor-hackathon-2e617-firebase-adminsdk-fbsvc-93b16413db.json'

function main() {
  // Get JSON file path from argument or use default
  const jsonPath = process.argv[2] || DEFAULT_JSON_PATH
  const absolutePath = path.isAbsolute(jsonPath) 
    ? jsonPath 
    : path.join(process.cwd(), jsonPath)

  console.log(`📁 Reading service account from: ${absolutePath}\n`)

  // Check if file exists
  if (!fs.existsSync(absolutePath)) {
    console.error(`❌ File not found: ${absolutePath}`)
    process.exit(1)
  }

  // Read and parse JSON
  let serviceAccount: ServiceAccount
  try {
    const content = fs.readFileSync(absolutePath, 'utf-8')
    serviceAccount = JSON.parse(content)
  } catch (error) {
    console.error(`❌ Failed to parse JSON file:`, error)
    process.exit(1)
  }

  // Extract required fields
  const { project_id, client_email, private_key } = serviceAccount

  if (!project_id || !client_email || !private_key) {
    console.error('❌ Missing required fields in service account JSON')
    process.exit(1)
  }

  // Format for .env file (escape newlines as \n)
  const envContent = `# Firebase Admin SDK Credentials
# Auto-generated from service account JSON
# Generated at: ${new Date().toISOString()}

FIREBASE_PROJECT_ID=${project_id}
FIREBASE_CLIENT_EMAIL=${client_email}
FIREBASE_PRIVATE_KEY="${private_key}"
`

  // Print to console
  console.log('=' .repeat(60))
  console.log('📋 Environment Variables (copy to Vercel):')
  console.log('=' .repeat(60))
  console.log()
  console.log(`FIREBASE_PROJECT_ID=${project_id}`)
  console.log()
  console.log(`FIREBASE_CLIENT_EMAIL=${client_email}`)
  console.log()
  console.log(`FIREBASE_PRIVATE_KEY=`)
  console.log(private_key)
  console.log()
  console.log('=' .repeat(60))

  // Save to .env.firebase file in project root (parent of server)
  const projectRoot = path.join(process.cwd(), '..')
  const envFilePath = path.join(projectRoot, '.env.firebase')
  fs.writeFileSync(envFilePath, envContent, 'utf-8')
  console.log(`\n✅ Saved to: ${envFilePath}`)
  console.log('\n💡 Tips:')
  console.log('   - For Vercel: Copy values above to Environment Variables')
  console.log('   - For local: Copy .env.firebase to server/.env or frontend/.env')
  console.log('   - The private key should be pasted as-is (with \\n characters)')
}

main()

