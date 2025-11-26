const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Supabase configuration
const supabaseUrl = 'http://127.0.0.1:54321'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'

const supabase = createClient(supabaseUrl, supabaseKey)

// Function to get all images for a specific e-bike from the public/img directory
function getAvailableImages(brand, modelName) {
  const imgDir = path.join(__dirname, 'public', 'img')
  const images = []
  
  // Try different possible directory names
  const possibleDirs = [
    `${brand} ${modelName}`,
    `${brand} ${modelName.replace(/[^a-zA-Z0-9\s]/g, '')}`,
    `${brand}`,
    modelName,
    modelName.replace(/[^a-zA-Z0-9\s]/g, '')
  ]
  
  for (const dirName of possibleDirs) {
    const dirPath = path.join(imgDir, dirName)
    if (fs.existsSync(dirPath)) {
      const files = fs.readdirSync(dirPath)
      const imageFiles = files.filter(file => 
        /\.(jpg|jpeg|png|webp|avif)$/i.test(file)
      )
      
      for (const file of imageFiles) {
        images.push(`/img/${dirName}/${file}`)
      }
      
      if (images.length > 0) {
        break // Found images, stop looking
      }
    }
  }
  
  return images
}

async function getSupabaseData() {
  try {
    console.log('🔍 Connecting to Supabase...')
    
    // Test connection
    const { data: testData, error: testError } = await supabase
      .from('ebikes')
      .select('count')
      .limit(1)
    
    if (testError) {
      console.error('❌ Error connecting to Supabase:', testError)
      return
    }
    
    console.log('✅ Connected to Supabase successfully')
    
    // Get all e-bikes
    console.log('📦 Fetching all e-bikes...')
    const { data: ebikes, error } = await supabase
      .from('ebikes')
      .select('*')
      .order('created_at', { ascending: true })
    
    if (error) {
      console.error('❌ Error fetching e-bikes:', error)
      return
    }
    
    console.log(`✅ Found ${ebikes.length} e-bikes`)
    
    // Process each e-bike to add image arrays
    const processedEbikes = ebikes.map(ebike => {
      console.log(`🖼️  Processing images for ${ebike.brand} ${ebike.model_name}...`)
      
      // Get available images
      const images = getAvailableImages(ebike.brand, ebike.model_name)
      
      // Convert dates to proper format
      const processedEbike = {
        ...ebike,
        build_date: ebike.build_date ? new Date(ebike.build_date).toISOString() : null,
        created_at: ebike.created_at ? new Date(ebike.created_at).toISOString() : new Date().toISOString(),
        updated_at: ebike.updated_at ? new Date(ebike.updated_at).toISOString() : new Date().toISOString(),
        images: images.length > 0 ? images : [ebike.image_url || '/api/placeholder/600/600'],
        // Keep the original image_url as the main image
        image_url: images.length > 0 ? images[0] : (ebike.image_url || '/api/placeholder/600/600')
      }
      
      console.log(`   Found ${images.length} images`)
      return processedEbike
    })
    
    // Save to local file
    const outputPath = path.join(__dirname, 'src', 'data', 'ebikes.json')
    const outputDir = path.dirname(outputPath)
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true })
    }
    
    fs.writeFileSync(outputPath, JSON.stringify(processedEbikes, null, 2))
    console.log(`✅ Saved ${processedEbikes.length} e-bikes to ${outputPath}`)
    
    // Also create a summary
    const summary = {
      total_ebikes: processedEbikes.length,
      brands: [...new Set(processedEbikes.map(e => e.brand))],
      total_images: processedEbikes.reduce((sum, e) => sum + e.images.length, 0),
      generated_at: new Date().toISOString()
    }
    
    const summaryPath = path.join(__dirname, 'src', 'data', 'ebikes_summary.json')
    fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2))
    console.log(`✅ Saved summary to ${summaryPath}`)
    
    console.log('\n📊 Summary:')
    console.log(`   Total e-bikes: ${summary.total_ebikes}`)
    console.log(`   Brands: ${summary.brands.join(', ')}`)
    console.log(`   Total images: ${summary.total_images}`)
    
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

// Run the script
getSupabaseData()
