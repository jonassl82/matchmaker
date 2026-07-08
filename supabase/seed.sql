-- Optional seed for testing the pipeline end to end. Run after schema.sql.
-- Replace the woman's email with your own so you actually receive the drop.

insert into men (name, age, city, ig, description, open_to, places, vibes, status, last_confirmed_at)
values
  ('Daan', 41, 'Utrecht', '@daanveenstra',
   'Creative director who''d rather cook you dinner than text for three weeks. Dry, warm, a little too into his record collection.',
   'Drinks, a long dinner, a day festival.',
   array['Vrijdagborrel White Edition, Fri 17 Jul','TivoliVredenburg, most Thursdays'],
   array['classics','house']::text[], 'active', now()),
  ('Mark', 46, 'Utrecht', '@markdejong',
   'Founder, two kids half the week, properly grown up but still first onto the floor at the right party. Calm and outdoorsy.',
   'A walk that turns into drinks, a day festival, Sunday lunch.',
   array['Vroeg Pieken, next Utrecht edition','A quiet wine bar in Laren'],
   array['classics','beach','outdoors']::text[], 'active', now()),
  ('Sander', 38, 'Utrecht', '@sanderprins',
   'Architect. Runs in the morning, dances at night, allergic to small talk and dating-app energy.',
   'A museum night, live music, dinner.',
   array['Thuishaven, most warm Saturdays','Paradiso or Melkweg for a gig'],
   array['house','culture']::text[], 'active', now()),
  ('Thomas', 44, 'Utrecht', '@thomasbakker',
   'Runs a small agency. Funny in a low-key way, the friend everyone calls to organize the trip.',
   'Coffee that overruns, a festival, a long table with wine.',
   array['Fluor Amersfoort, regular','A good day festival'],
   array['borrel','house','dinner']::text[], 'active', now()),
  ('Bas', 48, 'Utrecht', '@basmeijer',
   'Doctor, dry sense of humor, quietly confident. Likes a proper conversation and an old-school party.',
   'Dinner, drinks, a classics night.',
   array['Back To The 70s 80s 90s, Fri 17 Jul','EKKO, Utrecht'],
   array['classics','dinner']::text[], 'active', now());

insert into women (name, email, age, city, age_min, age_max, liked_vibes, regions, status)
values
  ('Test Woman', 'you@example.com', 42, 'Utrecht', 35, 52,
   array['classics','house','beach','borrel']::text[], array['Utrecht']::text[], 'active');
