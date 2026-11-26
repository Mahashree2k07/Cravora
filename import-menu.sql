BEGIN;
INSERT INTO courses (name) VALUES ('appetizer') ON CONFLICT (name) DO NOTHING;
INSERT INTO courses (name) VALUES ('bread') ON CONFLICT (name) DO NOTHING;
INSERT INTO courses (name) VALUES ('dessert') ON CONFLICT (name) DO NOTHING;
INSERT INTO courses (name) VALUES ('main') ON CONFLICT (name) DO NOTHING;
INSERT INTO courses (name) VALUES ('rice') ON CONFLICT (name) DO NOTHING;
INSERT INTO courses (name) VALUES ('salad') ON CONFLICT (name) DO NOTHING;
INSERT INTO courses (name) VALUES ('side') ON CONFLICT (name) DO NOTHING;
INSERT INTO courses (name) VALUES ('welcome_drink') ON CONFLICT (name) DO NOTHING;
INSERT INTO cuisine_regions (name) VALUES ('fusion') ON CONFLICT (name) DO NOTHING;
INSERT INTO cuisine_regions (name) VALUES ('indo_chinese') ON CONFLICT (name) DO NOTHING;
INSERT INTO cuisine_regions (name) VALUES ('mughlai') ON CONFLICT (name) DO NOTHING;
INSERT INTO cuisine_regions (name) VALUES ('north_indian') ON CONFLICT (name) DO NOTHING;
INSERT INTO cuisine_regions (name) VALUES ('pan_indian') ON CONFLICT (name) DO NOTHING;
INSERT INTO cuisine_regions (name) VALUES ('south_indian') ON CONFLICT (name) DO NOTHING;
INSERT INTO cuisine_regions (name) VALUES ('street_food') ON CONFLICT (name) DO NOTHING;
INSERT INTO mood_tags (name) VALUES ('bold') ON CONFLICT (name) DO NOTHING;
INSERT INTO mood_tags (name) VALUES ('comfort') ON CONFLICT (name) DO NOTHING;
INSERT INTO mood_tags (name) VALUES ('festive') ON CONFLICT (name) DO NOTHING;
INSERT INTO mood_tags (name) VALUES ('floral') ON CONFLICT (name) DO NOTHING;
INSERT INTO mood_tags (name) VALUES ('fresh') ON CONFLICT (name) DO NOTHING;
INSERT INTO mood_tags (name) VALUES ('fun') ON CONFLICT (name) DO NOTHING;
INSERT INTO mood_tags (name) VALUES ('hearty') ON CONFLICT (name) DO NOTHING;
INSERT INTO mood_tags (name) VALUES ('indulgent') ON CONFLICT (name) DO NOTHING;
INSERT INTO mood_tags (name) VALUES ('light') ON CONFLICT (name) DO NOTHING;
INSERT INTO dietary_tags (name) VALUES ('dairy_free') ON CONFLICT (name) DO NOTHING;
INSERT INTO dietary_tags (name) VALUES ('gluten_free') ON CONFLICT (name) DO NOTHING;
INSERT INTO dietary_tags (name) VALUES ('halal') ON CONFLICT (name) DO NOTHING;
INSERT INTO dietary_tags (name) VALUES ('jain') ON CONFLICT (name) DO NOTHING;
INSERT INTO dietary_tags (name) VALUES ('nut_free') ON CONFLICT (name) DO NOTHING;
INSERT INTO dietary_tags (name) VALUES ('vegan') ON CONFLICT (name) DO NOTHING;
INSERT INTO dietary_tags (name) VALUES ('vegetarian') ON CONFLICT (name) DO NOTHING;
INSERT INTO allergens (name) VALUES ('dairy') ON CONFLICT (name) DO NOTHING;
INSERT INTO allergens (name) VALUES ('eggs') ON CONFLICT (name) DO NOTHING;
INSERT INTO allergens (name) VALUES ('fish') ON CONFLICT (name) DO NOTHING;
INSERT INTO allergens (name) VALUES ('gluten') ON CONFLICT (name) DO NOTHING;
INSERT INTO allergens (name) VALUES ('nuts') ON CONFLICT (name) DO NOTHING;
INSERT INTO allergens (name) VALUES ('sesame') ON CONFLICT (name) DO NOTHING;
INSERT INTO allergens (name) VALUES ('shellfish') ON CONFLICT (name) DO NOTHING;
INSERT INTO menu_items
(id, name, description, course_id, cuisine_region_id, spice_level,
 retail_price_inr, retail_price_usd, is_signature, image_url)
VALUES
(
    'a2c80e75-bc64-412b-a44c-5242647575c3'::uuid,
    'Mango Habanero Paneer Tikka',
    'Tandoor-grilled paneer glazed with a sweet-hot mango habanero marinade.',
    (SELECT id FROM courses WHERE name = 'appetizer'),
    (SELECT id FROM cuisine_regions WHERE name = 'north_indian'),
    3,
    249,
    NULL,
    TRUE,
    '/images/menu/mango-habanero-paneer-tikka.jpg'
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    course_id = EXCLUDED.course_id,
    cuisine_region_id = EXCLUDED.cuisine_region_id,
    spice_level = EXCLUDED.spice_level,
    retail_price_inr = EXCLUDED.retail_price_inr,
    retail_price_usd = EXCLUDED.retail_price_usd,
    is_signature = EXCLUDED.is_signature,
    image_url = EXCLUDED.image_url;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT 'a2c80e75-bc64-412b-a44c-5242647575c3'::uuid, id FROM mood_tags WHERE name = 'bold' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT 'a2c80e75-bc64-412b-a44c-5242647575c3'::uuid, id FROM mood_tags WHERE name = 'festive' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'a2c80e75-bc64-412b-a44c-5242647575c3'::uuid, id FROM dietary_tags WHERE name = 'vegetarian' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'a2c80e75-bc64-412b-a44c-5242647575c3'::uuid, id FROM dietary_tags WHERE name = 'gluten_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'a2c80e75-bc64-412b-a44c-5242647575c3'::uuid, id FROM dietary_tags WHERE name = 'nut_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) SELECT 'a2c80e75-bc64-412b-a44c-5242647575c3'::uuid, id FROM allergens WHERE name = 'dairy' ON CONFLICT DO NOTHING;
INSERT INTO menu_items
(id, name, description, course_id, cuisine_region_id, spice_level,
 retail_price_inr, retail_price_usd, is_signature, image_url)
