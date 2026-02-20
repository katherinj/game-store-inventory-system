INSERT INTO games (title, description, esrb_rating, studio, price, quantity)
VALUES
    ('Cyberpunk 2077', 'Futuristic RPG', 'M', 'CD Projekt', 59.99, 2),
    ('Call of Duty MW3', 'Modern military shooter', 'M', 'Activision', 69.99, 1),
    ('Minecraft', 'Sandbox building game', 'E', 'Mojang', 29.99, 50),
    ('Fortnite Deluxe', 'Battle Royale', 'T', 'Epic Games', 39.99, 0), -- OUT OF STOCK
    ('Red Dead Redemption 2', 'Western adventure', 'M', 'Rockstar', 59.99, 3),
    ('Grand Theft Auto V', 'Crime sandbox', 'M', 'Rockstar', 39.99, 100);

INSERT INTO tshirts (size, color, description, price, quantity)
VALUES
    ('XL', 'Blue', 'Vintage gamer tee', 21.99, 40),
    ('M', 'Green', 'Pixel art shirt', 18.99, 12),
    ('L', 'Black', 'Console logo shirt', 22.99, 9),
    ('S', 'Purple', 'Retro arcade tee', 25.99, 2),
    ('XL', 'White', 'Limited drop tee', 35.99, 1);

INSERT INTO consoles (model, manufacturer, memory_amount, processor, price, quantity)
VALUES
    ('Gaming PC Ultimate', 'Custom Build', '32GB', 'Intel i9', 1200.00, 5),
    ('Steam Deck', 'Valve', '16GB', 'AMD APU', 649.99, 4),
    ('PlayStation 5 Pro', 'Sony', '32GB', 'AMD Zen 3', 799.99, 2),
    ('Xbox Series X Elite', 'Microsoft', '32GB', 'AMD Zen 3', 899.99, 3),
    ('Nintendo Switch Lite', 'Nintendo', '4GB', 'NVIDIA Tegra X1', 199.99, 30);

INSERT INTO tax (state, rate) VALUES
                                  ('AL', 0.04),
                                  ('AK', 0.00),
                                  ('AZ', 0.056),
                                  ('AR', 0.065),
                                  ('CA', 0.0725),
                                  ('CO', 0.029),
                                  ('CT', 0.0635),
                                  ('DE', 0.00),
                                  ('FL', 0.06),
                                  ('GA', 0.04),
                                  ('HI', 0.04),
                                  ('ID', 0.06),
                                  ('IL', 0.0625),
                                  ('IN', 0.07),
                                  ('IA', 0.06),
                                  ('KS', 0.065),
                                  ('KY', 0.06),
                                  ('LA', 0.0445),
                                  ('ME', 0.055),
                                  ('MD', 0.06),
                                  ('MA', 0.0625),
                                  ('MI', 0.06),
                                  ('MN', 0.06875),
                                  ('MS', 0.07),
                                  ('MO', 0.04225),
                                  ('MT', 0.00),
                                  ('NE', 0.055),
                                  ('NV', 0.0685),
                                  ('NH', 0.00),
                                  ('NJ', 0.06625),
                                  ('NM', 0.05125),
                                  ('NY', 0.08875),
                                  ('NC', 0.0475),
                                  ('ND', 0.05),
                                  ('OH', 0.0575),
                                  ('OK', 0.045),
                                  ('OR', 0.00),
                                  ('PA', 0.06),
                                  ('RI', 0.07),
                                  ('SC', 0.06),
                                  ('SD', 0.045),
                                  ('TN', 0.07),
                                  ('TX', 0.0625),
                                  ('UT', 0.0485),
                                  ('VT', 0.06),
                                  ('VA', 0.053),
                                  ('WA', 0.065),
                                  ('WV', 0.06),
                                  ('WI', 0.05),
                                  ('WY', 0.04);

INSERT INTO fee (product_type, fee) VALUES
                                        ('Game', 1.49),
                                        ('Console', 14.99),
                                        ('T-Shirt', 1.98);