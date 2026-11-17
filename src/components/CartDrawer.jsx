import { AnimatePresence, motion } from 'framer-motion';
import { Check, Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  subtotal,
  discountedSubtotal,
  discountAmount,
  appliedPromo,
  orderTotal,
  freeShippingThreshold,
  navigateTo,
  updateCartQty,
  removeFromCart,
  totalCartItems,
  darkMode,
  textMuted,
  borderCol,
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50"
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className={`fixed top-0 right-0 bottom-0 w-full sm:w-[440px] z-50 flex flex-col justify-between shadow-2xl ${
              darkMode ? 'bg-[#09090B] text-[#F4F4F5] border-l border-[#27272A]' : 'bg-[#FAF9F6] text-[#18181B] border-l border-[#E4E4E7]'
            }`}
          >
            <div className={`p-5 sm:p-6 border-b ${borderCol}`}>
              <div className="flex items-center justify-between">
                <h2 className="font-editorial text-2xl">Shopping Bag ({totalCartItems})</h2>
                <button
                  onClick={onClose}
                  className="min-w-[44px] min-h-[44px] flex items-center justify-center -mr-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5"
                  aria-label="Close Cart Drawer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-3">
                <div className="flex justify-between text-xs mb-1.5">
                  {discountedSubtotal >= freeShippingThreshold ? (
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5" /> Complimentary Express Shipping Unlocked
                    </span>
                  ) : (
                    <span className={textMuted}>
                      Add <strong className="text-current">${freeShippingThreshold - discountedSubtotal}</strong> more for complimentary courier delivery
                    </span>
                  )}
                </div>
                <div className="w-full h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
                  <div
                    className="h-full bg-[#9A3412] transition-all duration-500"
                    style={{ width: `${Math.min(100, (discountedSubtotal / freeShippingThreshold) * 100)}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <ShoppingBag className="w-10 h-10 mb-3 opacity-30" />
                  <p className="font-editorial text-2xl mb-1">Your bag is empty</p>
                  <p className={`text-xs max-w-xs mb-6 ${textMuted}`}>
                    Explore our seasonal collection of architectural outerwear, Tuscan leather, and botanical fragrances.
                  </p>
                  <button
                    onClick={() => navigateTo('shop')}
                    className="px-6 py-3 bg-[#18181B] dark:bg-[#F4F4F5] text-white dark:text-[#09090B] text-xs uppercase tracking-[0.15em] font-medium"
                  >
                    Explore Catalog
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.cartKey} className={`flex gap-4 pb-5 border-b ${borderCol}`}>
                    <img src={item.image} alt={item.name} className="w-20 h-24 object-cover rounded-xs flex-shrink-0 bg-zinc-200" />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="text-sm font-medium truncate">{item.name}</h4>
                        <button
                          onClick={() => removeFromCart(item.cartKey)}
                          aria-label="Remove item"
                          className={`p-1 hover:text-red-600 transition ${textMuted}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className={`text-xs mt-0.5 ${textMuted}`}>
                        {item.color} &bull; {item.size}
                      </p>
                      <div className="mt-3 flex items-center justify-between">
                        <div className={`inline-flex items-center border ${borderCol} rounded-xs`}>
                          <button
                            onClick={() => updateCartQty(item.cartKey, -1)}
                            className="w-8 h-8 flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/5"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2.5 text-xs font-medium">{item.qty}</span>
                          <button
                            onClick={() => updateCartQty(item.cartKey, 1)}
                            className="w-8 h-8 flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/5"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="text-sm font-medium">${item.price * item.qty}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className={`p-5 sm:p-6 border-t ${borderCol} space-y-3`}>
                <div className="flex justify-between text-xs">
                  <span className={textMuted}>Subtotal</span>
                  <span>${subtotal}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-xs text-emerald-600 dark:text-emerald-400">
                    <span>Discount ({appliedPromo.toUpperCase()})</span>
                    <span>-${discountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-semibold pt-2 border-t border-current/10">
                  <span>Estimated Total</span>
                  <span>${orderTotal}</span>
                </div>

                <div className="grid grid-cols-2 gap-2.5 pt-2">
                  <button
                    onClick={() => navigateTo('cart')}
                    className={`min-h-[46px] border ${borderCol} text-xs uppercase tracking-[0.14em] font-medium hover:bg-black/5 dark:hover:bg-white/5 transition`}
                  >
                    View Bag
                  </button>
                  <button
                    onClick={() => navigateTo('checkout')}
                    className="min-h-[46px] bg-[#9A3412] hover:bg-[#7C2D12] text-white text-xs uppercase tracking-[0.14em] font-medium transition"
                  >
                    Checkout
                  </button>
                </div>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