VALUES
(
    '70f95c52-4f8c-43e7-a626-7d3d62117ea3'::uuid,
    'Bangkok Bliss Chana',
    'Crispy chickpeas tossed in a Thai-inspired sweet, sour and spicy glaze.',
    (SELECT id FROM courses WHERE name = 'appetizer'),
    (SELECT id FROM cuisine_regions WHERE name = 'fusion'),
    3,
    199,
    NULL,
    FALSE,
    '/images/menu/bangkok-bliss-chana.jpg'
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    course_id = EXCLUDED.course_id,
    cuisine_region_id = EXCLUDED.cuisine_region_id,
    spice_level = EXCLUDED.spice_level,
    retail_price_inr = EXCLUDED.retail_price_inr,
    retail_price_usd = EXCLUDED.retail_price_usd,
    is_signature = EXCLUDED.is_signature,
    image_url = EXCLUDED.image_url;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '70f95c52-4f8c-43e7-a626-7d3d62117ea3'::uuid, id FROM mood_tags WHERE name = 'bold' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '70f95c52-4f8c-43e7-a626-7d3d62117ea3'::uuid, id FROM mood_tags WHERE name = 'fresh' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '70f95c52-4f8c-43e7-a626-7d3d62117ea3'::uuid, id FROM dietary_tags WHERE name = 'vegetarian' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '70f95c52-4f8c-43e7-a626-7d3d62117ea3'::uuid, id FROM dietary_tags WHERE name = 'vegan' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '70f95c52-4f8c-43e7-a626-7d3d62117ea3'::uuid, id FROM dietary_tags WHERE name = 'dairy_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '70f95c52-4f8c-43e7-a626-7d3d62117ea3'::uuid, id FROM dietary_tags WHERE name = 'nut_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_items
(id, name, description, course_id, cuisine_region_id, spice_level,
 retail_price_inr, retail_price_usd, is_signature, image_url)
VALUES
(
    'c9bf40c3-b127-48e5-b5a3-f862479f4a25'::uuid,
    'Paneer Ke Angare Cups',
    'Smoky chargrilled paneer served in crisp pastry cups.',
    (SELECT id FROM courses WHERE name = 'appetizer'),
    (SELECT id FROM cuisine_regions WHERE name = 'north_indian'),
    2,
    229,
    NULL,
    FALSE,
    '/images/menu/paneer-ke-angare-cups.jpg'
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    course_id = EXCLUDED.course_id,
    cuisine_region_id = EXCLUDED.cuisine_region_id,
    spice_level = EXCLUDED.spice_level,
    retail_price_inr = EXCLUDED.retail_price_inr,
    retail_price_usd = EXCLUDED.retail_price_usd,
    is_signature = EXCLUDED.is_signature,
    image_url = EXCLUDED.image_url;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT 'c9bf40c3-b127-48e5-b5a3-f862479f4a25'::uuid, id FROM mood_tags WHERE name = 'bold' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT 'c9bf40c3-b127-48e5-b5a3-f862479f4a25'::uuid, id FROM mood_tags WHERE name = 'indulgent' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'c9bf40c3-b127-48e5-b5a3-f862479f4a25'::uuid, id FROM dietary_tags WHERE name = 'vegetarian' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'c9bf40c3-b127-48e5-b5a3-f862479f4a25'::uuid, id FROM dietary_tags WHERE name = 'nut_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) SELECT 'c9bf40c3-b127-48e5-b5a3-f862479f4a25'::uuid, id FROM allergens WHERE name = 'dairy' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) SELECT 'c9bf40c3-b127-48e5-b5a3-f862479f4a25'::uuid, id FROM allergens WHERE name = 'gluten' ON CONFLICT DO NOTHING;
INSERT INTO menu_items
(id, name, description, course_id, cuisine_region_id, spice_level,
 retail_price_inr, retail_price_usd, is_signature, image_url)
VALUES
(
    '63a8211b-509f-40ad-8a0c-a60af964f61c'::uuid,
    'Aloo Croquets',
    'Golden potato croquettes with a soft spiced filling.',
    (SELECT id FROM courses WHERE name = 'appetizer'),
    (SELECT id FROM cuisine_regions WHERE name = 'north_indian'),
    2,
    169,
    NULL,
    FALSE,
    '/images/menu/aloo-croquets.jpg'
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    course_id = EXCLUDED.course_id,
    cuisine_region_id = EXCLUDED.cuisine_region_id,
    spice_level = EXCLUDED.spice_level,
    retail_price_inr = EXCLUDED.retail_price_inr,
    retail_price_usd = EXCLUDED.retail_price_usd,
    is_signature = EXCLUDED.is_signature,
    image_url = EXCLUDED.image_url;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '63a8211b-509f-40ad-8a0c-a60af964f61c'::uuid, id FROM mood_tags WHERE name = 'comfort' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '63a8211b-509f-40ad-8a0c-a60af964f61c'::uuid, id FROM dietary_tags WHERE name = 'vegetarian' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '63a8211b-509f-40ad-8a0c-a60af964f61c'::uuid, id FROM dietary_tags WHERE name = 'nut_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) SELECT '63a8211b-509f-40ad-8a0c-a60af964f61c'::uuid, id FROM allergens WHERE name = 'gluten' ON CONFLICT DO NOTHING;
INSERT INTO menu_items
(id, name, description, course_id, cuisine_region_id, spice_level,
 retail_price_inr, retail_price_usd, is_signature, image_url)
VALUES
(
    'f62bdccc-db98-4e63-a3d8-bceaaa47dd43'::uuid,
    'Pineapple Blaze Paneer Tikka',
    'Paneer tikka brushed with a smoky pineapple-chilli glaze.',
    (SELECT id FROM courses WHERE name = 'appetizer'),
    (SELECT id FROM cuisine_regions WHERE name = 'north_indian'),
    3,
    239,
    NULL,
    FALSE,
    '/images/menu/pineapple-blaze-paneer-tikka.jpg'
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    course_id = EXCLUDED.course_id,
    cuisine_region_id = EXCLUDED.cuisine_region_id,
    spice_level = EXCLUDED.spice_level,
    retail_price_inr = EXCLUDED.retail_price_inr,
    retail_price_usd = EXCLUDED.retail_price_usd,
    is_signature = EXCLUDED.is_signature,
    image_url = EXCLUDED.image_url;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT 'f62bdccc-db98-4e63-a3d8-bceaaa47dd43'::uuid, id FROM mood_tags WHERE name = 'bold' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT 'f62bdccc-db98-4e63-a3d8-bceaaa47dd43'::uuid, id FROM mood_tags WHERE name = 'festive' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'f62bdccc-db98-4e63-a3d8-bceaaa47dd43'::uuid, id FROM dietary_tags WHERE name = 'vegetarian' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'f62bdccc-db98-4e63-a3d8-bceaaa47dd43'::uuid, id FROM dietary_tags WHERE name = 'gluten_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'f62bdccc-db98-4e63-a3d8-bceaaa47dd43'::uuid, id FROM dietary_tags WHERE name = 'nut_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) SELECT 'f62bdccc-db98-4e63-a3d8-bceaaa47dd43'::uuid, id FROM allergens WHERE name = 'dairy' ON CONFLICT DO NOTHING;
INSERT INTO menu_items
(id, name, description, course_id, cuisine_region_id, spice_level,
 retail_price_inr, retail_price_usd, is_signature, image_url)
VALUES
(
    '62e97018-38fb-4b27-b71c-02b1d5aacdd2'::uuid,
    'Beetroot Croquets with Aioli Chutney',
    'Roasted-beet croquettes with a herbed aioli chutney.',
    (SELECT id FROM courses WHERE name = 'appetizer'),
    (SELECT id FROM cuisine_regions WHERE name = 'fusion'),
    2,
    199,
    NULL,
    FALSE,
    '/images/menu/beetroot-croquets-with-aioli-chutney.jpg'
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    course_id = EXCLUDED.course_id,
    cuisine_region_id = EXCLUDED.cuisine_region_id,
    spice_level = EXCLUDED.spice_level,
    retail_price_inr = EXCLUDED.retail_price_inr,
    retail_price_usd = EXCLUDED.retail_price_usd,
    is_signature = EXCLUDED.is_signature,
    image_url = EXCLUDED.image_url;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '62e97018-38fb-4b27-b71c-02b1d5aacdd2'::uuid, id FROM mood_tags WHERE name = 'fresh' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '62e97018-38fb-4b27-b71c-02b1d5aacdd2'::uuid, id FROM mood_tags WHERE name = 'light' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '62e97018-38fb-4b27-b71c-02b1d5aacdd2'::uuid, id FROM dietary_tags WHERE name = 'vegetarian' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '62e97018-38fb-4b27-b71c-02b1d5aacdd2'::uuid, id FROM dietary_tags WHERE name = 'nut_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) SELECT '62e97018-38fb-4b27-b71c-02b1d5aacdd2'::uuid, id FROM allergens WHERE name = 'gluten' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) SELECT '62e97018-38fb-4b27-b71c-02b1d5aacdd2'::uuid, id FROM allergens WHERE name = 'eggs' ON CONFLICT DO NOTHING;
INSERT INTO menu_items
(id, name, description, course_id, cuisine_region_id, spice_level,
 retail_price_inr, retail_price_usd, is_signature, image_url)
VALUES
(
    '2bb7927d-4e81-4494-8e3c-2c25dd92b82f'::uuid,
    'Sprouted Chana Salad',
    'Mixed sprouted lentils tossed with onion, tomato, lemon and chaat masala.',
    (SELECT id FROM courses WHERE name = 'appetizer'),
    (SELECT id FROM cuisine_regions WHERE name = 'street_food'),
    2,
    159,
    NULL,
    FALSE,
    '/images/menu/sprouted-chana-salad.jpg'
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    course_id = EXCLUDED.course_id,
    cuisine_region_id = EXCLUDED.cuisine_region_id,
    spice_level = EXCLUDED.spice_level,
    retail_price_inr = EXCLUDED.retail_price_inr,
    retail_price_usd = EXCLUDED.retail_price_usd,
    is_signature = EXCLUDED.is_signature,
    image_url = EXCLUDED.image_url;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '2bb7927d-4e81-4494-8e3c-2c25dd92b82f'::uuid, id FROM mood_tags WHERE name = 'fresh' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '2bb7927d-4e81-4494-8e3c-2c25dd92b82f'::uuid, id FROM mood_tags WHERE name = 'light' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '2bb7927d-4e81-4494-8e3c-2c25dd92b82f'::uuid, id FROM dietary_tags WHERE name = 'vegetarian' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '2bb7927d-4e81-4494-8e3c-2c25dd92b82f'::uuid, id FROM dietary_tags WHERE name = 'vegan' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '2bb7927d-4e81-4494-8e3c-2c25dd92b82f'::uuid, id FROM dietary_tags WHERE name = 'gluten_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '2bb7927d-4e81-4494-8e3c-2c25dd92b82f'::uuid, id FROM dietary_tags WHERE name = 'dairy_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '2bb7927d-4e81-4494-8e3c-2c25dd92b82f'::uuid, id FROM dietary_tags WHERE name = 'nut_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_items
(id, name, description, course_id, cuisine_region_id, spice_level,
 retail_price_inr, retail_price_usd, is_signature, image_url)
VALUES
(
    '3ae5fb08-dd9e-44ab-987e-3f98787f8f56'::uuid,
    'Bang Bang Paneer',
    'Crisp-fried paneer in a creamy bang bang sauce.',
    (SELECT id FROM courses WHERE name = 'appetizer'),
    (SELECT id FROM cuisine_regions WHERE name = 'indo_chinese'),
    3,
    229,
    NULL,
    FALSE,
    '/images/menu/bang-bang-paneer.jpg'
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    course_id = EXCLUDED.course_id,
    cuisine_region_id = EXCLUDED.cuisine_region_id,
    spice_level = EXCLUDED.spice_level,
    retail_price_inr = EXCLUDED.retail_price_inr,
    retail_price_usd = EXCLUDED.retail_price_usd,
    is_signature = EXCLUDED.is_signature,
    image_url = EXCLUDED.image_url;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '3ae5fb08-dd9e-44ab-987e-3f98787f8f56'::uuid, id FROM mood_tags WHERE name = 'bold' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '3ae5fb08-dd9e-44ab-987e-3f98787f8f56'::uuid, id FROM mood_tags WHERE name = 'indulgent' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '3ae5fb08-dd9e-44ab-987e-3f98787f8f56'::uuid, id FROM dietary_tags WHERE name = 'vegetarian' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '3ae5fb08-dd9e-44ab-987e-3f98787f8f56'::uuid, id FROM dietary_tags WHERE name = 'nut_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) SELECT '3ae5fb08-dd9e-44ab-987e-3f98787f8f56'::uuid, id FROM allergens WHERE name = 'dairy' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) SELECT '3ae5fb08-dd9e-44ab-987e-3f98787f8f56'::uuid, id FROM allergens WHERE name = 'gluten' ON CONFLICT DO NOTHING;
INSERT INTO menu_items
(id, name, description, course_id, cuisine_region_id, spice_level,
 retail_price_inr, retail_price_usd, is_signature, image_url)
VALUES
(
    '5d488470-a6c6-4669-976f-3b630215cc85'::uuid,
    'Bhel Poori (Mango or Avocado)',
    'Puffed rice tossed with chutneys, sev and a mango or avocado twist.',
    (SELECT id FROM courses WHERE name = 'appetizer'),
    (SELECT id FROM cuisine_regions WHERE name = 'street_food'),
    2,
    149,
    NULL,
    FALSE,
    '/images/menu/bhel-poori-mango-or-avocado.jpg'
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    course_id = EXCLUDED.course_id,
    cuisine_region_id = EXCLUDED.cuisine_region_id,
    spice_level = EXCLUDED.spice_level,
    retail_price_inr = EXCLUDED.retail_price_inr,
    retail_price_usd = EXCLUDED.retail_price_usd,
    is_signature = EXCLUDED.is_signature,
    image_url = EXCLUDED.image_url;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '5d488470-a6c6-4669-976f-3b630215cc85'::uuid, id FROM mood_tags WHERE name = 'fresh' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '5d488470-a6c6-4669-976f-3b630215cc85'::uuid, id FROM mood_tags WHERE name = 'light' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '5d488470-a6c6-4669-976f-3b630215cc85'::uuid, id FROM dietary_tags WHERE name = 'vegetarian' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '5d488470-a6c6-4669-976f-3b630215cc85'::uuid, id FROM dietary_tags WHERE name = 'vegan' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '5d488470-a6c6-4669-976f-3b630215cc85'::uuid, id FROM dietary_tags WHERE name = 'dairy_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '5d488470-a6c6-4669-976f-3b630215cc85'::uuid, id FROM dietary_tags WHERE name = 'nut_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) SELECT '5d488470-a6c6-4669-976f-3b630215cc85'::uuid, id FROM allergens WHERE name = 'gluten' ON CONFLICT DO NOTHING;
INSERT INTO menu_items
(id, name, description, course_id, cuisine_region_id, spice_level,
 retail_price_inr, retail_price_usd, is_signature, image_url)
VALUES
(
    'a3d1d0a7-7b0b-4a6a-8974-e30a0e3e14ad'::uuid,
    'Kale Chaat',
    'Crispy fried kale leaves tossed with sweet yoghurt and chutneys.',
    (SELECT id FROM courses WHERE name = 'appetizer'),
    (SELECT id FROM cuisine_regions WHERE name = 'fusion'),
    2,
    199,
    NULL,
    FALSE,
    '/images/menu/kale-chaat.jpg'
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    course_id = EXCLUDED.course_id,
    cuisine_region_id = EXCLUDED.cuisine_region_id,
    spice_level = EXCLUDED.spice_level,
    retail_price_inr = EXCLUDED.retail_price_inr,
    retail_price_usd = EXCLUDED.retail_price_usd,
    is_signature = EXCLUDED.is_signature,
    image_url = EXCLUDED.image_url;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT 'a3d1d0a7-7b0b-4a6a-8974-e30a0e3e14ad'::uuid, id FROM mood_tags WHERE name = 'fresh' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT 'a3d1d0a7-7b0b-4a6a-8974-e30a0e3e14ad'::uuid, id FROM mood_tags WHERE name = 'light' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'a3d1d0a7-7b0b-4a6a-8974-e30a0e3e14ad'::uuid, id FROM dietary_tags WHERE name = 'vegetarian' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'a3d1d0a7-7b0b-4a6a-8974-e30a0e3e14ad'::uuid, id FROM dietary_tags WHERE name = 'nut_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) SELECT 'a3d1d0a7-7b0b-4a6a-8974-e30a0e3e14ad'::uuid, id FROM allergens WHERE name = 'dairy' ON CONFLICT DO NOTHING;
INSERT INTO menu_items
(id, name, description, course_id, cuisine_region_id, spice_level,
 retail_price_inr, retail_price_usd, is_signature, image_url)
VALUES
(
    'b61a8e5e-103e-437a-b41b-13525ba2f66a'::uuid,
    'Banarasi Kachori',
    'Flaky pastry stuffed with spiced lentils, Banaras-style.',
    (SELECT id FROM courses WHERE name = 'appetizer'),
    (SELECT id FROM cuisine_regions WHERE name = 'north_indian'),
    2,
    169,
    NULL,
    FALSE,
    '/images/menu/banarasi-kachori.jpg'
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    course_id = EXCLUDED.course_id,
    cuisine_region_id = EXCLUDED.cuisine_region_id,
    spice_level = EXCLUDED.spice_level,
    retail_price_inr = EXCLUDED.retail_price_inr,
    retail_price_usd = EXCLUDED.retail_price_usd,
    is_signature = EXCLUDED.is_signature,
    image_url = EXCLUDED.image_url;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT 'b61a8e5e-103e-437a-b41b-13525ba2f66a'::uuid, id FROM mood_tags WHERE name = 'comfort' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'b61a8e5e-103e-437a-b41b-13525ba2f66a'::uuid, id FROM dietary_tags WHERE name = 'vegetarian' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'b61a8e5e-103e-437a-b41b-13525ba2f66a'::uuid, id FROM dietary_tags WHERE name = 'vegan' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'b61a8e5e-103e-437a-b41b-13525ba2f66a'::uuid, id FROM dietary_tags WHERE name = 'dairy_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'b61a8e5e-103e-437a-b41b-13525ba2f66a'::uuid, id FROM dietary_tags WHERE name = 'nut_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) SELECT 'b61a8e5e-103e-437a-b41b-13525ba2f66a'::uuid, id FROM allergens WHERE name = 'gluten' ON CONFLICT DO NOTHING;
INSERT INTO menu_items
(id, name, description, course_id, cuisine_region_id, spice_level,
 retail_price_inr, retail_price_usd, is_signature, image_url)
VALUES
(
    'a72c4108-e909-4a21-9483-355e7ff0456f'::uuid,
    'Rani Kebab Cylinders',
    'Spiced vegetable kebabs rolled into delicate cylinders and pan-seared.',
    (SELECT id FROM courses WHERE name = 'appetizer'),
    (SELECT id FROM cuisine_regions WHERE name = 'north_indian'),
    2,
    229,
    NULL,
    FALSE,
    '/images/menu/rani-kebab-cylinders.jpg'
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    course_id = EXCLUDED.course_id,
    cuisine_region_id = EXCLUDED.cuisine_region_id,
    spice_level = EXCLUDED.spice_level,
    retail_price_inr = EXCLUDED.retail_price_inr,
    retail_price_usd = EXCLUDED.retail_price_usd,
    is_signature = EXCLUDED.is_signature,
    image_url = EXCLUDED.image_url;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT 'a72c4108-e909-4a21-9483-355e7ff0456f'::uuid, id FROM mood_tags WHERE name = 'festive' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'a72c4108-e909-4a21-9483-355e7ff0456f'::uuid, id FROM dietary_tags WHERE name = 'vegetarian' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'a72c4108-e909-4a21-9483-355e7ff0456f'::uuid, id FROM dietary_tags WHERE name = 'nut_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) SELECT 'a72c4108-e909-4a21-9483-355e7ff0456f'::uuid, id FROM allergens WHERE name = 'gluten' ON CONFLICT DO NOTHING;
INSERT INTO menu_items
(id, name, description, course_id, cuisine_region_id, spice_level,
 retail_price_inr, retail_price_usd, is_signature, image_url)
VALUES
(
    '5e403add-ec9f-4a8f-8bed-7c5b24ad2678'::uuid,
    'Chana Daal Aloo Tikki',
    'Crisp potato patties studded with spiced split chickpea lentils.',
    (SELECT id FROM courses WHERE name = 'appetizer'),
    (SELECT id FROM cuisine_regions WHERE name = 'north_indian'),
    2,
    169,
    NULL,
    FALSE,
    '/images/menu/chana-daal-aloo-tikki.jpg'
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    course_id = EXCLUDED.course_id,
    cuisine_region_id = EXCLUDED.cuisine_region_id,
    spice_level = EXCLUDED.spice_level,
    retail_price_inr = EXCLUDED.retail_price_inr,
    retail_price_usd = EXCLUDED.retail_price_usd,
    is_signature = EXCLUDED.is_signature,
    image_url = EXCLUDED.image_url;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '5e403add-ec9f-4a8f-8bed-7c5b24ad2678'::uuid, id FROM mood_tags WHERE name = 'comfort' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '5e403add-ec9f-4a8f-8bed-7c5b24ad2678'::uuid, id FROM dietary_tags WHERE name = 'vegetarian' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '5e403add-ec9f-4a8f-8bed-7c5b24ad2678'::uuid, id FROM dietary_tags WHERE name = 'vegan' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '5e403add-ec9f-4a8f-8bed-7c5b24ad2678'::uuid, id FROM dietary_tags WHERE name = 'gluten_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '5e403add-ec9f-4a8f-8bed-7c5b24ad2678'::uuid, id FROM dietary_tags WHERE name = 'dairy_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '5e403add-ec9f-4a8f-8bed-7c5b24ad2678'::uuid, id FROM dietary_tags WHERE name = 'nut_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_items
(id, name, description, course_id, cuisine_region_id, spice_level,
 retail_price_inr, retail_price_usd, is_signature, image_url)
VALUES
(
    'b180cfe9-8387-441f-a384-ed1d282a05fa'::uuid,
    'Corn Bombs',
    'Crispy bites bursting with creamy spiced corn.',
    (SELECT id FROM courses WHERE name = 'appetizer'),
    (SELECT id FROM cuisine_regions WHERE name = 'fusion'),
    2,
    189,
    NULL,
    FALSE,
    '/images/menu/corn-bombs.jpg'
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    course_id = EXCLUDED.course_id,
    cuisine_region_id = EXCLUDED.cuisine_region_id,
    spice_level = EXCLUDED.spice_level,
    retail_price_inr = EXCLUDED.retail_price_inr,
    retail_price_usd = EXCLUDED.retail_price_usd,
    is_signature = EXCLUDED.is_signature,
    image_url = EXCLUDED.image_url;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT 'b180cfe9-8387-441f-a384-ed1d282a05fa'::uuid, id FROM mood_tags WHERE name = 'indulgent' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'b180cfe9-8387-441f-a384-ed1d282a05fa'::uuid, id FROM dietary_tags WHERE name = 'vegetarian' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'b180cfe9-8387-441f-a384-ed1d282a05fa'::uuid, id FROM dietary_tags WHERE name = 'nut_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) SELECT 'b180cfe9-8387-441f-a384-ed1d282a05fa'::uuid, id FROM allergens WHERE name = 'dairy' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) SELECT 'b180cfe9-8387-441f-a384-ed1d282a05fa'::uuid, id FROM allergens WHERE name = 'gluten' ON CONFLICT DO NOTHING;
INSERT INTO menu_items
(id, name, description, course_id, cuisine_region_id, spice_level,
 retail_price_inr, retail_price_usd, is_signature, image_url)
VALUES
(
    'daef51d3-2451-4f63-9416-265f96ecca3f'::uuid,
    'Gobhi 65',
    'Cauliflower florets in a fiery curry-leaf and chilli toss.',
    (SELECT id FROM courses WHERE name = 'appetizer'),
    (SELECT id FROM cuisine_regions WHERE name = 'south_indian'),
    4,
    199,
    NULL,
    FALSE,
    '/images/menu/gobhi-65.jpg'
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    course_id = EXCLUDED.course_id,
    cuisine_region_id = EXCLUDED.cuisine_region_id,
    spice_level = EXCLUDED.spice_level,
    retail_price_inr = EXCLUDED.retail_price_inr,
    retail_price_usd = EXCLUDED.retail_price_usd,
    is_signature = EXCLUDED.is_signature,
    image_url = EXCLUDED.image_url;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT 'daef51d3-2451-4f63-9416-265f96ecca3f'::uuid, id FROM mood_tags WHERE name = 'bold' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'daef51d3-2451-4f63-9416-265f96ecca3f'::uuid, id FROM dietary_tags WHERE name = 'vegetarian' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'daef51d3-2451-4f63-9416-265f96ecca3f'::uuid, id FROM dietary_tags WHERE name = 'vegan' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'daef51d3-2451-4f63-9416-265f96ecca3f'::uuid, id FROM dietary_tags WHERE name = 'dairy_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'daef51d3-2451-4f63-9416-265f96ecca3f'::uuid, id FROM dietary_tags WHERE name = 'nut_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) SELECT 'daef51d3-2451-4f63-9416-265f96ecca3f'::uuid, id FROM allergens WHERE name = 'gluten' ON CONFLICT DO NOTHING;
INSERT INTO menu_items
(id, name, description, course_id, cuisine_region_id, spice_level,
 retail_price_inr, retail_price_usd, is_signature, image_url)
VALUES
(
    'e218bd3c-676f-4b59-8b62-c1fd31f37f6f'::uuid,
    'Walking Tacos',
    'Crunchy taco cups filled with chaat-style toppings â eat on the go.',
    (SELECT id FROM courses WHERE name = 'appetizer'),
    (SELECT id FROM cuisine_regions WHERE name = 'fusion'),
    2,
    229,
    NULL,
    FALSE,
    '/images/menu/walking-tacos.jpg'
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    course_id = EXCLUDED.course_id,
    cuisine_region_id = EXCLUDED.cuisine_region_id,
    spice_level = EXCLUDED.spice_level,
    retail_price_inr = EXCLUDED.retail_price_inr,
    retail_price_usd = EXCLUDED.retail_price_usd,
    is_signature = EXCLUDED.is_signature,
    image_url = EXCLUDED.image_url;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT 'e218bd3c-676f-4b59-8b62-c1fd31f37f6f'::uuid, id FROM mood_tags WHERE name = 'fresh' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT 'e218bd3c-676f-4b59-8b62-c1fd31f37f6f'::uuid, id FROM mood_tags WHERE name = 'fun' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'e218bd3c-676f-4b59-8b62-c1fd31f37f6f'::uuid, id FROM dietary_tags WHERE name = 'vegetarian' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'e218bd3c-676f-4b59-8b62-c1fd31f37f6f'::uuid, id FROM dietary_tags WHERE name = 'nut_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) SELECT 'e218bd3c-676f-4b59-8b62-c1fd31f37f6f'::uuid, id FROM allergens WHERE name = 'gluten' ON CONFLICT DO NOTHING;
INSERT INTO menu_items
(id, name, description, course_id, cuisine_region_id, spice_level,
 retail_price_inr, retail_price_usd, is_signature, image_url)
VALUES
(
    '41dac658-b498-45fc-97d0-26b6e832b068'::uuid,
    'Tikki Bhakarwadi Timble',
    'Mini aloo tikkis crowned with crunchy bhakarwadi rolls.',
    (SELECT id FROM courses WHERE name = 'appetizer'),
    (SELECT id FROM cuisine_regions WHERE name = 'street_food'),
    2,
    179,
    NULL,
    FALSE,
    '/images/menu/tikki-bhakarwadi-timble.jpg'
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    course_id = EXCLUDED.course_id,
    cuisine_region_id = EXCLUDED.cuisine_region_id,
    spice_level = EXCLUDED.spice_level,
    retail_price_inr = EXCLUDED.retail_price_inr,
    retail_price_usd = EXCLUDED.retail_price_usd,
    is_signature = EXCLUDED.is_signature,
    image_url = EXCLUDED.image_url;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '41dac658-b498-45fc-97d0-26b6e832b068'::uuid, id FROM mood_tags WHERE name = 'festive' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '41dac658-b498-45fc-97d0-26b6e832b068'::uuid, id FROM dietary_tags WHERE name = 'vegetarian' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '41dac658-b498-45fc-97d0-26b6e832b068'::uuid, id FROM dietary_tags WHERE name = 'nut_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) SELECT '41dac658-b498-45fc-97d0-26b6e832b068'::uuid, id FROM allergens WHERE name = 'gluten' ON CONFLICT DO NOTHING;
INSERT INTO menu_items
(id, name, description, course_id, cuisine_region_id, spice_level,
 retail_price_inr, retail_price_usd, is_signature, image_url)
VALUES
(
    '01ff107c-fea2-439b-a2da-af4f8b11b1e0'::uuid,
    'Spicy Mango Caviar Gol Gappa Shots',
    'Pani puri shots topped with spherified spicy mango caviar.',
    (SELECT id FROM courses WHERE name = 'appetizer'),
    (SELECT id FROM cuisine_regions WHERE name = 'street_food'),
    3,
    199,
    NULL,
    TRUE,
    '/images/menu/spicy-mango-caviar-gol-gappa-shots.jpg'
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    course_id = EXCLUDED.course_id,
    cuisine_region_id = EXCLUDED.cuisine_region_id,
    spice_level = EXCLUDED.spice_level,
    retail_price_inr = EXCLUDED.retail_price_inr,
    retail_price_usd = EXCLUDED.retail_price_usd,
    is_signature = EXCLUDED.is_signature,
    image_url = EXCLUDED.image_url;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '01ff107c-fea2-439b-a2da-af4f8b11b1e0'::uuid, id FROM mood_tags WHERE name = 'bold' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '01ff107c-fea2-439b-a2da-af4f8b11b1e0'::uuid, id FROM mood_tags WHERE name = 'festive' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '01ff107c-fea2-439b-a2da-af4f8b11b1e0'::uuid, id FROM dietary_tags WHERE name = 'vegetarian' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '01ff107c-fea2-439b-a2da-af4f8b11b1e0'::uuid, id FROM dietary_tags WHERE name = 'vegan' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '01ff107c-fea2-439b-a2da-af4f8b11b1e0'::uuid, id FROM dietary_tags WHERE name = 'dairy_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '01ff107c-fea2-439b-a2da-af4f8b11b1e0'::uuid, id FROM dietary_tags WHERE name = 'nut_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) SELECT '01ff107c-fea2-439b-a2da-af4f8b11b1e0'::uuid, id FROM allergens WHERE name = 'gluten' ON CONFLICT DO NOTHING;
INSERT INTO menu_items
(id, name, description, course_id, cuisine_region_id, spice_level,
 retail_price_inr, retail_price_usd, is_signature, image_url)
VALUES
(
    '04f118b6-49a5-4055-944b-0d23ccf65491'::uuid,
    'Pizza Samosa',
    'A samosa-pizza mashup with melted cheese and spiced tomato.',
    (SELECT id FROM courses WHERE name = 'appetizer'),
    (SELECT id FROM cuisine_regions WHERE name = 'fusion'),
    2,
    179,
    NULL,
    FALSE,
    '/images/menu/pizza-samosa.jpg'
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    course_id = EXCLUDED.course_id,
    cuisine_region_id = EXCLUDED.cuisine_region_id,
    spice_level = EXCLUDED.spice_level,
    retail_price_inr = EXCLUDED.retail_price_inr,
    retail_price_usd = EXCLUDED.retail_price_usd,
    is_signature = EXCLUDED.is_signature,
    image_url = EXCLUDED.image_url;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '04f118b6-49a5-4055-944b-0d23ccf65491'::uuid, id FROM mood_tags WHERE name = 'fun' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '04f118b6-49a5-4055-944b-0d23ccf65491'::uuid, id FROM mood_tags WHERE name = 'indulgent' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '04f118b6-49a5-4055-944b-0d23ccf65491'::uuid, id FROM dietary_tags WHERE name = 'vegetarian' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '04f118b6-49a5-4055-944b-0d23ccf65491'::uuid, id FROM dietary_tags WHERE name = 'nut_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) SELECT '04f118b6-49a5-4055-944b-0d23ccf65491'::uuid, id FROM allergens WHERE name = 'dairy' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) SELECT '04f118b6-49a5-4055-944b-0d23ccf65491'::uuid, id FROM allergens WHERE name = 'gluten' ON CONFLICT DO NOTHING;
INSERT INTO menu_items
(id, name, description, course_id, cuisine_region_id, spice_level,
 retail_price_inr, retail_price_usd, is_signature, image_url)
VALUES
(
    'a9fb9117-bbe1-45ca-b188-7f2f57c4a741'::uuid,
    'Saag Paneer Samosa',
    'A samosa stuffed with palak-paneer filling.',
    (SELECT id FROM courses WHERE name = 'appetizer'),
    (SELECT id FROM cuisine_regions WHERE name = 'north_indian'),
    2,
    189,
    NULL,
    FALSE,
    '/images/menu/saag-paneer-samosa.jpg'
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    course_id = EXCLUDED.course_id,
    cuisine_region_id = EXCLUDED.cuisine_region_id,
    spice_level = EXCLUDED.spice_level,
    retail_price_inr = EXCLUDED.retail_price_inr,
    retail_price_usd = EXCLUDED.retail_price_usd,
    is_signature = EXCLUDED.is_signature,
    image_url = EXCLUDED.image_url;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT 'a9fb9117-bbe1-45ca-b188-7f2f57c4a741'::uuid, id FROM mood_tags WHERE name = 'comfort' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'a9fb9117-bbe1-45ca-b188-7f2f57c4a741'::uuid, id FROM dietary_tags WHERE name = 'vegetarian' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'a9fb9117-bbe1-45ca-b188-7f2f57c4a741'::uuid, id FROM dietary_tags WHERE name = 'nut_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) SELECT 'a9fb9117-bbe1-45ca-b188-7f2f57c4a741'::uuid, id FROM allergens WHERE name = 'dairy' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) SELECT 'a9fb9117-bbe1-45ca-b188-7f2f57c4a741'::uuid, id FROM allergens WHERE name = 'gluten' ON CONFLICT DO NOTHING;
INSERT INTO menu_items
(id, name, description, course_id, cuisine_region_id, spice_level,
 retail_price_inr, retail_price_usd, is_signature, image_url)
VALUES
(
    '3cfd5fbb-773b-4b4c-94e3-9f93ea4a4df6'::uuid,
    'Khata Meetha Samosa',
    'Sweet-and-sour samosa with a tamarind-jaggery twist.',
    (SELECT id FROM courses WHERE name = 'appetizer'),
    (SELECT id FROM cuisine_regions WHERE name = 'north_indian'),
    2,
    149,
    NULL,
    FALSE,
    '/images/menu/khata-meetha-samosa.jpg'
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    course_id = EXCLUDED.course_id,
    cuisine_region_id = EXCLUDED.cuisine_region_id,
    spice_level = EXCLUDED.spice_level,
    retail_price_inr = EXCLUDED.retail_price_inr,
    retail_price_usd = EXCLUDED.retail_price_usd,
    is_signature = EXCLUDED.is_signature,
    image_url = EXCLUDED.image_url;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '3cfd5fbb-773b-4b4c-94e3-9f93ea4a4df6'::uuid, id FROM mood_tags WHERE name = 'festive' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '3cfd5fbb-773b-4b4c-94e3-9f93ea4a4df6'::uuid, id FROM dietary_tags WHERE name = 'vegetarian' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '3cfd5fbb-773b-4b4c-94e3-9f93ea4a4df6'::uuid, id FROM dietary_tags WHERE name = 'vegan' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '3cfd5fbb-773b-4b4c-94e3-9f93ea4a4df6'::uuid, id FROM dietary_tags WHERE name = 'dairy_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '3cfd5fbb-773b-4b4c-94e3-9f93ea4a4df6'::uuid, id FROM dietary_tags WHERE name = 'nut_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) SELECT '3cfd5fbb-773b-4b4c-94e3-9f93ea4a4df6'::uuid, id FROM allergens WHERE name = 'gluten' ON CONFLICT DO NOTHING;
INSERT INTO menu_items
(id, name, description, course_id, cuisine_region_id, spice_level,
 retail_price_inr, retail_price_usd, is_signature, image_url)
VALUES
(
    'b1b892f5-791c-4951-89db-92ae54df2f9e'::uuid,
    'Dil Ke Kebab',
    'Tender heart-shaped vegetable kebabs.',
    (SELECT id FROM courses WHERE name = 'appetizer'),
    (SELECT id FROM cuisine_regions WHERE name = 'north_indian'),
    2,
    229,
    NULL,
    FALSE,
    '/images/menu/dil-ke-kebab.jpg'
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    course_id = EXCLUDED.course_id,
    cuisine_region_id = EXCLUDED.cuisine_region_id,
    spice_level = EXCLUDED.spice_level,
    retail_price_inr = EXCLUDED.retail_price_inr,
    retail_price_usd = EXCLUDED.retail_price_usd,
    is_signature = EXCLUDED.is_signature,
    image_url = EXCLUDED.image_url;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT 'b1b892f5-791c-4951-89db-92ae54df2f9e'::uuid, id FROM mood_tags WHERE name = 'festive' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'b1b892f5-791c-4951-89db-92ae54df2f9e'::uuid, id FROM dietary_tags WHERE name = 'vegetarian' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'b1b892f5-791c-4951-89db-92ae54df2f9e'::uuid, id FROM dietary_tags WHERE name = 'nut_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) SELECT 'b1b892f5-791c-4951-89db-92ae54df2f9e'::uuid, id FROM allergens WHERE name = 'gluten' ON CONFLICT DO NOTHING;
INSERT INTO menu_items
(id, name, description, course_id, cuisine_region_id, spice_level,
 retail_price_inr, retail_price_usd, is_signature, image_url)
VALUES
(
    'a99fd997-1edf-43a5-a58c-1326f283f11b'::uuid,
    'Keema Samosa',
    'Flaky samosa parcels stuffed with spiced minced lamb.',
    (SELECT id FROM courses WHERE name = 'appetizer'),
    (SELECT id FROM cuisine_regions WHERE name = 'north_indian'),
    3,
    229,
    NULL,
    FALSE,
    '/images/menu/keema-samosa.jpg'
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    course_id = EXCLUDED.course_id,
    cuisine_region_id = EXCLUDED.cuisine_region_id,
    spice_level = EXCLUDED.spice_level,
    retail_price_inr = EXCLUDED.retail_price_inr,
    retail_price_usd = EXCLUDED.retail_price_usd,
    is_signature = EXCLUDED.is_signature,
    image_url = EXCLUDED.image_url;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT 'a99fd997-1edf-43a5-a58c-1326f283f11b'::uuid, id FROM mood_tags WHERE name = 'hearty' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT 'a99fd997-1edf-43a5-a58c-1326f283f11b'::uuid, id FROM mood_tags WHERE name = 'festive' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'a99fd997-1edf-43a5-a58c-1326f283f11b'::uuid, id FROM dietary_tags WHERE name = 'halal' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'a99fd997-1edf-43a5-a58c-1326f283f11b'::uuid, id FROM dietary_tags WHERE name = 'nut_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'a99fd997-1edf-43a5-a58c-1326f283f11b'::uuid, id FROM dietary_tags WHERE name = 'dairy_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) SELECT 'a99fd997-1edf-43a5-a58c-1326f283f11b'::uuid, id FROM allergens WHERE name = 'gluten' ON CONFLICT DO NOTHING;
INSERT INTO menu_items
(id, name, description, course_id, cuisine_region_id, spice_level,
 retail_price_inr, retail_price_usd, is_signature, image_url)
VALUES
(
    '33e041c0-6146-4e40-be37-d92c8a6673e8'::uuid,
    'Chicken Malai Kebab',
    'Cream-marinated chicken skewers grilled in the tandoor.',
    (SELECT id FROM courses WHERE name = 'appetizer'),
    (SELECT id FROM cuisine_regions WHERE name = 'north_indian'),
    1,
    299,
    NULL,
    FALSE,
    '/images/menu/chicken-malai-kebab.jpg'
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    course_id = EXCLUDED.course_id,
    cuisine_region_id = EXCLUDED.cuisine_region_id,
    spice_level = EXCLUDED.spice_level,
    retail_price_inr = EXCLUDED.retail_price_inr,
    retail_price_usd = EXCLUDED.retail_price_usd,
    is_signature = EXCLUDED.is_signature,
    image_url = EXCLUDED.image_url;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '33e041c0-6146-4e40-be37-d92c8a6673e8'::uuid, id FROM mood_tags WHERE name = 'indulgent' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '33e041c0-6146-4e40-be37-d92c8a6673e8'::uuid, id FROM mood_tags WHERE name = 'light' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '33e041c0-6146-4e40-be37-d92c8a6673e8'::uuid, id FROM dietary_tags WHERE name = 'halal' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '33e041c0-6146-4e40-be37-d92c8a6673e8'::uuid, id FROM dietary_tags WHERE name = 'gluten_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '33e041c0-6146-4e40-be37-d92c8a6673e8'::uuid, id FROM dietary_tags WHERE name = 'nut_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) SELECT '33e041c0-6146-4e40-be37-d92c8a6673e8'::uuid, id FROM allergens WHERE name = 'dairy' ON CONFLICT DO NOTHING;
INSERT INTO menu_items
(id, name, description, course_id, cuisine_region_id, spice_level,
 retail_price_inr, retail_price_usd, is_signature, image_url)
VALUES
(
    '398c035e-514d-424b-a4c6-99afc8798528'::uuid,
    'Black Pepper Chicken Tikka',
    'Chicken tikka kissed with cracked black pepper.',
    (SELECT id FROM courses WHERE name = 'appetizer'),
    (SELECT id FROM cuisine_regions WHERE name = 'north_indian'),
    3,
    299,
    NULL,
    FALSE,
    '/images/menu/black-pepper-chicken-tikka.jpg'
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    course_id = EXCLUDED.course_id,
    cuisine_region_id = EXCLUDED.cuisine_region_id,
    spice_level = EXCLUDED.spice_level,
    retail_price_inr = EXCLUDED.retail_price_inr,
    retail_price_usd = EXCLUDED.retail_price_usd,
    is_signature = EXCLUDED.is_signature,
    image_url = EXCLUDED.image_url;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '398c035e-514d-424b-a4c6-99afc8798528'::uuid, id FROM mood_tags WHERE name = 'bold' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '398c035e-514d-424b-a4c6-99afc8798528'::uuid, id FROM dietary_tags WHERE name = 'halal' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '398c035e-514d-424b-a4c6-99afc8798528'::uuid, id FROM dietary_tags WHERE name = 'gluten_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '398c035e-514d-424b-a4c6-99afc8798528'::uuid, id FROM dietary_tags WHERE name = 'nut_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) SELECT '398c035e-514d-424b-a4c6-99afc8798528'::uuid, id FROM allergens WHERE name = 'dairy' ON CONFLICT DO NOTHING;
INSERT INTO menu_items
(id, name, description, course_id, cuisine_region_id, spice_level,
 retail_price_inr, retail_price_usd, is_signature, image_url)
VALUES
(
    '8b84e5d4-e5e4-4eb5-a457-dab6b4a056b0'::uuid,
    'Hariyali Kebab Chicken Tikka',
    'Green herb-marinated chicken tikka â fresh, vibrant, fragrant.',
    (SELECT id FROM courses WHERE name = 'appetizer'),
    (SELECT id FROM cuisine_regions WHERE name = 'north_indian'),
    2,
    289,
    NULL,
    FALSE,
    '/images/menu/hariyali-kebab-chicken-tikka.jpg'
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    course_id = EXCLUDED.course_id,
    cuisine_region_id = EXCLUDED.cuisine_region_id,
    spice_level = EXCLUDED.spice_level,
    retail_price_inr = EXCLUDED.retail_price_inr,
    retail_price_usd = EXCLUDED.retail_price_usd,
    is_signature = EXCLUDED.is_signature,
    image_url = EXCLUDED.image_url;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '8b84e5d4-e5e4-4eb5-a457-dab6b4a056b0'::uuid, id FROM mood_tags WHERE name = 'fresh' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '8b84e5d4-e5e4-4eb5-a457-dab6b4a056b0'::uuid, id FROM dietary_tags WHERE name = 'halal' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '8b84e5d4-e5e4-4eb5-a457-dab6b4a056b0'::uuid, id FROM dietary_tags WHERE name = 'gluten_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '8b84e5d4-e5e4-4eb5-a457-dab6b4a056b0'::uuid, id FROM dietary_tags WHERE name = 'nut_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) SELECT '8b84e5d4-e5e4-4eb5-a457-dab6b4a056b0'::uuid, id FROM allergens WHERE name = 'dairy' ON CONFLICT DO NOTHING;
INSERT INTO menu_items
(id, name, description, course_id, cuisine_region_id, spice_level,
 retail_price_inr, retail_price_usd, is_signature, image_url)
VALUES
(
    '90a6e0d8-7175-46cc-9be8-6ed9214d56ee'::uuid,
    'Chicken 65',
    'Chettinad-style fried chicken in a chilli-curry leaf toss.',
    (SELECT id FROM courses WHERE name = 'appetizer'),
    (SELECT id FROM cuisine_regions WHERE name = 'south_indian'),
    4,
    249,
    NULL,
    TRUE,
    '/images/menu/chicken-65.jpg'
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    course_id = EXCLUDED.course_id,
    cuisine_region_id = EXCLUDED.cuisine_region_id,
    spice_level = EXCLUDED.spice_level,
    retail_price_inr = EXCLUDED.retail_price_inr,
    retail_price_usd = EXCLUDED.retail_price_usd,
    is_signature = EXCLUDED.is_signature,
    image_url = EXCLUDED.image_url;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '90a6e0d8-7175-46cc-9be8-6ed9214d56ee'::uuid, id FROM mood_tags WHERE name = 'bold' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '90a6e0d8-7175-46cc-9be8-6ed9214d56ee'::uuid, id FROM mood_tags WHERE name = 'hearty' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '90a6e0d8-7175-46cc-9be8-6ed9214d56ee'::uuid, id FROM dietary_tags WHERE name = 'halal' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '90a6e0d8-7175-46cc-9be8-6ed9214d56ee'::uuid, id FROM dietary_tags WHERE name = 'dairy_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '90a6e0d8-7175-46cc-9be8-6ed9214d56ee'::uuid, id FROM dietary_tags WHERE name = 'nut_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) SELECT '90a6e0d8-7175-46cc-9be8-6ed9214d56ee'::uuid, id FROM allergens WHERE name = 'gluten' ON CONFLICT DO NOTHING;
INSERT INTO menu_items
(id, name, description, course_id, cuisine_region_id, spice_level,
 retail_price_inr, retail_price_usd, is_signature, image_url)
VALUES
(
    '8494825f-4d25-4af1-822d-30948d7336d3'::uuid,
    'Chili Chicken',
    'Indo-Chinese stir-fried chicken with peppers and chilli sauce.',
    (SELECT id FROM courses WHERE name = 'appetizer'),
    (SELECT id FROM cuisine_regions WHERE name = 'indo_chinese'),
    3,
    269,
    NULL,
    FALSE,
    '/images/menu/chili-chicken.jpg'
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    course_id = EXCLUDED.course_id,
    cuisine_region_id = EXCLUDED.cuisine_region_id,
    spice_level = EXCLUDED.spice_level,
    retail_price_inr = EXCLUDED.retail_price_inr,
    retail_price_usd = EXCLUDED.retail_price_usd,
    is_signature = EXCLUDED.is_signature,
    image_url = EXCLUDED.image_url;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '8494825f-4d25-4af1-822d-30948d7336d3'::uuid, id FROM mood_tags WHERE name = 'bold' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '8494825f-4d25-4af1-822d-30948d7336d3'::uuid, id FROM dietary_tags WHERE name = 'halal' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '8494825f-4d25-4af1-822d-30948d7336d3'::uuid, id FROM dietary_tags WHERE name = 'dairy_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '8494825f-4d25-4af1-822d-30948d7336d3'::uuid, id FROM dietary_tags WHERE name = 'nut_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) SELECT '8494825f-4d25-4af1-822d-30948d7336d3'::uuid, id FROM allergens WHERE name = 'gluten' ON CONFLICT DO NOTHING;
INSERT INTO menu_items
(id, name, description, course_id, cuisine_region_id, spice_level,
 retail_price_inr, retail_price_usd, is_signature, image_url)
VALUES
(
    '21f6b749-c014-48b2-a101-45e29bdd689c'::uuid,
    'Chicken Seekh Kebab',
    'Minced chicken skewers chargrilled in the tandoor.',
    (SELECT id FROM courses WHERE name = 'appetizer'),
    (SELECT id FROM cuisine_regions WHERE name = 'north_indian'),
    2,
    279,
    NULL,
    FALSE,
    '/images/menu/chicken-seekh-kebab.jpg'
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    course_id = EXCLUDED.course_id,
    cuisine_region_id = EXCLUDED.cuisine_region_id,
    spice_level = EXCLUDED.spice_level,
    retail_price_inr = EXCLUDED.retail_price_inr,
    retail_price_usd = EXCLUDED.retail_price_usd,
    is_signature = EXCLUDED.is_signature,
    image_url = EXCLUDED.image_url;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '21f6b749-c014-48b2-a101-45e29bdd689c'::uuid, id FROM mood_tags WHERE name = 'hearty' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '21f6b749-c014-48b2-a101-45e29bdd689c'::uuid, id FROM dietary_tags WHERE name = 'halal' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '21f6b749-c014-48b2-a101-45e29bdd689c'::uuid, id FROM dietary_tags WHERE name = 'gluten_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '21f6b749-c014-48b2-a101-45e29bdd689c'::uuid, id FROM dietary_tags WHERE name = 'dairy_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '21f6b749-c014-48b2-a101-45e29bdd689c'::uuid, id FROM dietary_tags WHERE name = 'nut_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_items
(id, name, description, course_id, cuisine_region_id, spice_level,
 retail_price_inr, retail_price_usd, is_signature, image_url)
VALUES
(
    '313415bb-69f5-4778-8920-1f3e4c5085f9'::uuid,
    'Lamb Shami Kebab with Avocado Chutney',
    'Pan-seared lamb patties served with a creamy avocado chutney.',
    (SELECT id FROM courses WHERE name = 'appetizer'),
    (SELECT id FROM cuisine_regions WHERE name = 'mughlai'),
    2,
    349,
    NULL,
    FALSE,
    '/images/menu/lamb-shami-kebab-with-avocado-chutney.jpg'
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    course_id = EXCLUDED.course_id,
    cuisine_region_id = EXCLUDED.cuisine_region_id,
    spice_level = EXCLUDED.spice_level,
    retail_price_inr = EXCLUDED.retail_price_inr,
    retail_price_usd = EXCLUDED.retail_price_usd,
    is_signature = EXCLUDED.is_signature,
    image_url = EXCLUDED.image_url;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '313415bb-69f5-4778-8920-1f3e4c5085f9'::uuid, id FROM mood_tags WHERE name = 'indulgent' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '313415bb-69f5-4778-8920-1f3e4c5085f9'::uuid, id FROM dietary_tags WHERE name = 'halal' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '313415bb-69f5-4778-8920-1f3e4c5085f9'::uuid, id FROM dietary_tags WHERE name = 'gluten_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '313415bb-69f5-4778-8920-1f3e4c5085f9'::uuid, id FROM dietary_tags WHERE name = 'dairy_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '313415bb-69f5-4778-8920-1f3e4c5085f9'::uuid, id FROM dietary_tags WHERE name = 'nut_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_items
(id, name, description, course_id, cuisine_region_id, spice_level,
 retail_price_inr, retail_price_usd, is_signature, image_url)
VALUES
(
    '4d8c87e1-1ed7-477f-8067-b01fc5fb87aa'::uuid,
    'Lamb Seekh Kebab',
    'Minced lamb skewers spiced and chargrilled in the tandoor.',
    (SELECT id FROM courses WHERE name = 'appetizer'),
    (SELECT id FROM cuisine_regions WHERE name = 'mughlai'),
    3,
    349,
    NULL,
    FALSE,
    '/images/menu/lamb-seekh-kebab.jpg'
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    course_id = EXCLUDED.course_id,
    cuisine_region_id = EXCLUDED.cuisine_region_id,
    spice_level = EXCLUDED.spice_level,
    retail_price_inr = EXCLUDED.retail_price_inr,
    retail_price_usd = EXCLUDED.retail_price_usd,
    is_signature = EXCLUDED.is_signature,
    image_url = EXCLUDED.image_url;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '4d8c87e1-1ed7-477f-8067-b01fc5fb87aa'::uuid, id FROM mood_tags WHERE name = 'bold' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '4d8c87e1-1ed7-477f-8067-b01fc5fb87aa'::uuid, id FROM mood_tags WHERE name = 'hearty' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '4d8c87e1-1ed7-477f-8067-b01fc5fb87aa'::uuid, id FROM dietary_tags WHERE name = 'halal' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '4d8c87e1-1ed7-477f-8067-b01fc5fb87aa'::uuid, id FROM dietary_tags WHERE name = 'gluten_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '4d8c87e1-1ed7-477f-8067-b01fc5fb87aa'::uuid, id FROM dietary_tags WHERE name = 'dairy_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '4d8c87e1-1ed7-477f-8067-b01fc5fb87aa'::uuid, id FROM dietary_tags WHERE name = 'nut_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_items
(id, name, description, course_id, cuisine_region_id, spice_level,
 retail_price_inr, retail_price_usd, is_signature, image_url)
VALUES
(
    'a8f3eb7e-86b7-48b3-8f92-dbb361474512'::uuid,
    'Baby Lamb Chops',
    'Tender frenched lamb chops marinated and tandoor-grilled.',
    (SELECT id FROM courses WHERE name = 'appetizer'),
    (SELECT id FROM cuisine_regions WHERE name = 'mughlai'),
    2,
    449,
    NULL,
    TRUE,
    '/images/menu/baby-lamb-chops.jpg'
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    course_id = EXCLUDED.course_id,
    cuisine_region_id = EXCLUDED.cuisine_region_id,
    spice_level = EXCLUDED.spice_level,
    retail_price_inr = EXCLUDED.retail_price_inr,
    retail_price_usd = EXCLUDED.retail_price_usd,
    is_signature = EXCLUDED.is_signature,
    image_url = EXCLUDED.image_url;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT 'a8f3eb7e-86b7-48b3-8f92-dbb361474512'::uuid, id FROM mood_tags WHERE name = 'indulgent' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT 'a8f3eb7e-86b7-48b3-8f92-dbb361474512'::uuid, id FROM mood_tags WHERE name = 'festive' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'a8f3eb7e-86b7-48b3-8f92-dbb361474512'::uuid, id FROM dietary_tags WHERE name = 'halal' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'a8f3eb7e-86b7-48b3-8f92-dbb361474512'::uuid, id FROM dietary_tags WHERE name = 'gluten_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'a8f3eb7e-86b7-48b3-8f92-dbb361474512'::uuid, id FROM dietary_tags WHERE name = 'nut_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) SELECT 'a8f3eb7e-86b7-48b3-8f92-dbb361474512'::uuid, id FROM allergens WHERE name = 'dairy' ON CONFLICT DO NOTHING;
INSERT INTO menu_items
(id, name, description, course_id, cuisine_region_id, spice_level,
 retail_price_inr, retail_price_usd, is_signature, image_url)
VALUES
(
    'ca093cb4-962a-4de6-84d5-804265dd7f74'::uuid,
    'Prawn Angare / Tandoori Shrimp',
    'Tandoor-grilled prawns marinated in fiery angare masala.',
    (SELECT id FROM courses WHERE name = 'appetizer'),
    (SELECT id FROM cuisine_regions WHERE name = 'north_indian'),
    3,
    399,
    NULL,
    FALSE,
    '/images/menu/prawn-angare-tandoori-shrimp.jpg'
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    course_id = EXCLUDED.course_id,
    cuisine_region_id = EXCLUDED.cuisine_region_id,
    spice_level = EXCLUDED.spice_level,
    retail_price_inr = EXCLUDED.retail_price_inr,
    retail_price_usd = EXCLUDED.retail_price_usd,
    is_signature = EXCLUDED.is_signature,
    image_url = EXCLUDED.image_url;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT 'ca093cb4-962a-4de6-84d5-804265dd7f74'::uuid, id FROM mood_tags WHERE name = 'bold' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT 'ca093cb4-962a-4de6-84d5-804265dd7f74'::uuid, id FROM mood_tags WHERE name = 'festive' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'ca093cb4-962a-4de6-84d5-804265dd7f74'::uuid, id FROM dietary_tags WHERE name = 'halal' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'ca093cb4-962a-4de6-84d5-804265dd7f74'::uuid, id FROM dietary_tags WHERE name = 'gluten_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'ca093cb4-962a-4de6-84d5-804265dd7f74'::uuid, id FROM dietary_tags WHERE name = 'dairy_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'ca093cb4-962a-4de6-84d5-804265dd7f74'::uuid, id FROM dietary_tags WHERE name = 'nut_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) SELECT 'ca093cb4-962a-4de6-84d5-804265dd7f74'::uuid, id FROM allergens WHERE name = 'shellfish' ON CONFLICT DO NOTHING;
INSERT INTO menu_items
(id, name, description, course_id, cuisine_region_id, spice_level,
 retail_price_inr, retail_price_usd, is_signature, image_url)
VALUES
(
    '97b877d2-f83a-4f0d-b2c6-902958fb4011'::uuid,
    'Shrimp Til Tilka',
    'Sesame-crusted shrimp, fried golden and crisp.',
    (SELECT id FROM courses WHERE name = 'appetizer'),
    (SELECT id FROM cuisine_regions WHERE name = 'north_indian'),
    2,
    379,
    NULL,
    FALSE,
    '/images/menu/shrimp-til-tilka.jpg'
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    course_id = EXCLUDED.course_id,
    cuisine_region_id = EXCLUDED.cuisine_region_id,
    spice_level = EXCLUDED.spice_level,
    retail_price_inr = EXCLUDED.retail_price_inr,
    retail_price_usd = EXCLUDED.retail_price_usd,
    is_signature = EXCLUDED.is_signature,
    image_url = EXCLUDED.image_url;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '97b877d2-f83a-4f0d-b2c6-902958fb4011'::uuid, id FROM mood_tags WHERE name = 'festive' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '97b877d2-f83a-4f0d-b2c6-902958fb4011'::uuid, id FROM dietary_tags WHERE name = 'halal' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '97b877d2-f83a-4f0d-b2c6-902958fb4011'::uuid, id FROM dietary_tags WHERE name = 'dairy_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) SELECT '97b877d2-f83a-4f0d-b2c6-902958fb4011'::uuid, id FROM allergens WHERE name = 'shellfish' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) SELECT '97b877d2-f83a-4f0d-b2c6-902958fb4011'::uuid, id FROM allergens WHERE name = 'sesame' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) SELECT '97b877d2-f83a-4f0d-b2c6-902958fb4011'::uuid, id FROM allergens WHERE name = 'gluten' ON CONFLICT DO NOTHING;
INSERT INTO menu_items
(id, name, description, course_id, cuisine_region_id, spice_level,
 retail_price_inr, retail_price_usd, is_signature, image_url)
VALUES
(
    '7ed94b64-057d-4f79-b055-e2be79fa2697'::uuid,
    'Amritsari Fish Fry',
    'Punjab-style ajwain-spiced fish fritters, crisp and golden.',
    (SELECT id FROM courses WHERE name = 'appetizer'),
    (SELECT id FROM cuisine_regions WHERE name = 'north_indian'),
    3,
    329,
    NULL,
    FALSE,
    '/images/menu/amritsari-fish-fry.jpg'
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    course_id = EXCLUDED.course_id,
    cuisine_region_id = EXCLUDED.cuisine_region_id,
    spice_level = EXCLUDED.spice_level,
    retail_price_inr = EXCLUDED.retail_price_inr,
    retail_price_usd = EXCLUDED.retail_price_usd,
    is_signature = EXCLUDED.is_signature,
    image_url = EXCLUDED.image_url;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '7ed94b64-057d-4f79-b055-e2be79fa2697'::uuid, id FROM mood_tags WHERE name = 'bold' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '7ed94b64-057d-4f79-b055-e2be79fa2697'::uuid, id FROM mood_tags WHERE name = 'hearty' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '7ed94b64-057d-4f79-b055-e2be79fa2697'::uuid, id FROM dietary_tags WHERE name = 'halal' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '7ed94b64-057d-4f79-b055-e2be79fa2697'::uuid, id FROM dietary_tags WHERE name = 'dairy_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '7ed94b64-057d-4f79-b055-e2be79fa2697'::uuid, id FROM dietary_tags WHERE name = 'nut_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) SELECT '7ed94b64-057d-4f79-b055-e2be79fa2697'::uuid, id FROM allergens WHERE name = 'fish' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) SELECT '7ed94b64-057d-4f79-b055-e2be79fa2697'::uuid, id FROM allergens WHERE name = 'gluten' ON CONFLICT DO NOTHING;
INSERT INTO menu_items
(id, name, description, course_id, cuisine_region_id, spice_level,
 retail_price_inr, retail_price_usd, is_signature, image_url)
VALUES
(
    'a59e4da0-d0e9-4624-bd38-66c08a24514e'::uuid,
    'Pineapple Blaze Chicken Tikka',
    'Chicken tikka with a smoky pineapple-chilli glaze.',
    (SELECT id FROM courses WHERE name = 'appetizer'),
    (SELECT id FROM cuisine_regions WHERE name = 'north_indian'),
    3,
    299,
    NULL,
    FALSE,
    '/images/menu/pineapple-blaze-chicken-tikka.jpg'
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    course_id = EXCLUDED.course_id,
    cuisine_region_id = EXCLUDED.cuisine_region_id,
    spice_level = EXCLUDED.spice_level,
    retail_price_inr = EXCLUDED.retail_price_inr,
    retail_price_usd = EXCLUDED.retail_price_usd,
    is_signature = EXCLUDED.is_signature,
    image_url = EXCLUDED.image_url;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT 'a59e4da0-d0e9-4624-bd38-66c08a24514e'::uuid, id FROM mood_tags WHERE name = 'bold' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT 'a59e4da0-d0e9-4624-bd38-66c08a24514e'::uuid, id FROM mood_tags WHERE name = 'festive' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'a59e4da0-d0e9-4624-bd38-66c08a24514e'::uuid, id FROM dietary_tags WHERE name = 'halal' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'a59e4da0-d0e9-4624-bd38-66c08a24514e'::uuid, id FROM dietary_tags WHERE name = 'gluten_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'a59e4da0-d0e9-4624-bd38-66c08a24514e'::uuid, id FROM dietary_tags WHERE name = 'nut_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) SELECT 'a59e4da0-d0e9-4624-bd38-66c08a24514e'::uuid, id FROM allergens WHERE name = 'dairy' ON CONFLICT DO NOTHING;
INSERT INTO menu_items
(id, name, description, course_id, cuisine_region_id, spice_level,
 retail_price_inr, retail_price_usd, is_signature, image_url)
VALUES
(
    'bc449235-43e6-46e2-9730-7e75b003b5b5'::uuid,
    'Garlic Naan',
    'Pillowy tandoor naan finished with garlic and butter.',
    (SELECT id FROM courses WHERE name = 'bread'),
    (SELECT id FROM cuisine_regions WHERE name = 'north_indian'),
    1,
    69,
    NULL,
    FALSE,
    '/images/menu/garlic-naan.jpg'
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    course_id = EXCLUDED.course_id,
    cuisine_region_id = EXCLUDED.cuisine_region_id,
    spice_level = EXCLUDED.spice_level,
    retail_price_inr = EXCLUDED.retail_price_inr,
    retail_price_usd = EXCLUDED.retail_price_usd,
    is_signature = EXCLUDED.is_signature,
    image_url = EXCLUDED.image_url;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT 'bc449235-43e6-46e2-9730-7e75b003b5b5'::uuid, id FROM mood_tags WHERE name = 'comfort' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'bc449235-43e6-46e2-9730-7e75b003b5b5'::uuid, id FROM dietary_tags WHERE name = 'vegetarian' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'bc449235-43e6-46e2-9730-7e75b003b5b5'::uuid, id FROM dietary_tags WHERE name = 'nut_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) SELECT 'bc449235-43e6-46e2-9730-7e75b003b5b5'::uuid, id FROM allergens WHERE name = 'gluten' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) SELECT 'bc449235-43e6-46e2-9730-7e75b003b5b5'::uuid, id FROM allergens WHERE name = 'dairy' ON CONFLICT DO NOTHING;
INSERT INTO menu_items
(id, name, description, course_id, cuisine_region_id, spice_level,
 retail_price_inr, retail_price_usd, is_signature, image_url)
VALUES
(
    '3ba0becc-e945-4017-9a00-6cd353ba8227'::uuid,
    'Butter Naan',
    'Tandoor-baked leavened flatbread brushed with butter.',
    (SELECT id FROM courses WHERE name = 'bread'),
    (SELECT id FROM cuisine_regions WHERE name = 'north_indian'),
    1,
    59,
    NULL,
    FALSE,
    '/images/menu/butter-naan.jpg'
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    course_id = EXCLUDED.course_id,
    cuisine_region_id = EXCLUDED.cuisine_region_id,
    spice_level = EXCLUDED.spice_level,
    retail_price_inr = EXCLUDED.retail_price_inr,
    retail_price_usd = EXCLUDED.retail_price_usd,
    is_signature = EXCLUDED.is_signature,
    image_url = EXCLUDED.image_url;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '3ba0becc-e945-4017-9a00-6cd353ba8227'::uuid, id FROM mood_tags WHERE name = 'comfort' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '3ba0becc-e945-4017-9a00-6cd353ba8227'::uuid, id FROM dietary_tags WHERE name = 'vegetarian' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '3ba0becc-e945-4017-9a00-6cd353ba8227'::uuid, id FROM dietary_tags WHERE name = 'nut_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) SELECT '3ba0becc-e945-4017-9a00-6cd353ba8227'::uuid, id FROM allergens WHERE name = 'gluten' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) SELECT '3ba0becc-e945-4017-9a00-6cd353ba8227'::uuid, id FROM allergens WHERE name = 'dairy' ON CONFLICT DO NOTHING;
INSERT INTO menu_items
(id, name, description, course_id, cuisine_region_id, spice_level,
 retail_price_inr, retail_price_usd, is_signature, image_url)
VALUES
(
    '3841562d-b907-4ae1-a9e2-3b6bd14e19b1'::uuid,
    'Laccha Paratha',
    'Multi-layered flaky whole-wheat paratha.',
    (SELECT id FROM courses WHERE name = 'bread'),
    (SELECT id FROM cuisine_regions WHERE name = 'north_indian'),
    1,
    69,
    NULL,
    FALSE,
    '/images/menu/laccha-paratha.jpg'
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    course_id = EXCLUDED.course_id,
    cuisine_region_id = EXCLUDED.cuisine_region_id,
    spice_level = EXCLUDED.spice_level,
    retail_price_inr = EXCLUDED.retail_price_inr,
    retail_price_usd = EXCLUDED.retail_price_usd,
    is_signature = EXCLUDED.is_signature,
    image_url = EXCLUDED.image_url;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '3841562d-b907-4ae1-a9e2-3b6bd14e19b1'::uuid, id FROM mood_tags WHERE name = 'comfort' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '3841562d-b907-4ae1-a9e2-3b6bd14e19b1'::uuid, id FROM dietary_tags WHERE name = 'vegetarian' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '3841562d-b907-4ae1-a9e2-3b6bd14e19b1'::uuid, id FROM dietary_tags WHERE name = 'nut_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) SELECT '3841562d-b907-4ae1-a9e2-3b6bd14e19b1'::uuid, id FROM allergens WHERE name = 'gluten' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) SELECT '3841562d-b907-4ae1-a9e2-3b6bd14e19b1'::uuid, id FROM allergens WHERE name = 'dairy' ON CONFLICT DO NOTHING;
INSERT INTO menu_items
(id, name, description, course_id, cuisine_region_id, spice_level,
 retail_price_inr, retail_price_usd, is_signature, image_url)
VALUES
(
    'a07c13f0-0887-417f-b8eb-c3420f5a91f3'::uuid,
    'Chapatti',
    'Soft whole-wheat flatbread cooked on the tava.',
    (SELECT id FROM courses WHERE name = 'bread'),
    (SELECT id FROM cuisine_regions WHERE name = 'north_indian'),
    1,
    35,
    NULL,
    FALSE,
    '/images/menu/chapatti.jpg'
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    course_id = EXCLUDED.course_id,
    cuisine_region_id = EXCLUDED.cuisine_region_id,
    spice_level = EXCLUDED.spice_level,
    retail_price_inr = EXCLUDED.retail_price_inr,
    retail_price_usd = EXCLUDED.retail_price_usd,
    is_signature = EXCLUDED.is_signature,
    image_url = EXCLUDED.image_url;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT 'a07c13f0-0887-417f-b8eb-c3420f5a91f3'::uuid, id FROM mood_tags WHERE name = 'comfort' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT 'a07c13f0-0887-417f-b8eb-c3420f5a91f3'::uuid, id FROM mood_tags WHERE name = 'light' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'a07c13f0-0887-417f-b8eb-c3420f5a91f3'::uuid, id FROM dietary_tags WHERE name = 'vegetarian' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'a07c13f0-0887-417f-b8eb-c3420f5a91f3'::uuid, id FROM dietary_tags WHERE name = 'vegan' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'a07c13f0-0887-417f-b8eb-c3420f5a91f3'::uuid, id FROM dietary_tags WHERE name = 'dairy_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'a07c13f0-0887-417f-b8eb-c3420f5a91f3'::uuid, id FROM dietary_tags WHERE name = 'nut_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) SELECT 'a07c13f0-0887-417f-b8eb-c3420f5a91f3'::uuid, id FROM allergens WHERE name = 'gluten' ON CONFLICT DO NOTHING;
INSERT INTO menu_items
(id, name, description, course_id, cuisine_region_id, spice_level,
 retail_price_inr, retail_price_usd, is_signature, image_url)
VALUES
(
    'ccabc4ac-b7ce-4708-a3b5-d99d4befba2b'::uuid,
    'Gulab Jamun',
    'Soft milk-solid dumplings in cardamom-rose syrup.',
    (SELECT id FROM courses WHERE name = 'dessert'),
    (SELECT id FROM cuisine_regions WHERE name = 'north_indian'),
    0,
    119,
    NULL,
    TRUE,
    '/images/menu/gulab-jamun.jpg'
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    course_id = EXCLUDED.course_id,
    cuisine_region_id = EXCLUDED.cuisine_region_id,
    spice_level = EXCLUDED.spice_level,
    retail_price_inr = EXCLUDED.retail_price_inr,
    retail_price_usd = EXCLUDED.retail_price_usd,
    is_signature = EXCLUDED.is_signature,
    image_url = EXCLUDED.image_url;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT 'ccabc4ac-b7ce-4708-a3b5-d99d4befba2b'::uuid, id FROM mood_tags WHERE name = 'indulgent' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT 'ccabc4ac-b7ce-4708-a3b5-d99d4befba2b'::uuid, id FROM mood_tags WHERE name = 'festive' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'ccabc4ac-b7ce-4708-a3b5-d99d4befba2b'::uuid, id FROM dietary_tags WHERE name = 'vegetarian' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'ccabc4ac-b7ce-4708-a3b5-d99d4befba2b'::uuid, id FROM dietary_tags WHERE name = 'nut_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) SELECT 'ccabc4ac-b7ce-4708-a3b5-d99d4befba2b'::uuid, id FROM allergens WHERE name = 'dairy' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) SELECT 'ccabc4ac-b7ce-4708-a3b5-d99d4befba2b'::uuid, id FROM allergens WHERE name = 'gluten' ON CONFLICT DO NOTHING;
INSERT INTO menu_items
(id, name, description, course_id, cuisine_region_id, spice_level,
 retail_price_inr, retail_price_usd, is_signature, image_url)
VALUES
(
    '623eaf97-61e4-4e9f-ab8e-994a9b56e9c0'::uuid,
    'Rasmalai',
    'Chenna patties in chilled saffron-cardamom cream.',
    (SELECT id FROM courses WHERE name = 'dessert'),
    (SELECT id FROM cuisine_regions WHERE name = 'north_indian'),
    0,
    149,
    NULL,
    TRUE,
    '/images/menu/rasmalai.jpg'
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    course_id = EXCLUDED.course_id,
    cuisine_region_id = EXCLUDED.cuisine_region_id,
    spice_level = EXCLUDED.spice_level,
    retail_price_inr = EXCLUDED.retail_price_inr,
    retail_price_usd = EXCLUDED.retail_price_usd,
    is_signature = EXCLUDED.is_signature,
    image_url = EXCLUDED.image_url;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '623eaf97-61e4-4e9f-ab8e-994a9b56e9c0'::uuid, id FROM mood_tags WHERE name = 'indulgent' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '623eaf97-61e4-4e9f-ab8e-994a9b56e9c0'::uuid, id FROM mood_tags WHERE name = 'light' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '623eaf97-61e4-4e9f-ab8e-994a9b56e9c0'::uuid, id FROM dietary_tags WHERE name = 'vegetarian' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '623eaf97-61e4-4e9f-ab8e-994a9b56e9c0'::uuid, id FROM dietary_tags WHERE name = 'gluten_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '623eaf97-61e4-4e9f-ab8e-994a9b56e9c0'::uuid, id FROM dietary_tags WHERE name = 'nut_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) SELECT '623eaf97-61e4-4e9f-ab8e-994a9b56e9c0'::uuid, id FROM allergens WHERE name = 'dairy' ON CONFLICT DO NOTHING;
INSERT INTO menu_items
(id, name, description, course_id, cuisine_region_id, spice_level,
 retail_price_inr, retail_price_usd, is_signature, image_url)
VALUES
(
    '65a989a4-a808-43ef-a2d8-63fd00038f19'::uuid,
    'Shahi Jamun',
    'Royal gulab jamun stuffed with khoya and nuts.',
    (SELECT id FROM courses WHERE name = 'dessert'),
    (SELECT id FROM cuisine_regions WHERE name = 'north_indian'),
    0,
    169,
    NULL,
    FALSE,
    '/images/menu/shahi-jamun.jpg'
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    course_id = EXCLUDED.course_id,
    cuisine_region_id = EXCLUDED.cuisine_region_id,
    spice_level = EXCLUDED.spice_level,
    retail_price_inr = EXCLUDED.retail_price_inr,
    retail_price_usd = EXCLUDED.retail_price_usd,
    is_signature = EXCLUDED.is_signature,
    image_url = EXCLUDED.image_url;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '65a989a4-a808-43ef-a2d8-63fd00038f19'::uuid, id FROM mood_tags WHERE name = 'indulgent' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '65a989a4-a808-43ef-a2d8-63fd00038f19'::uuid, id FROM mood_tags WHERE name = 'festive' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '65a989a4-a808-43ef-a2d8-63fd00038f19'::uuid, id FROM dietary_tags WHERE name = 'vegetarian' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) SELECT '65a989a4-a808-43ef-a2d8-63fd00038f19'::uuid, id FROM allergens WHERE name = 'dairy' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) SELECT '65a989a4-a808-43ef-a2d8-63fd00038f19'::uuid, id FROM allergens WHERE name = 'gluten' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) SELECT '65a989a4-a808-43ef-a2d8-63fd00038f19'::uuid, id FROM allergens WHERE name = 'nuts' ON CONFLICT DO NOTHING;
INSERT INTO menu_items
(id, name, description, course_id, cuisine_region_id, spice_level,
 retail_price_inr, retail_price_usd, is_signature, image_url)
VALUES
(
    '221b0e49-3cae-44e4-a772-187b94e7d487'::uuid,
    'Jalebi',
    'Crisp swirls of fried batter soaked in saffron syrup.',
    (SELECT id FROM courses WHERE name = 'dessert'),
    (SELECT id FROM cuisine_regions WHERE name = 'north_indian'),
    0,
    119,
    NULL,
    FALSE,
    '/images/menu/jalebi.jpg'
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    course_id = EXCLUDED.course_id,
    cuisine_region_id = EXCLUDED.cuisine_region_id,
    spice_level = EXCLUDED.spice_level,
    retail_price_inr = EXCLUDED.retail_price_inr,
    retail_price_usd = EXCLUDED.retail_price_usd,
    is_signature = EXCLUDED.is_signature,
    image_url = EXCLUDED.image_url;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '221b0e49-3cae-44e4-a772-187b94e7d487'::uuid, id FROM mood_tags WHERE name = 'festive' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '221b0e49-3cae-44e4-a772-187b94e7d487'::uuid, id FROM mood_tags WHERE name = 'indulgent' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '221b0e49-3cae-44e4-a772-187b94e7d487'::uuid, id FROM dietary_tags WHERE name = 'vegetarian' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '221b0e49-3cae-44e4-a772-187b94e7d487'::uuid, id FROM dietary_tags WHERE name = 'vegan' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '221b0e49-3cae-44e4-a772-187b94e7d487'::uuid, id FROM dietary_tags WHERE name = 'dairy_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '221b0e49-3cae-44e4-a772-187b94e7d487'::uuid, id FROM dietary_tags WHERE name = 'nut_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) SELECT '221b0e49-3cae-44e4-a772-187b94e7d487'::uuid, id FROM allergens WHERE name = 'gluten' ON CONFLICT DO NOTHING;
INSERT INTO menu_items
(id, name, description, course_id, cuisine_region_id, spice_level,
 retail_price_inr, retail_price_usd, is_signature, image_url)
VALUES
(
    '70e70859-9273-4246-abe2-465aa70a9109'::uuid,
    'Kulfi (Mango or Pistachio)',
    'Slow-churned Indian ice cream â choice of mango or pistachio.',
    (SELECT id FROM courses WHERE name = 'dessert'),
    (SELECT id FROM cuisine_regions WHERE name = 'north_indian'),
    0,
    149,
    NULL,
    FALSE,
    '/images/menu/kulfi-mango-or-pistachio.jpg'
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    course_id = EXCLUDED.course_id,
    cuisine_region_id = EXCLUDED.cuisine_region_id,
    spice_level = EXCLUDED.spice_level,
    retail_price_inr = EXCLUDED.retail_price_inr,
    retail_price_usd = EXCLUDED.retail_price_usd,
    is_signature = EXCLUDED.is_signature,
    image_url = EXCLUDED.image_url;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '70e70859-9273-4246-abe2-465aa70a9109'::uuid, id FROM mood_tags WHERE name = 'indulgent' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '70e70859-9273-4246-abe2-465aa70a9109'::uuid, id FROM mood_tags WHERE name = 'fresh' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '70e70859-9273-4246-abe2-465aa70a9109'::uuid, id FROM dietary_tags WHERE name = 'vegetarian' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '70e70859-9273-4246-abe2-465aa70a9109'::uuid, id FROM dietary_tags WHERE name = 'gluten_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) SELECT '70e70859-9273-4246-abe2-465aa70a9109'::uuid, id FROM allergens WHERE name = 'dairy' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) SELECT '70e70859-9273-4246-abe2-465aa70a9109'::uuid, id FROM allergens WHERE name = 'nuts' ON CONFLICT DO NOTHING;
INSERT INTO menu_items
(id, name, description, course_id, cuisine_region_id, spice_level,
 retail_price_inr, retail_price_usd, is_signature, image_url)
VALUES
(
    '86df2ae3-54dc-4a12-8910-85a95bab93be'::uuid,
    'Mousse (Rasmalai, Mango, Tiramisu)',
    'Silky mousse â choice of rasmalai, mango, or tiramisu.',
    (SELECT id FROM courses WHERE name = 'dessert'),
    (SELECT id FROM cuisine_regions WHERE name = 'fusion'),
    0,
    199,
    NULL,
    FALSE,
    '/images/menu/mousse-rasmalai-mango-tiramisu.jpg'
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    course_id = EXCLUDED.course_id,
    cuisine_region_id = EXCLUDED.cuisine_region_id,
    spice_level = EXCLUDED.spice_level,
    retail_price_inr = EXCLUDED.retail_price_inr,
    retail_price_usd = EXCLUDED.retail_price_usd,
    is_signature = EXCLUDED.is_signature,
    image_url = EXCLUDED.image_url;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '86df2ae3-54dc-4a12-8910-85a95bab93be'::uuid, id FROM mood_tags WHERE name = 'indulgent' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '86df2ae3-54dc-4a12-8910-85a95bab93be'::uuid, id FROM mood_tags WHERE name = 'light' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '86df2ae3-54dc-4a12-8910-85a95bab93be'::uuid, id FROM dietary_tags WHERE name = 'vegetarian' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '86df2ae3-54dc-4a12-8910-85a95bab93be'::uuid, id FROM dietary_tags WHERE name = 'nut_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) SELECT '86df2ae3-54dc-4a12-8910-85a95bab93be'::uuid, id FROM allergens WHERE name = 'dairy' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) SELECT '86df2ae3-54dc-4a12-8910-85a95bab93be'::uuid, id FROM allergens WHERE name = 'eggs' ON CONFLICT DO NOTHING;
INSERT INTO menu_items
(id, name, description, course_id, cuisine_region_id, spice_level,
 retail_price_inr, retail_price_usd, is_signature, image_url)
VALUES
(
    '0ca09339-b459-4ccc-afd3-fb9e1b4f06d2'::uuid,
    'BrÃ»lÃ© (Chai, Mango, Matcha)',
    'Crackling caramelised brÃ»lÃ© â chai, mango, or matcha.',
    (SELECT id FROM courses WHERE name = 'dessert'),
    (SELECT id FROM cuisine_regions WHERE name = 'fusion'),
    0,
    219,
    NULL,
    FALSE,
    '/images/menu/br-l-chai-mango-matcha.jpg'
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    course_id = EXCLUDED.course_id,
    cuisine_region_id = EXCLUDED.cuisine_region_id,
    spice_level = EXCLUDED.spice_level,
    retail_price_inr = EXCLUDED.retail_price_inr,
    retail_price_usd = EXCLUDED.retail_price_usd,
    is_signature = EXCLUDED.is_signature,
    image_url = EXCLUDED.image_url;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '0ca09339-b459-4ccc-afd3-fb9e1b4f06d2'::uuid, id FROM mood_tags WHERE name = 'indulgent' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '0ca09339-b459-4ccc-afd3-fb9e1b4f06d2'::uuid, id FROM dietary_tags WHERE name = 'vegetarian' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '0ca09339-b459-4ccc-afd3-fb9e1b4f06d2'::uuid, id FROM dietary_tags WHERE name = 'gluten_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '0ca09339-b459-4ccc-afd3-fb9e1b4f06d2'::uuid, id FROM dietary_tags WHERE name = 'nut_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) SELECT '0ca09339-b459-4ccc-afd3-fb9e1b4f06d2'::uuid, id FROM allergens WHERE name = 'dairy' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) SELECT '0ca09339-b459-4ccc-afd3-fb9e1b4f06d2'::uuid, id FROM allergens WHERE name = 'eggs' ON CONFLICT DO NOTHING;
INSERT INTO menu_items
(id, name, description, course_id, cuisine_region_id, spice_level,
 retail_price_inr, retail_price_usd, is_signature, image_url)
VALUES
(
    '54440f32-4f6f-416d-93c1-2bb919a62a30'::uuid,
    'Coconut Phirni',
    'Slow-cooked rice pudding with coconut and cardamom.',
    (SELECT id FROM courses WHERE name = 'dessert'),
    (SELECT id FROM cuisine_regions WHERE name = 'north_indian'),
    0,
    139,
    NULL,
    FALSE,
    '/images/menu/coconut-phirni.jpg'
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    course_id = EXCLUDED.course_id,
    cuisine_region_id = EXCLUDED.cuisine_region_id,
    spice_level = EXCLUDED.spice_level,
    retail_price_inr = EXCLUDED.retail_price_inr,
    retail_price_usd = EXCLUDED.retail_price_usd,
    is_signature = EXCLUDED.is_signature,
    image_url = EXCLUDED.image_url;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '54440f32-4f6f-416d-93c1-2bb919a62a30'::uuid, id FROM mood_tags WHERE name = 'comfort' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '54440f32-4f6f-416d-93c1-2bb919a62a30'::uuid, id FROM mood_tags WHERE name = 'light' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '54440f32-4f6f-416d-93c1-2bb919a62a30'::uuid, id FROM dietary_tags WHERE name = 'vegetarian' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '54440f32-4f6f-416d-93c1-2bb919a62a30'::uuid, id FROM dietary_tags WHERE name = 'gluten_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '54440f32-4f6f-416d-93c1-2bb919a62a30'::uuid, id FROM dietary_tags WHERE name = 'nut_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) SELECT '54440f32-4f6f-416d-93c1-2bb919a62a30'::uuid, id FROM allergens WHERE name = 'dairy' ON CONFLICT DO NOTHING;
INSERT INTO menu_items
(id, name, description, course_id, cuisine_region_id, spice_level,
 retail_price_inr, retail_price_usd, is_signature, image_url)
VALUES
(
    'c2bd4521-040a-447b-b47e-37c2beabfa52'::uuid,
    'Malpua Rabri',
    'Saffron pancake fritters served with chilled rabri.',
    (SELECT id FROM courses WHERE name = 'dessert'),
    (SELECT id FROM cuisine_regions WHERE name = 'north_indian'),
    0,
    179,
    NULL,
    FALSE,
    '/images/menu/malpua-rabri.jpg'
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    course_id = EXCLUDED.course_id,
    cuisine_region_id = EXCLUDED.cuisine_region_id,
    spice_level = EXCLUDED.spice_level,
    retail_price_inr = EXCLUDED.retail_price_inr,
    retail_price_usd = EXCLUDED.retail_price_usd,
    is_signature = EXCLUDED.is_signature,
    image_url = EXCLUDED.image_url;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT 'c2bd4521-040a-447b-b47e-37c2beabfa52'::uuid, id FROM mood_tags WHERE name = 'indulgent' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT 'c2bd4521-040a-447b-b47e-37c2beabfa52'::uuid, id FROM mood_tags WHERE name = 'festive' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'c2bd4521-040a-447b-b47e-37c2beabfa52'::uuid, id FROM dietary_tags WHERE name = 'vegetarian' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) SELECT 'c2bd4521-040a-447b-b47e-37c2beabfa52'::uuid, id FROM allergens WHERE name = 'dairy' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) SELECT 'c2bd4521-040a-447b-b47e-37c2beabfa52'::uuid, id FROM allergens WHERE name = 'gluten' ON CONFLICT DO NOTHING;
INSERT INTO menu_items
(id, name, description, course_id, cuisine_region_id, spice_level,
 retail_price_inr, retail_price_usd, is_signature, image_url)
VALUES
(
    '8fe78111-6c96-4c70-9b52-46be74d37c6b'::uuid,
    'Falooda Rabri',
    'Layers of rabri, rose syrup, and vermicelli.',
    (SELECT id FROM courses WHERE name = 'dessert'),
    (SELECT id FROM cuisine_regions WHERE name = 'north_indian'),
    0,
    199,
    NULL,
    FALSE,
    '/images/menu/falooda-rabri.jpg'
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    course_id = EXCLUDED.course_id,
    cuisine_region_id = EXCLUDED.cuisine_region_id,
    spice_level = EXCLUDED.spice_level,
    retail_price_inr = EXCLUDED.retail_price_inr,
    retail_price_usd = EXCLUDED.retail_price_usd,
    is_signature = EXCLUDED.is_signature,
    image_url = EXCLUDED.image_url;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '8fe78111-6c96-4c70-9b52-46be74d37c6b'::uuid, id FROM mood_tags WHERE name = 'festive' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '8fe78111-6c96-4c70-9b52-46be74d37c6b'::uuid, id FROM mood_tags WHERE name = 'fresh' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '8fe78111-6c96-4c70-9b52-46be74d37c6b'::uuid, id FROM dietary_tags WHERE name = 'vegetarian' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) SELECT '8fe78111-6c96-4c70-9b52-46be74d37c6b'::uuid, id FROM allergens WHERE name = 'dairy' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) SELECT '8fe78111-6c96-4c70-9b52-46be74d37c6b'::uuid, id FROM allergens WHERE name = 'gluten' ON CONFLICT DO NOTHING;
INSERT INTO menu_items
(id, name, description, course_id, cuisine_region_id, spice_level,
 retail_price_inr, retail_price_usd, is_signature, image_url)
VALUES
(
    '7bf27fcc-2d1e-412f-9cb8-6ede1acb5e36'::uuid,
    'Fruit Skewers',
    'Fresh seasonal fruit on skewers.',
    (SELECT id FROM courses WHERE name = 'dessert'),
    (SELECT id FROM cuisine_regions WHERE name = 'fusion'),
    0,
    149,
    NULL,
    FALSE,
    '/images/menu/fruit-skewers.jpg'
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    course_id = EXCLUDED.course_id,
    cuisine_region_id = EXCLUDED.cuisine_region_id,
    spice_level = EXCLUDED.spice_level,
    retail_price_inr = EXCLUDED.retail_price_inr,
    retail_price_usd = EXCLUDED.retail_price_usd,
    is_signature = EXCLUDED.is_signature,
    image_url = EXCLUDED.image_url;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '7bf27fcc-2d1e-412f-9cb8-6ede1acb5e36'::uuid, id FROM mood_tags WHERE name = 'fresh' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '7bf27fcc-2d1e-412f-9cb8-6ede1acb5e36'::uuid, id FROM mood_tags WHERE name = 'light' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '7bf27fcc-2d1e-412f-9cb8-6ede1acb5e36'::uuid, id FROM dietary_tags WHERE name = 'vegetarian' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '7bf27fcc-2d1e-412f-9cb8-6ede1acb5e36'::uuid, id FROM dietary_tags WHERE name = 'vegan' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '7bf27fcc-2d1e-412f-9cb8-6ede1acb5e36'::uuid, id FROM dietary_tags WHERE name = 'gluten_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '7bf27fcc-2d1e-412f-9cb8-6ede1acb5e36'::uuid, id FROM dietary_tags WHERE name = 'dairy_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '7bf27fcc-2d1e-412f-9cb8-6ede1acb5e36'::uuid, id FROM dietary_tags WHERE name = 'nut_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_items
(id, name, description, course_id, cuisine_region_id, spice_level,
 retail_price_inr, retail_price_usd, is_signature, image_url)
VALUES
(
    '4a1e3ba1-ce14-4cae-85d5-dfe90aa7e6d3'::uuid,
    'Chocolate Gulakand Samosa with Chocolate Rabri',
    'Chocolate samosa filled with gulakand, served with chocolate rabri.',
    (SELECT id FROM courses WHERE name = 'dessert'),
    (SELECT id FROM cuisine_regions WHERE name = 'fusion'),
    0,
    199,
    NULL,
    TRUE,
    NULL
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    course_id = EXCLUDED.course_id,
    cuisine_region_id = EXCLUDED.cuisine_region_id,
    spice_level = EXCLUDED.spice_level,
    retail_price_inr = EXCLUDED.retail_price_inr,
    retail_price_usd = EXCLUDED.retail_price_usd,
    is_signature = EXCLUDED.is_signature,
    image_url = EXCLUDED.image_url;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '4a1e3ba1-ce14-4cae-85d5-dfe90aa7e6d3'::uuid, id FROM mood_tags WHERE name = 'indulgent' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '4a1e3ba1-ce14-4cae-85d5-dfe90aa7e6d3'::uuid, id FROM dietary_tags WHERE name = 'vegetarian' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) SELECT '4a1e3ba1-ce14-4cae-85d5-dfe90aa7e6d3'::uuid, id FROM allergens WHERE name = 'dairy' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) SELECT '4a1e3ba1-ce14-4cae-85d5-dfe90aa7e6d3'::uuid, id FROM allergens WHERE name = 'gluten' ON CONFLICT DO NOTHING;
INSERT INTO menu_items
(id, name, description, course_id, cuisine_region_id, spice_level,
 retail_price_inr, retail_price_usd, is_signature, image_url)
VALUES
(
    'e623b3f1-560d-4417-85d4-002cb89d33e4'::uuid,
    'Chocolate Koya Samosa',
    'Crisp chocolate samosa filled with sweet koya.',
    (SELECT id FROM courses WHERE name = 'dessert'),
    (SELECT id FROM cuisine_regions WHERE name = 'fusion'),
    0,
    169,
    NULL,
    FALSE,
    NULL
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    course_id = EXCLUDED.course_id,
    cuisine_region_id = EXCLUDED.cuisine_region_id,
    spice_level = EXCLUDED.spice_level,
    retail_price_inr = EXCLUDED.retail_price_inr,
    retail_price_usd = EXCLUDED.retail_price_usd,
    is_signature = EXCLUDED.is_signature,
    image_url = EXCLUDED.image_url;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT 'e623b3f1-560d-4417-85d4-002cb89d33e4'::uuid, id FROM mood_tags WHERE name = 'indulgent' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'e623b3f1-560d-4417-85d4-002cb89d33e4'::uuid, id FROM dietary_tags WHERE name = 'vegetarian' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) SELECT 'e623b3f1-560d-4417-85d4-002cb89d33e4'::uuid, id FROM allergens WHERE name = 'dairy' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) SELECT 'e623b3f1-560d-4417-85d4-002cb89d33e4'::uuid, id FROM allergens WHERE name = 'gluten' ON CONFLICT DO NOTHING;
INSERT INTO menu_items
(id, name, description, course_id, cuisine_region_id, spice_level,
 retail_price_inr, retail_price_usd, is_signature, image_url)
VALUES
(
    '94b2e074-fe36-401e-82da-a1ce41ac3a50'::uuid,
    'Canoli (Ras Malai, Masala Tea, Thandai, Chocolate Mousse)',
    'Italian-style cannoli with Indian fillings â pick your flavour.',
    (SELECT id FROM courses WHERE name = 'dessert'),
    (SELECT id FROM cuisine_regions WHERE name = 'fusion'),
    0,
    219,
    NULL,
    FALSE,
    '/images/menu/canoli-ras-malai-masala-tea-thandai-chocolate-mousse.jpg'
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    course_id = EXCLUDED.course_id,
    cuisine_region_id = EXCLUDED.cuisine_region_id,
    spice_level = EXCLUDED.spice_level,
    retail_price_inr = EXCLUDED.retail_price_inr,
    retail_price_usd = EXCLUDED.retail_price_usd,
    is_signature = EXCLUDED.is_signature,
    image_url = EXCLUDED.image_url;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '94b2e074-fe36-401e-82da-a1ce41ac3a50'::uuid, id FROM mood_tags WHERE name = 'indulgent' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '94b2e074-fe36-401e-82da-a1ce41ac3a50'::uuid, id FROM dietary_tags WHERE name = 'vegetarian' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) SELECT '94b2e074-fe36-401e-82da-a1ce41ac3a50'::uuid, id FROM allergens WHERE name = 'dairy' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) SELECT '94b2e074-fe36-401e-82da-a1ce41ac3a50'::uuid, id FROM allergens WHERE name = 'gluten' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) SELECT '94b2e074-fe36-401e-82da-a1ce41ac3a50'::uuid, id FROM allergens WHERE name = 'eggs' ON CONFLICT DO NOTHING;
INSERT INTO menu_items
(id, name, description, course_id, cuisine_region_id, spice_level,
 retail_price_inr, retail_price_usd, is_signature, image_url)
VALUES
(
    'ddebfe63-4bbe-4599-872f-791dd99d3ce8'::uuid,
    'Tartelettes (Mango, Coconut, Passion Fruit, Raspberry)',
    'Buttery tart shells with assorted fruit fillings.',
    (SELECT id FROM courses WHERE name = 'dessert'),
    (SELECT id FROM cuisine_regions WHERE name = 'fusion'),
    0,
    229,
    NULL,
    FALSE,
    '/images/menu/tartelettes-mango-coconut-passion-fruit-raspberry.jpg'
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    course_id = EXCLUDED.course_id,
    cuisine_region_id = EXCLUDED.cuisine_region_id,
    spice_level = EXCLUDED.spice_level,
    retail_price_inr = EXCLUDED.retail_price_inr,
    retail_price_usd = EXCLUDED.retail_price_usd,
    is_signature = EXCLUDED.is_signature,
    image_url = EXCLUDED.image_url;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT 'ddebfe63-4bbe-4599-872f-791dd99d3ce8'::uuid, id FROM mood_tags WHERE name = 'fresh' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT 'ddebfe63-4bbe-4599-872f-791dd99d3ce8'::uuid, id FROM mood_tags WHERE name = 'light' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'ddebfe63-4bbe-4599-872f-791dd99d3ce8'::uuid, id FROM dietary_tags WHERE name = 'vegetarian' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'ddebfe63-4bbe-4599-872f-791dd99d3ce8'::uuid, id FROM dietary_tags WHERE name = 'nut_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) SELECT 'ddebfe63-4bbe-4599-872f-791dd99d3ce8'::uuid, id FROM allergens WHERE name = 'dairy' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) SELECT 'ddebfe63-4bbe-4599-872f-791dd99d3ce8'::uuid, id FROM allergens WHERE name = 'gluten' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) SELECT 'ddebfe63-4bbe-4599-872f-791dd99d3ce8'::uuid, id FROM allergens WHERE name = 'eggs' ON CONFLICT DO NOTHING;
INSERT INTO menu_items
(id, name, description, course_id, cuisine_region_id, spice_level,
 retail_price_inr, retail_price_usd, is_signature, image_url)
VALUES
(
    'cabf780b-cd0a-4dbe-97ec-76f5772ce7c6'::uuid,
    'Nutty Plantain',
    'Caramelised plantain finished with toasted nuts.',
    (SELECT id FROM courses WHERE name = 'dessert'),
    (SELECT id FROM cuisine_regions WHERE name = 'south_indian'),
    0,
    149,
    NULL,
    FALSE,
    '/images/menu/nutty-plantain.jpg'
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    course_id = EXCLUDED.course_id,
    cuisine_region_id = EXCLUDED.cuisine_region_id,
    spice_level = EXCLUDED.spice_level,
    retail_price_inr = EXCLUDED.retail_price_inr,
    retail_price_usd = EXCLUDED.retail_price_usd,
    is_signature = EXCLUDED.is_signature,
    image_url = EXCLUDED.image_url;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT 'cabf780b-cd0a-4dbe-97ec-76f5772ce7c6'::uuid, id FROM mood_tags WHERE name = 'indulgent' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'cabf780b-cd0a-4dbe-97ec-76f5772ce7c6'::uuid, id FROM dietary_tags WHERE name = 'vegetarian' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'cabf780b-cd0a-4dbe-97ec-76f5772ce7c6'::uuid, id FROM dietary_tags WHERE name = 'gluten_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) SELECT 'cabf780b-cd0a-4dbe-97ec-76f5772ce7c6'::uuid, id FROM allergens WHERE name = 'nuts' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) SELECT 'cabf780b-cd0a-4dbe-97ec-76f5772ce7c6'::uuid, id FROM allergens WHERE name = 'dairy' ON CONFLICT DO NOTHING;
INSERT INTO menu_items
(id, name, description, course_id, cuisine_region_id, spice_level,
 retail_price_inr, retail_price_usd, is_signature, image_url)
VALUES
(
    '1cebc4ea-6cc9-40b6-b786-6c2b602c31c6'::uuid,
    'Malai Kofta',
    'Soft paneer-and-potato dumplings in a rich, mildly sweet cashew-cream sauce.',
    (SELECT id FROM courses WHERE name = 'main'),
    (SELECT id FROM cuisine_regions WHERE name = 'north_indian'),
    2,
    279,
    NULL,
    TRUE,
    '/images/menu/malai-kofta.jpg'
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    course_id = EXCLUDED.course_id,
    cuisine_region_id = EXCLUDED.cuisine_region_id,
    spice_level = EXCLUDED.spice_level,
    retail_price_inr = EXCLUDED.retail_price_inr,
    retail_price_usd = EXCLUDED.retail_price_usd,
    is_signature = EXCLUDED.is_signature,
    image_url = EXCLUDED.image_url;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '1cebc4ea-6cc9-40b6-b786-6c2b602c31c6'::uuid, id FROM mood_tags WHERE name = 'indulgent' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '1cebc4ea-6cc9-40b6-b786-6c2b602c31c6'::uuid, id FROM mood_tags WHERE name = 'comfort' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '1cebc4ea-6cc9-40b6-b786-6c2b602c31c6'::uuid, id FROM dietary_tags WHERE name = 'vegetarian' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) SELECT '1cebc4ea-6cc9-40b6-b786-6c2b602c31c6'::uuid, id FROM allergens WHERE name = 'dairy' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) SELECT '1cebc4ea-6cc9-40b6-b786-6c2b602c31c6'::uuid, id FROM allergens WHERE name = 'nuts' ON CONFLICT DO NOTHING;
INSERT INTO menu_items
(id, name, description, course_id, cuisine_region_id, spice_level,
 retail_price_inr, retail_price_usd, is_signature, image_url)
VALUES
(
    '6216fee1-9cb8-4ce1-8927-ce8fa8ba9dc6'::uuid,
    'Coconut Kofta in Mangalorean Sauce',
    'Vegetable koftas simmered in a coconut-forward Mangalorean curry.',
    (SELECT id FROM courses WHERE name = 'main'),
    (SELECT id FROM cuisine_regions WHERE name = 'south_indian'),
    3,
    299,
    NULL,
    FALSE,
    NULL
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    course_id = EXCLUDED.course_id,
    cuisine_region_id = EXCLUDED.cuisine_region_id,
    spice_level = EXCLUDED.spice_level,
    retail_price_inr = EXCLUDED.retail_price_inr,
    retail_price_usd = EXCLUDED.retail_price_usd,
    is_signature = EXCLUDED.is_signature,
    image_url = EXCLUDED.image_url;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '6216fee1-9cb8-4ce1-8927-ce8fa8ba9dc6'::uuid, id FROM mood_tags WHERE name = 'bold' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '6216fee1-9cb8-4ce1-8927-ce8fa8ba9dc6'::uuid, id FROM dietary_tags WHERE name = 'vegetarian' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '6216fee1-9cb8-4ce1-8927-ce8fa8ba9dc6'::uuid, id FROM dietary_tags WHERE name = 'vegan' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '6216fee1-9cb8-4ce1-8927-ce8fa8ba9dc6'::uuid, id FROM dietary_tags WHERE name = 'gluten_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '6216fee1-9cb8-4ce1-8927-ce8fa8ba9dc6'::uuid, id FROM dietary_tags WHERE name = 'dairy_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '6216fee1-9cb8-4ce1-8927-ce8fa8ba9dc6'::uuid, id FROM dietary_tags WHERE name = 'nut_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_items
(id, name, description, course_id, cuisine_region_id, spice_level,
 retail_price_inr, retail_price_usd, is_signature, image_url)
VALUES
(
    '302fb4c6-8d5a-4db5-af37-6353b4e09935'::uuid,
    'Jack Fruit Kofta',
    'Tender jackfruit koftas in a fragrant tomato gravy.',
    (SELECT id FROM courses WHERE name = 'main'),
    (SELECT id FROM cuisine_regions WHERE name = 'south_indian'),
    2,
    289,
    NULL,
    FALSE,
    NULL
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    course_id = EXCLUDED.course_id,
    cuisine_region_id = EXCLUDED.cuisine_region_id,
    spice_level = EXCLUDED.spice_level,
    retail_price_inr = EXCLUDED.retail_price_inr,
    retail_price_usd = EXCLUDED.retail_price_usd,
    is_signature = EXCLUDED.is_signature,
    image_url = EXCLUDED.image_url;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '302fb4c6-8d5a-4db5-af37-6353b4e09935'::uuid, id FROM mood_tags WHERE name = 'comfort' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '302fb4c6-8d5a-4db5-af37-6353b4e09935'::uuid, id FROM dietary_tags WHERE name = 'vegetarian' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '302fb4c6-8d5a-4db5-af37-6353b4e09935'::uuid, id FROM dietary_tags WHERE name = 'vegan' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '302fb4c6-8d5a-4db5-af37-6353b4e09935'::uuid, id FROM dietary_tags WHERE name = 'gluten_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '302fb4c6-8d5a-4db5-af37-6353b4e09935'::uuid, id FROM dietary_tags WHERE name = 'dairy_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '302fb4c6-8d5a-4db5-af37-6353b4e09935'::uuid, id FROM dietary_tags WHERE name = 'nut_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_items
(id, name, description, course_id, cuisine_region_id, spice_level,
 retail_price_inr, retail_price_usd, is_signature, image_url)
VALUES
(
    '88d5c698-37fe-42aa-8534-98b8bf68430a'::uuid,
    'Palak Aloo',
    'Spinach simmered with golden potatoes and aromatic spices.',
    (SELECT id FROM courses WHERE name = 'main'),
    (SELECT id FROM cuisine_regions WHERE name = 'north_indian'),
    2,
    229,
    NULL,
    FALSE,
    '/images/menu/palak-aloo.jpg'
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    course_id = EXCLUDED.course_id,
    cuisine_region_id = EXCLUDED.cuisine_region_id,
    spice_level = EXCLUDED.spice_level,
    retail_price_inr = EXCLUDED.retail_price_inr,
    retail_price_usd = EXCLUDED.retail_price_usd,
    is_signature = EXCLUDED.is_signature,
    image_url = EXCLUDED.image_url;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '88d5c698-37fe-42aa-8534-98b8bf68430a'::uuid, id FROM mood_tags WHERE name = 'comfort' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '88d5c698-37fe-42aa-8534-98b8bf68430a'::uuid, id FROM mood_tags WHERE name = 'light' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '88d5c698-37fe-42aa-8534-98b8bf68430a'::uuid, id FROM dietary_tags WHERE name = 'vegetarian' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '88d5c698-37fe-42aa-8534-98b8bf68430a'::uuid, id FROM dietary_tags WHERE name = 'vegan' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '88d5c698-37fe-42aa-8534-98b8bf68430a'::uuid, id FROM dietary_tags WHERE name = 'jain' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '88d5c698-37fe-42aa-8534-98b8bf68430a'::uuid, id FROM dietary_tags WHERE name = 'gluten_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '88d5c698-37fe-42aa-8534-98b8bf68430a'::uuid, id FROM dietary_tags WHERE name = 'dairy_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '88d5c698-37fe-42aa-8534-98b8bf68430a'::uuid, id FROM dietary_tags WHERE name = 'nut_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_items
(id, name, description, course_id, cuisine_region_id, spice_level,
 retail_price_inr, retail_price_usd, is_signature, image_url)
VALUES
(
    '385f7b75-07f1-48d6-a5bb-1edb20f4face'::uuid,
    'Aloo Gobhi / Bhuni Gobhi',
    'Roasted cauliflower and potatoes tossed with turmeric and cumin.',
    (SELECT id FROM courses WHERE name = 'main'),
    (SELECT id FROM cuisine_regions WHERE name = 'north_indian'),
    2,
    239,
    NULL,
    FALSE,
    '/images/menu/aloo-gobhi-bhuni-gobhi.jpg'
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    course_id = EXCLUDED.course_id,
    cuisine_region_id = EXCLUDED.cuisine_region_id,
    spice_level = EXCLUDED.spice_level,
    retail_price_inr = EXCLUDED.retail_price_inr,
    retail_price_usd = EXCLUDED.retail_price_usd,
    is_signature = EXCLUDED.is_signature,
    image_url = EXCLUDED.image_url;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '385f7b75-07f1-48d6-a5bb-1edb20f4face'::uuid, id FROM mood_tags WHERE name = 'comfort' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '385f7b75-07f1-48d6-a5bb-1edb20f4face'::uuid, id FROM dietary_tags WHERE name = 'vegetarian' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '385f7b75-07f1-48d6-a5bb-1edb20f4face'::uuid, id FROM dietary_tags WHERE name = 'vegan' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '385f7b75-07f1-48d6-a5bb-1edb20f4face'::uuid, id FROM dietary_tags WHERE name = 'jain' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '385f7b75-07f1-48d6-a5bb-1edb20f4face'::uuid, id FROM dietary_tags WHERE name = 'gluten_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '385f7b75-07f1-48d6-a5bb-1edb20f4face'::uuid, id FROM dietary_tags WHERE name = 'dairy_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '385f7b75-07f1-48d6-a5bb-1edb20f4face'::uuid, id FROM dietary_tags WHERE name = 'nut_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_items
(id, name, description, course_id, cuisine_region_id, spice_level,
 retail_price_inr, retail_price_usd, is_signature, image_url)
VALUES
(
    '5b8e21d8-215f-4edc-87cb-443bda4565f0'::uuid,
    'Baingan Bharta / Baigare Baingan',
    'Smoky charred eggplant mash with onions, tomato, and green chilli.',
    (SELECT id FROM courses WHERE name = 'main'),
    (SELECT id FROM cuisine_regions WHERE name = 'north_indian'),
    2,
    249,
    NULL,
    FALSE,
    '/images/menu/baingan-bharta-baigare-baingan.jpg'
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    course_id = EXCLUDED.course_id,
    cuisine_region_id = EXCLUDED.cuisine_region_id,
    spice_level = EXCLUDED.spice_level,
    retail_price_inr = EXCLUDED.retail_price_inr,
    retail_price_usd = EXCLUDED.retail_price_usd,
    is_signature = EXCLUDED.is_signature,
    image_url = EXCLUDED.image_url;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '5b8e21d8-215f-4edc-87cb-443bda4565f0'::uuid, id FROM mood_tags WHERE name = 'comfort' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '5b8e21d8-215f-4edc-87cb-443bda4565f0'::uuid, id FROM mood_tags WHERE name = 'hearty' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '5b8e21d8-215f-4edc-87cb-443bda4565f0'::uuid, id FROM dietary_tags WHERE name = 'vegetarian' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '5b8e21d8-215f-4edc-87cb-443bda4565f0'::uuid, id FROM dietary_tags WHERE name = 'vegan' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '5b8e21d8-215f-4edc-87cb-443bda4565f0'::uuid, id FROM dietary_tags WHERE name = 'gluten_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '5b8e21d8-215f-4edc-87cb-443bda4565f0'::uuid, id FROM dietary_tags WHERE name = 'dairy_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '5b8e21d8-215f-4edc-87cb-443bda4565f0'::uuid, id FROM dietary_tags WHERE name = 'nut_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_items
(id, name, description, course_id, cuisine_region_id, spice_level,
 retail_price_inr, retail_price_usd, is_signature, image_url)
VALUES
(
    '53ab2e87-b118-4d6b-a865-a1e8f3e5281c'::uuid,
    'Tawa Bhindi Masala',
    'Griddle-seared okra tossed in onion-tomato masala.',
    (SELECT id FROM courses WHERE name = 'main'),
    (SELECT id FROM cuisine_regions WHERE name = 'north_indian'),
    2,
    249,
    NULL,
    FALSE,
    '/images/menu/tawa-bhindi-masala.jpg'
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    course_id = EXCLUDED.course_id,
    cuisine_region_id = EXCLUDED.cuisine_region_id,
    spice_level = EXCLUDED.spice_level,
    retail_price_inr = EXCLUDED.retail_price_inr,
    retail_price_usd = EXCLUDED.retail_price_usd,
    is_signature = EXCLUDED.is_signature,
    image_url = EXCLUDED.image_url;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '53ab2e87-b118-4d6b-a865-a1e8f3e5281c'::uuid, id FROM mood_tags WHERE name = 'light' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '53ab2e87-b118-4d6b-a865-a1e8f3e5281c'::uuid, id FROM mood_tags WHERE name = 'fresh' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '53ab2e87-b118-4d6b-a865-a1e8f3e5281c'::uuid, id FROM dietary_tags WHERE name = 'vegetarian' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '53ab2e87-b118-4d6b-a865-a1e8f3e5281c'::uuid, id FROM dietary_tags WHERE name = 'vegan' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '53ab2e87-b118-4d6b-a865-a1e8f3e5281c'::uuid, id FROM dietary_tags WHERE name = 'gluten_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '53ab2e87-b118-4d6b-a865-a1e8f3e5281c'::uuid, id FROM dietary_tags WHERE name = 'dairy_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '53ab2e87-b118-4d6b-a865-a1e8f3e5281c'::uuid, id FROM dietary_tags WHERE name = 'nut_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_items
(id, name, description, course_id, cuisine_region_id, spice_level,
 retail_price_inr, retail_price_usd, is_signature, image_url)
VALUES
(
    '9d5f219e-fc9f-4306-8180-2bdabae2ba81'::uuid,
    'Black Pepper Aloo',
    'Baby potatoes wok-tossed with cracked pepper and curry leaves.',
    (SELECT id FROM courses WHERE name = 'main'),
    (SELECT id FROM cuisine_regions WHERE name = 'south_indian'),
    3,
    239,
    NULL,
    FALSE,
    NULL
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    course_id = EXCLUDED.course_id,
    cuisine_region_id = EXCLUDED.cuisine_region_id,
    spice_level = EXCLUDED.spice_level,
    retail_price_inr = EXCLUDED.retail_price_inr,
    retail_price_usd = EXCLUDED.retail_price_usd,
    is_signature = EXCLUDED.is_signature,
    image_url = EXCLUDED.image_url;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '9d5f219e-fc9f-4306-8180-2bdabae2ba81'::uuid, id FROM mood_tags WHERE name = 'bold' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '9d5f219e-fc9f-4306-8180-2bdabae2ba81'::uuid, id FROM dietary_tags WHERE name = 'vegetarian' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '9d5f219e-fc9f-4306-8180-2bdabae2ba81'::uuid, id FROM dietary_tags WHERE name = 'vegan' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '9d5f219e-fc9f-4306-8180-2bdabae2ba81'::uuid, id FROM dietary_tags WHERE name = 'gluten_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '9d5f219e-fc9f-4306-8180-2bdabae2ba81'::uuid, id FROM dietary_tags WHERE name = 'dairy_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '9d5f219e-fc9f-4306-8180-2bdabae2ba81'::uuid, id FROM dietary_tags WHERE name = 'nut_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_items
(id, name, description, course_id, cuisine_region_id, spice_level,
 retail_price_inr, retail_price_usd, is_signature, image_url)
VALUES
(
    '9d4d796d-6293-47e8-866b-f9543b9c2540'::uuid,
    'Veg Jalfrezi',
    'Mixed vegetables stir-fried with peppers, onion, and tomato.',
    (SELECT id FROM courses WHERE name = 'main'),
    (SELECT id FROM cuisine_regions WHERE name = 'north_indian'),
    3,
    269,
    NULL,
    FALSE,
    '/images/menu/veg-jalfrezi.jpg'
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    course_id = EXCLUDED.course_id,
    cuisine_region_id = EXCLUDED.cuisine_region_id,
    spice_level = EXCLUDED.spice_level,
    retail_price_inr = EXCLUDED.retail_price_inr,
    retail_price_usd = EXCLUDED.retail_price_usd,
    is_signature = EXCLUDED.is_signature,
    image_url = EXCLUDED.image_url;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '9d4d796d-6293-47e8-866b-f9543b9c2540'::uuid, id FROM mood_tags WHERE name = 'fresh' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '9d4d796d-6293-47e8-866b-f9543b9c2540'::uuid, id FROM dietary_tags WHERE name = 'vegetarian' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '9d4d796d-6293-47e8-866b-f9543b9c2540'::uuid, id FROM dietary_tags WHERE name = 'vegan' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '9d4d796d-6293-47e8-866b-f9543b9c2540'::uuid, id FROM dietary_tags WHERE name = 'gluten_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '9d4d796d-6293-47e8-866b-f9543b9c2540'::uuid, id FROM dietary_tags WHERE name = 'dairy_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '9d4d796d-6293-47e8-866b-f9543b9c2540'::uuid, id FROM dietary_tags WHERE name = 'nut_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_items
(id, name, description, course_id, cuisine_region_id, spice_level,
 retail_price_inr, retail_price_usd, is_signature, image_url)
VALUES
(
    '89517b39-f7ca-4e98-89d6-50df0054eb53'::uuid,
    'Sarson Ka Saag',
    'Slow-cooked mustard greens in the Punjabi tradition.',
    (SELECT id FROM courses WHERE name = 'main'),
    (SELECT id FROM cuisine_regions WHERE name = 'north_indian'),
    2,
    279,
    NULL,
    FALSE,
    '/images/menu/sarson-ka-saag.jpg'
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    course_id = EXCLUDED.course_id,
    cuisine_region_id = EXCLUDED.cuisine_region_id,
    spice_level = EXCLUDED.spice_level,
    retail_price_inr = EXCLUDED.retail_price_inr,
    retail_price_usd = EXCLUDED.retail_price_usd,
    is_signature = EXCLUDED.is_signature,
    image_url = EXCLUDED.image_url;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '89517b39-f7ca-4e98-89d6-50df0054eb53'::uuid, id FROM mood_tags WHERE name = 'hearty' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '89517b39-f7ca-4e98-89d6-50df0054eb53'::uuid, id FROM mood_tags WHERE name = 'comfort' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '89517b39-f7ca-4e98-89d6-50df0054eb53'::uuid, id FROM dietary_tags WHERE name = 'vegetarian' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '89517b39-f7ca-4e98-89d6-50df0054eb53'::uuid, id FROM dietary_tags WHERE name = 'gluten_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '89517b39-f7ca-4e98-89d6-50df0054eb53'::uuid, id FROM dietary_tags WHERE name = 'nut_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) SELECT '89517b39-f7ca-4e98-89d6-50df0054eb53'::uuid, id FROM allergens WHERE name = 'dairy' ON CONFLICT DO NOTHING;
INSERT INTO menu_items
(id, name, description, course_id, cuisine_region_id, spice_level,
 retail_price_inr, retail_price_usd, is_signature, image_url)
VALUES
(
    '534770cb-1a57-4e57-9d6a-06794c562be7'::uuid,
    'Raw Banana Kofta',
    'Green-plantain koftas in a tangy tomato gravy.',
    (SELECT id FROM courses WHERE name = 'main'),
    (SELECT id FROM cuisine_regions WHERE name = 'south_indian'),
    2,
    269,
    NULL,
    FALSE,
    '/images/menu/raw-banana-kofta.jpg'
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    course_id = EXCLUDED.course_id,
    cuisine_region_id = EXCLUDED.cuisine_region_id,
    spice_level = EXCLUDED.spice_level,
    retail_price_inr = EXCLUDED.retail_price_inr,
    retail_price_usd = EXCLUDED.retail_price_usd,
    is_signature = EXCLUDED.is_signature,
    image_url = EXCLUDED.image_url;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '534770cb-1a57-4e57-9d6a-06794c562be7'::uuid, id FROM mood_tags WHERE name = 'comfort' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '534770cb-1a57-4e57-9d6a-06794c562be7'::uuid, id FROM dietary_tags WHERE name = 'vegetarian' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '534770cb-1a57-4e57-9d6a-06794c562be7'::uuid, id FROM dietary_tags WHERE name = 'vegan' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '534770cb-1a57-4e57-9d6a-06794c562be7'::uuid, id FROM dietary_tags WHERE name = 'gluten_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '534770cb-1a57-4e57-9d6a-06794c562be7'::uuid, id FROM dietary_tags WHERE name = 'dairy_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '534770cb-1a57-4e57-9d6a-06794c562be7'::uuid, id FROM dietary_tags WHERE name = 'nut_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_items
(id, name, description, course_id, cuisine_region_id, spice_level,
 retail_price_inr, retail_price_usd, is_signature, image_url)
VALUES
(
    '91c2f8f8-5f26-47d8-b2bf-4f0adad5ad88'::uuid,
    'Jackfruit & Eggplant Bharta',
    'Smoked jackfruit and eggplant mashed with onions and chilli.',
    (SELECT id FROM courses WHERE name = 'main'),
    (SELECT id FROM cuisine_regions WHERE name = 'fusion'),
    2,
    289,
    NULL,
    FALSE,
    NULL
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    course_id = EXCLUDED.course_id,
    cuisine_region_id = EXCLUDED.cuisine_region_id,
    spice_level = EXCLUDED.spice_level,
    retail_price_inr = EXCLUDED.retail_price_inr,
    retail_price_usd = EXCLUDED.retail_price_usd,
    is_signature = EXCLUDED.is_signature,
    image_url = EXCLUDED.image_url;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '91c2f8f8-5f26-47d8-b2bf-4f0adad5ad88'::uuid, id FROM mood_tags WHERE name = 'hearty' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '91c2f8f8-5f26-47d8-b2bf-4f0adad5ad88'::uuid, id FROM dietary_tags WHERE name = 'vegetarian' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '91c2f8f8-5f26-47d8-b2bf-4f0adad5ad88'::uuid, id FROM dietary_tags WHERE name = 'vegan' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '91c2f8f8-5f26-47d8-b2bf-4f0adad5ad88'::uuid, id FROM dietary_tags WHERE name = 'gluten_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '91c2f8f8-5f26-47d8-b2bf-4f0adad5ad88'::uuid, id FROM dietary_tags WHERE name = 'dairy_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '91c2f8f8-5f26-47d8-b2bf-4f0adad5ad88'::uuid, id FROM dietary_tags WHERE name = 'nut_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_items
(id, name, description, course_id, cuisine_region_id, spice_level,
 retail_price_inr, retail_price_usd, is_signature, image_url)
VALUES
(
    '409a4748-f243-4fc5-ac51-82943aee9edf'::uuid,
    'Nadru Curry',
    'Kashmiri lotus stems simmered in a fennel-and-ginger sauce.',
    (SELECT id FROM courses WHERE name = 'main'),
    (SELECT id FROM cuisine_regions WHERE name = 'north_indian'),
    2,
    299,
    NULL,
    FALSE,
    '/images/menu/nadru-curry.jpg'
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    course_id = EXCLUDED.course_id,
    cuisine_region_id = EXCLUDED.cuisine_region_id,
    spice_level = EXCLUDED.spice_level,
    retail_price_inr = EXCLUDED.retail_price_inr,
    retail_price_usd = EXCLUDED.retail_price_usd,
    is_signature = EXCLUDED.is_signature,
    image_url = EXCLUDED.image_url;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '409a4748-f243-4fc5-ac51-82943aee9edf'::uuid, id FROM mood_tags WHERE name = 'bold' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '409a4748-f243-4fc5-ac51-82943aee9edf'::uuid, id FROM mood_tags WHERE name = 'hearty' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '409a4748-f243-4fc5-ac51-82943aee9edf'::uuid, id FROM dietary_tags WHERE name = 'vegetarian' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '409a4748-f243-4fc5-ac51-82943aee9edf'::uuid, id FROM dietary_tags WHERE name = 'vegan' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '409a4748-f243-4fc5-ac51-82943aee9edf'::uuid, id FROM dietary_tags WHERE name = 'gluten_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '409a4748-f243-4fc5-ac51-82943aee9edf'::uuid, id FROM dietary_tags WHERE name = 'dairy_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '409a4748-f243-4fc5-ac51-82943aee9edf'::uuid, id FROM dietary_tags WHERE name = 'nut_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_items
(id, name, description, course_id, cuisine_region_id, spice_level,
 retail_price_inr, retail_price_usd, is_signature, image_url)
VALUES
(
    '804fcffe-4e31-4294-a296-50452af702dd'::uuid,
    'Kokum Tava Glaze Vegetables',
    'Griddled seasonal vegetables glazed with tart kokum.',
    (SELECT id FROM courses WHERE name = 'main'),
    (SELECT id FROM cuisine_regions WHERE name = 'fusion'),
    2,
    299,
    NULL,
    FALSE,
    NULL
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    course_id = EXCLUDED.course_id,
    cuisine_region_id = EXCLUDED.cuisine_region_id,
    spice_level = EXCLUDED.spice_level,
    retail_price_inr = EXCLUDED.retail_price_inr,
    retail_price_usd = EXCLUDED.retail_price_usd,
    is_signature = EXCLUDED.is_signature,
    image_url = EXCLUDED.image_url;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '804fcffe-4e31-4294-a296-50452af702dd'::uuid, id FROM mood_tags WHERE name = 'fresh' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '804fcffe-4e31-4294-a296-50452af702dd'::uuid, id FROM dietary_tags WHERE name = 'vegetarian' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '804fcffe-4e31-4294-a296-50452af702dd'::uuid, id FROM dietary_tags WHERE name = 'vegan' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '804fcffe-4e31-4294-a296-50452af702dd'::uuid, id FROM dietary_tags WHERE name = 'gluten_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '804fcffe-4e31-4294-a296-50452af702dd'::uuid, id FROM dietary_tags WHERE name = 'dairy_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '804fcffe-4e31-4294-a296-50452af702dd'::uuid, id FROM dietary_tags WHERE name = 'nut_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_items
(id, name, description, course_id, cuisine_region_id, spice_level,
 retail_price_inr, retail_price_usd, is_signature, image_url)
VALUES
(
    'd6a78e74-fdc5-4cc0-97ca-f069b243af61'::uuid,
    'Tawa Tokri Chana',
    'Crispy potato baskets filled with spiced chickpeas.',
    (SELECT id FROM courses WHERE name = 'main'),
    (SELECT id FROM cuisine_regions WHERE name = 'street_food'),
    3,
    249,
    NULL,
    FALSE,
    '/images/menu/tawa-tokri-chana.png'
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    course_id = EXCLUDED.course_id,
    cuisine_region_id = EXCLUDED.cuisine_region_id,
    spice_level = EXCLUDED.spice_level,
    retail_price_inr = EXCLUDED.retail_price_inr,
    retail_price_usd = EXCLUDED.retail_price_usd,
    is_signature = EXCLUDED.is_signature,
    image_url = EXCLUDED.image_url;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT 'd6a78e74-fdc5-4cc0-97ca-f069b243af61'::uuid, id FROM mood_tags WHERE name = 'festive' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT 'd6a78e74-fdc5-4cc0-97ca-f069b243af61'::uuid, id FROM mood_tags WHERE name = 'bold' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'd6a78e74-fdc5-4cc0-97ca-f069b243af61'::uuid, id FROM dietary_tags WHERE name = 'vegetarian' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'd6a78e74-fdc5-4cc0-97ca-f069b243af61'::uuid, id FROM dietary_tags WHERE name = 'vegan' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'd6a78e74-fdc5-4cc0-97ca-f069b243af61'::uuid, id FROM dietary_tags WHERE name = 'dairy_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'd6a78e74-fdc5-4cc0-97ca-f069b243af61'::uuid, id FROM dietary_tags WHERE name = 'nut_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_items
(id, name, description, course_id, cuisine_region_id, spice_level,
 retail_price_inr, retail_price_usd, is_signature, image_url)
VALUES
(
    'eb262e25-1ef0-4a8e-bf80-e7c15e4004e2'::uuid,
    'Plantain Pataka',
    'Fiery wok-tossed plantain with curry leaves and chilli.',
    (SELECT id FROM courses WHERE name = 'main'),
    (SELECT id FROM cuisine_regions WHERE name = 'south_indian'),
    4,
    249,
    NULL,
    FALSE,
    NULL
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    course_id = EXCLUDED.course_id,
    cuisine_region_id = EXCLUDED.cuisine_region_id,
    spice_level = EXCLUDED.spice_level,
    retail_price_inr = EXCLUDED.retail_price_inr,
    retail_price_usd = EXCLUDED.retail_price_usd,
    is_signature = EXCLUDED.is_signature,
    image_url = EXCLUDED.image_url;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT 'eb262e25-1ef0-4a8e-bf80-e7c15e4004e2'::uuid, id FROM mood_tags WHERE name = 'bold' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'eb262e25-1ef0-4a8e-bf80-e7c15e4004e2'::uuid, id FROM dietary_tags WHERE name = 'vegetarian' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'eb262e25-1ef0-4a8e-bf80-e7c15e4004e2'::uuid, id FROM dietary_tags WHERE name = 'vegan' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'eb262e25-1ef0-4a8e-bf80-e7c15e4004e2'::uuid, id FROM dietary_tags WHERE name = 'gluten_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'eb262e25-1ef0-4a8e-bf80-e7c15e4004e2'::uuid, id FROM dietary_tags WHERE name = 'dairy_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'eb262e25-1ef0-4a8e-bf80-e7c15e4004e2'::uuid, id FROM dietary_tags WHERE name = 'nut_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_items
(id, name, description, course_id, cuisine_region_id, spice_level,
 retail_price_inr, retail_price_usd, is_signature, image_url)
VALUES
(
    '3478f686-b226-4800-906f-27d5122ac205'::uuid,
    'Shahi Paneer',
    'Paneer cubes in a regal cashew, cardamom, and cream gravy.',
    (SELECT id FROM courses WHERE name = 'main'),
    (SELECT id FROM cuisine_regions WHERE name = 'mughlai'),
    2,
    299,
    NULL,
    TRUE,
    '/images/menu/shahi-paneer.jpg'
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    course_id = EXCLUDED.course_id,
    cuisine_region_id = EXCLUDED.cuisine_region_id,
    spice_level = EXCLUDED.spice_level,
    retail_price_inr = EXCLUDED.retail_price_inr,
    retail_price_usd = EXCLUDED.retail_price_usd,
    is_signature = EXCLUDED.is_signature,
    image_url = EXCLUDED.image_url;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '3478f686-b226-4800-906f-27d5122ac205'::uuid, id FROM mood_tags WHERE name = 'indulgent' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '3478f686-b226-4800-906f-27d5122ac205'::uuid, id FROM mood_tags WHERE name = 'festive' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '3478f686-b226-4800-906f-27d5122ac205'::uuid, id FROM dietary_tags WHERE name = 'vegetarian' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '3478f686-b226-4800-906f-27d5122ac205'::uuid, id FROM dietary_tags WHERE name = 'gluten_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) SELECT '3478f686-b226-4800-906f-27d5122ac205'::uuid, id FROM allergens WHERE name = 'dairy' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) SELECT '3478f686-b226-4800-906f-27d5122ac205'::uuid, id FROM allergens WHERE name = 'nuts' ON CONFLICT DO NOTHING;
INSERT INTO menu_items
(id, name, description, course_id, cuisine_region_id, spice_level,
 retail_price_inr, retail_price_usd, is_signature, image_url)
VALUES
(
    '8d0af06e-2d56-43e6-a9ca-32c678978558'::uuid,
    'Mangalorean Paneer',
    'Paneer in a coconut-and-chilli Mangalorean gravy.',
    (SELECT id FROM courses WHERE name = 'main'),
    (SELECT id FROM cuisine_regions WHERE name = 'south_indian'),
    3,
    299,
    NULL,
    FALSE,
    NULL
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    course_id = EXCLUDED.course_id,
    cuisine_region_id = EXCLUDED.cuisine_region_id,
    spice_level = EXCLUDED.spice_level,
    retail_price_inr = EXCLUDED.retail_price_inr,
    retail_price_usd = EXCLUDED.retail_price_usd,
    is_signature = EXCLUDED.is_signature,
    image_url = EXCLUDED.image_url;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '8d0af06e-2d56-43e6-a9ca-32c678978558'::uuid, id FROM mood_tags WHERE name = 'bold' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '8d0af06e-2d56-43e6-a9ca-32c678978558'::uuid, id FROM dietary_tags WHERE name = 'vegetarian' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '8d0af06e-2d56-43e6-a9ca-32c678978558'::uuid, id FROM dietary_tags WHERE name = 'gluten_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '8d0af06e-2d56-43e6-a9ca-32c678978558'::uuid, id FROM dietary_tags WHERE name = 'nut_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) SELECT '8d0af06e-2d56-43e6-a9ca-32c678978558'::uuid, id FROM allergens WHERE name = 'dairy' ON CONFLICT DO NOTHING;
INSERT INTO menu_items
(id, name, description, course_id, cuisine_region_id, spice_level,
 retail_price_inr, retail_price_usd, is_signature, image_url)
VALUES
(
    'e2162dc7-f19b-4f59-b355-cc4bb1f39548'::uuid,
    'Paneer Chettinand',
    'Paneer simmered in a peppery Chettinad masala.',
    (SELECT id FROM courses WHERE name = 'main'),
    (SELECT id FROM cuisine_regions WHERE name = 'south_indian'),
    4,
    299,
    NULL,
    FALSE,
    NULL
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    course_id = EXCLUDED.course_id,
    cuisine_region_id = EXCLUDED.cuisine_region_id,
    spice_level = EXCLUDED.spice_level,
    retail_price_inr = EXCLUDED.retail_price_inr,
    retail_price_usd = EXCLUDED.retail_price_usd,
    is_signature = EXCLUDED.is_signature,
    image_url = EXCLUDED.image_url;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT 'e2162dc7-f19b-4f59-b355-cc4bb1f39548'::uuid, id FROM mood_tags WHERE name = 'bold' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'e2162dc7-f19b-4f59-b355-cc4bb1f39548'::uuid, id FROM dietary_tags WHERE name = 'vegetarian' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'e2162dc7-f19b-4f59-b355-cc4bb1f39548'::uuid, id FROM dietary_tags WHERE name = 'gluten_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'e2162dc7-f19b-4f59-b355-cc4bb1f39548'::uuid, id FROM dietary_tags WHERE name = 'nut_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) SELECT 'e2162dc7-f19b-4f59-b355-cc4bb1f39548'::uuid, id FROM allergens WHERE name = 'dairy' ON CONFLICT DO NOTHING;
INSERT INTO menu_items
(id, name, description, course_id, cuisine_region_id, spice_level,
 retail_price_inr, retail_price_usd, is_signature, image_url)
VALUES
(
    'd1682d4e-d406-4e60-b014-1e5369872c34'::uuid,
    'Paneer Makhani',
    'Paneer in a silky tomato-butter gravy finished with fenugreek.',
    (SELECT id FROM courses WHERE name = 'main'),
    (SELECT id FROM cuisine_regions WHERE name = 'north_indian'),
    2,
    299,
    NULL,
    TRUE,
    '/images/menu/paneer-makhani.jpg'
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    course_id = EXCLUDED.course_id,
    cuisine_region_id = EXCLUDED.cuisine_region_id,
    spice_level = EXCLUDED.spice_level,
    retail_price_inr = EXCLUDED.retail_price_inr,
    retail_price_usd = EXCLUDED.retail_price_usd,
    is_signature = EXCLUDED.is_signature,
    image_url = EXCLUDED.image_url;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT 'd1682d4e-d406-4e60-b014-1e5369872c34'::uuid, id FROM mood_tags WHERE name = 'comfort' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT 'd1682d4e-d406-4e60-b014-1e5369872c34'::uuid, id FROM mood_tags WHERE name = 'indulgent' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'd1682d4e-d406-4e60-b014-1e5369872c34'::uuid, id FROM dietary_tags WHERE name = 'vegetarian' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'd1682d4e-d406-4e60-b014-1e5369872c34'::uuid, id FROM dietary_tags WHERE name = 'gluten_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'd1682d4e-d406-4e60-b014-1e5369872c34'::uuid, id FROM dietary_tags WHERE name = 'nut_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) SELECT 'd1682d4e-d406-4e60-b014-1e5369872c34'::uuid, id FROM allergens WHERE name = 'dairy' ON CONFLICT DO NOTHING;
INSERT INTO menu_items
(id, name, description, course_id, cuisine_region_id, spice_level,
 retail_price_inr, retail_price_usd, is_signature, image_url)
VALUES
(
    '21942b93-861b-42df-89ce-70af92dfa8a8'::uuid,
    'Palak Paneer',
    'Pureed spinach with paneer, tempered with garlic and cumin.',
    (SELECT id FROM courses WHERE name = 'main'),
    (SELECT id FROM cuisine_regions WHERE name = 'north_indian'),
    2,
    279,
    NULL,
    FALSE,
    '/images/menu/palak-paneer.jpg'
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    course_id = EXCLUDED.course_id,
    cuisine_region_id = EXCLUDED.cuisine_region_id,
    spice_level = EXCLUDED.spice_level,
    retail_price_inr = EXCLUDED.retail_price_inr,
    retail_price_usd = EXCLUDED.retail_price_usd,
    is_signature = EXCLUDED.is_signature,
    image_url = EXCLUDED.image_url;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '21942b93-861b-42df-89ce-70af92dfa8a8'::uuid, id FROM mood_tags WHERE name = 'comfort' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '21942b93-861b-42df-89ce-70af92dfa8a8'::uuid, id FROM mood_tags WHERE name = 'light' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '21942b93-861b-42df-89ce-70af92dfa8a8'::uuid, id FROM dietary_tags WHERE name = 'vegetarian' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '21942b93-861b-42df-89ce-70af92dfa8a8'::uuid, id FROM dietary_tags WHERE name = 'gluten_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '21942b93-861b-42df-89ce-70af92dfa8a8'::uuid, id FROM dietary_tags WHERE name = 'nut_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) SELECT '21942b93-861b-42df-89ce-70af92dfa8a8'::uuid, id FROM allergens WHERE name = 'dairy' ON CONFLICT DO NOTHING;
INSERT INTO menu_items
(id, name, description, course_id, cuisine_region_id, spice_level,
 retail_price_inr, retail_price_usd, is_signature, image_url)
VALUES
(
    '5a331baf-1981-4967-a4bf-74e11a2f344d'::uuid,
    'Dal Bukhara / Dal Makhani',
    'Black lentils simmered overnight in butter, cream, and tomato.',
    (SELECT id FROM courses WHERE name = 'main'),
    (SELECT id FROM cuisine_regions WHERE name = 'north_indian'),
    1,
    269,
    NULL,
    TRUE,
    '/images/menu/dal-bukhara-dal-makhani.jpg'
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    course_id = EXCLUDED.course_id,
    cuisine_region_id = EXCLUDED.cuisine_region_id,
    spice_level = EXCLUDED.spice_level,
    retail_price_inr = EXCLUDED.retail_price_inr,
    retail_price_usd = EXCLUDED.retail_price_usd,
    is_signature = EXCLUDED.is_signature,
    image_url = EXCLUDED.image_url;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '5a331baf-1981-4967-a4bf-74e11a2f344d'::uuid, id FROM mood_tags WHERE name = 'comfort' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '5a331baf-1981-4967-a4bf-74e11a2f344d'::uuid, id FROM mood_tags WHERE name = 'hearty' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '5a331baf-1981-4967-a4bf-74e11a2f344d'::uuid, id FROM dietary_tags WHERE name = 'vegetarian' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '5a331baf-1981-4967-a4bf-74e11a2f344d'::uuid, id FROM dietary_tags WHERE name = 'gluten_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '5a331baf-1981-4967-a4bf-74e11a2f344d'::uuid, id FROM dietary_tags WHERE name = 'nut_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) SELECT '5a331baf-1981-4967-a4bf-74e11a2f344d'::uuid, id FROM allergens WHERE name = 'dairy' ON CONFLICT DO NOTHING;
INSERT INTO menu_items
(id, name, description, course_id, cuisine_region_id, spice_level,
 retail_price_inr, retail_price_usd, is_signature, image_url)
VALUES
(
    '86b6de9e-c6e5-4172-8eb7-52af453247ea'::uuid,
    'Dal Tadka',
    'Yellow lentils finished with a fragrant cumin-and-garlic tempering.',
    (SELECT id FROM courses WHERE name = 'main'),
    (SELECT id FROM cuisine_regions WHERE name = 'north_indian'),
    2,
    219,
    NULL,
    FALSE,
    '/images/menu/dal-tadka.jpg'
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    course_id = EXCLUDED.course_id,
    cuisine_region_id = EXCLUDED.cuisine_region_id,
    spice_level = EXCLUDED.spice_level,
    retail_price_inr = EXCLUDED.retail_price_inr,
    retail_price_usd = EXCLUDED.retail_price_usd,
    is_signature = EXCLUDED.is_signature,
    image_url = EXCLUDED.image_url;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '86b6de9e-c6e5-4172-8eb7-52af453247ea'::uuid, id FROM mood_tags WHERE name = 'comfort' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '86b6de9e-c6e5-4172-8eb7-52af453247ea'::uuid, id FROM dietary_tags WHERE name = 'vegetarian' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '86b6de9e-c6e5-4172-8eb7-52af453247ea'::uuid, id FROM dietary_tags WHERE name = 'vegan' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '86b6de9e-c6e5-4172-8eb7-52af453247ea'::uuid, id FROM dietary_tags WHERE name = 'gluten_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '86b6de9e-c6e5-4172-8eb7-52af453247ea'::uuid, id FROM dietary_tags WHERE name = 'dairy_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '86b6de9e-c6e5-4172-8eb7-52af453247ea'::uuid, id FROM dietary_tags WHERE name = 'nut_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_items
(id, name, description, course_id, cuisine_region_id, spice_level,
 retail_price_inr, retail_price_usd, is_signature, image_url)
VALUES
(
    'f9ea5e03-c000-488b-b84a-7f3d533bb314'::uuid,
    'Ma Chana Dal',
    'Whole black urad with split chickpea lentils, slow-cooked.',
    (SELECT id FROM courses WHERE name = 'main'),
    (SELECT id FROM cuisine_regions WHERE name = 'north_indian'),
    2,
    229,
    NULL,
    FALSE,
    '/images/menu/ma-chana-dal.jpg'
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    course_id = EXCLUDED.course_id,
    cuisine_region_id = EXCLUDED.cuisine_region_id,
    spice_level = EXCLUDED.spice_level,
    retail_price_inr = EXCLUDED.retail_price_inr,
    retail_price_usd = EXCLUDED.retail_price_usd,
    is_signature = EXCLUDED.is_signature,
    image_url = EXCLUDED.image_url;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT 'f9ea5e03-c000-488b-b84a-7f3d533bb314'::uuid, id FROM mood_tags WHERE name = 'hearty' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'f9ea5e03-c000-488b-b84a-7f3d533bb314'::uuid, id FROM dietary_tags WHERE name = 'vegetarian' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'f9ea5e03-c000-488b-b84a-7f3d533bb314'::uuid, id FROM dietary_tags WHERE name = 'vegan' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'f9ea5e03-c000-488b-b84a-7f3d533bb314'::uuid, id FROM dietary_tags WHERE name = 'gluten_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'f9ea5e03-c000-488b-b84a-7f3d533bb314'::uuid, id FROM dietary_tags WHERE name = 'dairy_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'f9ea5e03-c000-488b-b84a-7f3d533bb314'::uuid, id FROM dietary_tags WHERE name = 'nut_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_items
(id, name, description, course_id, cuisine_region_id, spice_level,
 retail_price_inr, retail_price_usd, is_signature, image_url)
VALUES
(
    'c2cab058-b14f-4f44-a20e-d99a325dc5ee'::uuid,
    'Dal Pachranga',
    'Five-lentil medley simmered with whole spices.',
    (SELECT id FROM courses WHERE name = 'main'),
    (SELECT id FROM cuisine_regions WHERE name = 'north_indian'),
    2,
    239,
    NULL,
    FALSE,
    NULL
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    course_id = EXCLUDED.course_id,
    cuisine_region_id = EXCLUDED.cuisine_region_id,
    spice_level = EXCLUDED.spice_level,
    retail_price_inr = EXCLUDED.retail_price_inr,
    retail_price_usd = EXCLUDED.retail_price_usd,
    is_signature = EXCLUDED.is_signature,
    image_url = EXCLUDED.image_url;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT 'c2cab058-b14f-4f44-a20e-d99a325dc5ee'::uuid, id FROM mood_tags WHERE name = 'hearty' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'c2cab058-b14f-4f44-a20e-d99a325dc5ee'::uuid, id FROM dietary_tags WHERE name = 'vegetarian' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'c2cab058-b14f-4f44-a20e-d99a325dc5ee'::uuid, id FROM dietary_tags WHERE name = 'vegan' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'c2cab058-b14f-4f44-a20e-d99a325dc5ee'::uuid, id FROM dietary_tags WHERE name = 'gluten_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'c2cab058-b14f-4f44-a20e-d99a325dc5ee'::uuid, id FROM dietary_tags WHERE name = 'dairy_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'c2cab058-b14f-4f44-a20e-d99a325dc5ee'::uuid, id FROM dietary_tags WHERE name = 'nut_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_items
(id, name, description, course_id, cuisine_region_id, spice_level,
 retail_price_inr, retail_price_usd, is_signature, image_url)
VALUES
(
    '553f8b82-8bd7-45e8-9edc-8639e8bd0a11'::uuid,
    'Mango Dal',
    'Toor dal cooked with raw mango for a bright, tangy finish.',
    (SELECT id FROM courses WHERE name = 'main'),
    (SELECT id FROM cuisine_regions WHERE name = 'south_indian'),
    2,
    229,
    NULL,
    FALSE,
    NULL
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    course_id = EXCLUDED.course_id,
    cuisine_region_id = EXCLUDED.cuisine_region_id,
    spice_level = EXCLUDED.spice_level,
    retail_price_inr = EXCLUDED.retail_price_inr,
    retail_price_usd = EXCLUDED.retail_price_usd,
    is_signature = EXCLUDED.is_signature,
    image_url = EXCLUDED.image_url;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '553f8b82-8bd7-45e8-9edc-8639e8bd0a11'::uuid, id FROM mood_tags WHERE name = 'fresh' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '553f8b82-8bd7-45e8-9edc-8639e8bd0a11'::uuid, id FROM mood_tags WHERE name = 'light' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '553f8b82-8bd7-45e8-9edc-8639e8bd0a11'::uuid, id FROM dietary_tags WHERE name = 'vegetarian' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '553f8b82-8bd7-45e8-9edc-8639e8bd0a11'::uuid, id FROM dietary_tags WHERE name = 'vegan' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '553f8b82-8bd7-45e8-9edc-8639e8bd0a11'::uuid, id FROM dietary_tags WHERE name = 'gluten_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '553f8b82-8bd7-45e8-9edc-8639e8bd0a11'::uuid, id FROM dietary_tags WHERE name = 'dairy_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '553f8b82-8bd7-45e8-9edc-8639e8bd0a11'::uuid, id FROM dietary_tags WHERE name = 'nut_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_items
(id, name, description, course_id, cuisine_region_id, spice_level,
 retail_price_inr, retail_price_usd, is_signature, image_url)
VALUES
(
    '13b1b86a-0439-46a1-b01d-8676e4c5e9d9'::uuid,
    'Chana Masala',
    'Chickpeas simmered in a bold onion-tomato chana masala.',
    (SELECT id FROM courses WHERE name = 'main'),
    (SELECT id FROM cuisine_regions WHERE name = 'north_indian'),
    3,
    229,
    NULL,
    FALSE,
    '/images/menu/chana-masala.jpg'
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    course_id = EXCLUDED.course_id,
    cuisine_region_id = EXCLUDED.cuisine_region_id,
    spice_level = EXCLUDED.spice_level,
    retail_price_inr = EXCLUDED.retail_price_inr,
    retail_price_usd = EXCLUDED.retail_price_usd,
    is_signature = EXCLUDED.is_signature,
    image_url = EXCLUDED.image_url;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '13b1b86a-0439-46a1-b01d-8676e4c5e9d9'::uuid, id FROM mood_tags WHERE name = 'hearty' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '13b1b86a-0439-46a1-b01d-8676e4c5e9d9'::uuid, id FROM mood_tags WHERE name = 'bold' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '13b1b86a-0439-46a1-b01d-8676e4c5e9d9'::uuid, id FROM dietary_tags WHERE name = 'vegetarian' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '13b1b86a-0439-46a1-b01d-8676e4c5e9d9'::uuid, id FROM dietary_tags WHERE name = 'vegan' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '13b1b86a-0439-46a1-b01d-8676e4c5e9d9'::uuid, id FROM dietary_tags WHERE name = 'jain' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '13b1b86a-0439-46a1-b01d-8676e4c5e9d9'::uuid, id FROM dietary_tags WHERE name = 'gluten_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '13b1b86a-0439-46a1-b01d-8676e4c5e9d9'::uuid, id FROM dietary_tags WHERE name = 'dairy_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '13b1b86a-0439-46a1-b01d-8676e4c5e9d9'::uuid, id FROM dietary_tags WHERE name = 'nut_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_items
(id, name, description, course_id, cuisine_region_id, spice_level,
 retail_price_inr, retail_price_usd, is_signature, image_url)
VALUES
(
    'baa1bff3-8e82-42c9-9432-a6d70fb9dd21'::uuid,
    'Achari Dal Tadka',
    'Tadka dal finished with pickling spices for a tangy edge.',
    (SELECT id FROM courses WHERE name = 'main'),
    (SELECT id FROM cuisine_regions WHERE name = 'north_indian'),
    3,
    239,
    NULL,
    FALSE,
    NULL
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    course_id = EXCLUDED.course_id,
    cuisine_region_id = EXCLUDED.cuisine_region_id,
    spice_level = EXCLUDED.spice_level,
    retail_price_inr = EXCLUDED.retail_price_inr,
    retail_price_usd = EXCLUDED.retail_price_usd,
    is_signature = EXCLUDED.is_signature,
    image_url = EXCLUDED.image_url;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT 'baa1bff3-8e82-42c9-9432-a6d70fb9dd21'::uuid, id FROM mood_tags WHERE name = 'bold' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'baa1bff3-8e82-42c9-9432-a6d70fb9dd21'::uuid, id FROM dietary_tags WHERE name = 'vegetarian' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'baa1bff3-8e82-42c9-9432-a6d70fb9dd21'::uuid, id FROM dietary_tags WHERE name = 'vegan' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'baa1bff3-8e82-42c9-9432-a6d70fb9dd21'::uuid, id FROM dietary_tags WHERE name = 'gluten_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'baa1bff3-8e82-42c9-9432-a6d70fb9dd21'::uuid, id FROM dietary_tags WHERE name = 'dairy_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'baa1bff3-8e82-42c9-9432-a6d70fb9dd21'::uuid, id FROM dietary_tags WHERE name = 'nut_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_items
(id, name, description, course_id, cuisine_region_id, spice_level,
 retail_price_inr, retail_price_usd, is_signature, image_url)
VALUES
(
    '689fae27-fc2b-48cf-970c-6bc8421a879b'::uuid,
    'Butter Chicken',
    'Tandoor chicken in a rich tomato-butter gravy.',
    (SELECT id FROM courses WHERE name = 'main'),
    (SELECT id FROM cuisine_regions WHERE name = 'north_indian'),
    2,
    369,
    NULL,
    TRUE,
    '/images/menu/butter-chicken.jpg'
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    course_id = EXCLUDED.course_id,
    cuisine_region_id = EXCLUDED.cuisine_region_id,
    spice_level = EXCLUDED.spice_level,
    retail_price_inr = EXCLUDED.retail_price_inr,
    retail_price_usd = EXCLUDED.retail_price_usd,
    is_signature = EXCLUDED.is_signature,
    image_url = EXCLUDED.image_url;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '689fae27-fc2b-48cf-970c-6bc8421a879b'::uuid, id FROM mood_tags WHERE name = 'comfort' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '689fae27-fc2b-48cf-970c-6bc8421a879b'::uuid, id FROM mood_tags WHERE name = 'indulgent' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '689fae27-fc2b-48cf-970c-6bc8421a879b'::uuid, id FROM dietary_tags WHERE name = 'halal' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '689fae27-fc2b-48cf-970c-6bc8421a879b'::uuid, id FROM dietary_tags WHERE name = 'gluten_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '689fae27-fc2b-48cf-970c-6bc8421a879b'::uuid, id FROM dietary_tags WHERE name = 'nut_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) SELECT '689fae27-fc2b-48cf-970c-6bc8421a879b'::uuid, id FROM allergens WHERE name = 'dairy' ON CONFLICT DO NOTHING;
INSERT INTO menu_items
(id, name, description, course_id, cuisine_region_id, spice_level,
 retail_price_inr, retail_price_usd, is_signature, image_url)
VALUES
(
    '1bf54f5c-f79a-4623-858d-f6e8dfe31120'::uuid,
    'Chicken Tikka Masala',
    'Chargrilled chicken in a creamy spiced tomato sauce.',
    (SELECT id FROM courses WHERE name = 'main'),
    (SELECT id FROM cuisine_regions WHERE name = 'north_indian'),
    2,
    379,
    NULL,
    FALSE,
    '/images/menu/chicken-tikka-masala.jpg'
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    course_id = EXCLUDED.course_id,
    cuisine_region_id = EXCLUDED.cuisine_region_id,
    spice_level = EXCLUDED.spice_level,
    retail_price_inr = EXCLUDED.retail_price_inr,
    retail_price_usd = EXCLUDED.retail_price_usd,
    is_signature = EXCLUDED.is_signature,
    image_url = EXCLUDED.image_url;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '1bf54f5c-f79a-4623-858d-f6e8dfe31120'::uuid, id FROM mood_tags WHERE name = 'comfort' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '1bf54f5c-f79a-4623-858d-f6e8dfe31120'::uuid, id FROM mood_tags WHERE name = 'indulgent' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '1bf54f5c-f79a-4623-858d-f6e8dfe31120'::uuid, id FROM dietary_tags WHERE name = 'halal' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '1bf54f5c-f79a-4623-858d-f6e8dfe31120'::uuid, id FROM dietary_tags WHERE name = 'gluten_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '1bf54f5c-f79a-4623-858d-f6e8dfe31120'::uuid, id FROM dietary_tags WHERE name = 'nut_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) SELECT '1bf54f5c-f79a-4623-858d-f6e8dfe31120'::uuid, id FROM allergens WHERE name = 'dairy' ON CONFLICT DO NOTHING;
INSERT INTO menu_items
(id, name, description, course_id, cuisine_region_id, spice_level,
 retail_price_inr, retail_price_usd, is_signature, image_url)
VALUES
(
    'd0fc9222-0a4f-4871-a142-6107bac8c624'::uuid,
    'Bhuna Chicken',
    'Chicken slow-cooked with reduced onion-tomato masala until rich.',
    (SELECT id FROM courses WHERE name = 'main'),
    (SELECT id FROM cuisine_regions WHERE name = 'north_indian'),
    3,
    359,
    NULL,
    FALSE,
    '/images/menu/bhuna-chicken.jpg'
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    course_id = EXCLUDED.course_id,
    cuisine_region_id = EXCLUDED.cuisine_region_id,
    spice_level = EXCLUDED.spice_level,
    retail_price_inr = EXCLUDED.retail_price_inr,
    retail_price_usd = EXCLUDED.retail_price_usd,
    is_signature = EXCLUDED.is_signature,
    image_url = EXCLUDED.image_url;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT 'd0fc9222-0a4f-4871-a142-6107bac8c624'::uuid, id FROM mood_tags WHERE name = 'bold' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT 'd0fc9222-0a4f-4871-a142-6107bac8c624'::uuid, id FROM mood_tags WHERE name = 'hearty' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'd0fc9222-0a4f-4871-a142-6107bac8c624'::uuid, id FROM dietary_tags WHERE name = 'halal' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'd0fc9222-0a4f-4871-a142-6107bac8c624'::uuid, id FROM dietary_tags WHERE name = 'gluten_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'd0fc9222-0a4f-4871-a142-6107bac8c624'::uuid, id FROM dietary_tags WHERE name = 'dairy_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'd0fc9222-0a4f-4871-a142-6107bac8c624'::uuid, id FROM dietary_tags WHERE name = 'nut_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_items
(id, name, description, course_id, cuisine_region_id, spice_level,
 retail_price_inr, retail_price_usd, is_signature, image_url)
VALUES
(
    '5cbe15d2-1a4c-4cc7-87aa-61ba88d6a282'::uuid,
    'Dumpukht Chicken',
    'Sealed-pot chicken cooked dum-style with whole spices.',
    (SELECT id FROM courses WHERE name = 'main'),
    (SELECT id FROM cuisine_regions WHERE name = 'mughlai'),
    2,
    399,
    NULL,
    FALSE,
    NULL
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    course_id = EXCLUDED.course_id,
    cuisine_region_id = EXCLUDED.cuisine_region_id,
    spice_level = EXCLUDED.spice_level,
    retail_price_inr = EXCLUDED.retail_price_inr,
    retail_price_usd = EXCLUDED.retail_price_usd,
    is_signature = EXCLUDED.is_signature,
    image_url = EXCLUDED.image_url;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '5cbe15d2-1a4c-4cc7-87aa-61ba88d6a282'::uuid, id FROM mood_tags WHERE name = 'festive' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '5cbe15d2-1a4c-4cc7-87aa-61ba88d6a282'::uuid, id FROM mood_tags WHERE name = 'indulgent' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '5cbe15d2-1a4c-4cc7-87aa-61ba88d6a282'::uuid, id FROM dietary_tags WHERE name = 'halal' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '5cbe15d2-1a4c-4cc7-87aa-61ba88d6a282'::uuid, id FROM dietary_tags WHERE name = 'gluten_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '5cbe15d2-1a4c-4cc7-87aa-61ba88d6a282'::uuid, id FROM dietary_tags WHERE name = 'nut_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) SELECT '5cbe15d2-1a4c-4cc7-87aa-61ba88d6a282'::uuid, id FROM allergens WHERE name = 'dairy' ON CONFLICT DO NOTHING;
INSERT INTO menu_items
(id, name, description, course_id, cuisine_region_id, spice_level,
 retail_price_inr, retail_price_usd, is_signature, image_url)
VALUES
(
    '65f2a658-5b46-4ea1-8643-faa969b72c01'::uuid,
    'Murg Kali Mirch',
    'Black-pepper chicken in a cream-touched gravy.',
    (SELECT id FROM courses WHERE name = 'main'),
    (SELECT id FROM cuisine_regions WHERE name = 'north_indian'),
    3,
    369,
    NULL,
    FALSE,
    NULL
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    course_id = EXCLUDED.course_id,
    cuisine_region_id = EXCLUDED.cuisine_region_id,
    spice_level = EXCLUDED.spice_level,
    retail_price_inr = EXCLUDED.retail_price_inr,
    retail_price_usd = EXCLUDED.retail_price_usd,
    is_signature = EXCLUDED.is_signature,
    image_url = EXCLUDED.image_url;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '65f2a658-5b46-4ea1-8643-faa969b72c01'::uuid, id FROM mood_tags WHERE name = 'bold' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '65f2a658-5b46-4ea1-8643-faa969b72c01'::uuid, id FROM dietary_tags WHERE name = 'halal' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '65f2a658-5b46-4ea1-8643-faa969b72c01'::uuid, id FROM dietary_tags WHERE name = 'gluten_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '65f2a658-5b46-4ea1-8643-faa969b72c01'::uuid, id FROM dietary_tags WHERE name = 'nut_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) SELECT '65f2a658-5b46-4ea1-8643-faa969b72c01'::uuid, id FROM allergens WHERE name = 'dairy' ON CONFLICT DO NOTHING;
INSERT INTO menu_items
(id, name, description, course_id, cuisine_region_id, spice_level,
 retail_price_inr, retail_price_usd, is_signature, image_url)
VALUES
(
    '648cad36-ab80-4d07-a292-b473410d7582'::uuid,
    'Murg Dhania Matki',
    'Coriander-forward chicken curry with sprouted matki beans.',
    (SELECT id FROM courses WHERE name = 'main'),
    (SELECT id FROM cuisine_regions WHERE name = 'north_indian'),
    3,
    359,
    NULL,
    FALSE,
    NULL
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    course_id = EXCLUDED.course_id,
    cuisine_region_id = EXCLUDED.cuisine_region_id,
    spice_level = EXCLUDED.spice_level,
    retail_price_inr = EXCLUDED.retail_price_inr,
    retail_price_usd = EXCLUDED.retail_price_usd,
    is_signature = EXCLUDED.is_signature,
    image_url = EXCLUDED.image_url;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '648cad36-ab80-4d07-a292-b473410d7582'::uuid, id FROM mood_tags WHERE name = 'fresh' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '648cad36-ab80-4d07-a292-b473410d7582'::uuid, id FROM mood_tags WHERE name = 'hearty' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '648cad36-ab80-4d07-a292-b473410d7582'::uuid, id FROM dietary_tags WHERE name = 'halal' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '648cad36-ab80-4d07-a292-b473410d7582'::uuid, id FROM dietary_tags WHERE name = 'gluten_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '648cad36-ab80-4d07-a292-b473410d7582'::uuid, id FROM dietary_tags WHERE name = 'dairy_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '648cad36-ab80-4d07-a292-b473410d7582'::uuid, id FROM dietary_tags WHERE name = 'nut_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_items
(id, name, description, course_id, cuisine_region_id, spice_level,
 retail_price_inr, retail_price_usd, is_signature, image_url)
VALUES
(
    '2d81f7ce-e105-4c24-8e12-2ea3ef776f0b'::uuid,
    'Lamb Rogan Josh',
    'Kashmiri lamb braised in a deeply spiced aromatic sauce.',
    (SELECT id FROM courses WHERE name = 'main'),
    (SELECT id FROM cuisine_regions WHERE name = 'mughlai'),
    3,
    449,
    NULL,
    TRUE,
    '/images/menu/lamb-rogan-josh.jpg'
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    course_id = EXCLUDED.course_id,
    cuisine_region_id = EXCLUDED.cuisine_region_id,
    spice_level = EXCLUDED.spice_level,
    retail_price_inr = EXCLUDED.retail_price_inr,
    retail_price_usd = EXCLUDED.retail_price_usd,
    is_signature = EXCLUDED.is_signature,
    image_url = EXCLUDED.image_url;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '2d81f7ce-e105-4c24-8e12-2ea3ef776f0b'::uuid, id FROM mood_tags WHERE name = 'bold' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '2d81f7ce-e105-4c24-8e12-2ea3ef776f0b'::uuid, id FROM mood_tags WHERE name = 'indulgent' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '2d81f7ce-e105-4c24-8e12-2ea3ef776f0b'::uuid, id FROM dietary_tags WHERE name = 'halal' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '2d81f7ce-e105-4c24-8e12-2ea3ef776f0b'::uuid, id FROM dietary_tags WHERE name = 'gluten_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '2d81f7ce-e105-4c24-8e12-2ea3ef776f0b'::uuid, id FROM dietary_tags WHERE name = 'dairy_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '2d81f7ce-e105-4c24-8e12-2ea3ef776f0b'::uuid, id FROM dietary_tags WHERE name = 'nut_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_items
(id, name, description, course_id, cuisine_region_id, spice_level,
 retail_price_inr, retail_price_usd, is_signature, image_url)
VALUES
(
    '88fa12fa-6f2f-46cc-9057-de9d93036262'::uuid,
    'Lamb Kali Mirch',
    'Lamb in a peppery cream sauce.',
    (SELECT id FROM courses WHERE name = 'main'),
    (SELECT id FROM cuisine_regions WHERE name = 'mughlai'),
    3,
    459,
    NULL,
    FALSE,
    NULL
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    course_id = EXCLUDED.course_id,
    cuisine_region_id = EXCLUDED.cuisine_region_id,
    spice_level = EXCLUDED.spice_level,
    retail_price_inr = EXCLUDED.retail_price_inr,
    retail_price_usd = EXCLUDED.retail_price_usd,
    is_signature = EXCLUDED.is_signature,
    image_url = EXCLUDED.image_url;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '88fa12fa-6f2f-46cc-9057-de9d93036262'::uuid, id FROM mood_tags WHERE name = 'bold' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '88fa12fa-6f2f-46cc-9057-de9d93036262'::uuid, id FROM mood_tags WHERE name = 'indulgent' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '88fa12fa-6f2f-46cc-9057-de9d93036262'::uuid, id FROM dietary_tags WHERE name = 'halal' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '88fa12fa-6f2f-46cc-9057-de9d93036262'::uuid, id FROM dietary_tags WHERE name = 'gluten_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '88fa12fa-6f2f-46cc-9057-de9d93036262'::uuid, id FROM dietary_tags WHERE name = 'nut_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) SELECT '88fa12fa-6f2f-46cc-9057-de9d93036262'::uuid, id FROM allergens WHERE name = 'dairy' ON CONFLICT DO NOTHING;
INSERT INTO menu_items
(id, name, description, course_id, cuisine_region_id, spice_level,
 retail_price_inr, retail_price_usd, is_signature, image_url)
VALUES
(
    '7dc0c627-02ab-4a9b-a214-7756bb0ede55'::uuid,
    'Lamb Laal Maas',
    'Rajasthani fiery red lamb curry with mathania chillies.',
    (SELECT id FROM courses WHERE name = 'main'),
    (SELECT id FROM cuisine_regions WHERE name = 'north_indian'),
    5,
    469,
    NULL,
    FALSE,
    NULL
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    course_id = EXCLUDED.course_id,
    cuisine_region_id = EXCLUDED.cuisine_region_id,
    spice_level = EXCLUDED.spice_level,
    retail_price_inr = EXCLUDED.retail_price_inr,
    retail_price_usd = EXCLUDED.retail_price_usd,
    is_signature = EXCLUDED.is_signature,
    image_url = EXCLUDED.image_url;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '7dc0c627-02ab-4a9b-a214-7756bb0ede55'::uuid, id FROM mood_tags WHERE name = 'bold' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '7dc0c627-02ab-4a9b-a214-7756bb0ede55'::uuid, id FROM mood_tags WHERE name = 'hearty' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '7dc0c627-02ab-4a9b-a214-7756bb0ede55'::uuid, id FROM dietary_tags WHERE name = 'halal' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '7dc0c627-02ab-4a9b-a214-7756bb0ede55'::uuid, id FROM dietary_tags WHERE name = 'gluten_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '7dc0c627-02ab-4a9b-a214-7756bb0ede55'::uuid, id FROM dietary_tags WHERE name = 'dairy_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '7dc0c627-02ab-4a9b-a214-7756bb0ede55'::uuid, id FROM dietary_tags WHERE name = 'nut_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_items
(id, name, description, course_id, cuisine_region_id, spice_level,
 retail_price_inr, retail_price_usd, is_signature, image_url)
VALUES
(
    '90a1cf72-ea53-47ac-82d8-d7dfe6e764a4'::uuid,
    'Keema Matar',
    'Minced lamb cooked with green peas and warming spices.',
    (SELECT id FROM courses WHERE name = 'main'),
    (SELECT id FROM cuisine_regions WHERE name = 'north_indian'),
    3,
    399,
    NULL,
    FALSE,
    '/images/menu/keema-matar.jpg'
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    course_id = EXCLUDED.course_id,
    cuisine_region_id = EXCLUDED.cuisine_region_id,
    spice_level = EXCLUDED.spice_level,
    retail_price_inr = EXCLUDED.retail_price_inr,
    retail_price_usd = EXCLUDED.retail_price_usd,
    is_signature = EXCLUDED.is_signature,
    image_url = EXCLUDED.image_url;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '90a1cf72-ea53-47ac-82d8-d7dfe6e764a4'::uuid, id FROM mood_tags WHERE name = 'hearty' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '90a1cf72-ea53-47ac-82d8-d7dfe6e764a4'::uuid, id FROM mood_tags WHERE name = 'comfort' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '90a1cf72-ea53-47ac-82d8-d7dfe6e764a4'::uuid, id FROM dietary_tags WHERE name = 'halal' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '90a1cf72-ea53-47ac-82d8-d7dfe6e764a4'::uuid, id FROM dietary_tags WHERE name = 'gluten_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '90a1cf72-ea53-47ac-82d8-d7dfe6e764a4'::uuid, id FROM dietary_tags WHERE name = 'dairy_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '90a1cf72-ea53-47ac-82d8-d7dfe6e764a4'::uuid, id FROM dietary_tags WHERE name = 'nut_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_items
(id, name, description, course_id, cuisine_region_id, spice_level,
 retail_price_inr, retail_price_usd, is_signature, image_url)
VALUES
(
    '3778fb0d-1b55-4981-8abb-799b9c285e50'::uuid,
    'Goat Curry',
    'Bone-in goat slow-braised in a robust onion-tomato gravy.',
    (SELECT id FROM courses WHERE name = 'main'),
    (SELECT id FROM cuisine_regions WHERE name = 'north_indian'),
    3,
    449,
    NULL,
    FALSE,
    '/images/menu/goat-curry.jpg'
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    course_id = EXCLUDED.course_id,
    cuisine_region_id = EXCLUDED.cuisine_region_id,
    spice_level = EXCLUDED.spice_level,
    retail_price_inr = EXCLUDED.retail_price_inr,
    retail_price_usd = EXCLUDED.retail_price_usd,
    is_signature = EXCLUDED.is_signature,
    image_url = EXCLUDED.image_url;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '3778fb0d-1b55-4981-8abb-799b9c285e50'::uuid, id FROM mood_tags WHERE name = 'hearty' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '3778fb0d-1b55-4981-8abb-799b9c285e50'::uuid, id FROM mood_tags WHERE name = 'bold' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '3778fb0d-1b55-4981-8abb-799b9c285e50'::uuid, id FROM dietary_tags WHERE name = 'halal' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '3778fb0d-1b55-4981-8abb-799b9c285e50'::uuid, id FROM dietary_tags WHERE name = 'gluten_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '3778fb0d-1b55-4981-8abb-799b9c285e50'::uuid, id FROM dietary_tags WHERE name = 'dairy_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '3778fb0d-1b55-4981-8abb-799b9c285e50'::uuid, id FROM dietary_tags WHERE name = 'nut_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_items
(id, name, description, course_id, cuisine_region_id, spice_level,
 retail_price_inr, retail_price_usd, is_signature, image_url)
VALUES
(
    '0c19334e-e37e-4a42-b732-a7531895f0db'::uuid,
    'Mutton Chop Lababdar',
    'Mutton chops in a creamy tomato-onion lababdar gravy.',
    (SELECT id FROM courses WHERE name = 'main'),
    (SELECT id FROM cuisine_regions WHERE name = 'mughlai'),
    3,
    499,
    NULL,
    FALSE,
    NULL
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    course_id = EXCLUDED.course_id,
    cuisine_region_id = EXCLUDED.cuisine_region_id,
    spice_level = EXCLUDED.spice_level,
    retail_price_inr = EXCLUDED.retail_price_inr,
    retail_price_usd = EXCLUDED.retail_price_usd,
    is_signature = EXCLUDED.is_signature,
    image_url = EXCLUDED.image_url;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '0c19334e-e37e-4a42-b732-a7531895f0db'::uuid, id FROM mood_tags WHERE name = 'indulgent' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '0c19334e-e37e-4a42-b732-a7531895f0db'::uuid, id FROM mood_tags WHERE name = 'bold' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '0c19334e-e37e-4a42-b732-a7531895f0db'::uuid, id FROM dietary_tags WHERE name = 'halal' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '0c19334e-e37e-4a42-b732-a7531895f0db'::uuid, id FROM dietary_tags WHERE name = 'gluten_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '0c19334e-e37e-4a42-b732-a7531895f0db'::uuid, id FROM dietary_tags WHERE name = 'nut_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) SELECT '0c19334e-e37e-4a42-b732-a7531895f0db'::uuid, id FROM allergens WHERE name = 'dairy' ON CONFLICT DO NOTHING;
INSERT INTO menu_items
(id, name, description, course_id, cuisine_region_id, spice_level,
 retail_price_inr, retail_price_usd, is_signature, image_url)
VALUES
(
    '7472ed5d-2005-4822-9cdd-ea02245c4f7d'::uuid,
    'Bhuna Shrimp',
    'Shrimp tossed in a reduced onion-tomato bhuna masala.',
    (SELECT id FROM courses WHERE name = 'main'),
    (SELECT id FROM cuisine_regions WHERE name = 'north_indian'),
    3,
    399,
    NULL,
    FALSE,
    NULL
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    course_id = EXCLUDED.course_id,
    cuisine_region_id = EXCLUDED.cuisine_region_id,
    spice_level = EXCLUDED.spice_level,
    retail_price_inr = EXCLUDED.retail_price_inr,
    retail_price_usd = EXCLUDED.retail_price_usd,
    is_signature = EXCLUDED.is_signature,
    image_url = EXCLUDED.image_url;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '7472ed5d-2005-4822-9cdd-ea02245c4f7d'::uuid, id FROM mood_tags WHERE name = 'bold' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '7472ed5d-2005-4822-9cdd-ea02245c4f7d'::uuid, id FROM dietary_tags WHERE name = 'halal' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '7472ed5d-2005-4822-9cdd-ea02245c4f7d'::uuid, id FROM dietary_tags WHERE name = 'gluten_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '7472ed5d-2005-4822-9cdd-ea02245c4f7d'::uuid, id FROM dietary_tags WHERE name = 'dairy_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '7472ed5d-2005-4822-9cdd-ea02245c4f7d'::uuid, id FROM dietary_tags WHERE name = 'nut_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) SELECT '7472ed5d-2005-4822-9cdd-ea02245c4f7d'::uuid, id FROM allergens WHERE name = 'shellfish' ON CONFLICT DO NOTHING;
INSERT INTO menu_items
(id, name, description, course_id, cuisine_region_id, spice_level,
 retail_price_inr, retail_price_usd, is_signature, image_url)
VALUES
(
    '8525763f-a041-470f-ac11-a2487967251e'::uuid,
    'Goan Shrimp Curry',
    'Coconut-based Goan curry with shrimp and kokum.',
    (SELECT id FROM courses WHERE name = 'main'),
    (SELECT id FROM cuisine_regions WHERE name = 'south_indian'),
    3,
    429,
    NULL,
    FALSE,
    '/images/menu/goan-shrimp-curry.jpg'
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    course_id = EXCLUDED.course_id,
    cuisine_region_id = EXCLUDED.cuisine_region_id,
    spice_level = EXCLUDED.spice_level,
    retail_price_inr = EXCLUDED.retail_price_inr,
    retail_price_usd = EXCLUDED.retail_price_usd,
    is_signature = EXCLUDED.is_signature,
    image_url = EXCLUDED.image_url;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '8525763f-a041-470f-ac11-a2487967251e'::uuid, id FROM mood_tags WHERE name = 'bold' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '8525763f-a041-470f-ac11-a2487967251e'::uuid, id FROM mood_tags WHERE name = 'fresh' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '8525763f-a041-470f-ac11-a2487967251e'::uuid, id FROM dietary_tags WHERE name = 'halal' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '8525763f-a041-470f-ac11-a2487967251e'::uuid, id FROM dietary_tags WHERE name = 'gluten_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '8525763f-a041-470f-ac11-a2487967251e'::uuid, id FROM dietary_tags WHERE name = 'dairy_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '8525763f-a041-470f-ac11-a2487967251e'::uuid, id FROM dietary_tags WHERE name = 'nut_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) SELECT '8525763f-a041-470f-ac11-a2487967251e'::uuid, id FROM allergens WHERE name = 'shellfish' ON CONFLICT DO NOTHING;
INSERT INTO menu_items
(id, name, description, course_id, cuisine_region_id, spice_level,
 retail_price_inr, retail_price_usd, is_signature, image_url)
VALUES
(
    'c9200891-1567-4304-95d7-3a2814080351'::uuid,
    'Fish Tikka Masala',
    'Chargrilled fish in a creamy tomato masala.',
    (SELECT id FROM courses WHERE name = 'main'),
    (SELECT id FROM cuisine_regions WHERE name = 'north_indian'),
    2,
    399,
    NULL,
    FALSE,
    NULL
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    course_id = EXCLUDED.course_id,
    cuisine_region_id = EXCLUDED.cuisine_region_id,
    spice_level = EXCLUDED.spice_level,
    retail_price_inr = EXCLUDED.retail_price_inr,
    retail_price_usd = EXCLUDED.retail_price_usd,
    is_signature = EXCLUDED.is_signature,
    image_url = EXCLUDED.image_url;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT 'c9200891-1567-4304-95d7-3a2814080351'::uuid, id FROM mood_tags WHERE name = 'indulgent' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'c9200891-1567-4304-95d7-3a2814080351'::uuid, id FROM dietary_tags WHERE name = 'halal' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'c9200891-1567-4304-95d7-3a2814080351'::uuid, id FROM dietary_tags WHERE name = 'gluten_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'c9200891-1567-4304-95d7-3a2814080351'::uuid, id FROM dietary_tags WHERE name = 'nut_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) SELECT 'c9200891-1567-4304-95d7-3a2814080351'::uuid, id FROM allergens WHERE name = 'fish' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) SELECT 'c9200891-1567-4304-95d7-3a2814080351'::uuid, id FROM allergens WHERE name = 'dairy' ON CONFLICT DO NOTHING;
INSERT INTO menu_items
(id, name, description, course_id, cuisine_region_id, spice_level,
 retail_price_inr, retail_price_usd, is_signature, image_url)
VALUES
(
    '814fff04-a193-45bc-8bfc-21ef7f90c39f'::uuid,
    'Fish Curry',
    'Classic fish curry simmered in spiced gravy.',
    (SELECT id FROM courses WHERE name = 'main'),
    (SELECT id FROM cuisine_regions WHERE name = 'south_indian'),
    3,
    369,
    NULL,
    FALSE,
    '/images/menu/fish-curry.jpg'
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    course_id = EXCLUDED.course_id,
    cuisine_region_id = EXCLUDED.cuisine_region_id,
    spice_level = EXCLUDED.spice_level,
    retail_price_inr = EXCLUDED.retail_price_inr,
    retail_price_usd = EXCLUDED.retail_price_usd,
    is_signature = EXCLUDED.is_signature,
    image_url = EXCLUDED.image_url;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '814fff04-a193-45bc-8bfc-21ef7f90c39f'::uuid, id FROM mood_tags WHERE name = 'bold' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '814fff04-a193-45bc-8bfc-21ef7f90c39f'::uuid, id FROM mood_tags WHERE name = 'hearty' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '814fff04-a193-45bc-8bfc-21ef7f90c39f'::uuid, id FROM dietary_tags WHERE name = 'halal' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '814fff04-a193-45bc-8bfc-21ef7f90c39f'::uuid, id FROM dietary_tags WHERE name = 'gluten_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '814fff04-a193-45bc-8bfc-21ef7f90c39f'::uuid, id FROM dietary_tags WHERE name = 'dairy_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '814fff04-a193-45bc-8bfc-21ef7f90c39f'::uuid, id FROM dietary_tags WHERE name = 'nut_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) SELECT '814fff04-a193-45bc-8bfc-21ef7f90c39f'::uuid, id FROM allergens WHERE name = 'fish' ON CONFLICT DO NOTHING;
INSERT INTO menu_items
(id, name, description, course_id, cuisine_region_id, spice_level,
 retail_price_inr, retail_price_usd, is_signature, image_url)
VALUES
(
    'dc8febc9-8b8e-4f5b-872a-dc696f6658e6'::uuid,
    'Chettinad Chicken',
    'Chicken in a fiery, pepper-forward Chettinad masala.',
    (SELECT id FROM courses WHERE name = 'main'),
    (SELECT id FROM cuisine_regions WHERE name = 'south_indian'),
    4,
    369,
    NULL,
    FALSE,
    '/images/menu/chettinad-chicken.jpg'
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    course_id = EXCLUDED.course_id,
    cuisine_region_id = EXCLUDED.cuisine_region_id,
    spice_level = EXCLUDED.spice_level,
    retail_price_inr = EXCLUDED.retail_price_inr,
    retail_price_usd = EXCLUDED.retail_price_usd,
    is_signature = EXCLUDED.is_signature,
    image_url = EXCLUDED.image_url;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT 'dc8febc9-8b8e-4f5b-872a-dc696f6658e6'::uuid, id FROM mood_tags WHERE name = 'bold' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'dc8febc9-8b8e-4f5b-872a-dc696f6658e6'::uuid, id FROM dietary_tags WHERE name = 'halal' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'dc8febc9-8b8e-4f5b-872a-dc696f6658e6'::uuid, id FROM dietary_tags WHERE name = 'gluten_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'dc8febc9-8b8e-4f5b-872a-dc696f6658e6'::uuid, id FROM dietary_tags WHERE name = 'dairy_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'dc8febc9-8b8e-4f5b-872a-dc696f6658e6'::uuid, id FROM dietary_tags WHERE name = 'nut_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_items
(id, name, description, course_id, cuisine_region_id, spice_level,
 retail_price_inr, retail_price_usd, is_signature, image_url)
VALUES
(
    '1cf767ec-fc1d-4694-8cfc-211020db6c32'::uuid,
    'Chicken Ghee Roast',
    'Chicken roasted in ghee and a Mangalorean chilli paste.',
    (SELECT id FROM courses WHERE name = 'main'),
    (SELECT id FROM cuisine_regions WHERE name = 'south_indian'),
    4,
    379,
    NULL,
    FALSE,
    '/images/menu/chicken-ghee-roast.jpg'
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    course_id = EXCLUDED.course_id,
    cuisine_region_id = EXCLUDED.cuisine_region_id,
    spice_level = EXCLUDED.spice_level,
    retail_price_inr = EXCLUDED.retail_price_inr,
    retail_price_usd = EXCLUDED.retail_price_usd,
    is_signature = EXCLUDED.is_signature,
    image_url = EXCLUDED.image_url;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '1cf767ec-fc1d-4694-8cfc-211020db6c32'::uuid, id FROM mood_tags WHERE name = 'bold' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '1cf767ec-fc1d-4694-8cfc-211020db6c32'::uuid, id FROM mood_tags WHERE name = 'indulgent' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '1cf767ec-fc1d-4694-8cfc-211020db6c32'::uuid, id FROM dietary_tags WHERE name = 'halal' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '1cf767ec-fc1d-4694-8cfc-211020db6c32'::uuid, id FROM dietary_tags WHERE name = 'gluten_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '1cf767ec-fc1d-4694-8cfc-211020db6c32'::uuid, id FROM dietary_tags WHERE name = 'nut_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) SELECT '1cf767ec-fc1d-4694-8cfc-211020db6c32'::uuid, id FROM allergens WHERE name = 'dairy' ON CONFLICT DO NOTHING;
INSERT INTO menu_items
(id, name, description, course_id, cuisine_region_id, spice_level,
 retail_price_inr, retail_price_usd, is_signature, image_url)
VALUES
(
    '972e4277-3725-4d65-af47-817ce3b682af'::uuid,
    'Bang Bang Chicken',
    'Crispy chicken tossed in a creamy bang-bang chilli sauce.',
    (SELECT id FROM courses WHERE name = 'main'),
    (SELECT id FROM cuisine_regions WHERE name = 'indo_chinese'),
    3,
    349,
    NULL,
    FALSE,
    '/images/menu/bang-bang-chicken.jpg'
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    course_id = EXCLUDED.course_id,
    cuisine_region_id = EXCLUDED.cuisine_region_id,
    spice_level = EXCLUDED.spice_level,
    retail_price_inr = EXCLUDED.retail_price_inr,
    retail_price_usd = EXCLUDED.retail_price_usd,
    is_signature = EXCLUDED.is_signature,
    image_url = EXCLUDED.image_url;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '972e4277-3725-4d65-af47-817ce3b682af'::uuid, id FROM mood_tags WHERE name = 'bold' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '972e4277-3725-4d65-af47-817ce3b682af'::uuid, id FROM dietary_tags WHERE name = 'halal' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '972e4277-3725-4d65-af47-817ce3b682af'::uuid, id FROM dietary_tags WHERE name = 'nut_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) SELECT '972e4277-3725-4d65-af47-817ce3b682af'::uuid, id FROM allergens WHERE name = 'dairy' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) SELECT '972e4277-3725-4d65-af47-817ce3b682af'::uuid, id FROM allergens WHERE name = 'gluten' ON CONFLICT DO NOTHING;
INSERT INTO menu_items
(id, name, description, course_id, cuisine_region_id, spice_level,
 retail_price_inr, retail_price_usd, is_signature, image_url)
VALUES
(
    '39aa44fd-286c-405a-91e0-e640fd27d99a'::uuid,
    'Andhra Lunch â Option 1',
    'Rava Kesari (with jeedipappu/saffron)
Bobbatlu
Ulli Gare
Poori
Aalo Curry with jeedipappu
Dondakaaya Masala/Kurm (gravy)
Beans Coconut Poriyal with badam
Dosakaya Pappu
Coconut Rice
Curd Rice
Aavakaaya
Tomato Pacchadi (fresh)
Papad/Vadiyaalu',
    (SELECT id FROM courses WHERE name = 'main'),
    (SELECT id FROM cuisine_regions WHERE name = 'south_indian'),
    2,
    299,
    NULL,
    FALSE,
    NULL
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    course_id = EXCLUDED.course_id,
    cuisine_region_id = EXCLUDED.cuisine_region_id,
    spice_level = EXCLUDED.spice_level,
    retail_price_inr = EXCLUDED.retail_price_inr,
    retail_price_usd = EXCLUDED.retail_price_usd,
    is_signature = EXCLUDED.is_signature,
    image_url = EXCLUDED.image_url;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '39aa44fd-286c-405a-91e0-e640fd27d99a'::uuid, id FROM mood_tags WHERE name = 'comfort' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '39aa44fd-286c-405a-91e0-e640fd27d99a'::uuid, id FROM mood_tags WHERE name = 'festive' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '39aa44fd-286c-405a-91e0-e640fd27d99a'::uuid, id FROM dietary_tags WHERE name = 'vegetarian' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '39aa44fd-286c-405a-91e0-e640fd27d99a'::uuid, id FROM dietary_tags WHERE name = 'nut_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) SELECT '39aa44fd-286c-405a-91e0-e640fd27d99a'::uuid, id FROM allergens WHERE name = 'dairy' ON CONFLICT DO NOTHING;
INSERT INTO menu_items
(id, name, description, course_id, cuisine_region_id, spice_level,
 retail_price_inr, retail_price_usd, is_signature, image_url)
VALUES
(
    '6b7e7828-00df-4d57-9dc0-d27adaa14e67'::uuid,
    'Andhra Lunch â Option 2',
    'Poornaalu
Aratikaya Bajji
Mushroom Masala
Vankaya with kobbari & jeedipappu
Bhindi Fry with peanuts & badam flakes
Mirchi Ka Salan
Pulihora
Roti
Mango Dal
Rasam
Dosa Aavakaaya
Gongoora Pachhadi
Papad
Majjiga
Bobathlu',
    (SELECT id FROM courses WHERE name = 'main'),
    (SELECT id FROM cuisine_regions WHERE name = 'south_indian'),
    3,
    329,
    NULL,
    FALSE,
    NULL
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    course_id = EXCLUDED.course_id,
    cuisine_region_id = EXCLUDED.cuisine_region_id,
    spice_level = EXCLUDED.spice_level,
    retail_price_inr = EXCLUDED.retail_price_inr,
    retail_price_usd = EXCLUDED.retail_price_usd,
    is_signature = EXCLUDED.is_signature,
    image_url = EXCLUDED.image_url;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '6b7e7828-00df-4d57-9dc0-d27adaa14e67'::uuid, id FROM mood_tags WHERE name = 'comfort' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '6b7e7828-00df-4d57-9dc0-d27adaa14e67'::uuid, id FROM mood_tags WHERE name = 'bold' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '6b7e7828-00df-4d57-9dc0-d27adaa14e67'::uuid, id FROM dietary_tags WHERE name = 'vegetarian' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) SELECT '6b7e7828-00df-4d57-9dc0-d27adaa14e67'::uuid, id FROM allergens WHERE name = 'dairy' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) SELECT '6b7e7828-00df-4d57-9dc0-d27adaa14e67'::uuid, id FROM allergens WHERE name = 'nuts' ON CONFLICT DO NOTHING;
INSERT INTO menu_items
(id, name, description, course_id, cuisine_region_id, spice_level,
 retail_price_inr, retail_price_usd, is_signature, image_url)
VALUES
(
    '9a650cf3-3639-441e-9369-ec23bec1b699'::uuid,
    'Gujarati Menu',
    'Khandvi
Kachori
Dal
Puri
Rice
Kachumber Salad
Papad/Papdi
Val Nu Sak
Karela Kaju Sak
Undhiyu
Fresh Ras
Dryfruit Dudhi Halwa or Shrikhand',
    (SELECT id FROM courses WHERE name = 'main'),
    (SELECT id FROM cuisine_regions WHERE name = 'north_indian'),
    2,
    349,
    NULL,
    FALSE,
    '/images/menu/gujarati-menu.jpg'
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    course_id = EXCLUDED.course_id,
    cuisine_region_id = EXCLUDED.cuisine_region_id,
    spice_level = EXCLUDED.spice_level,
    retail_price_inr = EXCLUDED.retail_price_inr,
    retail_price_usd = EXCLUDED.retail_price_usd,
    is_signature = EXCLUDED.is_signature,
    image_url = EXCLUDED.image_url;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '9a650cf3-3639-441e-9369-ec23bec1b699'::uuid, id FROM mood_tags WHERE name = 'comfort' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '9a650cf3-3639-441e-9369-ec23bec1b699'::uuid, id FROM mood_tags WHERE name = 'festive' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '9a650cf3-3639-441e-9369-ec23bec1b699'::uuid, id FROM dietary_tags WHERE name = 'vegetarian' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) SELECT '9a650cf3-3639-441e-9369-ec23bec1b699'::uuid, id FROM allergens WHERE name = 'dairy' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) SELECT '9a650cf3-3639-441e-9369-ec23bec1b699'::uuid, id FROM allergens WHERE name = 'nuts' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) SELECT '9a650cf3-3639-441e-9369-ec23bec1b699'::uuid, id FROM allergens WHERE name = 'gluten' ON CONFLICT DO NOTHING;
INSERT INTO menu_items
(id, name, description, course_id, cuisine_region_id, spice_level,
 retail_price_inr, retail_price_usd, is_signature, image_url)
VALUES
(
    '093deee3-562b-4f04-bfaa-a28b94ba54e5'::uuid,
    'North Indian Lunch Menu',
    'Kadhi Pakora
Chana Masala
Paneer Bhurji
Black Pepper Aloo
Jeera Rice
Poori
Naan
Achar
Raita
Chai/Coffee
Kheer',
    (SELECT id FROM courses WHERE name = 'main'),
    (SELECT id FROM cuisine_regions WHERE name = 'north_indian'),
    2,
    349,
    NULL,
    FALSE,
    '/images/menu/north-indian-lunch-menu.jpg'
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    course_id = EXCLUDED.course_id,
    cuisine_region_id = EXCLUDED.cuisine_region_id,
    spice_level = EXCLUDED.spice_level,
    retail_price_inr = EXCLUDED.retail_price_inr,
    retail_price_usd = EXCLUDED.retail_price_usd,
    is_signature = EXCLUDED.is_signature,
    image_url = EXCLUDED.image_url;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '093deee3-562b-4f04-bfaa-a28b94ba54e5'::uuid, id FROM mood_tags WHERE name = 'comfort' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '093deee3-562b-4f04-bfaa-a28b94ba54e5'::uuid, id FROM mood_tags WHERE name = 'hearty' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '093deee3-562b-4f04-bfaa-a28b94ba54e5'::uuid, id FROM dietary_tags WHERE name = 'vegetarian' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '093deee3-562b-4f04-bfaa-a28b94ba54e5'::uuid, id FROM dietary_tags WHERE name = 'nut_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) SELECT '093deee3-562b-4f04-bfaa-a28b94ba54e5'::uuid, id FROM allergens WHERE name = 'dairy' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) SELECT '093deee3-562b-4f04-bfaa-a28b94ba54e5'::uuid, id FROM allergens WHERE name = 'gluten' ON CONFLICT DO NOTHING;
INSERT INTO menu_items
(id, name, description, course_id, cuisine_region_id, spice_level,
 retail_price_inr, retail_price_usd, is_signature, image_url)
VALUES
(
    'daa729be-ebe0-4126-b590-adf9768a199f'::uuid,
    'North Indian Breakfast',
    'Mixed Pakora OR Bread Pakora OR Sandwich OR Paratha (with achar & dahi)
Poha or Upma
Milk Cake & Laddoo
Chai',
    (SELECT id FROM courses WHERE name = 'main'),
    (SELECT id FROM cuisine_regions WHERE name = 'north_indian'),
    2,
    249,
    NULL,
    FALSE,
    NULL
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    course_id = EXCLUDED.course_id,
    cuisine_region_id = EXCLUDED.cuisine_region_id,
    spice_level = EXCLUDED.spice_level,
    retail_price_inr = EXCLUDED.retail_price_inr,
    retail_price_usd = EXCLUDED.retail_price_usd,
    is_signature = EXCLUDED.is_signature,
    image_url = EXCLUDED.image_url;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT 'daa729be-ebe0-4126-b590-adf9768a199f'::uuid, id FROM mood_tags WHERE name = 'comfort' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT 'daa729be-ebe0-4126-b590-adf9768a199f'::uuid, id FROM mood_tags WHERE name = 'light' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'daa729be-ebe0-4126-b590-adf9768a199f'::uuid, id FROM dietary_tags WHERE name = 'vegetarian' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'daa729be-ebe0-4126-b590-adf9768a199f'::uuid, id FROM dietary_tags WHERE name = 'nut_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) SELECT 'daa729be-ebe0-4126-b590-adf9768a199f'::uuid, id FROM allergens WHERE name = 'dairy' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) SELECT 'daa729be-ebe0-4126-b590-adf9768a199f'::uuid, id FROM allergens WHERE name = 'gluten' ON CONFLICT DO NOTHING;
INSERT INTO menu_items
(id, name, description, course_id, cuisine_region_id, spice_level,
 retail_price_inr, retail_price_usd, is_signature, image_url)
VALUES
(
    '7ba5b685-3279-4cfe-a3ab-c4db08735ccc'::uuid,
    'Jeera Rice',
    'Basmati rice tempered with cumin seeds.',
    (SELECT id FROM courses WHERE name = 'rice'),
    (SELECT id FROM cuisine_regions WHERE name = 'north_indian'),
    1,
    149,
    NULL,
    FALSE,
    NULL
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    course_id = EXCLUDED.course_id,
    cuisine_region_id = EXCLUDED.cuisine_region_id,
    spice_level = EXCLUDED.spice_level,
    retail_price_inr = EXCLUDED.retail_price_inr,
    retail_price_usd = EXCLUDED.retail_price_usd,
    is_signature = EXCLUDED.is_signature,
    image_url = EXCLUDED.image_url;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '7ba5b685-3279-4cfe-a3ab-c4db08735ccc'::uuid, id FROM mood_tags WHERE name = 'comfort' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '7ba5b685-3279-4cfe-a3ab-c4db08735ccc'::uuid, id FROM mood_tags WHERE name = 'light' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '7ba5b685-3279-4cfe-a3ab-c4db08735ccc'::uuid, id FROM dietary_tags WHERE name = 'vegetarian' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '7ba5b685-3279-4cfe-a3ab-c4db08735ccc'::uuid, id FROM dietary_tags WHERE name = 'vegan' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '7ba5b685-3279-4cfe-a3ab-c4db08735ccc'::uuid, id FROM dietary_tags WHERE name = 'gluten_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '7ba5b685-3279-4cfe-a3ab-c4db08735ccc'::uuid, id FROM dietary_tags WHERE name = 'dairy_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '7ba5b685-3279-4cfe-a3ab-c4db08735ccc'::uuid, id FROM dietary_tags WHERE name = 'nut_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_items
(id, name, description, course_id, cuisine_region_id, spice_level,
 retail_price_inr, retail_price_usd, is_signature, image_url)
VALUES
(
    'b7841bfe-4534-4942-afa0-ee128df536d9'::uuid,
    'Saffron Rice',
    'Basmati rice perfumed with saffron and whole spices.',
    (SELECT id FROM courses WHERE name = 'rice'),
    (SELECT id FROM cuisine_regions WHERE name = 'mughlai'),
    1,
    229,
    NULL,
    FALSE,
    NULL
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    course_id = EXCLUDED.course_id,
    cuisine_region_id = EXCLUDED.cuisine_region_id,
    spice_level = EXCLUDED.spice_level,
    retail_price_inr = EXCLUDED.retail_price_inr,
    retail_price_usd = EXCLUDED.retail_price_usd,
    is_signature = EXCLUDED.is_signature,
    image_url = EXCLUDED.image_url;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT 'b7841bfe-4534-4942-afa0-ee128df536d9'::uuid, id FROM mood_tags WHERE name = 'festive' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'b7841bfe-4534-4942-afa0-ee128df536d9'::uuid, id FROM dietary_tags WHERE name = 'vegetarian' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'b7841bfe-4534-4942-afa0-ee128df536d9'::uuid, id FROM dietary_tags WHERE name = 'vegan' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'b7841bfe-4534-4942-afa0-ee128df536d9'::uuid, id FROM dietary_tags WHERE name = 'gluten_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'b7841bfe-4534-4942-afa0-ee128df536d9'::uuid, id FROM dietary_tags WHERE name = 'dairy_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'b7841bfe-4534-4942-afa0-ee128df536d9'::uuid, id FROM dietary_tags WHERE name = 'nut_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_items
(id, name, description, course_id, cuisine_region_id, spice_level,
 retail_price_inr, retail_price_usd, is_signature, image_url)
VALUES
(
    '94e7216d-2876-467f-ae44-ea1a2896bab5'::uuid,
    'Peas Pulao',
    'Basmati pulao with sweet green peas.',
    (SELECT id FROM courses WHERE name = 'rice'),
    (SELECT id FROM cuisine_regions WHERE name = 'north_indian'),
    1,
    179,
    NULL,
    FALSE,
    NULL
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    course_id = EXCLUDED.course_id,
    cuisine_region_id = EXCLUDED.cuisine_region_id,
    spice_level = EXCLUDED.spice_level,
    retail_price_inr = EXCLUDED.retail_price_inr,
    retail_price_usd = EXCLUDED.retail_price_usd,
    is_signature = EXCLUDED.is_signature,
    image_url = EXCLUDED.image_url;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '94e7216d-2876-467f-ae44-ea1a2896bab5'::uuid, id FROM mood_tags WHERE name = 'comfort' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '94e7216d-2876-467f-ae44-ea1a2896bab5'::uuid, id FROM dietary_tags WHERE name = 'vegetarian' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '94e7216d-2876-467f-ae44-ea1a2896bab5'::uuid, id FROM dietary_tags WHERE name = 'vegan' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '94e7216d-2876-467f-ae44-ea1a2896bab5'::uuid, id FROM dietary_tags WHERE name = 'gluten_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '94e7216d-2876-467f-ae44-ea1a2896bab5'::uuid, id FROM dietary_tags WHERE name = 'dairy_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '94e7216d-2876-467f-ae44-ea1a2896bab5'::uuid, id FROM dietary_tags WHERE name = 'nut_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_items
(id, name, description, course_id, cuisine_region_id, spice_level,
 retail_price_inr, retail_price_usd, is_signature, image_url)
VALUES
(
    'c45f7dca-770e-4253-8f2e-9b086aac2532'::uuid,
    'Chana Pulao',
    'Pulao layered with spiced chickpeas.',
    (SELECT id FROM courses WHERE name = 'rice'),
    (SELECT id FROM cuisine_regions WHERE name = 'north_indian'),
    2,
    189,
    NULL,
    FALSE,
    NULL
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    course_id = EXCLUDED.course_id,
    cuisine_region_id = EXCLUDED.cuisine_region_id,
    spice_level = EXCLUDED.spice_level,
    retail_price_inr = EXCLUDED.retail_price_inr,
    retail_price_usd = EXCLUDED.retail_price_usd,
    is_signature = EXCLUDED.is_signature,
    image_url = EXCLUDED.image_url;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT 'c45f7dca-770e-4253-8f2e-9b086aac2532'::uuid, id FROM mood_tags WHERE name = 'hearty' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'c45f7dca-770e-4253-8f2e-9b086aac2532'::uuid, id FROM dietary_tags WHERE name = 'vegetarian' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'c45f7dca-770e-4253-8f2e-9b086aac2532'::uuid, id FROM dietary_tags WHERE name = 'vegan' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'c45f7dca-770e-4253-8f2e-9b086aac2532'::uuid, id FROM dietary_tags WHERE name = 'gluten_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'c45f7dca-770e-4253-8f2e-9b086aac2532'::uuid, id FROM dietary_tags WHERE name = 'dairy_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'c45f7dca-770e-4253-8f2e-9b086aac2532'::uuid, id FROM dietary_tags WHERE name = 'nut_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_items
(id, name, description, course_id, cuisine_region_id, spice_level,
 retail_price_inr, retail_price_usd, is_signature, image_url)
VALUES
(
    '263b7bd3-a06c-4d75-9928-59a53dabc692'::uuid,
    'Kale Pulao',
    'Pulao with sautÃ©ed kale and whole spices.',
    (SELECT id FROM courses WHERE name = 'rice'),
    (SELECT id FROM cuisine_regions WHERE name = 'fusion'),
    1,
    229,
    NULL,
    FALSE,
    NULL
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    course_id = EXCLUDED.course_id,
    cuisine_region_id = EXCLUDED.cuisine_region_id,
    spice_level = EXCLUDED.spice_level,
    retail_price_inr = EXCLUDED.retail_price_inr,
    retail_price_usd = EXCLUDED.retail_price_usd,
    is_signature = EXCLUDED.is_signature,
    image_url = EXCLUDED.image_url;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '263b7bd3-a06c-4d75-9928-59a53dabc692'::uuid, id FROM mood_tags WHERE name = 'fresh' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '263b7bd3-a06c-4d75-9928-59a53dabc692'::uuid, id FROM mood_tags WHERE name = 'light' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '263b7bd3-a06c-4d75-9928-59a53dabc692'::uuid, id FROM dietary_tags WHERE name = 'vegetarian' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '263b7bd3-a06c-4d75-9928-59a53dabc692'::uuid, id FROM dietary_tags WHERE name = 'vegan' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '263b7bd3-a06c-4d75-9928-59a53dabc692'::uuid, id FROM dietary_tags WHERE name = 'gluten_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '263b7bd3-a06c-4d75-9928-59a53dabc692'::uuid, id FROM dietary_tags WHERE name = 'dairy_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '263b7bd3-a06c-4d75-9928-59a53dabc692'::uuid, id FROM dietary_tags WHERE name = 'nut_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_items
(id, name, description, course_id, cuisine_region_id, spice_level,
 retail_price_inr, retail_price_usd, is_signature, image_url)
VALUES
(
    '41c9cddc-1071-48c0-aa71-afee29a3dd1a'::uuid,
    'Indian Salad',
    'Cucumber, chilli, onion, and lemon â bright and palate-cleansing.',
    (SELECT id FROM courses WHERE name = 'salad'),
    (SELECT id FROM cuisine_regions WHERE name = 'pan_indian'),
    1,
    129,
    NULL,
    FALSE,
    NULL
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    course_id = EXCLUDED.course_id,
    cuisine_region_id = EXCLUDED.cuisine_region_id,
    spice_level = EXCLUDED.spice_level,
    retail_price_inr = EXCLUDED.retail_price_inr,
    retail_price_usd = EXCLUDED.retail_price_usd,
    is_signature = EXCLUDED.is_signature,
    image_url = EXCLUDED.image_url;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '41c9cddc-1071-48c0-aa71-afee29a3dd1a'::uuid, id FROM mood_tags WHERE name = 'fresh' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '41c9cddc-1071-48c0-aa71-afee29a3dd1a'::uuid, id FROM mood_tags WHERE name = 'light' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '41c9cddc-1071-48c0-aa71-afee29a3dd1a'::uuid, id FROM dietary_tags WHERE name = 'vegetarian' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '41c9cddc-1071-48c0-aa71-afee29a3dd1a'::uuid, id FROM dietary_tags WHERE name = 'vegan' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '41c9cddc-1071-48c0-aa71-afee29a3dd1a'::uuid, id FROM dietary_tags WHERE name = 'gluten_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '41c9cddc-1071-48c0-aa71-afee29a3dd1a'::uuid, id FROM dietary_tags WHERE name = 'dairy_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '41c9cddc-1071-48c0-aa71-afee29a3dd1a'::uuid, id FROM dietary_tags WHERE name = 'nut_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_items
(id, name, description, course_id, cuisine_region_id, spice_level,
 retail_price_inr, retail_price_usd, is_signature, image_url)
VALUES
(
    'e1e3ad5c-c30d-472b-b24c-50728b85c764'::uuid,
    'Boondi Raita',
    'Whipped yoghurt with crisp boondi droplets.',
    (SELECT id FROM courses WHERE name = 'side'),
    (SELECT id FROM cuisine_regions WHERE name = 'north_indian'),
    1,
    99,
    NULL,
    FALSE,
    NULL
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    course_id = EXCLUDED.course_id,
    cuisine_region_id = EXCLUDED.cuisine_region_id,
    spice_level = EXCLUDED.spice_level,
    retail_price_inr = EXCLUDED.retail_price_inr,
    retail_price_usd = EXCLUDED.retail_price_usd,
    is_signature = EXCLUDED.is_signature,
    image_url = EXCLUDED.image_url;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT 'e1e3ad5c-c30d-472b-b24c-50728b85c764'::uuid, id FROM mood_tags WHERE name = 'fresh' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT 'e1e3ad5c-c30d-472b-b24c-50728b85c764'::uuid, id FROM mood_tags WHERE name = 'light' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'e1e3ad5c-c30d-472b-b24c-50728b85c764'::uuid, id FROM dietary_tags WHERE name = 'vegetarian' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'e1e3ad5c-c30d-472b-b24c-50728b85c764'::uuid, id FROM dietary_tags WHERE name = 'gluten_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'e1e3ad5c-c30d-472b-b24c-50728b85c764'::uuid, id FROM dietary_tags WHERE name = 'nut_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) SELECT 'e1e3ad5c-c30d-472b-b24c-50728b85c764'::uuid, id FROM allergens WHERE name = 'dairy' ON CONFLICT DO NOTHING;
INSERT INTO menu_items
(id, name, description, course_id, cuisine_region_id, spice_level,
 retail_price_inr, retail_price_usd, is_signature, image_url)
VALUES
(
    'a8e2b34a-93b1-460d-9b27-d36380f3e4e3'::uuid,
    'Tomato & Onion Raita',
    'Cooling yoghurt with diced tomato, onion, and herbs.',
    (SELECT id FROM courses WHERE name = 'side'),
    (SELECT id FROM cuisine_regions WHERE name = 'north_indian'),
    1,
    99,
    NULL,
    FALSE,
    NULL
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    course_id = EXCLUDED.course_id,
    cuisine_region_id = EXCLUDED.cuisine_region_id,
    spice_level = EXCLUDED.spice_level,
    retail_price_inr = EXCLUDED.retail_price_inr,
    retail_price_usd = EXCLUDED.retail_price_usd,
    is_signature = EXCLUDED.is_signature,
    image_url = EXCLUDED.image_url;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT 'a8e2b34a-93b1-460d-9b27-d36380f3e4e3'::uuid, id FROM mood_tags WHERE name = 'fresh' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT 'a8e2b34a-93b1-460d-9b27-d36380f3e4e3'::uuid, id FROM mood_tags WHERE name = 'light' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'a8e2b34a-93b1-460d-9b27-d36380f3e4e3'::uuid, id FROM dietary_tags WHERE name = 'vegetarian' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'a8e2b34a-93b1-460d-9b27-d36380f3e4e3'::uuid, id FROM dietary_tags WHERE name = 'gluten_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'a8e2b34a-93b1-460d-9b27-d36380f3e4e3'::uuid, id FROM dietary_tags WHERE name = 'nut_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) SELECT 'a8e2b34a-93b1-460d-9b27-d36380f3e4e3'::uuid, id FROM allergens WHERE name = 'dairy' ON CONFLICT DO NOTHING;
INSERT INTO menu_items
(id, name, description, course_id, cuisine_region_id, spice_level,
 retail_price_inr, retail_price_usd, is_signature, image_url)
VALUES
(
    '8e83bda9-cc10-4e8e-b885-8ed160d20d7f'::uuid,
    'Cucumber Raita',
    'Yoghurt with grated cucumber and roasted cumin.',
    (SELECT id FROM courses WHERE name = 'side'),
    (SELECT id FROM cuisine_regions WHERE name = 'north_indian'),
    1,
    109,
    NULL,
    FALSE,
    NULL
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    course_id = EXCLUDED.course_id,
    cuisine_region_id = EXCLUDED.cuisine_region_id,
    spice_level = EXCLUDED.spice_level,
    retail_price_inr = EXCLUDED.retail_price_inr,
    retail_price_usd = EXCLUDED.retail_price_usd,
    is_signature = EXCLUDED.is_signature,
    image_url = EXCLUDED.image_url;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '8e83bda9-cc10-4e8e-b885-8ed160d20d7f'::uuid, id FROM mood_tags WHERE name = 'fresh' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '8e83bda9-cc10-4e8e-b885-8ed160d20d7f'::uuid, id FROM mood_tags WHERE name = 'light' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '8e83bda9-cc10-4e8e-b885-8ed160d20d7f'::uuid, id FROM dietary_tags WHERE name = 'vegetarian' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '8e83bda9-cc10-4e8e-b885-8ed160d20d7f'::uuid, id FROM dietary_tags WHERE name = 'gluten_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '8e83bda9-cc10-4e8e-b885-8ed160d20d7f'::uuid, id FROM dietary_tags WHERE name = 'nut_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) SELECT '8e83bda9-cc10-4e8e-b885-8ed160d20d7f'::uuid, id FROM allergens WHERE name = 'dairy' ON CONFLICT DO NOTHING;
INSERT INTO menu_items
(id, name, description, course_id, cuisine_region_id, spice_level,
 retail_price_inr, retail_price_usd, is_signature, image_url)
VALUES
(
    '317fb9fb-1d51-4679-be5a-522e5b46359b'::uuid,
    'Jeera Poppadum',
    'Cumin-laced thin lentil wafers.',
    (SELECT id FROM courses WHERE name = 'side'),
    (SELECT id FROM cuisine_regions WHERE name = 'north_indian'),
    1,
    49,
    NULL,
    FALSE,
    NULL
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    course_id = EXCLUDED.course_id,
    cuisine_region_id = EXCLUDED.cuisine_region_id,
    spice_level = EXCLUDED.spice_level,
    retail_price_inr = EXCLUDED.retail_price_inr,
    retail_price_usd = EXCLUDED.retail_price_usd,
    is_signature = EXCLUDED.is_signature,
    image_url = EXCLUDED.image_url;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '317fb9fb-1d51-4679-be5a-522e5b46359b'::uuid, id FROM mood_tags WHERE name = 'light' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '317fb9fb-1d51-4679-be5a-522e5b46359b'::uuid, id FROM dietary_tags WHERE name = 'vegetarian' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '317fb9fb-1d51-4679-be5a-522e5b46359b'::uuid, id FROM dietary_tags WHERE name = 'vegan' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '317fb9fb-1d51-4679-be5a-522e5b46359b'::uuid, id FROM dietary_tags WHERE name = 'gluten_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '317fb9fb-1d51-4679-be5a-522e5b46359b'::uuid, id FROM dietary_tags WHERE name = 'dairy_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '317fb9fb-1d51-4679-be5a-522e5b46359b'::uuid, id FROM dietary_tags WHERE name = 'nut_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_items
(id, name, description, course_id, cuisine_region_id, spice_level,
 retail_price_inr, retail_price_usd, is_signature, image_url)
VALUES
(
    '3e341181-2203-4c33-9243-9be3bce0c998'::uuid,
    'South Indian Rice Poppadum',
    'Crisp South Indian rice flour poppadum.',
    (SELECT id FROM courses WHERE name = 'side'),
    (SELECT id FROM cuisine_regions WHERE name = 'south_indian'),
    1,
    49,
    NULL,
    FALSE,
    NULL
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    course_id = EXCLUDED.course_id,
    cuisine_region_id = EXCLUDED.cuisine_region_id,
    spice_level = EXCLUDED.spice_level,
    retail_price_inr = EXCLUDED.retail_price_inr,
    retail_price_usd = EXCLUDED.retail_price_usd,
    is_signature = EXCLUDED.is_signature,
    image_url = EXCLUDED.image_url;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '3e341181-2203-4c33-9243-9be3bce0c998'::uuid, id FROM mood_tags WHERE name = 'light' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '3e341181-2203-4c33-9243-9be3bce0c998'::uuid, id FROM dietary_tags WHERE name = 'vegetarian' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '3e341181-2203-4c33-9243-9be3bce0c998'::uuid, id FROM dietary_tags WHERE name = 'vegan' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '3e341181-2203-4c33-9243-9be3bce0c998'::uuid, id FROM dietary_tags WHERE name = 'gluten_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '3e341181-2203-4c33-9243-9be3bce0c998'::uuid, id FROM dietary_tags WHERE name = 'dairy_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '3e341181-2203-4c33-9243-9be3bce0c998'::uuid, id FROM dietary_tags WHERE name = 'nut_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_items
(id, name, description, course_id, cuisine_region_id, spice_level,
 retail_price_inr, retail_price_usd, is_signature, image_url)
VALUES
(
    'dcf47194-026a-441c-a032-5b0c34ee57b7'::uuid,
    'Pachranga Achar',
    'Five-vegetable Punjabi-style pickle.',
    (SELECT id FROM courses WHERE name = 'side'),
    (SELECT id FROM cuisine_regions WHERE name = 'north_indian'),
    3,
    49,
    NULL,
    FALSE,
    NULL
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    course_id = EXCLUDED.course_id,
    cuisine_region_id = EXCLUDED.cuisine_region_id,
    spice_level = EXCLUDED.spice_level,
    retail_price_inr = EXCLUDED.retail_price_inr,
    retail_price_usd = EXCLUDED.retail_price_usd,
    is_signature = EXCLUDED.is_signature,
    image_url = EXCLUDED.image_url;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT 'dcf47194-026a-441c-a032-5b0c34ee57b7'::uuid, id FROM mood_tags WHERE name = 'bold' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'dcf47194-026a-441c-a032-5b0c34ee57b7'::uuid, id FROM dietary_tags WHERE name = 'vegetarian' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'dcf47194-026a-441c-a032-5b0c34ee57b7'::uuid, id FROM dietary_tags WHERE name = 'vegan' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'dcf47194-026a-441c-a032-5b0c34ee57b7'::uuid, id FROM dietary_tags WHERE name = 'gluten_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'dcf47194-026a-441c-a032-5b0c34ee57b7'::uuid, id FROM dietary_tags WHERE name = 'dairy_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'dcf47194-026a-441c-a032-5b0c34ee57b7'::uuid, id FROM dietary_tags WHERE name = 'nut_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_items
(id, name, description, course_id, cuisine_region_id, spice_level,
 retail_price_inr, retail_price_usd, is_signature, image_url)
VALUES
(
    'd1dd254b-bbeb-475c-86a1-2b12b4ba0bbf'::uuid,
    'Jaljeera (Watermelon / Guava / Pineapple)',
    'Refreshing cumin-spiced cooler in your choice of watermelon, guava, or pineapple.',
    (SELECT id FROM courses WHERE name = 'welcome_drink'),
    (SELECT id FROM cuisine_regions WHERE name = 'north_indian'),
    1,
    79,
    NULL,
    FALSE,
    NULL
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    course_id = EXCLUDED.course_id,
    cuisine_region_id = EXCLUDED.cuisine_region_id,
    spice_level = EXCLUDED.spice_level,
    retail_price_inr = EXCLUDED.retail_price_inr,
    retail_price_usd = EXCLUDED.retail_price_usd,
    is_signature = EXCLUDED.is_signature,
    image_url = EXCLUDED.image_url;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT 'd1dd254b-bbeb-475c-86a1-2b12b4ba0bbf'::uuid, id FROM mood_tags WHERE name = 'fresh' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT 'd1dd254b-bbeb-475c-86a1-2b12b4ba0bbf'::uuid, id FROM mood_tags WHERE name = 'light' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'd1dd254b-bbeb-475c-86a1-2b12b4ba0bbf'::uuid, id FROM dietary_tags WHERE name = 'vegetarian' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'd1dd254b-bbeb-475c-86a1-2b12b4ba0bbf'::uuid, id FROM dietary_tags WHERE name = 'vegan' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'd1dd254b-bbeb-475c-86a1-2b12b4ba0bbf'::uuid, id FROM dietary_tags WHERE name = 'gluten_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'd1dd254b-bbeb-475c-86a1-2b12b4ba0bbf'::uuid, id FROM dietary_tags WHERE name = 'dairy_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'd1dd254b-bbeb-475c-86a1-2b12b4ba0bbf'::uuid, id FROM dietary_tags WHERE name = 'nut_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_items
(id, name, description, course_id, cuisine_region_id, spice_level,
 retail_price_inr, retail_price_usd, is_signature, image_url)
VALUES
(
    'ee1cca8c-abb4-4b55-af14-b852dee43350'::uuid,
    'Lychee Hibiscus Fresh Breeze',
    'Floral hibiscus infusion with lychee â light, fragrant, and refreshing.',
    (SELECT id FROM courses WHERE name = 'welcome_drink'),
    (SELECT id FROM cuisine_regions WHERE name = 'fusion'),
    0,
    129,
    NULL,
    FALSE,
    NULL
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    course_id = EXCLUDED.course_id,
    cuisine_region_id = EXCLUDED.cuisine_region_id,
    spice_level = EXCLUDED.spice_level,
    retail_price_inr = EXCLUDED.retail_price_inr,
    retail_price_usd = EXCLUDED.retail_price_usd,
    is_signature = EXCLUDED.is_signature,
    image_url = EXCLUDED.image_url;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT 'ee1cca8c-abb4-4b55-af14-b852dee43350'::uuid, id FROM mood_tags WHERE name = 'fresh' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT 'ee1cca8c-abb4-4b55-af14-b852dee43350'::uuid, id FROM mood_tags WHERE name = 'floral' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'ee1cca8c-abb4-4b55-af14-b852dee43350'::uuid, id FROM dietary_tags WHERE name = 'vegetarian' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'ee1cca8c-abb4-4b55-af14-b852dee43350'::uuid, id FROM dietary_tags WHERE name = 'vegan' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'ee1cca8c-abb4-4b55-af14-b852dee43350'::uuid, id FROM dietary_tags WHERE name = 'gluten_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'ee1cca8c-abb4-4b55-af14-b852dee43350'::uuid, id FROM dietary_tags WHERE name = 'dairy_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'ee1cca8c-abb4-4b55-af14-b852dee43350'::uuid, id FROM dietary_tags WHERE name = 'nut_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_items
(id, name, description, course_id, cuisine_region_id, spice_level,
 retail_price_inr, retail_price_usd, is_signature, image_url)
VALUES
(
    '6e47fdc1-a3c6-4678-8e7f-3c5da706da96'::uuid,
    'Mojito (Strawberry Rose Lychee or Guava)',
    'Non-alcoholic mojito with mint and lime â choose strawberry-rose-lychee or guava.',
    (SELECT id FROM courses WHERE name = 'welcome_drink'),
    (SELECT id FROM cuisine_regions WHERE name = 'fusion'),
    0,
    139,
    NULL,
    FALSE,
    NULL
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    course_id = EXCLUDED.course_id,
    cuisine_region_id = EXCLUDED.cuisine_region_id,
    spice_level = EXCLUDED.spice_level,
    retail_price_inr = EXCLUDED.retail_price_inr,
    retail_price_usd = EXCLUDED.retail_price_usd,
    is_signature = EXCLUDED.is_signature,
    image_url = EXCLUDED.image_url;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '6e47fdc1-a3c6-4678-8e7f-3c5da706da96'::uuid, id FROM mood_tags WHERE name = 'fresh' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '6e47fdc1-a3c6-4678-8e7f-3c5da706da96'::uuid, id FROM mood_tags WHERE name = 'festive' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '6e47fdc1-a3c6-4678-8e7f-3c5da706da96'::uuid, id FROM dietary_tags WHERE name = 'vegetarian' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '6e47fdc1-a3c6-4678-8e7f-3c5da706da96'::uuid, id FROM dietary_tags WHERE name = 'vegan' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '6e47fdc1-a3c6-4678-8e7f-3c5da706da96'::uuid, id FROM dietary_tags WHERE name = 'gluten_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '6e47fdc1-a3c6-4678-8e7f-3c5da706da96'::uuid, id FROM dietary_tags WHERE name = 'dairy_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '6e47fdc1-a3c6-4678-8e7f-3c5da706da96'::uuid, id FROM dietary_tags WHERE name = 'nut_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_items
(id, name, description, course_id, cuisine_region_id, spice_level,
 retail_price_inr, retail_price_usd, is_signature, image_url)
VALUES
(
    'd9b21013-67a0-4c31-a8d9-0d1d18bb48ea'::uuid,
    'Lemonade (Pineapple Hibiscus or Dragonfruit)',
    'House lemonade infused with pineapple-hibiscus or dragonfruit.',
    (SELECT id FROM courses WHERE name = 'welcome_drink'),
    (SELECT id FROM cuisine_regions WHERE name = 'fusion'),
    0,
    119,
    NULL,
    FALSE,
    NULL
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    course_id = EXCLUDED.course_id,
    cuisine_region_id = EXCLUDED.cuisine_region_id,
    spice_level = EXCLUDED.spice_level,
    retail_price_inr = EXCLUDED.retail_price_inr,
    retail_price_usd = EXCLUDED.retail_price_usd,
    is_signature = EXCLUDED.is_signature,
    image_url = EXCLUDED.image_url;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT 'd9b21013-67a0-4c31-a8d9-0d1d18bb48ea'::uuid, id FROM mood_tags WHERE name = 'fresh' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT 'd9b21013-67a0-4c31-a8d9-0d1d18bb48ea'::uuid, id FROM mood_tags WHERE name = 'light' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'd9b21013-67a0-4c31-a8d9-0d1d18bb48ea'::uuid, id FROM dietary_tags WHERE name = 'vegetarian' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'd9b21013-67a0-4c31-a8d9-0d1d18bb48ea'::uuid, id FROM dietary_tags WHERE name = 'vegan' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'd9b21013-67a0-4c31-a8d9-0d1d18bb48ea'::uuid, id FROM dietary_tags WHERE name = 'gluten_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'd9b21013-67a0-4c31-a8d9-0d1d18bb48ea'::uuid, id FROM dietary_tags WHERE name = 'dairy_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'd9b21013-67a0-4c31-a8d9-0d1d18bb48ea'::uuid, id FROM dietary_tags WHERE name = 'nut_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_items
(id, name, description, course_id, cuisine_region_id, spice_level,
 retail_price_inr, retail_price_usd, is_signature, image_url)
VALUES
(
    '6e01f10a-bbe4-48ee-99fd-16914b82bc18'::uuid,
    'Aam ka Panna / Amrud ka Panna',
    'Tangy raw-mango or guava panna â a classic summer cooler.',
    (SELECT id FROM courses WHERE name = 'welcome_drink'),
    (SELECT id FROM cuisine_regions WHERE name = 'north_indian'),
    1,
    99,
    NULL,
    FALSE,
    NULL
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    course_id = EXCLUDED.course_id,
    cuisine_region_id = EXCLUDED.cuisine_region_id,
    spice_level = EXCLUDED.spice_level,
    retail_price_inr = EXCLUDED.retail_price_inr,
    retail_price_usd = EXCLUDED.retail_price_usd,
    is_signature = EXCLUDED.is_signature,
    image_url = EXCLUDED.image_url;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '6e01f10a-bbe4-48ee-99fd-16914b82bc18'::uuid, id FROM mood_tags WHERE name = 'fresh' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '6e01f10a-bbe4-48ee-99fd-16914b82bc18'::uuid, id FROM mood_tags WHERE name = 'bold' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '6e01f10a-bbe4-48ee-99fd-16914b82bc18'::uuid, id FROM dietary_tags WHERE name = 'vegetarian' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '6e01f10a-bbe4-48ee-99fd-16914b82bc18'::uuid, id FROM dietary_tags WHERE name = 'vegan' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '6e01f10a-bbe4-48ee-99fd-16914b82bc18'::uuid, id FROM dietary_tags WHERE name = 'gluten_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '6e01f10a-bbe4-48ee-99fd-16914b82bc18'::uuid, id FROM dietary_tags WHERE name = 'dairy_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '6e01f10a-bbe4-48ee-99fd-16914b82bc18'::uuid, id FROM dietary_tags WHERE name = 'nut_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_items
(id, name, description, course_id, cuisine_region_id, spice_level,
 retail_price_inr, retail_price_usd, is_signature, image_url)
VALUES
(
    '9a88559c-3c45-4b94-9c4b-65ec8074e432'::uuid,
    'Lychee Pomegranate Fizz',
    'Sparkling cooler with lychee and fresh pomegranate.',
    (SELECT id FROM courses WHERE name = 'welcome_drink'),
    (SELECT id FROM cuisine_regions WHERE name = 'fusion'),
    0,
    139,
    NULL,
    FALSE,
    NULL
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    course_id = EXCLUDED.course_id,
    cuisine_region_id = EXCLUDED.cuisine_region_id,
    spice_level = EXCLUDED.spice_level,
    retail_price_inr = EXCLUDED.retail_price_inr,
    retail_price_usd = EXCLUDED.retail_price_usd,
    is_signature = EXCLUDED.is_signature,
    image_url = EXCLUDED.image_url;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '9a88559c-3c45-4b94-9c4b-65ec8074e432'::uuid, id FROM mood_tags WHERE name = 'fresh' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '9a88559c-3c45-4b94-9c4b-65ec8074e432'::uuid, id FROM mood_tags WHERE name = 'festive' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '9a88559c-3c45-4b94-9c4b-65ec8074e432'::uuid, id FROM dietary_tags WHERE name = 'vegetarian' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '9a88559c-3c45-4b94-9c4b-65ec8074e432'::uuid, id FROM dietary_tags WHERE name = 'vegan' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '9a88559c-3c45-4b94-9c4b-65ec8074e432'::uuid, id FROM dietary_tags WHERE name = 'gluten_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '9a88559c-3c45-4b94-9c4b-65ec8074e432'::uuid, id FROM dietary_tags WHERE name = 'dairy_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '9a88559c-3c45-4b94-9c4b-65ec8074e432'::uuid, id FROM dietary_tags WHERE name = 'nut_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_items
(id, name, description, course_id, cuisine_region_id, spice_level,
 retail_price_inr, retail_price_usd, is_signature, image_url)
VALUES
(
    'eb7f8513-04e6-492f-9391-60913068de57'::uuid,
    'Lassi (Mango / Rose Chia / Strawberry / Coconut-Lime)',
    'Choice of yogurt lassi â mango, rose-chia, strawberry, or coconut-lime.',
    (SELECT id FROM courses WHERE name = 'welcome_drink'),
    (SELECT id FROM cuisine_regions WHERE name = 'north_indian'),
    0,
    129,
    NULL,
    TRUE,
    NULL
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    course_id = EXCLUDED.course_id,
    cuisine_region_id = EXCLUDED.cuisine_region_id,
    spice_level = EXCLUDED.spice_level,
    retail_price_inr = EXCLUDED.retail_price_inr,
    retail_price_usd = EXCLUDED.retail_price_usd,
    is_signature = EXCLUDED.is_signature,
    image_url = EXCLUDED.image_url;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT 'eb7f8513-04e6-492f-9391-60913068de57'::uuid, id FROM mood_tags WHERE name = 'comfort' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT 'eb7f8513-04e6-492f-9391-60913068de57'::uuid, id FROM mood_tags WHERE name = 'indulgent' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'eb7f8513-04e6-492f-9391-60913068de57'::uuid, id FROM dietary_tags WHERE name = 'vegetarian' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'eb7f8513-04e6-492f-9391-60913068de57'::uuid, id FROM dietary_tags WHERE name = 'gluten_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'eb7f8513-04e6-492f-9391-60913068de57'::uuid, id FROM dietary_tags WHERE name = 'nut_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) SELECT 'eb7f8513-04e6-492f-9391-60913068de57'::uuid, id FROM allergens WHERE name = 'dairy' ON CONFLICT DO NOTHING;
INSERT INTO menu_items
(id, name, description, course_id, cuisine_region_id, spice_level,
 retail_price_inr, retail_price_usd, is_signature, image_url)
VALUES
(
    '9920e31d-b4d1-4e59-be53-0a804db059ad'::uuid,
    'Thandai',
    'Traditional chilled milk infused with saffron, cardamom, and spices.',
    (SELECT id FROM courses WHERE name = 'welcome_drink'),
    (SELECT id FROM cuisine_regions WHERE name = 'north_indian'),
    0,
    119,
    NULL,
    FALSE,
    NULL
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    course_id = EXCLUDED.course_id,
    cuisine_region_id = EXCLUDED.cuisine_region_id,
    spice_level = EXCLUDED.spice_level,
    retail_price_inr = EXCLUDED.retail_price_inr,
    retail_price_usd = EXCLUDED.retail_price_usd,
    is_signature = EXCLUDED.is_signature,
    image_url = EXCLUDED.image_url;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '9920e31d-b4d1-4e59-be53-0a804db059ad'::uuid, id FROM mood_tags WHERE name = 'festive' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '9920e31d-b4d1-4e59-be53-0a804db059ad'::uuid, id FROM mood_tags WHERE name = 'indulgent' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '9920e31d-b4d1-4e59-be53-0a804db059ad'::uuid, id FROM dietary_tags WHERE name = 'vegetarian' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '9920e31d-b4d1-4e59-be53-0a804db059ad'::uuid, id FROM dietary_tags WHERE name = 'gluten_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) SELECT '9920e31d-b4d1-4e59-be53-0a804db059ad'::uuid, id FROM allergens WHERE name = 'dairy' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) SELECT '9920e31d-b4d1-4e59-be53-0a804db059ad'::uuid, id FROM allergens WHERE name = 'nuts' ON CONFLICT DO NOTHING;
INSERT INTO menu_items
(id, name, description, course_id, cuisine_region_id, spice_level,
 retail_price_inr, retail_price_usd, is_signature, image_url)
VALUES
(
    '9497c2ec-cce1-4ea7-9d01-cc7e4e10137d'::uuid,
    'Sugar Cane Juice',
    'Freshly pressed sugar cane juice with a hint of lime and ginger.',
    (SELECT id FROM courses WHERE name = 'welcome_drink'),
    (SELECT id FROM cuisine_regions WHERE name = 'street_food'),
    0,
    89,
    NULL,
    FALSE,
    NULL
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    course_id = EXCLUDED.course_id,
    cuisine_region_id = EXCLUDED.cuisine_region_id,
    spice_level = EXCLUDED.spice_level,
    retail_price_inr = EXCLUDED.retail_price_inr,
    retail_price_usd = EXCLUDED.retail_price_usd,
    is_signature = EXCLUDED.is_signature,
    image_url = EXCLUDED.image_url;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '9497c2ec-cce1-4ea7-9d01-cc7e4e10137d'::uuid, id FROM mood_tags WHERE name = 'fresh' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT '9497c2ec-cce1-4ea7-9d01-cc7e4e10137d'::uuid, id FROM mood_tags WHERE name = 'light' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '9497c2ec-cce1-4ea7-9d01-cc7e4e10137d'::uuid, id FROM dietary_tags WHERE name = 'vegetarian' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '9497c2ec-cce1-4ea7-9d01-cc7e4e10137d'::uuid, id FROM dietary_tags WHERE name = 'vegan' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '9497c2ec-cce1-4ea7-9d01-cc7e4e10137d'::uuid, id FROM dietary_tags WHERE name = 'gluten_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '9497c2ec-cce1-4ea7-9d01-cc7e4e10137d'::uuid, id FROM dietary_tags WHERE name = 'dairy_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT '9497c2ec-cce1-4ea7-9d01-cc7e4e10137d'::uuid, id FROM dietary_tags WHERE name = 'nut_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_items
(id, name, description, course_id, cuisine_region_id, spice_level,
 retail_price_inr, retail_price_usd, is_signature, image_url)
VALUES
(
    'e4fe1204-0d7e-4241-8554-e1159f88f015'::uuid,
    'Kulki (Pineapple or Coconut)',
    'Chilled welcome shooter â choose pineapple or coconut.',
    (SELECT id FROM courses WHERE name = 'welcome_drink'),
    (SELECT id FROM cuisine_regions WHERE name = 'fusion'),
    0,
    99,
    NULL,
    FALSE,
    NULL
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    course_id = EXCLUDED.course_id,
    cuisine_region_id = EXCLUDED.cuisine_region_id,
    spice_level = EXCLUDED.spice_level,
    retail_price_inr = EXCLUDED.retail_price_inr,
    retail_price_usd = EXCLUDED.retail_price_usd,
    is_signature = EXCLUDED.is_signature,
    image_url = EXCLUDED.image_url;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT 'e4fe1204-0d7e-4241-8554-e1159f88f015'::uuid, id FROM mood_tags WHERE name = 'fresh' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_moods (menu_item_id, mood_tag_id) SELECT 'e4fe1204-0d7e-4241-8554-e1159f88f015'::uuid, id FROM mood_tags WHERE name = 'festive' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'e4fe1204-0d7e-4241-8554-e1159f88f015'::uuid, id FROM dietary_tags WHERE name = 'vegetarian' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'e4fe1204-0d7e-4241-8554-e1159f88f015'::uuid, id FROM dietary_tags WHERE name = 'vegan' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'e4fe1204-0d7e-4241-8554-e1159f88f015'::uuid, id FROM dietary_tags WHERE name = 'gluten_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'e4fe1204-0d7e-4241-8554-e1159f88f015'::uuid, id FROM dietary_tags WHERE name = 'dairy_free' ON CONFLICT DO NOTHING;
INSERT INTO menu_item_dietary (menu_item_id, dietary_tag_id) SELECT 'e4fe1204-0d7e-4241-8554-e1159f88f015'::uuid, id FROM dietary_tags WHERE name = 'nut_free' ON CONFLICT DO NOTHING;
COMMIT;
