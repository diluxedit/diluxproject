import {Check, Info, X} from 'lucide-react';
import {useEffect, useState} from 'react';
import {useSearchParams} from 'react-router-dom';
import {Button} from '../components/Button';
import {ProductCard} from '../components/Cards';
import {PageHead} from '../components/PageHead';
import {SafeImage} from '../components/SafeImage';
import {useFirebase} from '../context/FirebaseContext';
import {useLanguage} from '../context/LanguageContext';
import type {ProductCategory, ProductItem} from '../types';
import {filterProductsByCategory} from '../utils/filters';

const PRODUCT_CATEGORIES: {value: ProductCategory | 'All'; idLabel: string; enLabel: string}[] = [
  {value: 'All', idLabel: 'Semua', enLabel: 'All'},
  {value: 'Software', idLabel: 'Perangkat Lunak', enLabel: 'Software'},
  {value: 'Web Applications', idLabel: 'Aplikasi Web', enLabel: 'Web Applications'},
  {value: 'Digital Tools', idLabel: 'Perangkat Digital', enLabel: 'Digital Tools'},
  {value: 'Technology Products', idLabel: 'Produk Teknologi', enLabel: 'Technology Products'},
];

export function ProductsPage() {
  const {language, t, localize} = useLanguage();
  const {products} = useFirebase();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState<ProductCategory | 'All'>('All');
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);

  useEffect(() => {
    const itemSlug = searchParams.get('item');
    if (itemSlug) {
      const match = products.find((p) => p.slug === itemSlug);
      if (match) {
        setSelectedProduct(match);
      }
    }
  }, [searchParams, products]);

  const filteredProducts = filterProductsByCategory(products, activeCategory);

  const closeDetail = () => {
    setSelectedProduct(null);
    if (searchParams.has('item')) {
      searchParams.delete('item');
      setSearchParams(searchParams, {replace: true});
    }
  };

  return (
    <>
      <PageHead title={t.products.pageTitle} description={t.products.pageDescription} />

      <section className="bg-[#0B1428] text-white py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-wider text-[#60A5FA] mb-3">
            {t.products.headerKicker}
          </p>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight max-w-3xl">
            {t.products.headerTitle}
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
            {t.products.headerSubtitle}
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-[#F1F5F9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 rounded-xl bg-white border border-slate-200 p-4 sm:p-5 flex items-start gap-3">
            <Info className="w-5 h-5 text-[#2563EB] shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-sm text-[#0F172A] leading-relaxed">{t.products.demoBanner}</p>
          </div>

          <div
            role="group"
            aria-label="Product categories"
            className="inline-flex flex-wrap items-center gap-1.5 p-1.5 bg-white border border-slate-200 rounded-xl mb-8"
          >
            {PRODUCT_CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                type="button"
                onClick={() => setActiveCategory(cat.value)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  activeCategory === cat.value
                    ? 'bg-[#0B1428] text-white'
                    : 'text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                {language === 'id' ? cat.idLabel : cat.enLabel}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={(item) => setSelectedProduct(item)}
              />
            ))}
          </div>
        </div>
      </section>

      {selectedProduct && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="product-detail-title"
          className="fixed inset-0 z-50 bg-[#0B1428]/70 flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-xl border border-slate-200 max-w-2xl w-full overflow-hidden shadow-xl max-h-[90vh] flex flex-col">
            <div className="aspect-[16/9] w-full overflow-hidden bg-[#0B1428] relative shrink-0">
              <SafeImage
                src={selectedProduct.image}
                alt={localize(selectedProduct.imageAlt)}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={closeDetail}
                aria-label={t.products.closeDetail}
                className="absolute top-4 right-4 w-9 h-9 rounded-lg bg-white/95 text-[#0F172A] flex items-center justify-center hover:bg-white cursor-pointer"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            <div className="p-6 sm:p-8 overflow-y-auto">
              <div className="flex flex-wrap items-center gap-2 text-xs text-[#64748B] mb-2">
                {selectedProduct.isDemo && (
                  <>
                    <span className="font-semibold text-[#2563EB]">{t.common.demoLabel}</span>
                    <span aria-hidden="true">·</span>
                  </>
                )}
                <span>{localize(selectedProduct.categoryLabel)}</span>
                <span aria-hidden="true">·</span>
                <span>{localize(selectedProduct.status)}</span>
              </div>

              <h2
                id="product-detail-title"
                className="font-display text-2xl font-bold text-[#0F172A]"
              >
                {selectedProduct.name}
              </h2>

              <p className="mt-3 text-sm sm:text-base text-[#64748B] leading-relaxed">
                {localize(selectedProduct.fullDescription)}
              </p>

              <div className="mt-6 pt-5 border-t border-slate-100">
                <h3 className="text-xs font-semibold tracking-wider text-[#0F172A] mb-3">
                  {t.products.capabilitiesTitle}
                </h3>
                <ul className="space-y-2">
                  {selectedProduct.capabilities[language].map((cap) => (
                    <li key={cap} className="flex items-start gap-2.5 text-sm text-[#0F172A]">
                      <Check className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" aria-hidden="true" />
                      <span>{cap}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-7 flex flex-wrap items-center justify-end gap-3">
                <Button variant="outline" onClick={closeDetail}>
                  {t.products.closeDetail}
                </Button>
                <Button
                  to={`/contact?subject=${encodeURIComponent(selectedProduct.name)}`}
                  variant="primary"
                >
                  {t.products.inquireProduct}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
