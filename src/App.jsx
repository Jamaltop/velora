import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocalStorage } from './hooks/useLocalStorage';
import { PRODUCTS_DATA, INITIAL_ORDERS, FAQ_DATA, PROMO_CODES } from './data/storeData';
import StoreHeader, { MobileMenu } from './components/StoreHeader';
import CartDrawer from './components/CartDrawer';
import {
  Search, ShoppingBag, Heart, User, Menu, X, ChevronRight, ChevronDown,
  Plus, Minus, Trash2, ArrowRight, Check, Sun, Moon, Sparkles, ShieldCheck,
  Truck, RotateCcw, MapPin, Mail, Phone, Clock, Package, Star, Filter,
  SlidersHorizontal, ExternalLink, LogOut, CreditCard, Lock, Eye, ArrowLeft,
  CheckCircle2, AlertCircle, Info
} from 'lucide-react';

// ============================================================================
// 2. HELPER HOOKS & STORAGE UTILITIES
// ============================================================================

// ============================================================================
// 3. MAIN APPLICATION COMPONENT
// ============================================================================

export default function App() {
  // Inject Google Fonts & Custom Scrollbar/Overflow Guard
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  // Theme State
  const [darkMode, setDarkMode] = useLocalStorage('velora_theme_dark', false);

  // Navigation & Overlays
  const [activePage, setActivePage] = useState('home'); // home, shop, product, categories, wishlist, cart, checkout, account, orders, about, contact, faq
  const [selectedProductId, setSelectedProductId] = useState(PRODUCTS_DATA[0].id);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  // Catalog Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [maxPrice, setMaxPrice] = useState(1000);
  const [sortBy, setSortBy] = useState('featured');

  // Persistent Commerce State
  const [cart, setCart] = useLocalStorage('velora_cart', [
    {
      cartKey: 'vel-01-Oatmeal-M',
      id: 'vel-01',
      name: 'Structured Cashmere Overcoat',
      price: 890,
      color: 'Oatmeal',
      size: 'M',
      qty: 1,
      image: PRODUCTS_DATA[0].images[0]
    }
  ]);
  const [wishlist, setWishlist] = useLocalStorage('velora_wishlist', ['vel-02', 'vel-03']);
  const [recentlyViewed, setRecentlyViewed] = useLocalStorage('velora_recent', ['vel-01', 'vel-04', 'vel-06']);
  const [appliedPromo, setAppliedPromo] = useLocalStorage('velora_promo', '');

  // User & Orders State
  const [user, setUser] = useLocalStorage('velora_user', {
    isLoggedIn: true,
    name: 'Leyla Mammadova',
    email: 'leyla.m@velora-client.az',
    phone: '+994 50 555 0192',
    addresses: [
      { id: 'addr-1', label: 'Primary Residence', street: '14 Neftchilar Avenue, Apt 8', city: 'Baku', zip: 'AZ1000', country: 'Azerbaijan' },
      { id: 'addr-2', label: 'Design Studio', street: '28 Nizami Street, Floor 4', city: 'Baku', zip: 'AZ1005', country: 'Azerbaijan' }
    ]
  });
  const [orders, setOrders] = useLocalStorage('velora_orders', INITIAL_ORDERS);

  // Toast Notification Queue
  const [toasts, setToasts] = useState([]);
  const addToast = (message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3400);
  };

  // Navigate Helper
  const navigateTo = (page, options = {}) => {
    if (options.productId) {
      setSelectedProductId(options.productId);
      setRecentlyViewed((prev) => [options.productId, ...prev.filter((id) => id !== options.productId)].slice(0, 6));
    }
    if (options.category) {
      setSelectedCategory(options.category);
    }
    setActivePage(page);
    setMobileMenuOpen(false);
    setCartDrawerOpen(false);
    setMobileSearchOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cart Calculations
  const subtotal = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.qty, 0), [cart]);
  const promoObj = appliedPromo && PROMO_CODES[appliedPromo.toUpperCase()] ? PROMO_CODES[appliedPromo.toUpperCase()] : null;
  const discountAmount = promoObj ? Math.round(subtotal * promoObj.discount) : 0;
  const discountedSubtotal = Math.max(0, subtotal - discountAmount);
  const freeShippingThreshold = 250;
  const shippingCost = subtotal === 0 ? 0 : discountedSubtotal >= freeShippingThreshold ? 0 : 20;
  const orderTotal = discountedSubtotal + shippingCost;
  const totalCartItems = useMemo(() => cart.reduce((sum, item) => sum + item.qty, 0), [cart]);

  // Cart Actions
  const handleAddToCart = (product, color, size, qty = 1, openDrawer = true) => {
    const chosenColor = color || product.colors[0].name;
    const chosenSize = size || product.sizes[0];
    const cartKey = `${product.id}-${chosenColor}-${chosenSize}`;

    setCart((prev) => {
      const existing = prev.find((item) => item.cartKey === cartKey);
      if (existing) {
        return prev.map((item) => (item.cartKey === cartKey ? { ...item, qty: item.qty + qty } : item));
      }
      return [
        ...prev,
        {
          cartKey,
          id: product.id,
          name: product.name,
          price: product.price,
          color: chosenColor,
          size: chosenSize,
          qty,
          image: product.images[0]
        }
      ];
    });

    addToast(`Added ${product.name} to your bag`);
    if (openDrawer) setCartDrawerOpen(true);
  };

  const updateCartQty = (cartKey, delta) => {
    setCart((prev) =>
      prev
        .map((item) => (item.cartKey === cartKey ? { ...item, qty: Math.max(0, item.qty + delta) } : item))
        .filter((item) => item.qty > 0)
    );
  };

  const removeFromCart = (cartKey) => {
    setCart((prev) => prev.filter((item) => item.cartKey !== cartKey));
    addToast('Item removed from bag', 'info');
  };

  // Wishlist Action
  const toggleWishlist = (productId) => {
    const product = PRODUCTS_DATA.find((p) => p.id === productId);
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        addToast(`Removed ${product?.name || 'item'} from wishlist`, 'info');
        return prev.filter((id) => id !== productId);
      } else {
        addToast(`Saved ${product?.name || 'item'} to wishlist`);
        return [productId, ...prev];
      }
    });
  };

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return PRODUCTS_DATA.filter((p) => {
      const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
      const matchesPrice = p.price <= maxPrice;
      const q = searchQuery.trim().toLowerCase();
      const matchesQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.subtitle.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q);
      return matchesCat && matchesPrice && matchesQuery;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'popularity') return b.popularity - a.popularity;
      if (sortBy === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      return 0;
    });
  }, [selectedCategory, maxPrice, searchQuery, sortBy]);

  // Theme Classes
  const bgMain = darkMode ? 'bg-[#09090B] text-[#F4F4F5]' : 'bg-[#FAF9F6] text-[#18181B]';
  const bgCard = darkMode ? 'bg-[#18181B] border-[#27272A]' : 'bg-white border-[#E4E4E7]';
  const textMuted = darkMode ? 'text-[#A1A1AA]' : 'text-[#71717A]';
  const borderCol = darkMode ? 'border-[#27272A]' : 'border-[#E4E4E7]';

  return (
    <div
      className={`min-h-screen flex flex-col overflow-x-hidden transition-colors duration-300 ${bgMain}`}
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <style>{`
        .font-editorial { font-family: 'Cormorant Garamond', Georgia, serif; }
        /* Custom sleek scrollbar */
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(161, 161, 170, 0.35); border-radius: 9999px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(154, 52, 18, 0.7); }
      `}</style>

      <StoreHeader
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        activePage={activePage}
        navigateTo={navigateTo}
        setMobileMenuOpen={setMobileMenuOpen}
        setCartDrawerOpen={setCartDrawerOpen}
        setMobileSearchOpen={setMobileSearchOpen}
        mobileSearchOpen={mobileSearchOpen}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        wishlist={wishlist}
        totalCartItems={totalCartItems}
        textMuted={textMuted}
        borderCol={borderCol}
      />

      <MobileMenu
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        wishlist={wishlist}
        totalCartItems={totalCartItems}
        activePage={activePage}
        navigateTo={navigateTo}
        textMuted={textMuted}
        borderCol={borderCol}
      />

      {/* ====================================================================
          MOBILE NAVIGATION DRAWER
      ==================================================================== */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className={`fixed top-0 left-0 bottom-0 w-[85vw] max-w-[340px] z-50 flex flex-col justify-between p-6 overflow-y-auto ${
                darkMode ? 'bg-[#09090B] text-[#F4F4F5]' : 'bg-[#FAF9F6] text-[#18181B]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between pb-6 border-b border-current/10">
                  <span className="font-editorial text-2xl tracking-[0.2em] uppercase">VELORA</span>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="min-w-[44px] min-h-[44px] flex items-center justify-center -mr-2"
                    aria-label="Close Menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="mt-6 flex flex-col space-y-1">
                  {[
                    { id: 'home', label: 'Home' },
                    { id: 'shop', label: 'Shop All Objects' },
                    { id: 'categories', label: 'Collections & Departments' },
                    { id: 'wishlist', label: `Wishlist (${wishlist.length})` },
                    { id: 'cart', label: `Shopping Bag (${totalCartItems})` },
                    { id: 'account', label: 'Client Account' },
                    { id: 'orders', label: 'Order History' },
                    { id: 'about', label: 'About the Atelier' },
                    { id: 'contact', label: 'Contact & Concierge' },
                    { id: 'faq', label: 'FAQ & Client Care' }
                  ].map((link) => (
                    <button
                      key={link.id}
                      onClick={() => navigateTo(link.id)}
                      className={`min-h-[46px] px-3 rounded-lg flex items-center justify-between text-left text-sm tracking-wide transition ${
                        activePage === link.id
                          ? 'bg-[#9A3412]/10 text-[#9A3412] dark:text-[#EA580C] font-medium'
                          : 'hover:bg-black/5 dark:hover:bg-white/5'
                      }`}
                    >
                      <span>{link.label}</span>
                      <ChevronRight className="w-4 h-4 opacity-50" />
                    </button>
                  ))}
                </nav>
              </div>

              <div className="pt-6 border-t border-current/10 mt-6 space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className={textMuted}>Appearance</span>
                  <button
                    onClick={() => setDarkMode(!darkMode)}
                    className={`px-3 py-2 rounded-full border ${borderCol} flex items-center gap-2 text-xs`}
                  >
                    {darkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
                    {darkMode ? 'Alabaster Light' : 'Obsidian Dark'}
                  </button>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <CartDrawer
        isOpen={cartDrawerOpen}
        onClose={() => setCartDrawerOpen(false)}
        cart={cart}
        subtotal={subtotal}
        discountedSubtotal={discountedSubtotal}
        discountAmount={discountAmount}
        appliedPromo={appliedPromo}
        orderTotal={orderTotal}
        freeShippingThreshold={freeShippingThreshold}
        navigateTo={navigateTo}
        updateCartQty={updateCartQty}
        removeFromCart={removeFromCart}
        totalCartItems={totalCartItems}
        darkMode={darkMode}
        textMuted={textMuted}
        borderCol={borderCol}
      />

      {/* ====================================================================
          MAIN VIEWPORT ROUTER
      ==================================================================== */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={activePage + (activePage === 'product' ? selectedProductId : '')}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            {activePage === 'home' && (
              <HomeView
                products={PRODUCTS_DATA}
                navigateTo={navigateTo}
                handleAddToCart={handleAddToCart}
                wishlist={wishlist}
                toggleWishlist={toggleWishlist}
                darkMode={darkMode}
                bgCard={bgCard}
                textMuted={textMuted}
                borderCol={borderCol}
                addToast={addToast}
              />
            )}

            {activePage === 'shop' && (
              <ShopView
                products={filteredProducts}
                allProductsCount={PRODUCTS_DATA.length}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                maxPrice={maxPrice}
                setMaxPrice={setMaxPrice}
                sortBy={sortBy}
                setSortBy={setSortBy}
                navigateTo={navigateTo}
                handleAddToCart={handleAddToCart}
                wishlist={wishlist}
                toggleWishlist={toggleWishlist}
                bgCard={bgCard}
                textMuted={textMuted}
                borderCol={borderCol}
              />
            )}

            {activePage === 'product' && (
              <ProductDetailsView
                product={PRODUCTS_DATA.find((p) => p.id === selectedProductId) || PRODUCTS_DATA[0]}
                allProducts={PRODUCTS_DATA}
                recentlyViewedIds={recentlyViewed}
                navigateTo={navigateTo}
                handleAddToCart={handleAddToCart}
                wishlist={wishlist}
                toggleWishlist={toggleWishlist}
                bgCard={bgCard}
                textMuted={textMuted}
                borderCol={borderCol}
              />
            )}

            {activePage === 'categories' && (
              <CategoriesView
                products={PRODUCTS_DATA}
                navigateTo={navigateTo}
                bgCard={bgCard}
                textMuted={textMuted}
                borderCol={borderCol}
              />
            )}

            {activePage === 'wishlist' && (
              <WishlistView
                products={PRODUCTS_DATA.filter((p) => wishlist.includes(p.id))}
                toggleWishlist={toggleWishlist}
                handleAddToCart={handleAddToCart}
                navigateTo={navigateTo}
                bgCard={bgCard}
                textMuted={textMuted}
                borderCol={borderCol}
              />
            )}

            {activePage === 'cart' && (
              <CartPageView
                cart={cart}
                updateCartQty={updateCartQty}
                removeFromCart={removeFromCart}
                subtotal={subtotal}
                discountAmount={discountAmount}
                shippingCost={shippingCost}
                orderTotal={orderTotal}
                appliedPromo={appliedPromo}
                setAppliedPromo={setAppliedPromo}
                freeShippingThreshold={freeShippingThreshold}
                discountedSubtotal={discountedSubtotal}
                navigateTo={navigateTo}
                addToast={addToast}
                bgCard={bgCard}
                textMuted={textMuted}
                borderCol={borderCol}
              />
            )}

            {activePage === 'checkout' && (
              <CheckoutView
                cart={cart}
                setCart={setCart}
                subtotal={subtotal}
                discountAmount={discountAmount}
                shippingCost={shippingCost}
                orderTotal={orderTotal}
                appliedPromo={appliedPromo}
                setAppliedPromo={setAppliedPromo}
                user={user}
                setOrders={setOrders}
                navigateTo={navigateTo}
                addToast={addToast}
                bgCard={bgCard}
                textMuted={textMuted}
                borderCol={borderCol}
              />
            )}

            {activePage === 'account' && (
              <AccountView
                user={user}
                setUser={setUser}
                orders={orders}
                wishlistCount={wishlist.length}
                navigateTo={navigateTo}
                addToast={addToast}
                bgCard={bgCard}
                textMuted={textMuted}
                borderCol={borderCol}
              />
            )}

            {activePage === 'orders' && (
              <OrderHistoryView
                orders={orders}
                products={PRODUCTS_DATA}
                handleAddToCart={handleAddToCart}
                navigateTo={navigateTo}
                bgCard={bgCard}
                textMuted={textMuted}
                borderCol={borderCol}
              />
            )}

            {activePage === 'about' && (
              <AboutView
                navigateTo={navigateTo}
                bgCard={bgCard}
                textMuted={textMuted}
                borderCol={borderCol}
              />
            )}

            {activePage === 'contact' && (
              <ContactView
                addToast={addToast}
                bgCard={bgCard}
                textMuted={textMuted}
                borderCol={borderCol}
              />
            )}

            {activePage === 'faq' && (
              <FaqView
                navigateTo={navigateTo}
                bgCard={bgCard}
                textMuted={textMuted}
                borderCol={borderCol}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* ====================================================================
          EDITORIAL LUXURY FOOTER + DEVELOPER CREDIT
      ==================================================================== */}
      <footer className={`mt-24 border-t ${borderCol} ${darkMode ? 'bg-[#09090B]' : 'bg-[#F4F2ED]'}`}>
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-14 sm:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            <div>
              <span className="font-editorial text-2xl tracking-[0.22em] uppercase">VELORA</span>
              <p className={`mt-4 text-xs leading-relaxed max-w-xs ${textMuted}`}>
                Architectural silhouettes, vegetable-tanned leather goods, and botanical apothecary objects crafted for permanence.
              </p>
              <div className={`mt-5 flex items-center gap-2 text-xs ${textMuted}`}>
                <MapPin className="w-3.5 h-3.5 text-[#9A3412]" />
                <span>Baku • Milan • Tokyo</span>
              </div>
            </div>

            <div>
              <h4 className="text-xs uppercase tracking-[0.16em] font-semibold mb-4">Collections</h4>
              <ul className={`space-y-2.5 text-xs ${textMuted}`}>
                {['Apparel', 'Accessories', 'Home Objects', 'Fragrances'].map((cat) => (
                  <li key={cat}>
                    <button
                      onClick={() => navigateTo('shop', { category: cat })}
                      className="hover:text-[#9A3412] transition"
                    >
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs uppercase tracking-[0.16em] font-semibold mb-4">Client Services</h4>
              <ul className={`space-y-2.5 text-xs ${textMuted}`}>
                <li>
                  <button onClick={() => navigateTo('account')} className="hover:text-[#9A3412] transition">
                    Client Account
                  </button>
                </li>
                <li>
                  <button onClick={() => navigateTo('orders')} className="hover:text-[#9A3412] transition">
                    Track & Order History
                  </button>
                </li>
                <li>
                  <button onClick={() => navigateTo('faq')} className="hover:text-[#9A3412] transition">
                    Shipping, Returns & FAQ
                  </button>
                </li>
                <li>
                  <button onClick={() => navigateTo('contact')} className="hover:text-[#9A3412] transition">
                    Contact Concierge
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs uppercase tracking-[0.16em] font-semibold mb-4">The Atelier</h4>
              <ul className={`space-y-2.5 text-xs ${textMuted}`}>
                <li>
                  <button onClick={() => navigateTo('about')} className="hover:text-[#9A3412] transition">
                    Our Philosophy & Craft
                  </button>
                </li>
                <li>
                  <button onClick={() => navigateTo('wishlist')} className="hover:text-[#9A3412] transition">
                    Saved Wishlist ({wishlist.length})
                  </button>
                </li>
                <li>
                  <button onClick={() => navigateTo('cart')} className="hover:text-[#9A3412] transition">
                    Shopping Bag ({totalCartItems})
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className={`mt-12 pt-8 border-t ${borderCol} flex flex-col sm:flex-row items-center justify-between gap-4 text-xs ${textMuted}`}>
            <p>© {new Date().getFullYear()} VELORA Maison. All rights reserved.</p>
            <p>
              Designed &amp; Developed by{' '}
              <a
                href="https://jamalaliyev.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4 hover:text-[#9A3412] dark:hover:text-[#EA580C] transition font-medium"
              >
                Jamal Aliyev
              </a>
            </p>
          </div>
        </div>
      </footer>

      {/* ====================================================================
          TOAST NOTIFICATIONS
      ==================================================================== */}
      <div className="fixed bottom-4 right-4 left-4 sm:left-auto z-50 flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.96 }}
              className="pointer-events-auto sm:min-w-[300px] max-w-md bg-[#18181B] text-[#FAF9F6] border border-white/15 px-4 py-3.5 rounded-xs shadow-xl flex items-center gap-3 text-xs"
            >
              {t.type === 'error' ? (
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              )}
              <span className="flex-1 leading-snug">{t.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ============================================================================
// 4. REUSABLE PRODUCT CARD COMPONENT
// ============================================================================

function ProductCard({ product, navigateTo, handleAddToCart, isWishlisted, toggleWishlist, bgCard, textMuted, borderCol }) {
  return (
    <div className="group flex flex-col">
      <div className={`relative aspect-[4/5] overflow-hidden rounded-xs border ${borderCol} bg-zinc-200 dark:bg-zinc-900`}>
        <img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          onClick={() => navigateTo('product', { productId: product.id })}
          className="w-full h-full object-cover object-center cursor-pointer transition-transform duration-700 group-hover:scale-105"
        />

        {product.isNew && (
          <span className="absolute top-3 left-3 bg-[#18181B]/90 text-white text-[10px] tracking-[0.16em] uppercase px-2.5 py-1">
            New Arrival
          </span>
        )}

        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          aria-label="Toggle Wishlist"
          className="absolute top-2.5 right-2.5 w-9 h-9 rounded-full bg-white/85 dark:bg-zinc-900/85 backdrop-blur-xs flex items-center justify-center transition hover:scale-105"
        >
          <Heart
            className={`w-4 h-4 transition ${
              isWishlisted ? 'fill-[#9A3412] text-[#9A3412]' : 'text-zinc-700 dark:text-zinc-200'
            }`}
          />
        </button>

        {/* Quick Add Overlay */}
        <button
          onClick={() => handleAddToCart(product, product.colors[0].name, product.sizes[0], 1, true)}
          className="absolute bottom-3 left-3 right-3 min-h-[42px] bg-[#18181B]/95 text-white text-[11px] uppercase tracking-[0.15em] font-medium opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 hover:bg-[#9A3412]"
        >
          <Plus className="w-3.5 h-3.5" /> Quick Add
        </button>
      </div>

      <div className="pt-3.5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3
              onClick={() => navigateTo('product', { productId: product.id })}
              className="text-sm font-medium cursor-pointer hover:text-[#9A3412] transition line-clamp-1"
            >
              {product.name}
            </h3>
            <span className="text-sm font-semibold flex-shrink-0">${product.price}</span>
          </div>
          <p className={`text-xs mt-1 line-clamp-1 ${textMuted}`}>{product.subtitle}</p>
        </div>

        <div className="mt-2.5 flex items-center gap-1.5">
          {product.colors.map((c) => (
            <span
              key={c.name}
              title={c.name}
              className="w-3 h-3 rounded-full border border-black/20 dark:border-white/25"
              style={{ backgroundColor: c.hex }}
            />
          ))}
          <span className={`text-[11px] ml-1 ${textMuted}`}>{product.category}</span>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 5. PAGE 1: HOME VIEW
// ============================================================================

function HomeView({ products, navigateTo, handleAddToCart, wishlist, toggleWishlist, bgCard, textMuted, borderCol, addToast }) {
  const [email, setEmail] = useState('');

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      addToast('Please enter a valid email address', 'error');
      return;
    }
    addToast('Welcome to the VELORA Private Circle. Use code WELCOME20.');
    setEmail('');
  };

  return (
    <div>
      {/* Full-Bleed Editorial Hero */}
      <section className="relative min-h-[78vh] sm:min-h-[85vh] flex items-end overflow-hidden bg-zinc-900">
        <img
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1920&q=85"
          alt="VELORA Autumn Winter Editorial"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        <div className="relative z-10 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-10 pb-14 sm:pb-20 pt-28 text-white">
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-xs uppercase tracking-[0.24em] text-white/80 mb-3"
          >
            Collection 04 &mdash; Quiet Architecture
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-editorial text-4xl sm:text-6xl lg:text-7xl font-normal leading-[1.06] max-w-3xl"
          >
            Objects of Restraint &amp; Tactile Permanence.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 sm:mt-6 text-sm sm:text-base text-white/80 max-w-xl leading-relaxed"
          >
            Double-faced Italian cashmere, vegetable-tanned Tuscan leather, and small-batch botanical extracts crafted without compromise.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 flex flex-wrap gap-3.5"
          >
            <button
              onClick={() => navigateTo('shop')}
              className="min-h-[48px] px-7 bg-[#FAF9F6] text-[#18181B] hover:bg-[#9A3412] hover:text-white text-xs uppercase tracking-[0.16em] font-semibold transition flex items-center gap-2.5"
            >
              Explore Collection <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigateTo('about')}
              className="min-h-[48px] px-7 border border-white/40 hover:border-white text-white text-xs uppercase tracking-[0.16em] font-medium transition"
            >
              The Atelier Story
            </button>
          </motion.div>
        </div>
      </section>

      {/* Curated Featured Pieces */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 pt-16 sm:pt-24">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#9A3412] dark:text-[#EA580C] font-medium">
              Seasonal Curation
            </p>
            <h2 className="font-editorial text-3xl sm:text-4xl mt-1">Signature Editions</h2>
          </div>
          <button
            onClick={() => navigateTo('shop')}
            className="self-start sm:self-auto text-xs uppercase tracking-[0.15em] font-medium flex items-center gap-2 hover:text-[#9A3412] transition py-2"
          >
            View All 16 Pieces <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
          {products.slice(0, 4).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              navigateTo={navigateTo}
              handleAddToCart={handleAddToCart}
              isWishlisted={wishlist.includes(product.id)}
              toggleWishlist={toggleWishlist}
              bgCard={bgCard}
              textMuted={textMuted}
              borderCol={borderCol}
            />
          ))}
        </div>
      </section>

      {/* Visual Department Tiles */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 pt-20 sm:pt-28">
        <div className="mb-10">
          <p className="text-xs uppercase tracking-[0.2em] text-[#9A3412] dark:text-[#EA580C] font-medium">
            Departments
          </p>
          <h2 className="font-editorial text-3xl sm:text-4xl mt-1">Curated by Discipline</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            {
              name: 'Apparel',
              desc: 'Tailored wool, cashmere & silk',
              img: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=800&q=80'
            },
            {
              name: 'Accessories',
              desc: 'Tuscan leather & Swiss horology',
              img: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80'
            },
            {
              name: 'Home Objects',
              desc: 'Roman travertine, brass & flax',
              img: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80'
            },
            {
              name: 'Fragrances',
              desc: 'Botanical extraits & incense',
              img: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80'
            }
          ].map((dept) => (
            <div
              key={dept.name}
              onClick={() => navigateTo('shop', { category: dept.name })}
              className="group relative aspect-[3/4] overflow-hidden rounded-xs cursor-pointer bg-zinc-900"
            >
              <img
                src={dept.img}
                alt={dept.name}
                loading="lazy"
                className="w-full h-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 text-white">
                <h3 className="font-editorial text-2xl">{dept.name}</h3>
                <p className="text-xs text-white/75 mt-1">{dept.desc}</p>
                <span className="mt-3 inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.16em] border-b border-white/50 pb-0.5">
                  Browse <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Brand Philosophy Banner */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 pt-20 sm:pt-28">
        <div className={`border ${borderCol} ${bgCard} p-8 sm:p-12 lg:p-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center`}>
          <div className="lg:col-span-7 space-y-4">
            <span className="text-xs uppercase tracking-[0.2em] text-[#9A3412] dark:text-[#EA580C] font-semibold">
              Material Integrity
            </span>
            <h2 className="font-editorial text-3xl sm:text-5xl leading-tight">
              Designed to age with quiet dignity, never seasonal obsolescence.
            </h2>
            <p className={`text-sm leading-relaxed max-w-2xl ${textMuted}`}>
              Every VELORA piece is produced in numbered runs with family-owned mills in Biella, Florence, and Kyoto. We reject synthetic shortcuts in favor of natural fibers that develop character over decades.
            </p>
            <div className="pt-2 flex flex-wrap gap-6 text-xs">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#9A3412]" />
                <span>5-Year Craftsmanship Guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#9A3412]" />
                <span>Carbon-Neutral Express Courier</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-[#9A3412]" />
                <span>30-Day Effortless Returns</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className={`p-6 sm:p-8 border ${borderCol} bg-black/[0.02] dark:bg-white/[0.02]`}>
              <h3 className="font-editorial text-2xl">Join the Private Circle</h3>
              <p className={`text-xs mt-1.5 leading-relaxed ${textMuted}`}>
                Receive early access to numbered atelier releases and 20% off your inaugural order.
              </p>
              <form onSubmit={handleNewsletter} className="mt-5 space-y-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className={`w-full min-h-[46px] px-3.5 text-xs bg-transparent border ${borderCol} focus:outline-none focus:border-[#9A3412]`}
                />
                <button
                  type="submit"
                  className="w-full min-h-[46px] bg-[#18181B] dark:bg-[#F4F4F5] text-white dark:text-[#09090B] text-xs uppercase tracking-[0.16em] font-semibold hover:bg-[#9A3412] dark:hover:bg-[#EA580C] dark:hover:text-white transition"
                >
                  Request Invitation
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// ============================================================================
// 6. PAGE 2: SHOP CATALOG VIEW
// ============================================================================

function ShopView({
  products,
  allProductsCount,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  maxPrice,
  setMaxPrice,
  sortBy,
  setSortBy,
  navigateTo,
  handleAddToCart,
  wishlist,
  toggleWishlist,
  bgCard,
  textMuted,
  borderCol
}) {
  const categories = ['All', 'Apparel', 'Accessories', 'Home Objects', 'Fragrances'];

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 pt-10 sm:pt-14">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-current/10">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[#9A3412] dark:text-[#EA580C]">Complete Archive</p>
          <h1 className="font-editorial text-4xl sm:text-5xl mt-1">
            {selectedCategory === 'All' ? 'All Objects' : selectedCategory}
          </h1>
        </div>
        <p className={`text-xs ${textMuted}`}>
          Showing {products.length} of {allProductsCount} curated editions
        </p>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="py-6 space-y-4">
        <div className="flex flex-col lg:flex-row gap-4 justify-between">
          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`min-h-[40px] px-4 rounded-full text-xs tracking-wide whitespace-nowrap border transition ${
                  selectedCategory === cat
                    ? 'bg-[#18181B] text-white border-[#18181B] dark:bg-[#F4F4F5] dark:text-[#09090B] dark:border-[#F4F4F5]'
                    : `${borderCol} hover:border-[#9A3412]`
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search & Sort Controls */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className={`flex items-center px-3.5 min-h-[42px] border ${borderCol} ${bgCard} sm:w-64`}>
              <Search className={`w-4 h-4 mr-2 flex-shrink-0 ${textMuted}`} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter by keyword..."
                className="w-full bg-transparent text-xs focus:outline-none"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="text-xs opacity-60 hover:opacity-100">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort products"
              className={`min-h-[42px] px-3.5 text-xs border ${borderCol} ${bgCard} focus:outline-none`}
            >
              <option value="featured">Sort: Featured</option>
              <option value="popularity">Sort: Most Popular</option>
              <option value="newest">Sort: New Arrivals</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Price Range Slider */}
        <div className={`p-4 border ${borderCol} ${bgCard} flex flex-col sm:flex-row sm:items-center justify-between gap-4`}>
          <div className="flex items-center gap-3 flex-1">
            <SlidersHorizontal className="w-4 h-4 text-[#9A3412] flex-shrink-0" />
            <span className="text-xs font-medium whitespace-nowrap">Max Price: ${maxPrice}</span>
            <input
              type="range"
              min="100"
              max="1000"
              step="25"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full max-w-xs accent-[#9A3412] cursor-pointer"
            />
          </div>
          {(selectedCategory !== 'All' || maxPrice < 1000 || searchQuery) && (
            <button
              onClick={() => {
                setSelectedCategory('All');
                setMaxPrice(1000);
                setSearchQuery('');
              }}
              className="text-xs underline underline-offset-4 text-[#9A3412] self-start sm:self-auto"
            >
              Reset All Filters
            </button>
          )}
        </div>
      </div>

      {/* Product Grid or Empty State */}
      {products.length === 0 ? (
        <div className={`my-12 p-12 text-center border ${borderCol} ${bgCard}`}>
          <p className="font-editorial text-3xl mb-2">No matching pieces found</p>
          <p className={`text-xs mb-6 ${textMuted}`}>
            Try broadening your price ceiling or clearing active search terms.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setMaxPrice(1000);
              setSearchQuery('');
            }}
            className="min-h-[44px] px-6 bg-[#18181B] dark:bg-[#F4F4F5] text-white dark:text-[#09090B] text-xs uppercase tracking-[0.15em]"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10 mt-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              navigateTo={navigateTo}
              handleAddToCart={handleAddToCart}
              isWishlisted={wishlist.includes(product.id)}
              toggleWishlist={toggleWishlist}
              bgCard={bgCard}
              textMuted={textMuted}
              borderCol={borderCol}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 7. PAGE 3: PRODUCT DETAILS VIEW
// ============================================================================

function ProductDetailsView({
  product,
  allProducts,
  recentlyViewedIds,
  navigateTo,
  handleAddToCart,
  wishlist,
  toggleWishlist,
  bgCard,
  textMuted,
  borderCol
}) {
  const [activeImage, setActiveImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product.colors[0].name);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    setActiveImage(0);
    setSelectedColor(product.colors[0].name);
    setSelectedSize(product.sizes[0]);
    setQty(1);
  }, [product]);

  const isWishlisted = wishlist.includes(product.id);
  const recommendations = allProducts.filter((p) => p.id !== product.id && p.category === product.category).slice(0, 4);
  const recentProducts = recentlyViewedIds
    .filter((id) => id !== product.id)
    .map((id) => allProducts.find((p) => p.id === id))
    .filter(Boolean)
    .slice(0, 4);

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 pt-8 sm:pt-12">
      {/* Breadcrumb */}
      <button
        onClick={() => navigateTo('shop')}
        className={`inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] mb-6 hover:text-[#9A3412] transition ${textMuted}`}
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Catalog
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14">
        {/* Left: Image Gallery */}
        <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
          {product.images.length > 1 && (
            <div className="flex sm:flex-col gap-3 overflow-x-auto sm:w-20 flex-shrink-0">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`w-16 h-20 sm:w-20 sm:h-24 flex-shrink-0 overflow-hidden border-2 transition ${
                    activeImage === idx ? 'border-[#9A3412]' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          <div className={`flex-1 aspect-[4/5] overflow-hidden border ${borderCol} bg-zinc-200 dark:bg-zinc-900`}>
            <img
              src={product.images[activeImage] || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Right: Product Info & Controls */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-[0.18em] text-[#9A3412] dark:text-[#EA580C] font-medium">
                {product.category}
              </span>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                In Stock ({product.stock} pieces remaining)
              </span>
            </div>
            <h1 className="font-editorial text-3xl sm:text-4xl lg:text-5xl mt-2">{product.name}</h1>
            <p className={`text-sm mt-1.5 ${textMuted}`}>{product.subtitle}</p>
            <p className="text-2xl font-semibold mt-4">${product.price}</p>
          </div>

          {/* Color Selector */}
          <div className={`pt-5 border-t ${borderCol}`}>
            <span className="text-xs uppercase tracking-[0.14em] font-medium">
              Color: <span className={textMuted}>{selectedColor}</span>
            </span>
            <div className="flex flex-wrap gap-3 mt-3">
              {product.colors.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setSelectedColor(c.name)}
                  className={`min-h-[40px] px-3.5 border flex items-center gap-2.5 text-xs transition ${
                    selectedColor === c.name ? 'border-[#9A3412] font-semibold' : borderCol
                  }`}
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-black/20"
                    style={{ backgroundColor: c.hex }}
                  />
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Size Selector */}
          <div>
            <div className="flex justify-between items-center">
              <span className="text-xs uppercase tracking-[0.14em] font-medium">
                Edition / Size: <span className={textMuted}>{selectedSize}</span>
              </span>
            </div>
            <div className="flex flex-wrap gap-2.5 mt-3">
              {product.sizes.map((sz) => (
                <button
                  key={sz}
                  onClick={() => setSelectedSize(sz)}
                  className={`min-w-[48px] min-h-[44px] px-3.5 border text-xs transition ${
                    selectedSize === sz
                      ? 'bg-[#18181B] text-white border-[#18181B] dark:bg-[#F4F4F5] dark:text-[#09090B]'
                      : `${borderCol} hover:border-[#9A3412]`
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity & Add to Bag */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <div className={`inline-flex items-center justify-between border ${borderCol} min-h-[50px] sm:w-32`}>
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="w-11 h-12 flex items-center justify-center"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="text-sm font-medium">{qty}</span>
              <button
                onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                className="w-11 h-12 flex items-center justify-center"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={() => handleAddToCart(product, selectedColor, selectedSize, qty, true)}
              className="flex-1 min-h-[50px] bg-[#9A3412] hover:bg-[#7C2D12] text-white text-xs uppercase tracking-[0.16em] font-semibold transition flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" /> Add to Bag &mdash; ${product.price * qty}
            </button>

            <button
              onClick={() => toggleWishlist(product.id)}
              aria-label="Save to Wishlist"
              className={`min-w-[50px] min-h-[50px] border ${borderCol} flex items-center justify-center hover:border-[#9A3412] transition`}
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-[#9A3412] text-[#9A3412]' : ''}`} />
            </button>
          </div>

          {/* Tabbed Specifications */}
          <div className={`pt-6 border-t ${borderCol}`}>
            <div className={`flex gap-6 border-b ${borderCol}`}>
              {[
                { id: 'description', label: 'Description' },
                { id: 'materials', label: 'Materials & Care' },
                { id: 'shipping', label: 'Delivery' }
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`pb-3 text-xs uppercase tracking-[0.14em] border-b-2 transition ${
                    activeTab === t.id
                      ? 'border-[#9A3412] font-semibold'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <div className={`pt-4 text-xs leading-relaxed ${textMuted}`}>
              {activeTab === 'description' && <p>{product.description}</p>}
              {activeTab === 'materials' && <p>{product.materials}</p>}
              {activeTab === 'shipping' && <p>{product.shippingInfo}</p>}
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <section className="mt-20 pt-14 border-t border-current/10">
          <h2 className="font-editorial text-3xl mb-8">You May Also Appreciate</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendations.map((item) => (
              <ProductCard
                key={item.id}
                product={item}
                navigateTo={navigateTo}
                handleAddToCart={handleAddToCart}
                isWishlisted={wishlist.includes(item.id)}
                toggleWishlist={toggleWishlist}
                bgCard={bgCard}
                textMuted={textMuted}
                borderCol={borderCol}
              />
            ))}
          </div>
        </section>
      )}

      {/* Recently Viewed */}
      {recentProducts.length > 0 && (
        <section className="mt-16 pt-14 border-t border-current/10">
          <h2 className="font-editorial text-3xl mb-8">Recently Viewed</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {recentProducts.map((item) => (
              <ProductCard
                key={item.id}
                product={item}
                navigateTo={navigateTo}
                handleAddToCart={handleAddToCart}
                isWishlisted={wishlist.includes(item.id)}
                toggleWishlist={toggleWishlist}
                bgCard={bgCard}
                textMuted={textMuted}
                borderCol={borderCol}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

// ============================================================================
// 8. PAGE 4: CATEGORIES VIEW
// ============================================================================

function CategoriesView({ products, navigateTo, bgCard, textMuted, borderCol }) {
  const departments = [
    {
      name: 'Apparel',
      tagline: 'Architectural Silhouettes & Noble Fibers',
      description: 'Double-faced Italian cashmere outerwear, tropical-weight virgin wool tailoring, and 22-momme mulberry silk essentials.',
      image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=1200&q=85'
    },
    {
      name: 'Accessories',
      tagline: 'Tuscan Leathercraft & Swiss Horology',
      description: 'Vegetable-tanned calfskin totes, hand-loomed intrecciato cardholders, Japanese acetate frames, and minimalist chronographs.',
      image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1200&q=85'
    },
    {
      name: 'Home Objects',
      tagline: 'Sculptural Living & Tactile Warmth',
      description: 'Hand-turned Roman travertine vessels, unlacquered brass lighting, and stonewashed Belgian flax throws.',
      image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=85'
    },
    {
      name: 'Fragrances',
      tagline: 'Botanical Extraits & Olfactory Rituals',
      description: 'High-concentration extraits de parfum formulated around aged Assam oud, Australian sandalwood, and Calabrian bergamot.',
      image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1200&q=85'
    }
  ];

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 pt-10 sm:pt-14">
      <div className="max-w-2xl mb-12">
        <p className="text-xs uppercase tracking-[0.2em] text-[#9A3412] dark:text-[#EA580C]">Departments</p>
        <h1 className="font-editorial text-4xl sm:text-5xl mt-1">Collections</h1>
        <p className={`text-sm mt-3 leading-relaxed ${textMuted}`}>
          Explore our four core disciplines—each conceived with singular material honesty and enduring utility.
        </p>
      </div>

      <div className="space-y-10">
        {departments.map((dept, index) => {
          const count = products.filter((p) => p.category === dept.name).length;
          return (
            <div
              key={dept.name}
              className={`grid grid-cols-1 lg:grid-cols-12 border ${borderCol} ${bgCard} overflow-hidden`}
            >
              <div className={`lg:col-span-6 aspect-[16/10] lg:aspect-auto ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                <img src={dept.image} alt={dept.name} className="w-full h-full object-cover" />
              </div>
              <div className="lg:col-span-6 p-7 sm:p-12 flex flex-col justify-center">
                <span className="text-xs uppercase tracking-[0.18em] text-[#9A3412] dark:text-[#EA580C] font-medium">
                  {count} Editions Available
                </span>
                <h2 className="font-editorial text-3xl sm:text-4xl mt-2">{dept.name}</h2>
                <p className="text-sm font-medium mt-1">{dept.tagline}</p>
                <p className={`text-xs sm:text-sm mt-4 leading-relaxed ${textMuted}`}>{dept.description}</p>
                <div className="mt-7">
                  <button
                    onClick={() => navigateTo('shop', { category: dept.name })}
                    className="min-h-[46px] px-7 bg-[#18181B] dark:bg-[#F4F4F5] text-white dark:text-[#09090B] text-xs uppercase tracking-[0.16em] font-semibold hover:bg-[#9A3412] dark:hover:bg-[#EA580C] dark:hover:text-white transition inline-flex items-center gap-2"
                  >
                    Enter {dept.name} <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================================
// 9. PAGE 5: WISHLIST VIEW
// ============================================================================

function WishlistView({ products, toggleWishlist, handleAddToCart, navigateTo, bgCard, textMuted, borderCol }) {
  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 pt-10 sm:pt-14">
      <div className="pb-8 border-b border-current/10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[#9A3412] dark:text-[#EA580C]">Saved Selection</p>
          <h1 className="font-editorial text-4xl sm:text-5xl mt-1">Your Wishlist ({products.length})</h1>
        </div>
        <button
          onClick={() => navigateTo('shop')}
          className="text-xs uppercase tracking-[0.15em] underline underline-offset-4 self-start sm:self-auto"
        >
          Continue Exploring
        </button>
      </div>

      {products.length === 0 ? (
        <div className={`my-12 p-12 text-center border ${borderCol} ${bgCard}`}>
          <Heart className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <h2 className="font-editorial text-3xl">Your wishlist is currently empty</h2>
          <p className={`text-xs mt-2 mb-6 max-w-md mx-auto ${textMuted}`}>
            Save pieces you admire while browsing to revisit or move them effortlessly into your shopping bag.
          </p>
          <button
            onClick={() => navigateTo('shop')}
            className="min-h-[46px] px-7 bg-[#18181B] dark:bg-[#F4F4F5] text-white dark:text-[#09090B] text-xs uppercase tracking-[0.16em]"
          >
            Browse Catalog
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
          {products.map((product) => (
            <div key={product.id} className={`border ${borderCol} ${bgCard} flex flex-col`}>
              <div className="relative aspect-[4/5] overflow-hidden bg-zinc-200">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  onClick={() => navigateTo('product', { productId: product.id })}
                  className="w-full h-full object-cover cursor-pointer"
                />
                <button
                  onClick={() => toggleWishlist(product.id)}
                  aria-label="Remove from wishlist"
                  className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 text-zinc-900 flex items-center justify-center hover:bg-red-600 hover:text-white transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3
                    onClick={() => navigateTo('product', { productId: product.id })}
                    className="text-sm font-medium cursor-pointer hover:text-[#9A3412]"
                  >
                    {product.name}
                  </h3>
                  <p className="text-sm font-semibold mt-1">${product.price}</p>
                </div>
                <button
                  onClick={() => handleAddToCart(product, product.colors[0].name, product.sizes[0], 1, true)}
                  className="mt-4 w-full min-h-[42px] bg-[#18181B] dark:bg-[#F4F4F5] text-white dark:text-[#09090B] text-xs uppercase tracking-[0.14em] font-medium hover:bg-[#9A3412] dark:hover:bg-[#EA580C] dark:hover:text-white transition"
                >
                  Move to Bag
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 10. PAGE 6: FULL SHOPPING CART VIEW
// ============================================================================

function CartPageView({
  cart,
  updateCartQty,
  removeFromCart,
  subtotal,
  discountAmount,
  shippingCost,
  orderTotal,
  appliedPromo,
  setAppliedPromo,
  freeShippingThreshold,
  discountedSubtotal,
  navigateTo,
  addToast,
  bgCard,
  textMuted,
  borderCol
}) {
  const [promoInput, setPromoInput] = useState(appliedPromo);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    const code = promoInput.trim().toUpperCase();
    if (!code) return;
    if (PROMO_CODES[code]) {
      setAppliedPromo(code);
      addToast(`Applied privilege code ${code}: ${PROMO_CODES[code].label}`);
    } else {
      addToast('Invalid promo code. Try VELORA10 or WELCOME20', 'error');
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 pt-10 sm:pt-14">
      <h1 className="font-editorial text-4xl sm:text-5xl pb-6 border-b border-current/10">Shopping Bag</h1>

      {cart.length === 0 ? (
        <div className={`my-12 p-12 text-center border ${borderCol} ${bgCard}`}>
          <ShoppingBag className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <h2 className="font-editorial text-3xl">Your shopping bag is empty</h2>
          <p className={`text-xs mt-2 mb-6 ${textMuted}`}>
            Discover timeless wardrobe foundations and home objects in our catalog.
          </p>
          <button
            onClick={() => navigateTo('shop')}
            className="min-h-[46px] px-7 bg-[#18181B] dark:bg-[#F4F4F5] text-white dark:text-[#09090B] text-xs uppercase tracking-[0.16em]"
          >
            Explore Catalog
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-8">
          {/* Cart Items */}
          <div className="lg:col-span-8 space-y-5">
            {cart.map((item) => (
              <div key={item.cartKey} className={`p-4 sm:p-5 border ${borderCol} ${bgCard} flex gap-4 sm:gap-6`}>
                <img
                  src={item.image}
                  alt={item.name}
                  onClick={() => navigateTo('product', { productId: item.id })}
                  className="w-24 h-28 sm:w-28 sm:h-36 object-cover cursor-pointer flex-shrink-0"
                />
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <h3
                        onClick={() => navigateTo('product', { productId: item.id })}
                        className="font-editorial text-xl sm:text-2xl cursor-pointer hover:text-[#9A3412]"
                      >
                        {item.name}
                      </h3>
                      <button
                        onClick={() => removeFromCart(item.cartKey)}
                        className={`p-1.5 hover:text-red-600 transition ${textMuted}`}
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className={`text-xs mt-1 ${textMuted}`}>
                      Color: {item.color} &bull; Size: {item.size}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    <div className={`inline-flex items-center border ${borderCol}`}>
                      <button
                        onClick={() => updateCartQty(item.cartKey, -1)}
                        className="w-9 h-9 flex items-center justify-center"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-xs font-medium">{item.qty}</span>
                      <button
                        onClick={() => updateCartQty(item.cartKey, 1)}
                        className="w-9 h-9 flex items-center justify-center"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <span className="text-base font-semibold">${item.price * item.qty}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4">
            <div className={`p-6 border ${borderCol} ${bgCard} space-y-5`}>
              <h2 className="font-editorial text-2xl">Order Summary</h2>

              {/* Free Shipping Status */}
              <div className="text-xs">
                {discountedSubtotal >= freeShippingThreshold ? (
                  <p className="text-emerald-600 dark:text-emerald-400 font-medium">
                    ✓ You qualify for complimentary express shipping.
                  </p>
                ) : (
                  <p className={textMuted}>
                    Add <strong>${freeShippingThreshold - discountedSubtotal}</strong> for complimentary shipping.
                  </p>
                )}
              </div>

              {/* Promo Code Form */}
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <input
                  type="text"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  placeholder="Promo code (VELORA10)"
                  className={`flex-1 min-h-[42px] px-3 text-xs bg-transparent border ${borderCol} focus:outline-none`}
                />
                <button
                  type="submit"
                  className="px-4 min-h-[42px] border border-current text-xs uppercase tracking-wider font-medium hover:bg-[#9A3412] hover:border-[#9A3412] hover:text-white transition"
                >
                  Apply
                </button>
              </form>

              {appliedPromo && (
                <div className="flex items-center justify-between text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-2">
                  <span>Code {appliedPromo.toUpperCase()} active</span>
                  <button
                    onClick={() => {
                      setAppliedPromo('');
                      setPromoInput('');
                    }}
                    className="underline"
                  >
                    Remove
                  </button>
                </div>
              )}

              <div className={`space-y-2.5 pt-4 border-t ${borderCol} text-xs`}>
                <div className="flex justify-between">
                  <span className={textMuted}>Subtotal</span>
                  <span>${subtotal}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                    <span>Discount</span>
                    <span>-${discountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className={textMuted}>Express Courier</span>
                  <span>{shippingCost === 0 ? 'Complimentary' : `$${shippingCost}`}</span>
                </div>
                <div className={`flex justify-between text-base font-semibold pt-3 border-t ${borderCol}`}>
                  <span>Total</span>
                  <span>${orderTotal}</span>
                </div>
              </div>

              <button
                onClick={() => navigateTo('checkout')}
                className="w-full min-h-[50px] bg-[#9A3412] hover:bg-[#7C2D12] text-white text-xs uppercase tracking-[0.16em] font-semibold transition"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 11. PAGE 7: MULTI-STEP CHECKOUT VIEW (DEMO MODE)
// ============================================================================

function CheckoutView({
  cart,
  setCart,
  subtotal,
  discountAmount,
  shippingCost,
  orderTotal,
  appliedPromo,
  setAppliedPromo,
  user,
  setOrders,
  navigateTo,
  addToast,
  bgCard,
  textMuted,
  borderCol
}) {
  const [step, setStep] = useState(1); // 1: Details, 2: Payment Demo, 3: Confirmed
  const [customerName, setCustomerName] = useState(user.name || '');
  const [customerEmail, setCustomerEmail] = useState(user.email || '');
  const [selectedAddressId, setSelectedAddressId] = useState(user.addresses?.[0]?.id || 'custom');
  const [customStreet, setCustomStreet] = useState('14 Neftchilar Avenue, Apt 8');
  const [customCity, setCustomCity] = useState('Baku');
  const [customCountry, setCustomCountry] = useState('Azerbaijan');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  if (cart.length === 0 && step !== 3) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h1 className="font-editorial text-3xl mb-3">Your bag is empty</h1>
        <button
          onClick={() => navigateTo('shop')}
          className="min-h-[46px] px-7 bg-[#18181B] text-white text-xs uppercase tracking-[0.15em]"
        >
          Return to Catalog
        </button>
      </div>
    );
  }

  const resolvedAddress =
    selectedAddressId !== 'custom' && user.addresses?.find((a) => a.id === selectedAddressId)
      ? (() => {
          const a = user.addresses.find((addr) => addr.id === selectedAddressId);
          return `${a.street}, ${a.city} ${a.zip}, ${a.country}`;
        })()
      : `${customStreet}, ${customCity}, ${customCountry}`;

  const handleCompleteOrder = (e) => {
    e.preventDefault();
    const newOrder = {
      id: `VLR-${Math.floor(10000 + Math.random() * 90000)}`,
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      status: 'Confirmed — Preparing Dispatch',
      total: orderTotal,
      subtotal,
      discount: discountAmount,
      shipping: shippingCost,
      address: resolvedAddress,
      items: [...cart]
    };

    setOrders((prev) => [newOrder, ...prev]);
    setConfirmedOrder(newOrder);
    setCart([]);
    setAppliedPromo('');
    setStep(3);
    addToast(`Order ${newOrder.id} confirmed!`);
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10 pt-10 sm:pt-14">
      {/* Demo Environment Banner */}
      <div className="mb-8 p-3.5 border border-amber-600/40 bg-amber-500/10 flex items-center gap-3 text-xs">
        <Info className="w-4 h-4 text-amber-600 flex-shrink-0" />
        <span>
          <strong>Portfolio Interactive Demonstration:</strong> No real financial charges are processed. Completing checkout generates a persistent order record in your Order History.
        </span>
      </div>

      {step === 3 && confirmedOrder ? (
        <div className={`max-w-2xl mx-auto p-8 sm:p-12 border ${borderCol} ${bgCard} text-center space-y-5`}>
          <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
          <p className="text-xs uppercase tracking-[0.2em] text-[#9A3412]">Order Confirmed</p>
          <h1 className="font-editorial text-3xl sm:text-4xl">Thank you, {customerName}.</h1>
          <p className={`text-xs sm:text-sm leading-relaxed ${textMuted}`}>
            Your order <strong>{confirmedOrder.id}</strong> has been registered with our atelier dispatch team. A confirmation summary has been saved to your account.
          </p>
          <div className={`p-4 border ${borderCol} text-left text-xs space-y-1.5`}>
            <p>
              <strong>Reference:</strong> {confirmedOrder.id}
            </p>
            <p>
              <strong>Destination:</strong> {confirmedOrder.address}
            </p>
            <p>
              <strong>Total Paid (Demo):</strong> ${confirmedOrder.total}
            </p>
          </div>
          <div className="pt-3 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => navigateTo('orders')}
              className="min-h-[46px] px-6 bg-[#9A3412] text-white text-xs uppercase tracking-[0.15em] font-semibold"
            >
              View Order History
            </button>
            <button
              onClick={() => navigateTo('shop')}
              className={`min-h-[46px] px-6 border ${borderCol} text-xs uppercase tracking-[0.15em]`}
            >
              Continue Browsing
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Form */}
          <div className="lg:col-span-7 space-y-8">
            {/* Step Indicator */}
            <div className="flex items-center gap-4 text-xs uppercase tracking-[0.15em]">
              <span className={step === 1 ? 'font-bold text-[#9A3412]' : textMuted}>1. Delivery</span>
              <ChevronRight className="w-3.5 h-3.5 opacity-40" />
              <span className={step === 2 ? 'font-bold text-[#9A3412]' : textMuted}>2. Payment</span>
            </div>

            {step === 1 && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setStep(2);
                }}
                className={`p-6 sm:p-8 border ${borderCol} ${bgCard} space-y-5`}
              >
                <h2 className="font-editorial text-2xl">Client &amp; Delivery Details</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs mb-1.5">Full Name</label>
                    <input
                      required
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className={`w-full min-h-[44px] px-3.5 text-xs bg-transparent border ${borderCol}`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs mb-1.5">Email Address</label>
                    <input
                      required
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className={`w-full min-h-[44px] px-3.5 text-xs bg-transparent border ${borderCol}`}
                    />
                  </div>
                </div>

                {user.addresses?.length > 0 && (
                  <div className="space-y-2.5">
                    <label className="block text-xs font-medium">Select Saved Address</label>
                    {user.addresses.map((addr) => (
                      <label
                        key={addr.id}
                        className={`flex items-start gap-3 p-3.5 border cursor-pointer text-xs ${
                          selectedAddressId === addr.id ? 'border-[#9A3412]' : borderCol
                        }`}
                      >
                        <input
                          type="radio"
                          name="address"
                          checked={selectedAddressId === addr.id}
                          onChange={() => setSelectedAddressId(addr.id)}
                          className="mt-0.5 accent-[#9A3412]"
                        />
                        <div>
                          <p className="font-semibold">{addr.label}</p>
                          <p className={textMuted}>
                            {addr.street}, {addr.city} {addr.zip}, {addr.country}
                          </p>
                        </div>
                      </label>
                    ))}
                    <label
                      className={`flex items-center gap-3 p-3.5 border cursor-pointer text-xs ${
                        selectedAddressId === 'custom' ? 'border-[#9A3412]' : borderCol
                      }`}
                    >
                      <input
                        type="radio"
                        name="address"
                        checked={selectedAddressId === 'custom'}
                        onChange={() => setSelectedAddressId('custom')}
                        className="accent-[#9A3412]"
                      />
                      <span>Enter a new delivery address</span>
                    </label>
                  </div>
                )}

                {selectedAddressId === 'custom' && (
                  <div className="space-y-3 pt-2">
                    <input
                      required
                      type="text"
                      value={customStreet}
                      onChange={(e) => setCustomStreet(e.target.value)}
                      placeholder="Street Address & Suite"
                      className={`w-full min-h-[44px] px-3.5 text-xs bg-transparent border ${borderCol}`}
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        required
                        type="text"
                        value={customCity}
                        onChange={(e) => setCustomCity(e.target.value)}
                        placeholder="City"
                        className={`w-full min-h-[44px] px-3.5 text-xs bg-transparent border ${borderCol}`}
                      />
                      <input
                        required
                        type="text"
                        value={customCountry}
                        onChange={(e) => setCustomCountry(e.target.value)}
                        placeholder="Country"
                        className={`w-full min-h-[44px] px-3.5 text-xs bg-transparent border ${borderCol}`}
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full min-h-[48px] bg-[#18181B] dark:bg-[#F4F4F5] text-white dark:text-[#09090B] text-xs uppercase tracking-[0.16em] font-semibold"
                >
                  Continue to Payment
                </button>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleCompleteOrder} className={`p-6 sm:p-8 border ${borderCol} ${bgCard} space-y-5`}>
                <div className="flex items-center justify-between">
                  <h2 className="font-editorial text-2xl">Payment Method (Demo)</h2>
                  <button type="button" onClick={() => setStep(1)} className="text-xs underline">
                    Edit Delivery
                  </button>
                </div>

                <div className="space-y-2.5 text-xs">
                  {[
                    { id: 'card', label: 'Credit / Debit Card (Simulated)' },
                    { id: 'apple', label: 'Apple Pay Express (Simulated)' },
                    { id: 'wire', label: 'Private Client Bank Wire (Simulated)' }
                  ].map((m) => (
                    <label
                      key={m.id}
                      className={`flex items-center gap-3 p-4 border cursor-pointer ${
                        paymentMethod === m.id ? 'border-[#9A3412]' : borderCol
                      }`}
                    >
                      <input
                        type="radio"
                        name="pay"
                        checked={paymentMethod === m.id}
                        onChange={() => setPaymentMethod(m.id)}
                        className="accent-[#9A3412]"
                      />
                      <CreditCard className="w-4 h-4 opacity-70" />
                      <span className="font-medium">{m.label}</span>
                    </label>
                  ))}
                </div>

                {paymentMethod === 'card' && (
                  <div className={`p-4 border ${borderCol} space-y-3 text-xs`}>
                    <input
                      type="text"
                      defaultValue="4532 •••• •••• 8890 (Demo Card)"
                      readOnly
                      className={`w-full min-h-[42px] px-3 bg-transparent border ${borderCol} opacity-75`}
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        defaultValue="09 / 29"
                        readOnly
                        className={`w-full min-h-[42px] px-3 bg-transparent border ${borderCol} opacity-75`}
                      />
                      <input
                        type="text"
                        defaultValue="•••"
                        readOnly
                        className={`w-full min-h-[42px] px-3 bg-transparent border ${borderCol} opacity-75`}
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full min-h-[50px] bg-[#9A3412] hover:bg-[#7C2D12] text-white text-xs uppercase tracking-[0.16em] font-semibold flex items-center justify-center gap-2"
                >
                  <Lock className="w-3.5 h-3.5" /> Complete Demo Order &mdash; ${orderTotal}
                </button>
              </form>
            )}
          </div>

          {/* Right Summary */}
          <div className="lg:col-span-5">
            <div className={`p-6 border ${borderCol} ${bgCard} space-y-4`}>
              <h3 className="font-editorial text-2xl">In Your Bag ({cart.length})</h3>
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={item.cartKey} className="flex items-center gap-3 text-xs">
                    <img src={item.image} alt="" className="w-12 h-14 object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{item.name}</p>
                      <p className={textMuted}>
                        {item.color} / {item.size} &times; {item.qty}
                      </p>
                    </div>
                    <span className="font-semibold">${item.price * item.qty}</span>
                  </div>
                ))}
              </div>
              <div className={`pt-4 border-t ${borderCol} space-y-2 text-xs`}>
                <div className="flex justify-between">
                  <span className={textMuted}>Subtotal</span>
                  <span>${subtotal}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Promo ({appliedPromo.toUpperCase()})</span>
                    <span>-${discountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className={textMuted}>Shipping</span>
                  <span>{shippingCost === 0 ? 'Complimentary' : `$${shippingCost}`}</span>
                </div>
                <div className={`flex justify-between text-base font-semibold pt-2 border-t ${borderCol}`}>
                  <span>Total</span>
                  <span>${orderTotal}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 12. PAGE 8: USER ACCOUNT VIEW
// ============================================================================

function AccountView({ user, setUser, orders, wishlistCount, navigateTo, addToast, bgCard, textMuted, borderCol }) {
  const [authMode, setAuthMode] = useState('login');
  const [authEmail, setAuthEmail] = useState('');
  const [authName, setAuthName] = useState('');

  // Profile Edit State
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);

  // New Address State
  const [newLabel, setNewLabel] = useState('');
  const [newStreet, setNewStreet] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newCountry, setNewCountry] = useState('Azerbaijan');

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setUser((prev) => ({ ...prev, name, email, phone }));
    addToast('Client profile updated');
  };

  const handleAddAddress = (e) => {
    e.preventDefault();
    if (!newStreet.trim() || !newCity.trim()) return;
    const addr = {
      id: `addr-${Date.now()}`,
      label: newLabel.trim() || 'Saved Address',
      street: newStreet.trim(),
      city: newCity.trim(),
      zip: 'AZ1000',
      country: newCountry.trim() || 'Azerbaijan'
    };
    setUser((prev) => ({ ...prev, addresses: [...prev.addresses, addr] }));
    setNewLabel('');
    setNewStreet('');
    setNewCity('');
    addToast('Delivery address saved');
  };

  const deleteAddress = (id) => {
    setUser((prev) => ({ ...prev, addresses: prev.addresses.filter((a) => a.id !== id) }));
    addToast('Address removed', 'info');
  };

  if (!user.isLoggedIn) {
    return (
      <div className="max-w-md mx-auto px-4 pt-14">
        <div className={`p-8 border ${borderCol} ${bgCard} space-y-6`}>
          <div className="flex border-b border-current/10">
            <button
              onClick={() => setAuthMode('login')}
              className={`flex-1 pb-3 text-xs uppercase tracking-[0.15em] border-b-2 ${
                authMode === 'login' ? 'border-[#9A3412] font-semibold' : 'border-transparent opacity-60'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setAuthMode('register')}
              className={`flex-1 pb-3 text-xs uppercase tracking-[0.15em] border-b-2 ${
                authMode === 'register' ? 'border-[#9A3412] font-semibold' : 'border-transparent opacity-60'
              }`}
            >
              Create Account
            </button>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              setUser((prev) => ({
                ...prev,
                isLoggedIn: true,
                name: authMode === 'register' && authName ? authName : prev.name || 'Leyla Mammadova',
                email: authEmail || prev.email || 'leyla.m@velora-client.az'
              }));
              addToast('Signed in to VELORA Client Portal');
            }}
            className="space-y-4 text-xs"
          >
            {authMode === 'register' && (
              <div>
                <label className="block mb-1.5">Full Name</label>
                <input
                  required
                  type="text"
                  value={authName}
                  onChange={(e) => setAuthName(e.target.value)}
                  placeholder="Jamal Aliyev"
                  className={`w-full min-h-[44px] px-3.5 bg-transparent border ${borderCol}`}
                />
              </div>
            )}
            <div>
              <label className="block mb-1.5">Email Address</label>
              <input
                required
                type="email"
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                placeholder="client@velora.com"
                className={`w-full min-h-[44px] px-3.5 bg-transparent border ${borderCol}`}
              />
            </div>
            <div>
              <label className="block mb-1.5">Password</label>
              <input
                required
                type="password"
                defaultValue="••••••••••••"
                className={`w-full min-h-[44px] px-3.5 bg-transparent border ${borderCol}`}
              />
            </div>
            <button
              type="submit"
              className="w-full min-h-[48px] bg-[#18181B] dark:bg-[#F4F4F5] text-white dark:text-[#09090B] uppercase tracking-[0.16em] font-semibold"
            >
              {authMode === 'login' ? 'Access Account' : 'Register Membership'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 pt-10 sm:pt-14">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-8 border-b border-current/10">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[#9A3412] dark:text-[#EA580C]">Private Client Portal</p>
          <h1 className="font-editorial text-4xl sm:text-5xl mt-1">Welcome, {user.name}</h1>
        </div>
        <button
          onClick={() => {
            setUser((prev) => ({ ...prev, isLoggedIn: false }));
            addToast('Signed out', 'info');
          }}
          className={`inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] hover:text-red-600 transition ${textMuted}`}
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>

      {/* Quick Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 my-8">
        <div
          onClick={() => navigateTo('orders')}
          className={`p-6 border ${borderCol} ${bgCard} cursor-pointer hover:border-[#9A3412] transition`}
        >
          <Package className="w-5 h-5 text-[#9A3412] mb-3" />
          <p className="font-editorial text-3xl">{orders.length} Orders</p>
          <p className={`text-xs mt-1 ${textMuted}`}>View receipts &amp; dispatch status &rarr;</p>
        </div>

        <div
          onClick={() => navigateTo('wishlist')}
          className={`p-6 border ${borderCol} ${bgCard} cursor-pointer hover:border-[#9A3412] transition`}
        >
          <Heart className="w-5 h-5 text-[#9A3412] mb-3" />
          <p className="font-editorial text-3xl">{wishlistCount} Saved Pieces</p>
          <p className={`text-xs mt-1 ${textMuted}`}>Manage your curated wishlist &rarr;</p>
        </div>

        <div className={`p-6 border ${borderCol} ${bgCard}`}>
          <Star className="w-5 h-5 text-[#9A3412] mb-3" />
          <p className="font-editorial text-3xl">Atelier Tier</p>
          <p className={`text-xs mt-1 ${textMuted}`}>Complimentary courier privileges active</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Profile Details Form */}
        <div className="lg:col-span-6">
          <form onSubmit={handleSaveProfile} className={`p-6 sm:p-8 border ${borderCol} ${bgCard} space-y-4 text-xs`}>
            <h2 className="font-editorial text-2xl">Personal Information</h2>
            <div>
              <label className="block mb-1.5">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full min-h-[44px] px-3.5 bg-transparent border ${borderCol}`}
              />
            </div>
            <div>
              <label className="block mb-1.5">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full min-h-[44px] px-3.5 bg-transparent border ${borderCol}`}
              />
            </div>
            <div>
              <label className="block mb-1.5">Telephone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={`w-full min-h-[44px] px-3.5 bg-transparent border ${borderCol}`}
              />
            </div>
            <button
              type="submit"
              className="min-h-[46px] px-7 bg-[#18181B] dark:bg-[#F4F4F5] text-white dark:text-[#09090B] uppercase tracking-[0.15em] font-semibold"
            >
              Save Changes
            </button>
          </form>
        </div>

        {/* Saved Addresses */}
        <div className="lg:col-span-6">
          <div className={`p-6 sm:p-8 border ${borderCol} ${bgCard} space-y-5 text-xs`}>
            <h2 className="font-editorial text-2xl">Saved Addresses</h2>
            <div className="space-y-3">
              {user.addresses.map((addr) => (
                <div key={addr.id} className={`p-4 border ${borderCol} flex justify-between items-start gap-3`}>
                  <div>
                    <p className="font-semibold">{addr.label}</p>
                    <p className={`mt-1 ${textMuted}`}>
                      {addr.street}, {addr.city} {addr.zip}, {addr.country}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteAddress(addr.id)}
                    aria-label="Delete address"
                    className="p-1 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddAddress} className={`pt-4 border-t ${borderCol} space-y-3`}>
              <p className="font-medium uppercase tracking-wider">Add New Destination</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  placeholder="Label (e.g. Summer Villa)"
                  className={`min-h-[42px] px-3 bg-transparent border ${borderCol}`}
                />
                <input
                  type="text"
                  value={newCity}
                  onChange={(e) => setNewCity(e.target.value)}
                  placeholder="City"
                  className={`min-h-[42px] px-3 bg-transparent border ${borderCol}`}
                />
              </div>
              <input
                type="text"
                value={newStreet}
                onChange={(e) => setNewStreet(e.target.value)}
                placeholder="Street Address & Apartment"
                className={`w-full min-h-[42px] px-3 bg-transparent border ${borderCol}`}
              />
              <button
                type="submit"
                className="min-h-[44px] px-6 border border-current uppercase tracking-[0.14em] font-medium hover:bg-[#9A3412] hover:border-[#9A3412] hover:text-white transition"
              >
                Add Address
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 13. PAGE 9: ORDER HISTORY VIEW
// ============================================================================

function OrderHistoryView({ orders, products, handleAddToCart, navigateTo, bgCard, textMuted, borderCol }) {
  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10 pt-10 sm:pt-14">
      <div className="flex items-center justify-between pb-8 border-b border-current/10">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[#9A3412] dark:text-[#EA580C]">Client Archive</p>
          <h1 className="font-editorial text-4xl sm:text-5xl mt-1">Order History</h1>
        </div>
        <button onClick={() => navigateTo('account')} className="text-xs underline underline-offset-4">
          Back to Account
        </button>
      </div>

      <div className="space-y-6 mt-8">
        {orders.map((order) => (
          <div key={order.id} className={`border ${borderCol} ${bgCard} p-5 sm:p-7 space-y-5`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-current/10">
              <div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-sm">{order.id}</span>
                  <span className="text-[11px] px-2.5 py-0.5 bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 font-medium">
                    {order.status}
                  </span>
                </div>
                <p className={`text-xs mt-1 ${textMuted}`}>
                  Placed on {order.date} &bull; Shipped to {order.address}
                </p>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-base font-semibold">${order.total}</p>
                <p className={`text-[11px] ${textMuted}`}>{order.items.length} item(s)</p>
              </div>
            </div>

            <div className="space-y-3">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <img src={item.image} alt={item.name} className="w-12 h-16 object-cover flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="font-medium truncate">{item.name}</p>
                      <p className={textMuted}>
                        {item.color} &bull; {item.size} &bull; Qty {item.qty}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      const prod = products.find((p) => p.id === item.id);
                      if (prod) handleAddToCart(prod, item.color, item.size, 1, true);
                    }}
                    className={`px-3.5 py-2 border ${borderCol} hover:border-[#9A3412] whitespace-nowrap transition`}
                  >
                    Reorder
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// 14. PAGE 10: ABOUT US VIEW
// ============================================================================

function AboutView({ navigateTo, bgCard, textMuted, borderCol }) {
  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 pt-10 sm:pt-14 space-y-16">
      <div className="max-w-3xl">
        <p className="text-xs uppercase tracking-[0.22em] text-[#9A3412] dark:text-[#EA580C]">The Maison</p>
        <h1 className="font-editorial text-4xl sm:text-6xl mt-2 leading-tight">
          Founded at the crossroads of Caspian heritage and European craft.
        </h1>
        <p className={`text-sm sm:text-base mt-5 leading-relaxed ${textMuted}`}>
          Established with creative direction in Baku and production ateliers across Milan and Kyoto, VELORA creates architectural wardrobe foundations and tactile living objects engineered to outlast fleeting trends.
        </p>
      </div>

      <div className="aspect-[16/8] overflow-hidden bg-zinc-900">
        <img
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1800&q=85"
          alt="VELORA Atelier Interior"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            metric: '92%',
            title: 'Certified Natural Fibers',
            desc: 'Traceable Mongolian cashmere, RWS merino wool, Belgian flax, and vegetable-tanned leathers.'
          },
          {
            metric: '100%',
            title: 'Numbered Small Batches',
            desc: 'Zero overproduction. Every garment and travertine vessel is crafted in deliberate, limited runs.'
          },
          {
            metric: '5 Yrs',
            title: 'Atelier Restoration',
            desc: 'Complimentary seam, button, and leather conditioning care at our flagship studios.'
          }
        ].map((stat) => (
          <div key={stat.title} className={`p-8 border ${borderCol} ${bgCard}`}>
            <p className="font-editorial text-5xl text-[#9A3412] dark:text-[#EA580C]">{stat.metric}</p>
            <h3 className="font-editorial text-2xl mt-3">{stat.title}</h3>
            <p className={`text-xs mt-2 leading-relaxed ${textMuted}`}>{stat.desc}</p>
          </div>
        ))}
      </div>

      <div className="text-center pt-4">
        <button
          onClick={() => navigateTo('shop')}
          className="min-h-[48px] px-8 bg-[#18181B] dark:bg-[#F4F4F5] text-white dark:text-[#09090B] text-xs uppercase tracking-[0.16em] font-semibold"
        >
          Explore the Collection
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// 15. PAGE 11: CONTACT VIEW
// ============================================================================

function ContactView({ addToast, bgCard, textMuted, borderCol }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState('Private Styling & Sizing');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;
    addToast('Your inquiry has been routed to our Baku & Milan Client Concierge.');
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10 pt-10 sm:pt-14">
      <div className="max-w-2xl mb-12">
        <p className="text-xs uppercase tracking-[0.2em] text-[#9A3412] dark:text-[#EA580C]">Concierge</p>
        <h1 className="font-editorial text-4xl sm:text-5xl mt-1">Contact the Atelier</h1>
        <p className={`text-sm mt-2 ${textMuted}`}>
          Our client advisors respond to all inquiries within 4 business hours.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <form onSubmit={handleSubmit} className={`lg:col-span-7 p-6 sm:p-8 border ${borderCol} ${bgCard} space-y-4 text-xs`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1.5">Your Name</label>
              <input
                required
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Leyla Mammadova"
                className={`w-full min-h-[44px] px-3.5 bg-transparent border ${borderCol}`}
              />
            </div>
            <div>
              <label className="block mb-1.5">Email Address</label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="client@domain.com"
                className={`w-full min-h-[44px] px-3.5 bg-transparent border ${borderCol}`}
              />
            </div>
          </div>

          <div>
            <label className="block mb-1.5">Subject</label>
            <select
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className={`w-full min-h-[44px] px-3.5 bg-transparent border ${borderCol}`}
            >
              <option>Private Styling &amp; Sizing</option>
              <option>Order &amp; Courier Assistance</option>
              <option>Press &amp; Editorial Pulls</option>
              <option>Bespoke &amp; Interior Trade</option>
            </select>
          </div>

          <div>
            <label className="block mb-1.5">Message</label>
            <textarea
              required
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="How may our advisors assist you?"
              className={`w-full p-3.5 bg-transparent border ${borderCol}`}
            />
          </div>

          <button
            type="submit"
            className="min-h-[48px] px-8 bg-[#9A3412] hover:bg-[#7C2D12] text-white uppercase tracking-[0.16em] font-semibold transition"
          >
            Send Inquiry
          </button>
        </form>

        <div className="lg:col-span-5 space-y-5">
          <div className={`p-6 border ${borderCol} ${bgCard} space-y-4 text-xs`}>
            <h3 className="font-editorial text-2xl">Flagship Studios</h3>
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-[#9A3412] mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold">Baku Flagship &amp; Creative Direction</p>
                <p className={textMuted}>14 Neftchilar Avenue, Sabail District, Baku AZ1000</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-[#9A3412] mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold">Milan Showroom</p>
                <p className={textMuted}>Via Solferino 18, 20121 Milano MI, Italy</p>
              </div>
            </div>
            <div className="flex items-center gap-3 pt-2 border-t border-current/10">
              <Mail className="w-4 h-4 text-[#9A3412]" />
              <span>concierge@velora-maison.com</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-[#9A3412]" />
              <span>+994 12 498 01 92</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-4 h-4 text-[#9A3412]" />
              <span>Mon – Sat: 10:00 – 20:00 (GMT+4)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 16. PAGE 12: FAQ VIEW
// ============================================================================

function FaqView({ navigateTo, bgCard, textMuted, borderCol }) {
  const [query, setQuery] = useState('');
  const [openIndex, setOpenIndex] = useState(0);

  const filteredFaqs = FAQ_DATA.filter(
    (item) =>
      item.question.toLowerCase().includes(query.toLowerCase()) ||
      item.answer.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14">
      <div className="text-center mb-10">
        <p className="text-xs uppercase tracking-[0.2em] text-[#9A3412] dark:text-[#EA580C]">Client Care</p>
        <h1 className="font-editorial text-4xl sm:text-5xl mt-1">Frequently Asked Questions</h1>
        <div className={`mt-6 flex items-center px-4 min-h-[46px] border ${borderCol} ${bgCard}`}>
          <Search className={`w-4 h-4 mr-3 ${textMuted}`} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search shipping, returns, sizing, materials..."
            className="w-full bg-transparent text-xs focus:outline-none"
          />
        </div>
      </div>

      <div className="space-y-3">
        {filteredFaqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div key={faq.question} className={`border ${borderCol} ${bgCard}`}>
              <button
                onClick={() => setOpenIndex(isOpen ? -1 : index)}
                className="w-full p-5 text-left flex items-center justify-between gap-4"
              >
                <div>
                  <span className="text-[10px] uppercase tracking-[0.16em] text-[#9A3412] dark:text-[#EA580C] block mb-1">
                    {faq.category}
                  </span>
                  <span className="text-sm font-medium">{faq.question}</span>
                </div>
                <ChevronDown className={`w-4 h-4 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <p className={`px-5 pb-5 text-xs leading-relaxed ${textMuted}`}>{faq.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      <div className={`mt-12 p-6 border ${borderCol} ${bgCard} flex flex-col sm:flex-row items-center justify-between gap-4`}>
        <p className="text-xs">Require personalized assistance from our client advisors?</p>
        <button
          onClick={() => navigateTo('contact')}
          className="min-h-[42px] px-6 bg-[#18181B] dark:bg-[#F4F4F5] text-white dark:text-[#09090B] text-xs uppercase tracking-[0.15em]"
        >
          Contact Concierge
        </button>
      </div>
    </div>
  );
}