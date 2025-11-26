/**
 * Comprehensive Health Check Script
 * Verifies all services are running correctly
 */
const BASE_URL = 'http://127.0.0.1:5173';
const SUPABASE_URL = 'http://127.0.0.1:54321';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

async function checkService(name, url, validate) {
  try {
    console.log(`🔍 Checking ${name}...`);
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const result = await validate(response);
    console.log(`✅ ${name}: ${result}`);
    return true;
  } catch (error) {
    console.log(`❌ ${name}: ${error.message}`);
    return false;
  }
}

async function checkSupabase() {
  return await checkService('Supabase API', `${SUPABASE_URL}/rest/v1/ebikes?select=count`, async (response) => {
    const data = await response.json();
    return `Found ${data.length} e-bikes`;
  });
}

async function checkDevServer() {
  return await checkService('Dev Server', BASE_URL, async (response) => {
    const html = await response.text();
    if (html.includes('Vite') || html.includes('vite') || html.includes('app') || html.includes('<!doctype html>')) {
      return 'Dev server running';
    } else {
      throw new Error('Not a valid dev server response');
    }
  });
}

async function main() {
  console.log('╔════════════════════════════════════════╗');
  console.log('║     HEALTH CHECK                       ║');
  console.log('╚════════════════════════════════════════╝');
  
  const supabaseOk = await checkSupabase();
  const devServerOk = await checkDevServer();
  
  console.log('\n📊 Summary:');
  console.log(`Supabase: ${supabaseOk ? '✅' : '❌'}`);
  console.log(`Dev Server: ${devServerOk ? '✅' : '❌'}`);
  
  if (supabaseOk && devServerOk) {
    console.log('\n🎉 All services are healthy!');
    console.log(`🌐 App URL: ${BASE_URL}`);
    console.log(`🗄️  Supabase Studio: ${SUPABASE_URL.replace('54321', '54323')}`);
  } else {
    console.log('\n⚠️  Some services are not running properly.');
    process.exit(1);
  }
}

main().catch(console.error);