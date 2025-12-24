import Header from './components/Header';
import Hero from './components/Hero';
import ProductGrid from './components/ProductGrid';
import Footer from './components/Footer';
import { getProducts } from './lib/api';

export default async function Home() {
  let products = [];
  try {
    const data = await getProducts();
    products = data.data || [];
  } catch (error) {
    console.error('Failed to fetch products:', error);
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <ProductGrid products={products} />
      </main>
      <Footer />
    </div>
  );
}
