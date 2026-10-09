import React, { useState } from 'react';
import { X, Star, Upload, CheckCircle2 } from 'lucide-react';
import db from '../../services/db';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

export default function ReviewFormModal({ product, isOpen, onClose, onReviewSubmitted }) {
  const { user } = useAuth();
  const { isUrdu } = useLanguage();
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen || !product) return null;

  // Check if customer is verified purchaser
  const orders = db.getOrders();
  const hasPurchased = orders.some(
    o => o.customer?.email === user?.email && o.items?.some(i => i.id === product.id)
  );

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhotoUrl(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setIsSubmitting(true);
    const reviews = db.get('reviews');
    const newReview = {
      id: `rev-${Date.now()}`,
      productId: product.id,
      productName: product.name,
      customerName: user?.name || 'Verified Purchaser',
      customerEmail: user?.email || 'customer@sawerasweets.pk',
      isVerifiedBuyer: hasPurchased,
      rating,
      comment: comment.trim(),
      photoUrl: photoUrl || null,
      status: 'approved', // auto-published or can be toggled in admin
      createdAt: new Date().toISOString()
    };

    db.set('reviews', [newReview, ...reviews]);
    db.logActivity('Review Submitted', `New review for ${product.name} with rating ${rating}/5.`);
    setIsSubmitting(false);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onReviewSubmitted && onReviewSubmitted(newReview);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        <div className="bg-[#07643D] text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-[#D4AF37] fill-[#D4AF37]" />
            <h3 className="text-sm font-bold">{isUrdu ? 'پروڈکٹ پر رائے درج کریں' : 'Write a Product Review'}</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded text-white/80 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {success ? (
          <div className="p-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-[#07643D] mx-auto animate-bounce" />
            <h4 className="text-base font-bold text-gray-900">
              {isUrdu ? 'آپ کی رائے موصول ہو چکی ہے!' : 'Review Submitted Successfully!'}
            </h4>
            <p className="text-xs text-gray-500">Thank you for sharing your authentic feedback with Sawera Sweets.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
            <div>
              <p className="font-bold text-gray-800 text-sm">{product.name}</p>
              {hasPurchased && (
                <span className="inline-block mt-1 text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                  ✓ Verified Purchaser
                </span>
              )}
            </div>

            {/* Rating Stars */}
            <div>
              <label className="block text-gray-600 font-semibold mb-1">
                {isUrdu ? 'درجہ بندی (Rating)' : 'Your Overall Rating'}
              </label>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 hover:scale-125 transition-transform"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        (hoverRating || rating) >= star
                          ? 'text-[#D4AF37] fill-[#D4AF37]'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-bold text-gray-700 ml-2">
                  {rating} of 5 Stars
                </span>
              </div>
            </div>

            {/* Review Text */}
            <div>
              <label className="block text-gray-600 font-semibold mb-1">
                {isUrdu ? 'تفصیلی رائے' : 'Your Detailed Experience'}
              </label>
              <textarea
                required
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={isUrdu ? 'ذائقہ، تازگی اور ڈلیوری کے بارے میں اپنی رائے لکھیں...' : 'Share details about taste, freshness, packaging, and delivery...'}
                className="w-full p-2.5 rounded-lg border border-gray-300 focus:border-[#07643D] outline-none text-xs"
              />
            </div>

            {/* Photo Upload */}
            <div>
              <label className="block text-gray-600 font-semibold mb-1">
                {isUrdu ? 'تصویر شامل کریں (اختیاری)' : 'Add Photo (Optional)'}
              </label>
              <div className="flex items-center gap-3">
                <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-300 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium">
                  <Upload className="w-3.5 h-3.5 text-gray-500" />
                  <span>Upload Image</span>
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                </label>
                {photoUrl && (
                  <span className="text-[11px] text-emerald-700 font-semibold">Image selected ✓</span>
                )}
              </div>
            </div>

            {/* Submit */}
            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 rounded-lg bg-[#07643D] text-white hover:bg-[#043E26] font-semibold transition-colors shadow-sm"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
