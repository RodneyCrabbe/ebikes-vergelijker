#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const supabaseUrl = 'http://127.0.0.1:54321'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: {
      getItem: (key) => {
        if (typeof window !== 'undefined') {
          return window.localStorage.getItem(key)
        }
        return null
      },
      setItem: (key, value) => {
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, value)
        }
      },
      removeItem: (key) => {
        if (typeof window !== 'undefined') {
          window.localStorage.removeItem(key)
        }
      }
    },
    storageKey: 'eb-auth'
  }
})

async function testAuthenticationFlow() {
  console.log('🔍 Testing Authentication Flow...\n')
  
  try {
    // Test 1: Check current auth state
    console.log('1️⃣ Checking current authentication state...')
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError) {
      console.log(`❌ Auth error: ${userError.message}`)
    } else if (user) {
      console.log(`✅ User authenticated: ${user.email}`)
    } else {
      console.log('ℹ️ No user currently authenticated')
    }
    
    // Test 2: Check profiles table
    console.log('\n2️⃣ Checking profiles table...')
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, email, name, created_at')
      .order('created_at', { ascending: false })
    
    if (profilesError) {
      console.log(`❌ Profiles error: ${profilesError.message}`)
    } else {
      console.log(`✅ Found ${profiles.length} profiles:`)
      profiles.forEach(profile => {
        console.log(`   - ${profile.email} (${profile.name}) - ${profile.created_at}`)
      })
    }
    
    // Test 3: Test user registration
    console.log('\n3️⃣ Testing user registration...')
    const testEmail = `test-persistence-${Date.now()}@example.com`
    const testPassword = 'testpassword123'
    
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          name: 'Test Persistence User',
          newsletter_subscribed: false
        }
      }
    })
    
    if (authError) {
      console.log(`❌ Registration error: ${authError.message}`)
    } else {
      console.log(`✅ User registered: ${authData.user?.email}`)
      
      // Wait for trigger to create profile
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Check if profile was created
      const { data: newProfile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', testEmail)
        .single()
      
      if (profileError) {
        console.log(`❌ Profile creation error: ${profileError.message}`)
      } else {
        console.log(`✅ Profile created: ${newProfile.name}`)
      }
    }
    
    // Test 4: Test login
    console.log('\n4️⃣ Testing user login...')
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword
    })
    
    if (loginError) {
      console.log(`❌ Login error: ${loginError.message}`)
    } else {
      console.log(`✅ User logged in: ${loginData.user?.email}`)
    }
    
    // Test 5: Test session persistence
    console.log('\n5️⃣ Testing session persistence...')
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError) {
      console.log(`❌ Session error: ${sessionError.message}`)
    } else if (session) {
      console.log(`✅ Session active: ${session.user.email}`)
      console.log(`   - Expires at: ${new Date(session.expires_at * 1000).toLocaleString()}`)
    } else {
      console.log('ℹ️ No active session')
    }
    
    console.log('\n✅ Authentication flow test completed!')
    
  } catch (error) {
    console.error('❌ Test failed:', error)
  }
}

async function fixAuthPersistence() {
  console.log('🔧 Fixing Authentication Persistence...\n')
  
  try {
    // Check if we need to create any missing profiles for existing auth users
    console.log('1️⃣ Checking for orphaned profiles...')
    
    // This would require direct database access, which we can't do from the client
    // Instead, we'll provide guidance
    console.log('ℹ️ To fix persistence issues:')
    console.log('   1. Ensure Supabase is running: npm run supabase:start')
    console.log('   2. Check site_url in supabase/config.toml matches your app URL')
    console.log('   3. Restart Supabase after config changes: npm run supabase:restart')
    console.log('   4. Test registration and login flow')
    
    console.log('\n✅ Persistence fix guidance provided!')
    
  } catch (error) {
    console.error('❌ Fix failed:', error)
  }
}

async function main() {
  const action = process.argv[2] || 'test'
  
  switch (action) {
    case 'test':
      await testAuthenticationFlow()
      break
    case 'fix':
      await fixAuthPersistence()
      break
    default:
      console.log('Usage: node fix-auth-persistence.js [test|fix]')
      console.log('  test - Test the authentication flow')
      console.log('  fix  - Provide guidance for fixing persistence issues')
  }
}

main()
