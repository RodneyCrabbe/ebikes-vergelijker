-- Fix image paths to use /img/ instead of /src/img/
UPDATE ebikes SET image_url = REPLACE(image_url, '/src/img/', '/img/') WHERE image_url LIKE '/src/img/%';
