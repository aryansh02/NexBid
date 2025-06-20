'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';
import { z } from 'zod';
import { api } from '@/lib/api';

const reviewSchema = z.object({
  rating: z.number().min(1, 'Please select a rating').max(5, 'Rating cannot exceed 5 stars'),
  comment: z.string().min(1, 'Comment is required').max(1000, 'Comment must be less than 1000 characters'),
  buyerId: z.string().min(1, 'Buyer ID is required'), // TODO: Remove when JWT auth is implemented
  sellerId: z.string().min(1, 'Seller ID is required'), // TODO: Remove when JWT auth is implemented
});

type ReviewForm = z.infer<typeof reviewSchema>;

export default function ReviewPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  
  const [formData, setFormData] = useState<ReviewForm>({
    rating: 0,
    comment: '',
    buyerId: 'buyer-1-id', // TODO: Get from auth context
    sellerId: 'seller-1-id', // TODO: Get from project data
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ReviewForm, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);

  const handleRatingChange = (rating: number) => {
    setFormData(prev => ({ ...prev, rating }));
    if (errors.rating) {
      setErrors(prev => ({ ...prev, rating: undefined }));
    }
  };

  const handleCommentChange = (comment: string) => {
    setFormData(prev => ({ ...prev, comment }));
    if (errors.comment) {
      setErrors(prev => ({ ...prev, comment: undefined }));
    }
  };

  const validateForm = (): boolean => {
    try {
      reviewSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Partial<Record<keyof ReviewForm, string>> = {};
        error.errors.forEach((err) => {
          if (err.path.length > 0) {
            const field = err.path[0] as keyof ReviewForm;
            newErrors[field] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await api.createReview(projectId, formData);
      setSubmitted(true);
      
      // Redirect after showing success message
      setTimeout(() => {
        router.push(`/project/${projectId}`);
      }, 2000);
    } catch (error) {
      console.error('Failed to submit review:', error);
      setErrors({ comment: 'Failed to submit review. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRatingText = (rating: number): string => {
    switch (rating) {
      case 1: return 'Poor';
      case 2: return 'Fair';
      case 3: return 'Good';
      case 4: return 'Very Good';
      case 5: return 'Excellent';
      default: return 'Select rating';
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md mx-auto py-16"
      >
        <div className="card-neu text-center p-8">
          <div className="text-6xl mb-4">🌟</div>
          <h2 className="heading-secondary mb-2">Review Submitted!</h2>
          <p className="text-body mb-4">Thank you for your feedback. Your review helps improve our community.</p>
          <div className="bg-primary-100 border border-primary-200 rounded-xl p-4">
            <p className="text-primary-800 text-sm">
              You&apos;ll be redirected to the project page shortly.
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-2xl mx-auto py-8"
    >
      <div className="card-neu">
        <h1 className="heading-primary mb-2 text-center">Leave a Review</h1>
        <p className="text-body text-center mb-8">
          Share your experience working with the seller on this project.
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Star Rating */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-4">
              How would you rate this seller? *
            </label>
            
            <div className="flex items-center justify-center space-x-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => {
                const isActive = star <= (hoveredStar || formData.rating);
                return (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRatingChange(star)}
                    onMouseEnter={() => setHoveredStar(star)}
                    onMouseLeave={() => setHoveredStar(0)}
                    className="transition-all duration-200 hover:scale-110"
                  >
                    {isActive ? (
                      <StarIcon className="h-8 w-8 text-accent-orange" />
                    ) : (
                      <StarOutlineIcon className="h-8 w-8 text-neu-gray hover:text-accent-orange" />
                    )}
                  </button>
                );
              })}
            </div>
            
            <p className="text-center text-sm text-neu-gray">
              {getRatingText(hoveredStar || formData.rating)}
            </p>
            
            {errors.rating && (
              <p className="text-red-500 text-sm mt-2 text-center">{errors.rating}</p>
            )}
          </div>

          {/* Comment */}
          <div>
            <label htmlFor="comment" className="block text-sm font-semibold text-slate-700 mb-2">
              Share your experience *
            </label>
            <textarea
              id="comment"
              rows={6}
              value={formData.comment}
              onChange={(e) => handleCommentChange(e.target.value)}
              className="textarea-neu"
              placeholder="Describe your experience working with this seller. Was the work delivered on time? Did it meet your expectations? Any other feedback?"
            />
            <div className="flex justify-between items-center mt-2">
              {errors.comment && (
                <p className="text-red-500 text-sm">{errors.comment}</p>
              )}
              <p className="text-sm text-neu-gray ml-auto">
                {formData.comment.length}/1000
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="btn-secondary"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            
            <motion.button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: isSubmitting ? 1 : 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Submitting...
                </span>
              ) : (
                'Submit Review'
              )}
            </motion.button>
          </div>
        </form>

        {/* Review Guidelines */}
        <div className="mt-8 card-neu-inset">
          <h3 className="font-semibold text-slate-700 mb-2">Review Guidelines:</h3>
          <ul className="text-sm text-neu-gray space-y-1">
            <li>• Be honest and constructive in your feedback</li>
            <li>• Focus on the seller&apos;s work quality and professionalism</li>
            <li>• Mention specific aspects like communication, timeliness, and deliverables</li>
            <li>• Keep your review respectful and professional</li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
} 