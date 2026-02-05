SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- \restrict W5QosuDzhMXa1MnsUlrPLP9GemkP0rHLSXQKF1acvMsvjE0cTfyYFIUOQteNhcp

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: banners; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."banners" ("id", "cuisine", "image_url", "alt", "created_at") VALUES
	('55110298-a470-4d40-83f0-e6dd9e6d917e', 'Punjabi/North Indian', 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&q=80&w=1200', 'North Indian banner', '2026-01-31 04:12:40.147348+00'),
	('18153111-5867-4dee-80b5-4309ac5f219d', 'South Indian', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=1200', 'South Indian banner', '2026-01-31 04:12:40.147348+00'),
	('8b98f14d-a5ef-4a1e-ab44-b21fefc66e10', 'Mughlai', 'https://images.unsplash.com/photo-1603894584713-f480232d2ee0?auto=format&fit=crop&q=80&w=1200', 'Mughlai banner', '2026-01-31 04:12:40.147348+00'),
	('0e6ca3bf-c0d7-4f96-9aab-82d3e26c0156', 'Italian', 'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?auto=format&fit=crop&q=80&w=1200', 'Italian banner', '2026-01-31 04:12:40.147348+00'),
	('1f527cd1-18a2-4f8b-a49f-d4f2fd53c2ce', 'Chinese', 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=1200', 'Chinese banner', '2026-01-31 04:12:40.147348+00'),
	('cc537e5f-f52e-406e-95b0-63cbec2d363a', 'Continental', 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=1200', 'Continental banner', '2026-01-31 04:12:40.147348+00'),
	('635ddc5c-25e5-454f-bbf1-41f956d22bb3', 'Mediterranean', 'https://images.unsplash.com/photo-1544124499-58912cbddaad?auto=format&fit=crop&q=80&w=1200', 'Mediterranean banner', '2026-01-31 04:12:40.147348+00');


--
-- Data for Name: dishes; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."dishes" ("id", "cuisine", "category", "name", "description", "dietaryTags", "imageUrl", "created_at") VALUES
	('b83c6a83-d3db-4cad-a772-73818d0a1a1e', 'Punjabi/North Indian', 'Starters', 'Paneer Tikka', 'Char-grilled cottage cheese with spices', '{veg}', NULL, '2026-01-31 04:12:40.147348+00'),
	('48555855-14c5-4825-a8d6-12f579d2b1b7', 'Punjabi/North Indian', 'Starters', 'Hara Bhara Kebab', 'Spinach and green pea kebabs', '{veg}', NULL, '2026-01-31 04:12:40.147348+00'),
	('5e37aa61-148b-4ef3-9134-b6d0d2227877', 'Punjabi/North Indian', 'Starters', 'Veg Seekh Kebab', 'Minced vegetable skewers', '{veg}', NULL, '2026-01-31 04:12:40.147348+00'),
	('1e4e3be5-9510-415c-ba25-8fda5966fefd', 'Punjabi/North Indian', 'Mains', 'Dal Makhani', 'Slow-cooked black lentils with butter', '{veg}', NULL, '2026-01-31 04:12:40.147348+00'),
	('77f9c72f-30a3-4e57-b55e-352a173cb257', 'Punjabi/North Indian', 'Mains', 'Paneer Lababdar', 'Rich tomato paneer curry', '{veg}', NULL, '2026-01-31 04:12:40.147348+00'),
	('fb766786-18d9-4536-91c9-81611435b1bc', 'Punjabi/North Indian', 'Mains', 'Chole Masala', 'Spiced chickpea curry', '{veg,jain}', NULL, '2026-01-31 04:12:40.147348+00'),
	('c18a77e9-6601-4510-ae81-36c7b34b3264', 'Punjabi/North Indian', 'Sides', 'Jeera Rice', 'Cumin tempered basmati rice', '{veg,jain}', NULL, '2026-01-31 04:12:40.147348+00'),
	('84c7ab2d-2a15-4db0-a05e-83df030db766', 'Punjabi/North Indian', 'Sides', 'Butter Naan', 'Soft buttered flatbread', '{veg}', NULL, '2026-01-31 04:12:40.147348+00'),
	('26ae3410-8aa8-4961-814c-717f101dcb91', 'Punjabi/North Indian', 'Sides', 'Lachha Paratha', 'Layered wheat flatbread', '{veg}', NULL, '2026-01-31 04:12:40.147348+00'),
	('84e93bc6-afbd-48e9-b990-5911e23c9d54', 'Punjabi/North Indian', 'Desserts', 'Gulab Jamun', 'Milk dumplings in sugar syrup', '{veg}', NULL, '2026-01-31 04:12:40.147348+00'),
	('9468238e-2f68-46dd-ad22-7922b137ec81', 'Punjabi/North Indian', 'Desserts', 'Gajar Halwa', 'Slow cooked carrot pudding', '{veg}', NULL, '2026-01-31 04:12:40.147348+00'),
	('bce0ebd5-61fc-4638-b95b-4baa071e7bd2', 'South Indian', 'Starters', 'Mini Idli Sambar', 'Steamed rice cakes with lentil stew', '{veg,jain}', NULL, '2026-01-31 04:12:40.147348+00'),
	('f31a5d31-0575-4015-a774-fbc1e220db47', 'South Indian', 'Starters', 'Medu Vada', 'Crispy lentil fritters', '{veg}', NULL, '2026-01-31 04:12:40.147348+00'),
	('031fdea0-bd60-4763-a80c-78e6eb00fa5a', 'South Indian', 'Starters', 'Vegetable Uttapam', 'Thick rice pancake with veggies', '{veg}', NULL, '2026-01-31 04:12:40.147348+00'),
	('772be405-c00c-4bd5-b21b-1b9aee6b98d3', 'South Indian', 'Mains', 'Masala Dosa', 'Crispy dosa with spiced potato filling', '{veg}', NULL, '2026-01-31 04:12:40.147348+00'),
	('d89f2a04-f19b-4a75-9c7c-79dff74ef978', 'South Indian', 'Mains', 'Vegetable Biryani', 'South-style spiced rice', '{veg}', NULL, '2026-01-31 04:12:40.147348+00'),
	('5f03d811-73a0-48a0-8845-cbae3924cfac', 'South Indian', 'Mains', 'Sambar Rice', 'Rice cooked with lentils and vegetables', '{veg,jain}', NULL, '2026-01-31 04:12:40.147348+00'),
	('00637f4e-cdda-4794-b3e7-45db1538233f', 'South Indian', 'Sides', 'Coconut Chutney', 'Fresh coconut relish', '{veg,jain}', NULL, '2026-01-31 04:12:40.147348+00'),
	('a4c555fb-7d96-443c-86c4-68623d6287bd', 'South Indian', 'Sides', 'Tomato Rasam', 'Spiced tamarind soup', '{veg,jain}', NULL, '2026-01-31 04:12:40.147348+00'),
	('6f598dc1-a5fe-4081-8b2e-105192f14a04', 'South Indian', 'Desserts', 'Payasam', 'South Indian milk pudding', '{veg}', NULL, '2026-01-31 04:12:40.147348+00'),
	('4177d4ae-e115-40ae-8d24-6e91ec800a8b', 'Mughlai', 'Starters', 'Chicken Tikka', 'Char-grilled marinated chicken', '{non-veg}', NULL, '2026-01-31 04:12:40.147348+00'),
	('fefb5706-f2ec-474f-aa96-03dd44904b20', 'Mughlai', 'Starters', 'Paneer Malai Tikka', 'Creamy grilled paneer', '{veg}', NULL, '2026-01-31 04:12:40.147348+00'),
	('ff965dc7-7f35-405d-84b5-b9329d8463ed', 'Mughlai', 'Mains', 'Butter Chicken', 'Tomato based chicken curry', '{non-veg}', NULL, '2026-01-31 04:12:40.147348+00'),
	('60434a1c-da84-4772-9703-5345fbe3b880', 'Mughlai', 'Mains', 'Shahi Paneer', 'Royal cashew paneer curry', '{veg}', NULL, '2026-01-31 04:12:40.147348+00'),
	('d5623205-1490-4050-9f31-33e419ce1457', 'Mughlai', 'Mains', 'Korma Vegetables', 'Slow cooked vegetable korma', '{veg}', NULL, '2026-01-31 04:12:40.147348+00'),
	('b0be5d80-39dd-4335-8403-ca97495c8360', 'Mughlai', 'Sides', 'Roomali Roti', 'Thin handkerchief flatbread', '{veg}', NULL, '2026-01-31 04:12:40.147348+00'),
	('a4b0dfc6-79ad-4d25-9db0-e6874ec6647c', 'Mughlai', 'Sides', 'Pulao Rice', 'Fragrant saffron rice', '{veg}', NULL, '2026-01-31 04:12:40.147348+00'),
	('fbec5daa-aa10-46d5-af1e-188b94e3bfdf', 'Italian', 'Starters', 'Bruschetta Pomodoro', 'Tomato basil crostini', '{veg}', NULL, '2026-01-31 04:12:40.147348+00'),
	('845ec3de-5795-4350-9f53-c2753983cb13', 'Italian', 'Starters', 'Arancini', 'Crispy risotto balls', '{veg}', NULL, '2026-01-31 04:12:40.147348+00'),
	('50bbf625-9f11-4b0e-9ce7-eb3b71491c81', 'Italian', 'Mains', 'Penne Arrabiata', 'Spicy tomato pasta', '{veg}', NULL, '2026-01-31 04:12:40.147348+00'),
	('628db74c-4c10-4420-93ae-a2ee0f56fb67', 'Italian', 'Mains', 'Lasagna', 'Layered pasta bake', '{non-veg}', NULL, '2026-01-31 04:12:40.147348+00'),
	('c2c973e4-85d1-4557-98dd-ed081a2f5021', 'Italian', 'Mains', 'Mushroom Risotto', 'Creamy arborio rice', '{veg}', NULL, '2026-01-31 04:12:40.147348+00'),
	('a03e1823-b686-46cd-abe1-8f029c7b4ae8', 'Italian', 'Desserts', 'Tiramisu', 'Coffee mascarpone dessert', '{veg}', NULL, '2026-01-31 04:12:40.147348+00'),
	('382d4480-5a26-4db0-beae-9df3d25bb26d', 'Italian', 'Desserts', 'Panna Cotta', 'Vanilla cream pudding', '{veg}', NULL, '2026-01-31 04:12:40.147348+00'),
	('acc27cb3-7b99-413c-a314-d3cbf5fb0bee', 'Chinese', 'Starters', 'Veg Spring Rolls', 'Crispy vegetable rolls', '{veg}', NULL, '2026-01-31 04:12:40.147348+00'),
	('cff7ab74-b999-4495-b92e-e223865fdec1', 'Chinese', 'Starters', 'Chilli Paneer', 'Spicy Indo-Chinese paneer', '{veg}', NULL, '2026-01-31 04:12:40.147348+00'),
	('1a6eeca3-1a83-4419-814d-b87ccee61efb', 'Chinese', 'Mains', 'Hakka Noodles', 'Stir-fried noodles', '{veg}', NULL, '2026-01-31 04:12:40.147348+00'),
	('88a31b56-f961-4b2f-b4ee-bff28495133e', 'Chinese', 'Mains', 'Fried Rice', 'Wok tossed rice', '{veg}', NULL, '2026-01-31 04:12:40.147348+00'),
	('97866976-c2b3-400a-9ad0-e4e6306e047e', 'Chinese', 'Mains', 'Kung Pao Chicken', 'Spicy Sichuan chicken', '{non-veg}', NULL, '2026-01-31 04:12:40.147348+00'),
	('50b906ed-6a9d-4f24-89a8-95ffd3eab584', 'Continental', 'Starters', 'Stuffed Mushrooms', 'Herb cheese stuffed mushrooms', '{veg}', NULL, '2026-01-31 04:12:40.147348+00'),
	('97ca47aa-1381-4750-82a9-df915086b2ff', 'Continental', 'Starters', 'Garlic Bread', 'Toasted garlic baguette', '{veg}', NULL, '2026-01-31 04:12:40.147348+00'),
	('48776b11-5ac1-48d3-8c78-47027f68276e', 'Continental', 'Mains', 'Grilled Vegetables', 'Seasonal grilled vegetables', '{veg}', NULL, '2026-01-31 04:12:40.147348+00'),
	('cffd2c9a-2935-41e8-94e1-a991770cd281', 'Continental', 'Mains', 'Chicken Steak', 'Herb grilled chicken', '{non-veg}', NULL, '2026-01-31 04:12:40.147348+00'),
	('9d06ff23-2d10-4ea8-8c4d-51d89ce33a93', 'Mediterranean', 'Starters', 'Hummus & Pita', 'Chickpea dip with bread', '{veg,jain}', NULL, '2026-01-31 04:12:40.147348+00'),
	('2a4c8be5-aa6a-430c-9bd3-6dd665aed20c', 'Mediterranean', 'Starters', 'Falafel', 'Crispy chickpea fritters', '{veg}', NULL, '2026-01-31 04:12:40.147348+00'),
	('11add149-0ac5-42ad-a1e5-d455de7735ab', 'Mediterranean', 'Mains', 'Vegetable Moussaka', 'Layered baked vegetables', '{veg}', NULL, '2026-01-31 04:12:40.147348+00'),
	('1ae6cb22-3610-4368-a284-181a08314b81', 'Mediterranean', 'Mains', 'Grilled Halloumi', 'Charred cheese with herbs', '{veg}', NULL, '2026-01-31 04:12:40.147348+00'),
	('b28e8916-77c3-4f26-a763-22c10ca8a6f3', 'Mediterranean', 'Sides', 'Greek Salad', 'Feta, olives, cucumber salad', '{veg}', NULL, '2026-01-31 04:12:40.147348+00'),
	('b1515777-87cb-4b10-a432-d67bba71dafa', 'Mediterranean', 'Sides', 'Couscous', 'Steamed semolina grains', '{veg}', NULL, '2026-01-31 04:12:40.147348+00'),
	('a9082d03-4a49-46b7-a6f0-8e4a5167fa99', 'Any / Mix', 'Appetizers & Starters', 'Chef''s Signature Selection', 'A freshly curated seasonal creation based on your event theme.', '{Veg}', NULL, '2026-01-31 04:33:41.426459+00'),
	-- Live Counter / Interactive Stations
	('c1a2b3c4-d5e6-f7a8-b9c0-d1e2f3a4b5c6', 'Punjabi/North Indian', 'Live Counter', 'Chaat Counter', 'Interactive station with pani puri, bhel puri, and sev puri', '{veg,jain}', NULL, '2026-01-31 04:12:40.147348+00'),
	('d2b3c4d5-e6f7-a8b9-c0d1-e2f3a4b5c6d7', 'Punjabi/North Indian', 'Live Station', 'Dosa Station', 'Freshly made dosas with assorted chutneys', '{veg}', NULL, '2026-01-31 04:12:40.147348+00'),
	('e3c4d5e6-f7a8-b9c0-d1e2-f3a4b5c6d7e8', 'South Indian', 'Live Counter', 'Idli & Vada Counter', 'Steamed idlis and crispy vadas made to order', '{veg}', NULL, '2026-01-31 04:12:40.147348+00'),
	('f4d5e6f7-a8b9-c0d1-e2f3-a4b5c6d7e8f9', 'Italian', 'Live Station', 'Pasta Station', 'Fresh pasta tossed with choice of sauces', '{veg}', NULL, '2026-01-31 04:12:40.147348+00'),
	('a5e6f7a8-b9c0-d1e2-f3a4-b5c6d7e8f9a0', 'Italian', 'Live Counter', 'Pizza Counter', 'Wood-fired pizzas with custom toppings', '{veg}', NULL, '2026-01-31 04:12:40.147348+00'),
	('b6f7a8b9-c0d1-e2f3-a4b5-c6d7e8f9a0b1', 'Chinese', 'Live Station', 'Noodle Bar', 'Stir-fried noodles with fresh vegetables', '{veg}', NULL, '2026-01-31 04:12:40.147348+00'),
	('c7a8b9c0-d1e2-f3a4-b5c6-d7e8f9a0b1c2', 'Chinese', 'Live Counter', 'Wok Station', 'Live wok cooking with choice of proteins and sauces', '{veg,non-veg}', NULL, '2026-01-31 04:12:40.147348+00'),
	('d8b9c0d1-e2f3-a4b5-c6d7-e8f9a0b1c2d3', 'Continental', 'Live Station', 'Salad Bar', 'Fresh greens with gourmet toppings and dressings', '{veg,jain}', NULL, '2026-01-31 04:12:40.147348+00'),
	('e9c0d1e2-f3a4-b5c6-d7e8-f9a0b1c2d3e4', 'Continental', 'Live Counter', 'Carving Station', 'Chef-carved roasted meats and vegetables', '{non-veg}', NULL, '2026-01-31 04:12:40.147348+00'),
	('f0d1e2f3-a4b5-c6d7-e8f9-a0b1c2d3e4f5', 'Mediterranean', 'Live Station', 'Falafel & Shawarma Bar', 'Freshly prepared falafel and shawarma wraps', '{veg}', NULL, '2026-01-31 04:12:40.147348+00');




--
-- Data for Name: sub_menu_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."sub_menu_items" ("id", "dish_id", "name", "description", "dietaryTags", "created_at") VALUES
	-- Pasta Station options
	('a1b2c3d4-e5f6-47a8-b9c0-d1e2f3a4b5c6', 'f4d5e6f7-a8b9-c0d1-e2f3-a4b5c6d7e8f9', 'Penne Arrabiata', 'Spicy tomato sauce', '{veg}', '2026-01-31 04:12:40.147348+00'),
	('b2c3d4e5-f6a7-48b9-c0d1-e2f3a4b5c6d7', 'f4d5e6f7-a8b9-c0d1-e2f3-a4b5c6d7e8f9', 'Fusilli Alfredo', 'Creamy white sauce', '{veg}', '2026-01-31 04:12:40.147348+00'),
	('c3d4e5f6-a7b8-49c0-d1e2-f3a4b5c6d7e8', 'f4d5e6f7-a8b9-c0d1-e2f3-a4b5c6d7e8f9', 'Spaghetti Aglio e Olio', 'Garlic and olive oil', '{veg,jain}', '2026-01-31 04:12:40.147348+00'),
	-- Pizza Counter options
	('d4e5f6a7-b8c9-40d1-e2f3-a4b5c6d7e8f9', 'a5e6f7a8-b9c0-d1e2-f3a4-b5c6d7e8f9a0', 'Margherita', 'Classic tomato and mozzarella', '{veg}', '2026-01-31 04:12:40.147348+00'),
	('e5f6a7b8-c9d0-41e2-f3a4-b5c6d7e8f9a0', 'a5e6f7a8-b9c0-d1e2-f3a4-b5c6d7e8f9a0', 'Veggie Supreme', 'Loaded with fresh vegetables', '{veg}', '2026-01-31 04:12:40.147348+00'),
	('f6a7b8c9-d0e1-42f3-a4b5-c6d7e8f9a0b1', 'a5e6f7a8-b9c0-d1e2-f3a4-b5c6d7e8f9a0', 'Pepperoni', 'Classic pepperoni and cheese', '{non-veg}', '2026-01-31 04:12:40.147348+00'),
	-- Noodle Bar options
	('a7b8c9d0-e1f2-43a4-b5c6-d7e8f9a0b1c2', 'b6f7a8b9-c0d1-e2f3-a4b5-c6d7e8f9a0b1', 'Hakka Noodles', 'Classic stir-fried style', '{veg}', '2026-01-31 04:12:40.147348+00'),
	('b8c9d0e1-f2a3-44b5-c6d7-e8f9a0b1c2d3', 'b6f7a8b9-c0d1-e2f3-a4b5-c6d7e8f9a0b1', 'Schezwan Noodles', 'Spicy Sichuan style', '{veg}', '2026-01-31 04:12:40.147348+00'),
	('c9d0e1f2-a3b4-45c6-d7e8-f9a0b1c2d3e4', 'b6f7a8b9-c0d1-e2f3-a4b5-c6d7e8f9a0b1', 'Singapore Noodles', 'Curry flavored', '{veg}', '2026-01-31 04:12:40.147348+00'),
	-- Chaat Counter options
	('d0e1f2a3-b4c5-46d7-e8f9-a0b1c2d3e4f5', 'c1a2b3c4-d5e6-f7a8-b9c0-d1e2f3a4b5c6', 'Pani Puri', 'Crispy shells with spiced water', '{veg,jain}', '2026-01-31 04:12:40.147348+00'),
	('e1f2a3b4-c5d6-47e8-f9a0-b1c2d3e4f5a6', 'c1a2b3c4-d5e6-f7a8-b9c0-d1e2f3a4b5c6', 'Bhel Puri', 'Puffed rice mix', '{veg,jain}', '2026-01-31 04:12:40.147348+00'),
	('f2a3b4c5-d6e7-48f9-a0b1-c2d3e4f5a6b7', 'c1a2b3c4-d5e6-f7a8-b9c0-d1e2f3a4b5c6', 'Sev Puri', 'Crispy base with toppings', '{veg,jain}', '2026-01-31 04:12:40.147348+00');


--
-- Data for Name: menus; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."menus" ("id", "created_at", "user_id", "title", "menu_data", "client_name", "event_name", "guest_count", "event_date") VALUES
	('89fae9cd-7eeb-4c22-ad19-810944e163d7', '2026-01-31 05:05:30.656379+00', 'b05e6032-4780-4e65-95e4-026e7edfc525', 'Classic and delightful Any / Mix Feast', '{"title": "Classic and delightful Any / Mix Feast", "sections": [{"items": [{"id": "bce0ebd5-61fc-4638-b95b-4baa071e7bd2", "name": "Mini Idli Sambar", "imageUrl": "", "description": "Steamed rice cakes with lentil stew", "dietaryTags": ["veg", "jain"]}, {"id": "50b906ed-6a9d-4f24-89a8-95ffd3eab584", "name": "Stuffed Mushrooms", "imageUrl": "", "description": "Herb cheese stuffed mushrooms", "dietaryTags": ["veg"]}, {"id": "cff7ab74-b999-4495-b92e-e223865fdec1", "name": "Chilli Paneer", "imageUrl": "", "description": "Spicy Indo-Chinese paneer", "dietaryTags": ["veg"]}], "category": "Appetizers & Starters"}, {"items": [{"id": "48776b11-5ac1-48d3-8c78-47027f68276e", "name": "Grilled Vegetables", "imageUrl": "", "description": "Seasonal grilled vegetables", "dietaryTags": ["veg"]}, {"id": "1a6eeca3-1a83-4419-814d-b87ccee61efb", "name": "Hakka Noodles", "imageUrl": "", "description": "Stir-fried noodles", "dietaryTags": ["veg"]}], "category": "Main Course Selection"}, {"items": [{"id": "00637f4e-cdda-4794-b3e7-45db1538233f", "name": "Coconut Chutney", "imageUrl": "", "description": "Fresh coconut relish", "dietaryTags": ["veg", "jain"]}, {"id": "26ae3410-8aa8-4961-814c-717f101dcb91", "name": "Lachha Paratha", "imageUrl": "", "description": "Layered wheat flatbread", "dietaryTags": ["veg"]}], "category": "Accompaniments"}, {"items": [{"id": "9468238e-2f68-46dd-ad22-7922b137ec81", "name": "Gajar Halwa", "imageUrl": "", "description": "Slow cooked carrot pudding", "dietaryTags": ["veg"]}], "category": "The Grand Finale (Desserts)"}], "chefsNotes": "This menu has been architected with a focus on seasonal integrity and visual drama. We''ve ensured a balance of textures and temperatures to provide a continuous culinary journey.", "winePairing": "To complement these flavors, we suggest a full-bodied red for the mains and a crisp, aromatic white for the starters.", "cuisineRegion": "Any / Mix", "vibeDescription": "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80&w=1200", "eventDescription": "A wedding curated exclusively for our guest of honor. This classic and delightful selection celebrates the vibrant heritage of Any / Mix cuisine, tailored for an intimate gathering of 50 guests."}', '', '', '50', '2026-01-31'),
	('844a3c3d-4fdf-42ec-90ee-43da8e1fdb7a', '2026-01-31 05:07:10.192898+00', 'b05e6032-4780-4e65-95e4-026e7edfc525', 'Classic and delightful Any / Mix Feast', '{"title": "Classic and delightful Any / Mix Feast", "sections": [{"items": [{"id": "9d06ff23-2d10-4ea8-8c4d-51d89ce33a93", "name": "Hummus & Pita", "imageUrl": "", "description": "Chickpea dip with bread", "dietaryTags": ["veg", "jain"]}, {"id": "2a4c8be5-aa6a-430c-9bd3-6dd665aed20c", "name": "Falafel", "imageUrl": "", "description": "Crispy chickpea fritters", "dietaryTags": ["veg"]}, {"id": "031fdea0-bd60-4763-a80c-78e6eb00fa5a", "name": "Vegetable Uttapam", "imageUrl": "", "description": "Thick rice pancake with veggies", "dietaryTags": ["veg"]}], "category": "Appetizers & Starters"}, {"items": [{"id": "fb766786-18d9-4536-91c9-81611435b1bc", "name": "Chole Masala", "imageUrl": "", "description": "Spiced chickpea curry", "dietaryTags": ["veg", "jain"]}, {"id": "77f9c72f-30a3-4e57-b55e-352a173cb257", "name": "Paneer Lababdar", "imageUrl": "", "description": "Rich tomato paneer curry", "dietaryTags": ["veg"]}], "category": "Main Course Selection"}, {"items": [{"id": "a4c555fb-7d96-443c-86c4-68623d6287bd", "name": "Tomato Rasam", "imageUrl": "", "description": "Spiced tamarind soup", "dietaryTags": ["veg", "jain"]}, {"id": "b28e8916-77c3-4f26-a763-22c10ca8a6f3", "name": "Greek Salad", "imageUrl": "", "description": "Feta, olives, cucumber salad", "dietaryTags": ["veg"]}], "category": "Accompaniments"}, {"items": [{"id": "84e93bc6-afbd-48e9-b990-5911e23c9d54", "name": "Gulab Jamun", "imageUrl": "", "description": "Milk dumplings in sugar syrup", "dietaryTags": ["veg"]}], "category": "The Grand Finale (Desserts)"}], "chefsNotes": "This menu has been architected with a focus on seasonal integrity and visual drama. We''ve ensured a balance of textures and temperatures to provide a continuous culinary journey.", "winePairing": "To complement these flavors, we suggest a full-bodied red for the mains and a crisp, aromatic white for the starters.", "cuisineRegion": "Any / Mix", "vibeDescription": "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80&w=1200", "eventDescription": "A wedding curated exclusively for our guest of honor. This classic and delightful selection celebrates the vibrant heritage of Any / Mix cuisine, tailored for an intimate gathering of 50 guests."}', '', '', '50', '2026-01-31'),
	('d08f5cdf-8065-4e7b-9406-15d82b696278', '2026-01-31 05:16:23.70505+00', 'b05e6032-4780-4e65-95e4-026e7edfc525', 'Classic and delightful Any / Mix Feast', '{"title": "Classic and delightful Any / Mix Feast", "sections": [{"items": [{"id": "50b906ed-6a9d-4f24-89a8-95ffd3eab584", "name": "Stuffed Mushrooms", "imageUrl": "", "description": "Herb cheese stuffed mushrooms", "dietaryTags": ["veg"]}, {"id": "bce0ebd5-61fc-4638-b95b-4baa071e7bd2", "name": "Mini Idli Sambar", "imageUrl": "", "description": "Steamed rice cakes with lentil stew", "dietaryTags": ["veg", "jain"]}, {"id": "9d06ff23-2d10-4ea8-8c4d-51d89ce33a93", "name": "Hummus & Pita", "imageUrl": "", "description": "Chickpea dip with bread", "dietaryTags": ["veg", "jain"]}], "category": "Appetizers & Starters"}, {"items": [{"id": "1e4e3be5-9510-415c-ba25-8fda5966fefd", "name": "Dal Makhani", "imageUrl": "", "description": "Slow-cooked black lentils with butter", "dietaryTags": ["veg"]}, {"id": "d5623205-1490-4050-9f31-33e419ce1457", "name": "Korma Vegetables", "imageUrl": "", "description": "Slow cooked vegetable korma", "dietaryTags": ["veg"]}], "category": "Main Course Selection"}, {"items": [{"id": "a4b0dfc6-79ad-4d25-9db0-e6874ec6647c", "name": "Pulao Rice", "imageUrl": "", "description": "Fragrant saffron rice", "dietaryTags": ["veg"]}, {"id": "c18a77e9-6601-4510-ae81-36c7b34b3264", "name": "Jeera Rice", "imageUrl": "", "description": "Cumin tempered basmati rice", "dietaryTags": ["veg", "jain"]}], "category": "Accompaniments"}, {"items": [{"id": "a03e1823-b686-46cd-abe1-8f029c7b4ae8", "name": "Tiramisu", "imageUrl": "", "description": "Coffee mascarpone dessert", "dietaryTags": ["veg"]}], "category": "The Grand Finale (Desserts)"}], "chefsNotes": "This menu has been architected with a focus on seasonal integrity and visual drama. We''ve ensured a balance of textures and temperatures to provide a continuous culinary journey.", "winePairing": "To complement these flavors, we suggest a full-bodied red for the mains and a crisp, aromatic white for the starters.", "cuisineRegion": "Any / Mix", "vibeDescription": "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80&w=1200", "eventDescription": "A wedding curated exclusively for our guest of honor. This classic and delightful selection celebrates the vibrant heritage of Any / Mix cuisine, tailored for an intimate gathering of 50 guests."}', '', '', '50', '2026-01-31'),
	('94ea9b98-5e2e-44b6-a6dd-6d46abc6d1c8', '2026-01-31 05:40:43.858713+00', 'b05e6032-4780-4e65-95e4-026e7edfc525', 'Classic and delightful Any / Mix Feast', '{"title": "Classic and delightful Any / Mix Feast", "sections": [{"items": [{"id": "48555855-14c5-4825-a8d6-12f579d2b1b7", "name": "Hara Bhara Kebab", "imageUrl": "", "description": "Spinach and green pea kebabs", "dietaryTags": ["veg"]}, {"id": "97ca47aa-1381-4750-82a9-df915086b2ff", "name": "Garlic Bread", "imageUrl": "", "description": "Toasted garlic baguette", "dietaryTags": ["veg"]}, {"id": "5e37aa61-148b-4ef3-9134-b6d0d2227877", "name": "Veg Seekh Kebab", "imageUrl": "", "description": "Minced vegetable skewers", "dietaryTags": ["veg"]}], "category": "Appetizers & Starters"}, {"items": [{"id": "d89f2a04-f19b-4a75-9c7c-79dff74ef978", "name": "Vegetable Biryani", "imageUrl": "", "description": "South-style spiced rice", "dietaryTags": ["veg"]}, {"id": "11add149-0ac5-42ad-a1e5-d455de7735ab", "name": "Vegetable Moussaka", "imageUrl": "", "description": "Layered baked vegetables", "dietaryTags": ["veg"]}], "category": "Main Course Selection"}, {"items": [{"id": "b0be5d80-39dd-4335-8403-ca97495c8360", "name": "Roomali Roti", "imageUrl": "", "description": "Thin handkerchief flatbread", "dietaryTags": ["veg"]}, {"id": "c18a77e9-6601-4510-ae81-36c7b34b3264", "name": "Jeera Rice", "imageUrl": "", "description": "Cumin tempered basmati rice", "dietaryTags": ["veg", "jain"]}], "category": "Accompaniments"}, {"items": [{"id": "9468238e-2f68-46dd-ad22-7922b137ec81", "name": "Gajar Halwa", "imageUrl": "", "description": "Slow cooked carrot pudding", "dietaryTags": ["veg"]}], "category": "The Grand Finale (Desserts)"}], "chefsNotes": "This menu has been architected with a focus on seasonal integrity and visual drama. We''ve ensured a balance of textures and temperatures to provide a continuous culinary journey.", "winePairing": "To complement these flavors, we suggest a full-bodied red for the mains and a crisp, aromatic white for the starters.", "cuisineRegion": "Any / Mix", "vibeDescription": "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80&w=1200", "eventDescription": "A wedding curated exclusively for <b>our guest of honor</b>. This classic and delightful selection celebrates the vibrant heritage of Any / Mix cuisine, tailored for an intimate gathering of 50 guests."}', '', '', '50', '2026-01-31'),
	('e79dcacf-d47b-4125-854e-4a22542935e0', '2026-01-31 05:44:30.151951+00', 'b05e6032-4780-4e65-95e4-026e7edfc525', 'Classic and delightful Any / Mix Feast', '{"title": "Classic and delightful Any / Mix Feast", "sections": [{"items": [{"id": "a9082d03-4a49-46b7-a6f0-8e4a5167fa99", "name": "Chef''s Signature Selection", "imageUrl": "", "description": "A freshly curated seasonal creation based on your event theme.", "dietaryTags": ["Veg"]}, {"id": "9d06ff23-2d10-4ea8-8c4d-51d89ce33a93", "name": "Hummus & Pita", "imageUrl": "", "description": "Chickpea dip with bread", "dietaryTags": ["veg", "jain"]}, {"id": "b83c6a83-d3db-4cad-a772-73818d0a1a1e", "name": "Paneer Tikka", "imageUrl": "", "description": "Char-grilled cottage cheese with spices", "dietaryTags": ["veg"]}], "category": "Appetizers & Starters"}, {"items": [{"id": "1e4e3be5-9510-415c-ba25-8fda5966fefd", "name": "Dal Makhani", "imageUrl": "", "description": "Slow-cooked black lentils with butter", "dietaryTags": ["veg"]}, {"id": "48776b11-5ac1-48d3-8c78-47027f68276e", "name": "Grilled Vegetables", "imageUrl": "", "description": "Seasonal grilled vegetables", "dietaryTags": ["veg"]}], "category": "Main Course Selection"}, {"items": [{"id": "b0be5d80-39dd-4335-8403-ca97495c8360", "name": "Roomali Roti", "imageUrl": "", "description": "Thin handkerchief flatbread", "dietaryTags": ["veg"]}, {"id": "84c7ab2d-2a15-4db0-a05e-83df030db766", "name": "Butter Naan", "imageUrl": "", "description": "Soft buttered flatbread", "dietaryTags": ["veg"]}], "category": "Accompaniments"}, {"items": [{"id": "9468238e-2f68-46dd-ad22-7922b137ec81", "name": "Gajar Halwa", "imageUrl": "", "description": "Slow cooked carrot pudding", "dietaryTags": ["veg"]}], "category": "The Grand Finale (Desserts)"}], "chefsNotes": "This menu has been architected with a focus on seasonal integrity and visual drama. We''ve ensured a balance of textures and temperatures to provide a continuous culinary journey.", "winePairing": "To complement these flavors, we suggest a full-bodied red for the mains and a crisp, aromatic white for the starters.", "cuisineRegion": "Any / Mix", "vibeDescription": "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80&w=1200", "eventDescription": "A wedding curated exclusively for <b>our guest of honor</b>. This classic and delightful selection celebrates the vibrant heritage of Any / Mix cuisine, tailored for an intimate gathering of 50 guests."}', '', '', '50', '2026-01-31');


--
-- Data for Name: profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."profiles" ("id", "role", "email") VALUES
	('b05e6032-4780-4e65-95e4-026e7edfc525', 'admin', 'pattabhidp@gmail.com'),
	('708686cd-de2f-4ba0-8b9d-908558ae7bd6', 'admin', 'admin@gourmet.com'),
	('f51d40d2-fc63-4c7f-b7cc-5f9ef1272fb6', 'staff', 'staff@gourmet.com');


--
-- PostgreSQL database dump complete
--

-- \unrestrict W5QosuDzhMXa1MnsUlrPLP9GemkP0rHLSXQKF1acvMsvjE0cTfyYFIUOQteNhcp

RESET ALL;
