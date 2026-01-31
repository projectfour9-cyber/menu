-- supabase/seed.sql
begin;

-- =========================
-- 1) BANNERS
-- =========================
insert into public.banners (cuisine, image_url, alt)
values
  ('Punjabi/North Indian', 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&q=80&w=1200', 'North Indian banner'),
  ('South Indian', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=1200', 'South Indian banner'),
  ('Mughlai', 'https://images.unsplash.com/photo-1603894584713-f480232d2ee0?auto=format&fit=crop&q=80&w=1200', 'Mughlai banner'),
  ('Italian', 'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?auto=format&fit=crop&q=80&w=1200', 'Italian banner'),
  ('Chinese', 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=1200', 'Chinese banner'),
  ('Continental', 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=1200', 'Continental banner'),
  ('Mediterranean', 'https://images.unsplash.com/photo-1544124499-58912cbddaad?auto=format&fit=crop&q=80&w=1200', 'Mediterranean banner')
on conflict (cuisine) do nothing;

-- =========================
-- 2) DISHES
-- =========================
insert into public.dishes
(cuisine, category, name, description, "dietaryTags", "imageUrl")
values

-- ===== NORTH INDIAN =====
('Punjabi/North Indian', 'Starters', 'Paneer Tikka', 'Char-grilled cottage cheese with spices', array['veg'], null),
('Punjabi/North Indian', 'Starters', 'Hara Bhara Kebab', 'Spinach and green pea kebabs', array['veg'], null),
('Punjabi/North Indian', 'Starters', 'Veg Seekh Kebab', 'Minced vegetable skewers', array['veg'], null),

('Punjabi/North Indian', 'Mains', 'Dal Makhani', 'Slow-cooked black lentils with butter', array['veg'], null),
('Punjabi/North Indian', 'Mains', 'Paneer Lababdar', 'Rich tomato paneer curry', array['veg'], null),
('Punjabi/North Indian', 'Mains', 'Chole Masala', 'Spiced chickpea curry', array['veg','jain'], null),

('Punjabi/North Indian', 'Sides', 'Jeera Rice', 'Cumin tempered basmati rice', array['veg','jain'], null),
('Punjabi/North Indian', 'Sides', 'Butter Naan', 'Soft buttered flatbread', array['veg'], null),
('Punjabi/North Indian', 'Sides', 'Lachha Paratha', 'Layered wheat flatbread', array['veg'], null),

('Punjabi/North Indian', 'Desserts', 'Gulab Jamun', 'Milk dumplings in sugar syrup', array['veg'], null),
('Punjabi/North Indian', 'Desserts', 'Gajar Halwa', 'Slow cooked carrot pudding', array['veg'], null),

-- ===== SOUTH INDIAN =====
('South Indian', 'Starters', 'Mini Idli Sambar', 'Steamed rice cakes with lentil stew', array['veg','jain'], null),
('South Indian', 'Starters', 'Medu Vada', 'Crispy lentil fritters', array['veg'], null),
('South Indian', 'Starters', 'Vegetable Uttapam', 'Thick rice pancake with veggies', array['veg'], null),

('South Indian', 'Mains', 'Masala Dosa', 'Crispy dosa with spiced potato filling', array['veg'], null),
('South Indian', 'Mains', 'Vegetable Biryani', 'South-style spiced rice', array['veg'], null),
('South Indian', 'Mains', 'Sambar Rice', 'Rice cooked with lentils and vegetables', array['veg','jain'], null),

('South Indian', 'Sides', 'Coconut Chutney', 'Fresh coconut relish', array['veg','jain'], null),
('South Indian', 'Sides', 'Tomato Rasam', 'Spiced tamarind soup', array['veg','jain'], null),

('South Indian', 'Desserts', 'Payasam', 'South Indian milk pudding', array['veg'], null),

-- ===== MUGHLAI =====
('Mughlai', 'Starters', 'Chicken Tikka', 'Char-grilled marinated chicken', array['non-veg'], null),
('Mughlai', 'Starters', 'Paneer Malai Tikka', 'Creamy grilled paneer', array['veg'], null),

('Mughlai', 'Mains', 'Butter Chicken', 'Tomato based chicken curry', array['non-veg'], null),
('Mughlai', 'Mains', 'Shahi Paneer', 'Royal cashew paneer curry', array['veg'], null),
('Mughlai', 'Mains', 'Korma Vegetables', 'Slow cooked vegetable korma', array['veg'], null),

('Mughlai', 'Sides', 'Roomali Roti', 'Thin handkerchief flatbread', array['veg'], null),
('Mughlai', 'Sides', 'Pulao Rice', 'Fragrant saffron rice', array['veg'], null),

-- ===== ITALIAN =====
('Italian', 'Starters', 'Bruschetta Pomodoro', 'Tomato basil crostini', array['veg'], null),
('Italian', 'Starters', 'Arancini', 'Crispy risotto balls', array['veg'], null),

('Italian', 'Mains', 'Penne Arrabiata', 'Spicy tomato pasta', array['veg'], null),
('Italian', 'Mains', 'Lasagna', 'Layered pasta bake', array['non-veg'], null),
('Italian', 'Mains', 'Mushroom Risotto', 'Creamy arborio rice', array['veg'], null),

('Italian', 'Desserts', 'Tiramisu', 'Coffee mascarpone dessert', array['veg'], null),
('Italian', 'Desserts', 'Panna Cotta', 'Vanilla cream pudding', array['veg'], null),

-- ===== CHINESE =====
('Chinese', 'Starters', 'Veg Spring Rolls', 'Crispy vegetable rolls', array['veg'], null),
('Chinese', 'Starters', 'Chilli Paneer', 'Spicy Indo-Chinese paneer', array['veg'], null),

('Chinese', 'Mains', 'Hakka Noodles', 'Stir-fried noodles', array['veg'], null),
('Chinese', 'Mains', 'Fried Rice', 'Wok tossed rice', array['veg'], null),
('Chinese', 'Mains', 'Kung Pao Chicken', 'Spicy Sichuan chicken', array['non-veg'], null),

-- ===== CONTINENTAL =====
('Continental', 'Starters', 'Stuffed Mushrooms', 'Herb cheese stuffed mushrooms', array['veg'], null),
('Continental', 'Starters', 'Garlic Bread', 'Toasted garlic baguette', array['veg'], null),

('Continental', 'Mains', 'Grilled Vegetables', 'Seasonal grilled vegetables', array['veg'], null),
('Continental', 'Mains', 'Chicken Steak', 'Herb grilled chicken', array['non-veg'], null),

-- ===== MEDITERRANEAN =====
('Mediterranean', 'Starters', 'Hummus & Pita', 'Chickpea dip with bread', array['veg','jain'], null),
('Mediterranean', 'Starters', 'Falafel', 'Crispy chickpea fritters', array['veg'], null),

('Mediterranean', 'Mains', 'Vegetable Moussaka', 'Layered baked vegetables', array['veg'], null),
('Mediterranean', 'Mains', 'Grilled Halloumi', 'Charred cheese with herbs', array['veg'], null),

('Mediterranean', 'Sides', 'Greek Salad', 'Feta, olives, cucumber salad', array['veg'], null),
('Mediterranean', 'Sides', 'Couscous', 'Steamed semolina grains', array['veg'], null);

commit;
