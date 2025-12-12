#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const ENV_FILE = '.env'
const REQUIRED_VARS = ['VITE_WP_API_URL']

const FALLBACK_CONFIG = {
  VITE_WP_API_URL: 'https://your-wordpress-site.com/wp-json'
}

function checkEnvFile() {
  const envPath = path.join(__dirname, '..', ENV_FILE)
  
  if (!fs.existsSync(envPath)) {
    console.log('❌ .env file not found')
    return false
  }
  
  console.log('✅ .env file exists')
  return true
}

function validateEnvContent() {
  const envPath = path.join(__dirname, '..', ENV_FILE)
  
  if (!fs.existsSync(envPath)) {
    return { isValid: false, missing: REQUIRED_VARS }
  }
  
  const envContent = fs.readFileSync(envPath, 'utf8')
  const envVars = {}
  
  envContent.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=')
    if (key && valueParts.length > 0) {
      envVars[key.trim()] = valueParts.join('=').trim()
    }
  })
  
  const missing = REQUIRED_VARS.filter(varName => !envVars[varName])
  
  return {
    isValid: missing.length === 0,
    missing,
    envVars
  }
}

function createEnvFile() {
  const envPath = path.join(__dirname, '..', ENV_FILE)
  
  console.log('📝 Creating .env file with fallback configuration...')
  
  const envContent = Object.entries(FALLBACK_CONFIG)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n') + '\n'
  
  fs.writeFileSync(envPath, envContent)
  console.log('✅ .env file created successfully')
}

function main() {
  console.log('🔍 Checking environment configuration...\n')
  
  // Check if .env file exists
  const envExists = checkEnvFile()
  
  if (!envExists) {
    console.log('📝 Creating .env file...')
    createEnvFile()
    console.log('\n✅ Environment setup complete!')
    console.log('💡 You can now start the development server with: npm run dev')
    return
  }
  
  // Validate .env content
  const validation = validateEnvContent()
  
  if (validation.isValid) {
    console.log('✅ All required environment variables are present')
    console.log('✅ Environment configuration is valid')
  } else {
    console.log('❌ Missing environment variables:', validation.missing.join(', '))
    console.log('📝 Updating .env file with missing variables...')
    
    // Read existing .env content
    const envPath = path.join(__dirname, '..', ENV_FILE)
    let envContent = fs.readFileSync(envPath, 'utf8')
    
    // Add missing variables
    validation.missing.forEach(varName => {
      const value = FALLBACK_CONFIG[varName]
      if (value) {
        envContent += `\n${varName}=${value}`
        console.log(`✅ Added ${varName}`)
      }
    })
    
    fs.writeFileSync(envPath, envContent)
    console.log('\n✅ Environment configuration updated!')
  }
  
  console.log('\n💡 If you recently modified .env, restart the dev server:')
  console.log('   npm run dev')
}

// Run main function if this script is executed directly
main()

export { checkEnvFile, validateEnvContent, createEnvFile }
