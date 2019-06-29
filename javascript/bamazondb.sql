ALTER USER 'root'@'localhost' IDENTIFIED
WITH mysql_native_password BY 'bamazon1';
DROP DATABASE IF EXISTS bamazon_db;
CREATE DATABASE bamazon_db;
USE bamazon_db;
CREATE TABLE products
(
    id INT
    AUTO_INCREMENT NOT NULL,
product_name VARCHAR
    (30) NOT NULL,
department_name VARCHAR
    (30) NOT NULL,
price DECIMAL
    (10,2) NOT NULL,
stock_quantity INT
    (10) NOT NULL,
PRIMARY KEY
    (id)
);
    INSERT INTO products
        (product_name, department_name, price, stock_quantity)
    VALUES
        ("Doom", "Electronics", 60.00, 100),
        ("Halo 5", "Electronics", 20.00, 200),
        ("Danner Boots", "Clothing", 100.00, 50),
        ("Levi Pants", "Clothing", 40.00, 110),
        ("Eggs", "Food", 8.00, 135),
        ("Milk", "Food", 5.50, 56),
        ("40in TV", "Electronics", 300.00, 10),
        ("60in OLED TV", "Electronics", 900.00, 2),
        ("Tool Set", "Tools/Hardware", 100.00, 37),
        ("Pillows", "Home", 5.00, 80);