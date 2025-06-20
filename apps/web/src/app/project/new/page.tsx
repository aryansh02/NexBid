'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { z } from 'zod';
import { api } from '@/lib/api';

const createProjectSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  description: z.string().min(1, 'Description is required').max(2000, 'Description must be less than 2000 characters'),
  minBudget: z.number().positive('Minimum budget must be positive'),
  maxBudget: z.number().positive('Maximum budget must be positive'),
  deadline: z.string().min(1, 'Deadline is required'),
  buyerId: z.string().min(1, 'Buyer ID is required'), // TODO: Remove when JWT auth is implemented
}).refine((data) => data.maxBudget >= data.minBudget, {
  message: "Maximum budget must be greater than or equal to minimum budget",
  path: ["maxBudget"],
});

type CreateProjectForm = z.infer<typeof createProjectSchema>;

export default function NewProjectPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<CreateProjectForm>({
    title: '',
    description: '',
    minBudget: 0,
    maxBudget: 0,
    deadline: '',
    buyerId: 'buyer-1-id', // TODO: Get from auth context
  });
  const [errors, setErrors] = useState<Partial<Record<keyof CreateProjectForm, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof CreateProjectForm, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    try {
      createProjectSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Partial<Record<keyof CreateProjectForm, string>> = {};
        error.errors.forEach((err) => {
          if (err.path.length > 0) {
            const field = err.path[0] as keyof CreateProjectForm;
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
      await api.createProject(formData);
      router.push('/dashboard');
    } catch (error) {
      console.error('Failed to create project:', error);
      setErrors({ title: 'Failed to create project. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-2xl mx-auto py-8"
    >
      <div className="card-neu">
        <h1 className="heading-primary mb-8 text-center">Create Project</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
            <label htmlFor="title" className="text-sm font-semibold text-slate-700 md:text-right md:pt-3">
              Project Title *
            </label>
            <div className="md:col-span-2">
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="input-neu"
                placeholder="Enter a descriptive project title"
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
            <label htmlFor="description" className="text-sm font-semibold text-slate-700 md:text-right md:pt-3">
              Description *
            </label>
            <div className="md:col-span-2">
              <textarea
                id="description"
                rows={6}
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="textarea-neu"
                placeholder="Describe your project requirements, deliverables, and expectations..."
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description}</p>
              )}
            </div>
          </div>

          {/* Budget Range */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
            <label className="text-sm font-semibold text-slate-700 md:text-right md:pt-3">
              Budget Range *
            </label>
            <div className="md:col-span-2 grid grid-cols-2 gap-4">
              <div>
                <input
                  type="number"
                  value={formData.minBudget || ''}
                  onChange={(e) => handleInputChange('minBudget', Number(e.target.value))}
                  className="input-neu"
                  placeholder="Min ($)"
                  min="0"
                />
                {errors.minBudget && (
                  <p className="text-red-500 text-sm mt-1">{errors.minBudget}</p>
                )}
              </div>
              <div>
                <input
                  type="number"
                  value={formData.maxBudget || ''}
                  onChange={(e) => handleInputChange('maxBudget', Number(e.target.value))}
                  className="input-neu"
                  placeholder="Max ($)"
                  min="0"
                />
                {errors.maxBudget && (
                  <p className="text-red-500 text-sm mt-1">{errors.maxBudget}</p>
                )}
              </div>
            </div>
          </div>

          {/* Deadline */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
            <label htmlFor="deadline" className="text-sm font-semibold text-slate-700 md:text-right md:pt-3">
              Deadline *
            </label>
            <div className="md:col-span-2">
              <input
                type="datetime-local"
                id="deadline"
                value={formData.deadline}
                onChange={(e) => handleInputChange('deadline', e.target.value)}
                className="input-neu"
                min={new Date().toISOString().slice(0, 16)}
              />
              {errors.deadline && (
                <p className="text-red-500 text-sm mt-1">{errors.deadline}</p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-6">
            <motion.button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary px-8 disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: isSubmitting ? 1 : 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating...
                </span>
              ) : (
                'Create Project'
              )}
            </motion.button>
          </div>
        </form>
      </div>
    </motion.div>
  );
} 