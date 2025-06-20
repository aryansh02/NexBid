'use client';

import { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { motion } from 'framer-motion';
import { z } from 'zod';
import { api } from '@/lib/api';

const bidSchema = z.object({
  amount: z.number().positive('Bid amount must be positive'),
  etaDays: z.number().positive('ETA must be positive').max(365, 'ETA cannot exceed 365 days'),
  message: z.string().min(1, 'Message is required').max(1000, 'Message must be less than 1000 characters'),
  sellerId: z.string().min(1, 'Seller ID is required'), // TODO: Remove when JWT auth is implemented
});

type BidForm = z.infer<typeof bidSchema>;

interface BidModalProps {
  projectId: string;
  onClose: () => void;
  onBidSubmitted: () => void;
}

export default function BidModal({ projectId, onClose, onBidSubmitted }: BidModalProps) {
  const [formData, setFormData] = useState<BidForm>({
    amount: 0,
    etaDays: 0,
    message: '',
    sellerId: 'seller-1-id', // TODO: Get from auth context
  });
  const [errors, setErrors] = useState<Partial<Record<keyof BidForm, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof BidForm, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    try {
      bidSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Partial<Record<keyof BidForm, string>> = {};
        error.errors.forEach((err) => {
          if (err.path.length > 0) {
            const field = err.path[0] as keyof BidForm;
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
      await api.createBid(projectId, formData);
      onBidSubmitted();
    } catch (error) {
      console.error('Failed to create bid:', error);
      setErrors({ message: 'Failed to place bid. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Transition appear show={true} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform card-neu-inset text-left align-middle transition-all">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Dialog.Title as="h3" className="heading-secondary mb-6 text-center">
                    Place Your Bid
                  </Dialog.Title>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Bid Amount */}
                    <div>
                      <label htmlFor="amount" className="block text-sm font-semibold text-slate-700 mb-2">
                        Bid Amount ($) *
                      </label>
                      <input
                        type="number"
                        id="amount"
                        value={formData.amount || ''}
                        onChange={(e) => handleInputChange('amount', Number(e.target.value))}
                        className="input-neu"
                        placeholder="Enter your bid amount"
                        min="0"
                        step="0.01"
                      />
                      {errors.amount && (
                        <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
                      )}
                    </div>

                    {/* ETA */}
                    <div>
                      <label htmlFor="etaDays" className="block text-sm font-semibold text-slate-700 mb-2">
                        Estimated Days to Complete *
                      </label>
                      <input
                        type="number"
                        id="etaDays"
                        value={formData.etaDays || ''}
                        onChange={(e) => handleInputChange('etaDays', Number(e.target.value))}
                        className="input-neu"
                        placeholder="How many days will you need?"
                        min="1"
                        max="365"
                      />
                      {errors.etaDays && (
                        <p className="text-red-500 text-sm mt-1">{errors.etaDays}</p>
                      )}
                    </div>

                    {/* Message */}
                    <div>
                      <label htmlFor="message" className="block text-sm font-semibold text-slate-700 mb-2">
                        Proposal Message *
                      </label>
                      <textarea
                        id="message"
                        rows={4}
                        value={formData.message}
                        onChange={(e) => handleInputChange('message', e.target.value)}
                        className="textarea-neu"
                        placeholder="Explain why you're the best fit for this project..."
                      />
                      {errors.message && (
                        <p className="text-red-500 text-sm mt-1">{errors.message}</p>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-3 pt-4">
                      <button
                        type="button"
                        onClick={onClose}
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
                            Placing Bid...
                          </span>
                        ) : (
                          'Place Bid'
                        )}
                      </motion.button>
                    </div>
                  </form>
                </motion.div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
} 