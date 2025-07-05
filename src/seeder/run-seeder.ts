import AppDataSource from '../data-source';
import seed from './index';

async function runSeed() {
  try {
    await AppDataSource.initialize();
    console.log('📦 Database connected');

    await seed(AppDataSource);

    await AppDataSource.destroy();
    console.log('✅ Seeder selesai');
  } catch (error) {
    console.error('❌ Gagal jalankan seeder:', error);
    process.exit(1);
  }
}

runSeed();
