import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  Zap, 
  ShieldCheck, 
  Truck, 
  Clock, 
  Award, 
  ArrowLeft,
  Star,
  MessageSquare,
  HelpCircle,
  CheckCircle2,
  Image as ImageIcon
} from 'lucide-react';
import db from '../services/db';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import ProductCard from '../components/product/ProductCard';
import VariationSelector from '../components/product/VariationSelector';
import ReviewFormModal from '../components/customer/ReviewFormModal';
import AskQuestionModal from '../components/customer/AskQuestionModal';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isUrdu } = useLanguage();

  const [product, setProduct] = useState(() => db.getProductById(id));
  const [reviews, setReviews] = useState(() => db.get('reviews'));
  const [questions, setQuestions] = useState(() => db.get('questions'));

  // Modals
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);

  useEffect(() => {
    const syncData = () => {
      setProduct(db.getProductById(id));
      setReviews(db.get('reviews'));
      setQuestions(db.get('questions'));
    };
    syncData();
    const unsubscribe = db.subscribe(syncData);
    return unsubscribe;
  }, [id]);

  const hasVariations = product?.variations && product.variations.length > 0;
  const [selectedVariation, setSelectedVariation] = useState(
    hasVariations ? product.variations[0] : null
  );
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div className="min-h-[70vh] bg-[#FDFBF7] flex flex-col items-center justify-center p-4">
        <h2 className="text-xl font-bold text-gray-800">Product Not Found</h2>
        <p className="text-xs text-gray-500 mt-1">The requested product could not be located in our catalog.</p>
        <Link 
          to="/products"
          className="mt-4 px-4 py-2 rounded-xl bg-[#07643D] text-white text-xs font-semibold"
        >
          Back to All Products
        </Link>
      </div>
    );
  }

  const currentPrice = selectedVariation 
    ? (selectedVariation.discountPrice ?? selectedVariation.price) 
    : (product.discountPrice ?? product.price);

  const originalPrice = selectedVariation 
    ? selectedVariation.price 
    : product.price;

  const hasDiscount = (selectedVariation?.discountPrice && selectedVariation.discountPrice < selectedVariation.price) ||
    (!selectedVariation && product.discountPrice && product.discountPrice < product.price);

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedVariation);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedVariation);
    navigate('/checkout');
  };

  const productReviews = reviews.filter(r => r.productId === product.id && r.status === 'approved');
  const productQuestions = questions.filter(q => q.productId === product.id && q.status === 'published');

  const relatedProducts = db.getProducts()
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Link to="/" className="hover:text-[#07643D]">Home</Link>
          <span>/</span>
          <Link to={`/category/${product.category}`} className="capitalize hover:text-[#07643D]">
            {product.category}
          </Link>
          <span>/</span>
          <span className="font-bold text-[#07643D] truncate">{product.name}</span>
        </div>

        {/* Product Hero Section */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden p-6 sm:p-8 lg:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-gray-200 p-4 flex items-center justify-center">
                <img
                  src={product.image}
                  alt={product.name}
                  className="max-h-full object-contain"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/images/products/gulab-jamun.svg";
                  }}
                />
                {product.badge && (
                  <span className="absolute top-4 left-4 bg-[#07643D] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow">
                    {product.badge}
                  </span>
                )}
              </div>
            </div>

            {/* Product Info & Purchase Actions */}
            <div className="flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                
                {/* Category & Urdu Motto */}
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-bold tracking-widest text-[#07643D] bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                    {product.category} {product.subCategory ? `• ${product.subCategory}` : ''}
                  </span>
                  {product.urduName && (
                    <span className="urdu-text text-[#A5841D] text-lg font-bold">
                      {product.urduName}
                    </span>
                  )}
                </div>

                <h1 className={`text-2xl sm:text-3xl font-extrabold ${isUrdu ? 'urdu-text' : 'font-serif'} text-gray-900 tracking-tight`}>
                  {isUrdu ? (product.urduName || product.name) : product.name}
                </h1>

                {/* Stock Status & Badges */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-[#07643D] bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{isUrdu ? 'دستیاب ہے • فوری ڈلیوری' : 'In Stock • Ready for Delivery'}</span>
                  </span>
                  <span className="text-xs text-gray-500 font-mono">{isUrdu ? 'پیکنگ:' : 'Unit:'} {product.unit}</span>
                </div>

                {/* Pricing Block */}
                <div className="p-4 rounded-2xl bg-[#FDFBF7] border border-[#D4AF37]/30 flex items-baseline gap-3">
                  <span className="text-3xl font-extrabold text-[#07643D] font-mono">
                    Rs. {currentPrice?.toLocaleString()}
                  </span>
                  {hasDiscount && (
                    <span className="text-sm text-gray-400 line-through font-mono">
                      Rs. {originalPrice?.toLocaleString()}
                    </span>
                  )}
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-auto">
                    PKR
                  </span>
                </div>

                {/* Description */}
                <div className="text-xs text-gray-600 leading-relaxed">
                  <p className={isUrdu ? 'urdu-text leading-relaxed text-sm' : ''}>
                    {isUrdu ? (product.urduDescription || product.description) : product.description}
                  </p>
                </div>

                {/* Ingredients / Highlights */}
                {product.ingredients && (
                  <div className="text-xs p-3 rounded-xl bg-gray-50 border border-gray-200">
                    <span className="font-bold text-gray-700 block mb-0.5">
                      {isUrdu ? 'اجزاء اور ترکیب:' : 'Ingredients & Composition:'}
                    </span>
                    <span className="text-gray-600">{product.ingredients}</span>
                  </div>
                )}

                {/* Variations & Decimal Quantity Selector */}
                <VariationSelector
                  product={product}
                  selectedVariation={selectedVariation}
                  onSelectVariation={(v) => setSelectedVariation(v)}
                  quantity={quantity}
                  onChangeQuantity={(q) => setQuantity(q)}
                />

              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-4 border-t border-gray-100">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={handleAddToCart}
                    className="py-3 px-4 rounded-xl bg-emerald-50 hover:bg-[#07643D] text-[#07643D] hover:text-white border border-[#07643D]/40 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>{isUrdu ? `ٹوکری میں شامل کریں (${quantity})` : `Add to Cart (${quantity})`}</span>
                  </button>

                  <button
                    onClick={handleBuyNow}
                    className="py-3 px-4 rounded-xl bg-[#07643D] hover:bg-[#043E26] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
                  >
                    <Zap className="w-4 h-4 text-[#D4AF37]" />
                    <span>{isUrdu ? 'ابھی خریدیں اور کیش ادا کریں' : 'Buy Now & Checkout'}</span>
                  </button>
                </div>

                {/* Trust mini-strip */}
                <div className="grid grid-cols-3 gap-2 pt-2 text-[10px] text-gray-500 text-center">
                  <div className="p-2 rounded-lg bg-gray-50 border border-gray-100 flex flex-col items-center">
                    <Award className="w-3.5 h-3.5 text-[#D4AF37] mb-0.5" />
                    <span>Pure Desi Ghee</span>
                  </div>
                  <div className="p-2 rounded-lg bg-gray-50 border border-gray-100 flex flex-col items-center">
                    <Truck className="w-3.5 h-3.5 text-[#D4AF37] mb-0.5" />
                    <span>Jhang &amp; Nationwide</span>
                  </div>
                  <div className="p-2 rounded-lg bg-gray-50 border border-gray-100 flex flex-col items-center">
                    <Clock className="w-3.5 h-3.5 text-[#D4AF37] mb-0.5" />
                    <span>Fresh Daily Batch</span>
                  </div>
                </div>

              </div>

            </div>

          </div>
        </div>

        {/* Customer Reviews & Questions Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Reviews Card */}
          <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-[#D4AF37] fill-[#D4AF37]" />
                <h3 className="text-base font-bold text-gray-900">
                  Customer Reviews ({productReviews.length})
                </h3>
              </div>
              <button
                onClick={() => setIsReviewModalOpen(true)}
                className="text-xs font-bold text-[#07643D] hover:underline"
              >
                + Write a Review
              </button>
            </div>

            {productReviews.length === 0 ? (
              <p className="text-xs text-gray-500 py-6 text-center">
                No reviews yet. Be the first verified purchaser to leave feedback!
              </p>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {productReviews.map((rev) => (
                  <div key={rev.id} className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900">{rev.customerName}</span>
                        {rev.isVerifiedBuyer && (
                          <span className="px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-bold">
                            ✓ Verified Buyer
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-gray-400">
                        {new Date(rev.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < rev.rating ? 'text-[#D4AF37] fill-[#D4AF37]' : 'text-gray-200'
                          }`}
                        />
                      ))}
                    </div>

                    <p className="text-gray-700 leading-relaxed">"{rev.comment}"</p>

                    {rev.photoUrl && (
                      <div className="mt-2 rounded-xl overflow-hidden border max-w-[120px]">
                        <img src={rev.photoUrl} alt="Review photo" className="w-full h-auto object-cover" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Q&A Card */}
          <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-[#07643D]" />
                <h3 className="text-base font-bold text-gray-900">
                  Questions &amp; Answers ({productQuestions.length})
                </h3>
              </div>
              <button
                onClick={() => setIsQuestionModalOpen(true)}
                className="text-xs font-bold text-[#07643D] hover:underline"
              >
                + Ask Question
              </button>
            </div>

            {productQuestions.length === 0 ? (
              <p className="text-xs text-gray-500 py-6 text-center">
                Have a question about ingredients, taste, or packaging? Ask our kitchen team!
              </p>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {productQuestions.map((q) => (
                  <div key={q.id} className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 text-xs space-y-1.5">
                    <p className="font-bold text-gray-800">Q: {q.question}</p>
                    {q.answer ? (
                      <p className="text-emerald-950 bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-100 leading-relaxed">
                        <span className="font-bold text-[#07643D]">Sawera Sweets &amp; Bakers: </span>
                        {q.answer}
                      </p>
                    ) : (
                      <p className="text-[11px] text-gray-400 italic">Awaiting answer from store...</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Related Category Items */}
        {relatedProducts.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold font-serif text-[#07643D]">
              More from {product.category.toUpperCase()}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Review Modal */}
      <ReviewFormModal
        product={product}
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
      />

      {/* Ask Question Modal */}
      <AskQuestionModal
        product={product}
        isOpen={isQuestionModalOpen}
        onClose={() => setIsQuestionModalOpen(false)}
      />
    </div>
  );
}
