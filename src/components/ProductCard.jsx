import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Star } from 'lucide-react';

export default function ProductCard({
  product,
  onAddToCart,
  onToggleWishlist,
  isFavorite,
  navigateTo,
  darkMode,
}) {
  return (
    <motion.article
      layout
      whileHover={{ y: -4 }}
      className={`group overflow-hidden border ${darkMode ? 'border-[#27272A] bg-[#18181B]' : 'border-[#E4E4E7] bg-white'} transition-colors`}
    >
      <div className="relative">
        <img
          src={product.images[0]}
          alt={product.name}
          className="h-80 w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />

        <button
          onClick={() => onToggleWishlist(product.id)}
          aria-label="Toggle wishlist"
          className="absolute top-3 right-3 flex h-10 w-10 items-center justify-center rounded-full border border-white/50 bg-white/90 text-[#18181B] shadow-sm backdrop-blur-sm transition hover:scale-105"
        >
          <Heart className={`h-4 w-4 ${isFavorite ? 'fill-[#9A3412] text-[#9A3412]' : ''}`} />
        </button>

        {product.isNew && (
          <span className="absolute left-3 top-3 bg-[#18181B] px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-white">
            New
          </span>
        )}
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#9A3412]">
              {product.category}
            </p>
            <h3 className="mt-2 text-lg font-medium text-current">{product.name}</h3>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 text-[#9A3412]">
              <Star className="h-3.5 w-3.5 fill-current" />
              <span className="text-[10px] font-medium">{product.popularity}</span>
            </div>
          </div>
        </div>

        <p className={`text-sm ${darkMode ? 'text-zinc-300' : 'text-[#71717A]'}`}>
          {product.subtitle}
        </p>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-medium">${product.price}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigateTo('product', { productId: product.id })}
              className={`rounded-full border px-3 py-2 text-[10px] uppercase tracking-[0.16em] ${
                darkMode ? 'border-[#27272A] text-zinc-100 hover:bg-white/5' : 'border-[#E4E4E7] text-[#18181B] hover:bg-black/5'
              }`}
            >
              Details
            </button>
            <button
              onClick={() => onAddToCart(product, product.colors[0].name, product.sizes[0])}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#18181B] text-white transition hover:bg-[#9A3412]"
              aria-label={`Add ${product.name} to cart`}
            >
              <ShoppingBag className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
