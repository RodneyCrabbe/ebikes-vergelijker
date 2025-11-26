-- Update Knaap RTD X thumbnail image
UPDATE ebikes 
SET 
  image_url = '/src/img/Knaap RTD X/2.png',
  updated_at = NOW()
WHERE id = 'knaap-rtd-x-detailed';
