import { DataSource } from 'typeorm';
import { Product } from '../entity/product.entity';

async function seed(appDataSource: DataSource) {
  const productRepository = appDataSource.getRepository(Product);

  // Contoh: Tambahkan beberapa produk
  const products = [
    { name: 'Mie Goreng', price: 20000 },
    { name: 'Nasi Putih', price: 5000 },
    { name: 'Ayam Goreng', price: 15000 },
  ];

  const savedProducts = await productRepository.save(products);
  console.log(`✅ Seeded ${savedProducts.length} products`);
}

export default seed;
