INSERT INTO games (title, description, esrb_rating, studio, price, quantity)
VALUES
    ('The Legend of Zelda', 'Adventure game', 'E', 'Nintendo', 59.99, 15),
    ('Halo Infinite', 'Sci-fi shooter', 'M', 'Microsoft', 69.99, 10),
    ('God of War', 'Action mythology game', 'M', 'Sony', 49.99, 8),
    ('Animal Crossing', 'Life simulation', 'E', 'Nintendo', 39.99, 20),
    ('Elden Ring', 'Fantasy RPG', 'M', 'FromSoftware', 59.99, 12);

INSERT INTO tshirts (size, color, description, price, quantity) VALUES
                                                                    ('M', 'Black', 'Logo tee', 19.99, 25),
                                                                    ('L', 'White', 'Retro gaming tee', 24.99, 10),
                                                                    ('S', 'Red', 'Limited edition tee', 29.99, 5);

INSERT INTO consoles (model, manufacturer, memory_amount, processor, price, quantity)
VALUES
    ('PlayStation 5', 'Sony', '16GB', 'AMD Zen 2', 499.99, 12),
    ('Xbox Series X', 'Microsoft', '16GB', 'AMD Zen 2', 499.99, 10),
    ('Nintendo Switch', 'Nintendo', '4GB', 'NVIDIA Tegra X1', 299.99, 20),
    ('PlayStation 4', 'Sony', '8GB', 'AMD Jaguar', 299.99, 8),
    ('Xbox One S', 'Microsoft', '8GB', 'AMD Jaguar', 249.99, 6);

INSERT INTO tax (state, rate) VALUES
                                  ('NJ', 0.06625),
                                  ('NY', 0.08875);

INSERT INTO fee (product_type, fee) VALUES
                                        ('Game', 1.49),
                                        ('Console', 14.99),
                                        ('T-Shirt', 1.98);