-- Update Knaap BCN thumbnail image
UPDATE ebikes 
SET 
  image_url = '/src/img/Knaap BCN/17599213921.jpg',
  updated_at = NOW()
WHERE id = 'knaap-bcn-black-detailed';
