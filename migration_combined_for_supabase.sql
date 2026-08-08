-- Combined migration: upsert site_images, update image URLs, reset sequences

-- 1) Upsert site_images (from migration_sql.sql)
INSERT INTO public.site_images (id, slot_key, label, category, image_url, updated_at)
VALUES
(1, 'hero_slide_1', 'Hero Slide 1 - Main Building', 'Hero Slides', '', '2026-07-16 10:25:16'),
(2, 'hero_slide_2', 'Hero Slide 2 - World Education', 'Hero Slides', '', '2026-07-16 10:25:16'),
(3, 'hero_slide_3', 'Hero Slide 3 - Sports', 'Hero Slides', '', '2026-07-16 10:25:16'),
(4, 'hero_slide_4', 'Hero Slide 4 - Library', 'Hero Slides', '', '2026-07-16 10:25:16'),
(5, 'hero_slide_5', 'Hero Slide 5 - Cultural', 'Hero Slides', '', '2026-07-16 10:25:16'),
(6, 'hero_slide_6', 'Hero Slide 6 - Library Resources', 'Hero Slides', '', '2026-07-16 10:25:16'),
(7, 'about_image_1', 'About Section Image 1', 'About Section', '', '2026-07-16 10:25:16'),
(8, 'about_image_2', 'About Section Image 2', 'About Section', '', '2026-07-16 10:25:16'),
(9, 'about_image_3', 'About Section Image 3', 'About Section', '', '2026-07-16 10:25:16')
ON CONFLICT (id) DO UPDATE
  SET slot_key = EXCLUDED.slot_key,
      label = EXCLUDED.label,
      category = EXCLUDED.category,
      image_url = EXCLUDED.image_url,
      updated_at = EXCLUDED.updated_at;

-- 2) Update image/file URLs to Cloudinary (contents of update_image_urls.sql)
-- Paste the full contents of update_image_urls.sql below when running in Supabase SQL Editor.
-- It is large; include it after the upsert block, then run the sequence resets.

-- 3) Reset sequences for tables with serial primary keys
SELECT setval(pg_get_serial_sequence('site_images','id'), COALESCE((SELECT MAX(id) FROM site_images),0));
SELECT setval(pg_get_serial_sequence('hero_slides','id'), COALESCE((SELECT MAX(id) FROM hero_slides),0));
SELECT setval(pg_get_serial_sequence('gallery','id'), COALESCE((SELECT MAX(id) FROM gallery),0));
SELECT setval(pg_get_serial_sequence('events','id'), COALESCE((SELECT MAX(id) FROM events),0));
SELECT setval(pg_get_serial_sequence('past_event_photos','id'), COALESCE((SELECT MAX(id) FROM past_event_photos),0));
SELECT setval(pg_get_serial_sequence('documents','id'), COALESCE((SELECT MAX(id) FROM documents),0));
SELECT setval(pg_get_serial_sequence('teacher_applications','id'), COALESCE((SELECT MAX(id) FROM teacher_applications),0));

COMMIT;

