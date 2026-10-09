import React, { useState } from 'react';
import { Star, CheckCircle, EyeOff, Trash2, ShieldCheck, Image as ImageIcon, X } from 'lucide-react';
import db from '../../services/db';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState(() => db.get('reviews'));
  const [photoModalUrl, setPhotoModalUrl] = useState(null);

  const syncReviews = () => {
    setReviews(db.get('reviews'));
  };

  const handleUpdateStatus = (id, newStatus) => {
    const updated = reviews.map(r => r.id === id ? { ...r, status: newStatus } : r);
    db.set('reviews', updated);
    db.logActivity('Review Moderated', `Review ${id} status set to ${newStatus}.`);
    syncReviews();
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this review permanently?')) {
      const filtered = reviews.filter(r => r.id !== id);
      db.set('reviews', filtered);
      db.logActivity('Review Deleted', `Review ${id} was deleted.`);
      syncReviews();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold font-serif text-gray-900">Verified Buyer Reviews Moderation</h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Moderate customer reviews and uploaded images. Note: customer photo downloads are restricted per privacy policy.
        </p>
      </div>

      <div className="space-y-3">
        {reviews.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-3xl border border-gray-200 text-xs text-gray-500">
            No customer reviews submitted yet.
          </div>
        ) : (
          reviews.map((rev) => (
            <div key={rev.id} className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm text-xs flex flex-col md:flex-row justify-between gap-4">
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-900">{rev.customerName}</span>
                  {rev.isVerifiedBuyer && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[9px]">
                      ✓ Verified Purchaser
                    </span>
                  )}
                  <span className={`px-2 py-0.2 rounded-full font-bold text-[9px] uppercase ${
                    rev.status === 'approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                    'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {rev.status}
                  </span>
                </div>

                <p className="text-[11px] text-gray-500">
                  Product: <span className="font-semibold text-[#07643D]">{rev.productName}</span> • {new Date(rev.createdAt).toLocaleDateString()}
                </p>

                {/* Stars */}
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < rev.rating ? 'text-[#D4AF37] fill-[#D4AF37]' : 'text-gray-200'
                      }`}
                    />
                  ))}
                  <span className="text-[11px] font-bold text-gray-700 ml-1">{rev.rating}/5</span>
                </div>

                <p className="text-gray-700 leading-relaxed mt-1">"{rev.comment}"</p>

                {rev.photoUrl && (
                  <button
                    onClick={() => setPhotoModalUrl(rev.photoUrl)}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:underline mt-1"
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Inspect Customer Photo</span>
                  </button>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex md:flex-col justify-end gap-1.5 flex-shrink-0">
                {rev.status !== 'approved' && (
                  <button
                    onClick={() => handleUpdateStatus(rev.id, 'approved')}
                    className="px-3 py-1.5 bg-[#07643D] text-white rounded-lg font-semibold text-xs hover:bg-[#043E26]"
                  >
                    Approve
                  </button>
                )}
                {rev.status !== 'hidden' && (
                  <button
                    onClick={() => handleUpdateStatus(rev.id, 'hidden')}
                    className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg font-semibold text-xs hover:bg-gray-200"
                  >
                    Hide
                  </button>
                )}
                <button
                  onClick={() => handleDelete(rev.id)}
                  className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg font-semibold text-xs hover:bg-red-100"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Inspect Photo Modal (Strictly View-only, No Download) */}
      {photoModalUrl && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full space-y-3 shadow-2xl text-xs">
            <div className="flex items-center justify-between pb-2 border-b">
              <span className="font-bold text-gray-800">Customer Photo Inspection</span>
              <button onClick={() => setPhotoModalUrl(null)} className="text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="rounded-2xl overflow-hidden border max-h-80 bg-gray-100 flex items-center justify-center select-none">
              <img
                src={photoModalUrl}
                alt="Customer Review"
                className="max-h-full object-contain pointer-events-none"
              />
            </div>
            <p className="text-[10px] text-gray-400 text-center">
              Customer privacy protection: Image download disabled.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
