-- Remove ALL duplicate e-bike records (keep only the ones with proper IDs starting with 550e8400)
DELETE FROM ebikes WHERE id = 'cd68a75e-43ff-4ec1-8a32-4ee6278ece4a'; -- Batavus Diva E-go Power duplicate
DELETE FROM ebikes WHERE id = '3e7a4557-27c5-4ea7-a16f-c4d8bcade6c8'; -- Gazelle Ultimate C8+ HMB duplicate
DELETE FROM ebikes WHERE id = '6ec94c0a-d4fa-4027-ae80-13306bb6ffdb'; -- Giant Explore E+ 1 duplicate
DELETE FROM ebikes WHERE id = '903fe2d3-4b04-47ca-bbfc-a5de4ae88b44'; -- Koga E-Nova Evo duplicate
DELETE FROM ebikes WHERE id = '0bf0d3e9-ff86-4a1a-bae1-2909cc8a4f0b'; -- Sparta e-Speed D11S duplicate
DELETE FROM ebikes WHERE id = '5f6a7355-0c73-4085-9131-7677a85b4fc7'; -- VanMoof S5 duplicate

-- Also remove any other duplicates that might exist
DELETE FROM ebikes WHERE id NOT LIKE '550e8400-%' AND brand IN ('Batavus', 'Gazelle', 'Giant', 'Koga', 'Sparta', 'VanMoof', 'VANMOOF');
