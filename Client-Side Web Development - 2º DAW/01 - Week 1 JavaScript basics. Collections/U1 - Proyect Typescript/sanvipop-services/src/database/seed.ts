import { MikroORM } from '@mikro-orm/sql';
import bcrypt from 'bcrypt';
import config from '../config/database.config.js';
import { User } from '../modules/users/entities/user.entity.js';
import { Category } from '../modules/categories/entities/category.entity.js';
import { Product, ProductStatus } from '../modules/products/entities/product.entity.js';
import { ProductPhoto } from '../modules/products/entities/product-photo.entity.js';
import { ProductBookmark } from '../modules/products/entities/product-bookmark.entity.js';
import { Transaction } from '../modules/transactions/entities/transaction.entity.js';

async function runSeed() {
  const orm = await MikroORM.init({
    ...config,
    debug: false,
  });

  try {
    await orm.schema.update();

    const em = orm.em.fork();

    await em.transactional(async (forkEm) => {
      // 1. Limpieza de datos existentes en orden seguro por restricciones de clave foránea
      await forkEm.nativeDelete(ProductBookmark, {});
      await forkEm.nativeDelete(Transaction, {});
      await forkEm.qb(Product).update({ mainPhoto: null }).execute();
      await forkEm.nativeDelete(ProductPhoto, {});
      await forkEm.nativeDelete(Product, {});
      await forkEm.nativeDelete(User, {});
      await forkEm.nativeDelete(Category, {});

      // 2. Categorías oficiales
      const categoriesData = [
        { id: 1, name: 'Informática' },
        { id: 2, name: 'Telefonía' },
        { id: 3, name: 'Hogar' },
        { id: 4, name: 'Deportes' },
        { id: 5, name: 'Motor' },
        { id: 6, name: 'Moda' },
        { id: 7, name: 'Juegos' },
        { id: 8, name: 'Otros' },
      ];
      const categories = categoriesData.map((cat) => forkEm.create(Category, cat));

      // 3. Usuarios de prueba con contraseña encriptada (Password123!)
      const defaultPassword = await bcrypt.hash('Password123!', 10);

      const user1 = forkEm.create(User, {
        name: 'Arturo García',
        email: 'arturo@sanvipop.es',
        password: defaultPassword,
        lat: 38.3965,
        lng: -0.5255,
        role: 1,
        photo: 'img/users/arturo.jpg',
      });

      const user2 = forkEm.create(User, {
        name: 'María Gómez',
        email: 'maria@sanvipop.es',
        password: defaultPassword,
        lat: 38.3900,
        lng: -0.5100,
        role: 1,
        photo: 'img/users/maria.jpg',
      });

      const user3 = forkEm.create(User, {
        name: 'Carlos López',
        email: 'carlos@sanvipop.es',
        password: defaultPassword,
        lat: 38.4100,
        lng: -0.5300,
        role: 1,
        photo: 'img/users/carlos.jpg',
      });

      // 4. Productos de ejemplo
      const p1 = forkEm.create(Product, {
        title: 'Bicicleta de montaña Rockrider',
        description: 'Bicicleta de montaña en perfecto estado, talla M, ruedas 29 pulgadas, frenos de disco hidráulicos.',
        price: 150.0,
        category: categories[3], // Deportes
        owner: user2,
        status: ProductStatus.AVAILABLE,
        numVisits: 24,
      });

      const p2 = forkEm.create(Product, {
        title: 'iPhone 13 Pro 128GB',
        description: 'iPhone 13 Pro color azul grafito, 128GB, pantalla intacta, salud de batería al 87%. Incluye caja original.',
        price: 450.0,
        category: categories[1], // Telefonía
        owner: user1,
        status: ProductStatus.AVAILABLE,
        numVisits: 68,
      });

      const p3 = forkEm.create(Product, {
        title: 'Portátil Lenovo ThinkPad T14',
        description: 'Intel Core i5, 16GB RAM, 512GB SSD NVMe, pantalla 14 pulgadas FHD. Perfecto para programación o teletrabajo.',
        price: 380.0,
        category: categories[0], // Informática
        owner: user2,
        status: ProductStatus.AVAILABLE,
        numVisits: 45,
      });

      const p4 = forkEm.create(Product, {
        title: 'Sofá chaise longue gris',
        description: 'Sofá chaise longue de 3 plazas, tela antimanchas color gris marengo, asientos deslizantes y reclinables.',
        price: 200.0,
        category: categories[2], // Hogar
        owner: user3,
        status: ProductStatus.AVAILABLE,
        numVisits: 15,
      });

      const p5 = forkEm.create(Product, {
        title: 'Nintendo Switch OLED',
        description: 'Nintendo Switch modelo OLED blanca, muy poco uso. Incluye cable HDMI, adaptador de corriente y juego Mario Kart 8 Deluxe.',
        price: 220.0,
        category: categories[6], // Juegos
        owner: user1,
        status: ProductStatus.AVAILABLE,
        numVisits: 52,
      });

      const p6 = forkEm.create(Product, {
        title: 'Casco de moto MT Helmets',
        description: 'Casco integral MT Helmets talla L, diseño negro mate, visera transparente anti-vaho y pantalla solar integrada.',
        price: 65.0,
        category: categories[4], // Motor
        owner: user3,
        status: ProductStatus.AVAILABLE,
        numVisits: 9,
      });

      const p7 = forkEm.create(Product, {
        title: 'Chaqueta de cuero vintage',
        description: 'Chaqueta de cuero auténtico estilo motero, color marrón envejecido, talla L. Forro interior abrigado y en perfecto estado.',
        price: 45.0,
        category: categories[5], // Moda
        owner: user2,
        status: ProductStatus.AVAILABLE,
        numVisits: 18,
      });

      const p8 = forkEm.create(Product, {
        title: 'Monitor Gaming 27 pulgadas 144Hz',
        description: 'Monitor IPS 27" 144Hz 1ms, resolución 1080p, soporte regulable en altura, puertos HDMI y DisplayPort.',
        price: 130.0,
        category: categories[0], // Informática
        owner: user3,
        status: ProductStatus.SOLD,
        soldTo: user1,
        numVisits: 31,
      });

      // 5. Fotos de productos y foto principal
      const products = [p1, p2, p3, p4, p5, p6, p7, p8];
      products.forEach((prod, index) => {
        const photo = forkEm.create(ProductPhoto, {
          url: `img/products/product-${index + 1}.jpg`,
          product: prod,
        });
        prod.mainPhoto = photo;
        prod.photos.add(photo);
      });

      // 6. Favorito de ejemplo (Arturo guarda la bicicleta de María)
      forkEm.create(ProductBookmark, {
        user: user1,
        product: p1,
      });

      // 7. Transacción completada con valoraciones para el producto vendido
      forkEm.create(Transaction, {
        product: p8,
        seller: user3,
        buyer: user1,
        sellerRating: 5,
        buyerRating: 5,
        sellerComment: 'Comprador muy puntual y atento durante la entrega.',
        buyerComment: 'El monitor funciona genial, tal y como se describía. ¡Vendedor totalmente recomendado!',
      });
    });

    console.log('✅ Base de datos sembrada correctamente.');
    console.log('--------------------------------------------------');
    console.log('Usuarios de prueba disponibles (Contraseña: Password123!):');
    console.log('  1. arturo@sanvipop.es (San Vicente del Raspeig)');
    console.log('  2. maria@sanvipop.es  (Alicante)');
    console.log('  3. carlos@sanvipop.es (San Vicente Centro)');
    console.log('--------------------------------------------------');
  } catch (error) {
    console.error('❌ Error al sembrar la base de datos:', error);
    process.exit(1);
  } finally {
    await orm.close();
  }
}

runSeed();
