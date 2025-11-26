-- Remove duplicate e-bike records (keeping the ones with proper IDs and images)
DELETE FROM ebikes WHERE id = 'ffdd9997-d6da-485d-97a4-186a26a188ff'; -- VanMoof S5 duplicate
DELETE FROM ebikes WHERE id = '07feb58a-142e-4c88-8729-90eedb85e063'; -- Batavus Diva E-go Power (different model)
DELETE FROM ebikes WHERE id = 'b0c074ca-a6ea-413d-a2a8-21881086cf58'; -- Giant Explore E+ 1 duplicate
DELETE FROM ebikes WHERE id = '2c1e09a1-0c9a-449d-8c0e-e3411d05ab4a'; -- Sparta e-Speed D11S duplicate
DELETE FROM ebikes WHERE id = '4c5f6447-ba2e-4b82-a0fd-e28bf5dfe2e4'; -- Gazelle Ultimate C8+ HMB duplicate
DELETE FROM ebikes WHERE id = '34fd4ca0-89da-41f7-8319-a7a4cee4c1cc'; -- Koga E-Nova Evo duplicate
