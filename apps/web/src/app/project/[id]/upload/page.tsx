'use client';

import { useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CloudArrowUpIcon, DocumentIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { api } from '@/lib/api';

export default function UploadPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      setFile(files[0]);
      setError(null);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFile(files[0]);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      
      await api.uploadDeliverable(projectId, file);
      setUploaded(true);
      
      // Redirect after a short delay to show success state
      setTimeout(() => {
        router.push(`/project/${projectId}`);
      }, 2000);
    } catch (err) {
      setError('Failed to upload file. Please try again.');
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (uploaded) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md mx-auto py-16"
      >
        <div className="card-neu text-center p-8">
          <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="heading-secondary mb-2">Upload Successful!</h2>
          <p className="text-body mb-4">Your deliverable has been uploaded successfully.</p>
          <div className="bg-green-100 border border-green-200 rounded-xl p-4">
            <p className="text-green-800 text-sm">
                             The project buyer will be notified about your deliverable. You&apos;ll be redirected to the project page shortly.
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
        <h1 className="heading-primary mb-2 text-center">Upload Deliverable</h1>
        <p className="text-body text-center mb-8">
          Upload your completed work for this project. The buyer will be notified once uploaded.
        </p>

        {/* Drag and Drop Zone */}
        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
            dragOver
              ? 'border-primary-500 bg-primary-50'
              : file
              ? 'border-green-400 bg-green-50'
              : 'border-teal-400 hover:bg-teal-50'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            className="hidden"
            accept=".pdf,.doc,.docx,.zip,.rar,.jpg,.jpeg,.png,.gif"
          />

          {file ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <DocumentIcon className="h-12 w-12 text-green-500 mx-auto" />
              <div>
                <p className="font-semibold text-slate-700">{file.name}</p>
                <p className="text-sm text-neu-gray">{formatFileSize(file.size)}</p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                }}
                className="text-sm text-red-500 hover:text-red-700"
              >
                Remove file
              </button>
            </motion.div>
          ) : (
            <div className="space-y-4">
              <CloudArrowUpIcon className="h-12 w-12 text-teal-500 mx-auto" />
              <div>
                <p className="text-lg font-semibold text-slate-700">
                  Drop your file here, or <span className="text-primary-500">browse</span>
                </p>
                <p className="text-sm text-neu-gray mt-2">
                  Supports: PDF, DOC, DOCX, ZIP, RAR, JPG, PNG, GIF (max 10MB)
                </p>
              </div>
            </div>
          )}
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 bg-red-100 border border-red-200 rounded-xl p-4"
          >
            <p className="text-red-800 text-sm">{error}</p>
          </motion.div>
        )}

        {/* Upload Button */}
        <div className="flex justify-end mt-8 space-x-4">
          <button
            onClick={() => router.back()}
            className="btn-secondary"
            disabled={uploading}
          >
            Cancel
          </button>
          
          <motion.button
            onClick={handleUpload}
            disabled={!file || uploading}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: !file || uploading ? 1 : 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {uploading ? (
              <span className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Uploading...
              </span>
            ) : (
              'Upload Deliverable'
            )}
          </motion.button>
        </div>

        {/* Instructions */}
        <div className="mt-8 card-neu-inset">
          <h3 className="font-semibold text-slate-700 mb-2">Upload Guidelines:</h3>
          <ul className="text-sm text-neu-gray space-y-1">
            <li>• Ensure your deliverable meets all project requirements</li>
            <li>• Include documentation or instructions if necessary</li>
            <li>• Use descriptive filenames for easy identification</li>
            <li>• The buyer will be automatically notified via email</li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
} 