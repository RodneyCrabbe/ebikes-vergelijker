-- Remove all remaining duplicate e-bike records (keep only the ones with proper IDs starting with 550e8400)
DELETE FROM ebikes WHERE id = 'f09c7a3e-1abd-4171-831e-68408eb8e096'; -- Batavus Diva E-go Power duplicate
DELETE FROM ebikes WHERE id = 'b275e224-46fc-470a-aca8-9f10c41d1473'; -- Gazelle Ultimate C8+ HMB duplicate
DELETE FROM ebikes WHERE id = '37acd8ba-3bc3-425d-9cd1-c6a68714316d'; -- Giant Explore E+ 1 duplicate
DELETE FROM ebikes WHERE id = 'fa55021a-fb52-430a-bfd0-3addd2a91c05'; -- Koga E-Nova Evo duplicate
DELETE FROM ebikes WHERE id = '42f82f2f-0bb6-4886-9ee6-031e794ba90f'; -- Sparta e-Speed D11S duplicate
DELETE FROM ebikes WHERE id = '42230ac9-5dfb-4cf7-bc88-981c33097acb'; -- VanMoof S5 duplicate
