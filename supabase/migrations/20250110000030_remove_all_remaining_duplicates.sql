-- Remove all remaining duplicate e-bike records (keep only the ones with proper IDs starting with 550e8400)
DELETE FROM ebikes WHERE id = '41b90314-471c-47d1-addd-b20176db2096'; -- Batavus Diva E-go Power duplicate
DELETE FROM ebikes WHERE id = 'ce2cf7bb-3e96-437f-84c8-cab85c12f3c5'; -- Gazelle Ultimate C8+ HMB duplicate
DELETE FROM ebikes WHERE id = '43a473ce-aff6-447f-a731-f83b8ee0fb7f'; -- Giant Explore E+ 1 duplicate
DELETE FROM ebikes WHERE id = '474bdc95-705f-41ad-a51a-10efec7d53b7'; -- Koga E-Nova Evo duplicate
DELETE FROM ebikes WHERE id = '3cf72a3e-b9e0-41d6-aeb4-044409b077eb'; -- Sparta e-Speed D11S duplicate
DELETE FROM ebikes WHERE id = 'd7f86a82-ec13-4abc-bcbb-712fb749fa75'; -- VanMoof S5 duplicate
