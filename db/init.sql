CREATE DATABASE IF NOT EXISTS tienda_ropa;
USE tienda_ropa;

CREATE TABLE IF NOT EXISTS productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion VARCHAR(255),
    precio DECIMAL(10,2) NOT NULL,
    stock INT NOT NULL
);

INSERT INTO productos (nombre, descripcion, precio, stock) VALUES
('Camiseta Algodón Premium', 'Algodón 100%, mangas cortas, varios colores', 9990, 25),
('Jeans Clásicos', 'Corte recto, tela denim azul', 24990, 12),
('Chaqueta Impermeable', 'Con capucha, resistente al agua, talla única', 35990, 8),
('Vestido Floral', 'Estampado flores, manga corta, algodón', 19990, 20),
('Zapatos Deportivos', 'Suela antideslizante, tallas 36-44', 29990, 15);
