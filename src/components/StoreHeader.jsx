import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Menu,
  X,
  ChevronRight,
  Sun,
  Moon,
} from 'lucide-react';

export default function StoreHeader({
  darkMode,
  setDarkMode,
  activePage,
  navigateTo,
  setMobileMenuOpen,
  setCartDrawerOpen,
  setMobileSearchOpen,
  mobileSearchOpen,
  searchQuery,
  setSearchQuery,
  wishlist,
  totalCartItems,
  textMuted,
  borderCol,
}) {
  return (
    <>
      <div className="bg-[#18181B] text-[#FAF9F6] text-[11px] sm:text-xs tracking-[0.16em] uppercase py-2.5 px-4 text-center border-b border-white/10">
        Complimentary Express Courier on Orders Over $250 &nbsp;•&nbsp; Code <span className="underline underline-offset-4 font-medium">VELORA10</span> for 10% Off
      </div>

      <header
        className={`sticky top-0 z-40 backdrop-blur-md transition-colors duration-300 border-b ${
          darkMode ? 'bg-[#09090B]/90 border-[#27272A]' : 'bg-[#FAF9F6]/90 border-[#E4E4E7]'
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 h-16 sm:h-20 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 lg:gap-8 flex-1">
            <button
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open Navigation Menu"
              className="lg:hidden min-w-[44px] min-h-[44px] flex items-center justify-center -ml-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition"
            >
              <Menu className="w-5 h-5" />
            </button>

            <nav className="hidden lg:flex items-center gap-7 text-xs tracking-[0.14em] uppercase font-medium">
              {[
                { id: 'home', label: 'Home' },
                { id: 'shop', label: 'Shop' },
                { id: 'categories', label: 'Collections' },
                { id: 'about', label: 'Atelier' },
                { id: 'faq', label: 'Client Care' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => navigateTo(item.id)}
                  className={`py-2 relative transition-colors ${
                    activePage === item.id
                      ? 'text-[#9A3412] dark:text-[#EA580C]'
                      : 'hover:text-[#9A3412] dark:hover:text-[#EA580C]'
                  }`}
                >
                  {item.label}
                  {activePage === item.id && (
                    <motion.span
                      layoutId="navUnderline"
                      className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#9A3412] dark:bg-[#EA580C]"
                    />
                  )}
                </button>
              ))}
            </nav>
          </div>

          <div className="flex-shrink-0 text-center">
            <button
              onClick={() => navigateTo('home')}
              className="font-editorial text-2xl sm:text-3xl lg:text-[34px] tracking-[0.22em] font-medium uppercase focus:outline-none"
            >
              VELORA
            </button>
          </div>

          <div className="flex items-center justify-end gap-0.5 sm:gap-2 flex-1">
            <button
              onClick={() => setMobileSearchOpen((value) => !value)}
              aria-label="Search Catalog"
              className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition"
            >
              <Search className="w-[18px] h-[18px]" />
            </button>

            <button
              onClick={() => setDarkMode(!darkMode)}
              aria-label="Toggle Color Theme"
              className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition"
            >
              {darkMode ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
            </button>

            <button
              onClick={() => navigateTo('wishlist')}
              aria-label="Wishlist"
              className="relative min-w-[44px] min-h-[44px] hidden sm:flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition"
            >
              <Heart className="w-[18px] h-[18px]" />
              {wishlist.length > 0 && (
                <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[#9A3412] text-white text-[10px] flex items-center justify-center font-medium">
                  {wishlist.length}
                </span>
              )}
            </button>

            <button
              onClick={() => navigateTo('account')}
              aria-label="User Account"
              className="min-w-[44px] min-h-[44px] hidden sm:flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition"
            >
              <User className="w-[18px] h-[18px]" />
            </button>

            <button
              onClick={() => setCartDrawerOpen(true)}
              aria-label="Shopping Bag"
              className="relative min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition"
            >
              <ShoppingBag className="w-[18px] h-[18px]" />
              {totalCartItems > 0 && (
                <span className="absolute top-2 right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#9A3412] text-white text-[10px] flex items-center justify-center font-semibold">
                  {totalCartItems}
                </span>
              )}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileSearchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className={`border-t ${borderCol} overflow-hidden`}
            >
              <div className="max-w-3xl mx-auto px-4 py-3.5 flex items-center gap-3">
                <Search className={`w-4 h-4 flex-shrink-0 ${textMuted}`} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                  }}
                  placeholder="Search cashmere coats, Tuscan leather, sandalwood parfum..."
                  autoFocus
                  className="w-full bg-transparent text-sm focus:outline-none"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="text-xs uppercase tracking-wider opacity-60 hover:opacity-100">
                    Clear
                  </button>
                )}
                <button
                  onClick={() => setMobileSearchOpen(false)}
                  className="min-w-[36px] min-h-[36px] flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <AnimatePresence>
        {false && null}
      </AnimatePresence>
    </>
  );
}

export function MobileMenu({
  darkMode,
  setDarkMode,
  mobileMenuOpen,
  setMobileMenuOpen,
  wishlist,
  totalCartItems,
  activePage,
  navigateTo,
  textMuted,
  borderCol,
}) {
  return (
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
                  { id: 'faq', label: 'FAQ & Client Care' },
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
  );
}
