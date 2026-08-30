'use client';

import { useState } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { Document } from '@/store/documentStore';

interface DocumentUploadProps {
  projectId: string;
  parcelId?: string;
  onUploadComplete?: (document: Document) => void;
  onUploadError?: (error: string) => void;
}

export function DocumentUpload({
  projectId,
  parcelId,
  onUploadComplete,
  onUploadError,
}: DocumentUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    setUploading(true);
    for (const file of selectedFiles) {
      try {
        // Simulate upload progress
        for (let i = 0; i <= 100; i += 10) {
          await new Promise(resolve => setTimeout(resolve, 100));
          setUploadProgress(prev => ({
            ...prev,
            [file.name]: i,
          }));
        }

        onUploadComplete?.({
          id: `DOC-${Date.now()}`,
          documentId: `DOC-ID-${Math.random().toString(36).substr(2, 9)}`,
          projectId,
          parcelId,
          category: 'legal_documents',
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
          status: 'uploaded',
          version: 1,
          uploadedBy: 'Current User',
          uploadedDate: new Date(),
          s3Key: `documents/${projectId}/${file.name}`,
        });
      } catch (error) {
        onUploadError?.(error instanceof Error ? error.message : 'Upload failed');
      }
    }

    setSelectedFiles([]);
    setUploadProgress({});
    setUploading(false);
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`card p-8 border-2 border-dashed rounded-lg transition ${
          isDragging
            ? 'border-gov-accent bg-gov-50'
            : 'border-gray-300 bg-white hover:border-gov-accent'
        }`}
      >
        <div className="text-center">
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-lg font-semibold text-gov-900 mb-1">
            Drag and drop documents here
          </p>
          <p className="text-sm text-gray-600 mb-4">or click to browse</p>
          <input
            type="file"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            id="file-upload"
            accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
          />
          <label
            htmlFor="file-upload"
            className="inline-block px-6 py-2 bg-gov-accent text-white rounded-lg font-medium hover:bg-blue-700 transition cursor-pointer"
          >
            Select Files
          </label>
          <p className="text-xs text-gray-500 mt-3">
            Supported formats: PDF, DOC, XLS, JPG, PNG (Max 50MB)
          </p>
        </div>
      </div>

      {/* Selected Files */}
      {selectedFiles.length > 0 && (
        <div className="card p-4 space-y-3">
          <h3 className="font-semibold text-gov-900">
            Selected Files ({selectedFiles.length})
          </h3>
          <div className="space-y-2">
            {selectedFiles.map((file, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <FileText className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gov-900 truncate">{file.name}</p>
                  <p className="text-xs text-gray-600">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <button
                  onClick={() => handleRemoveFile(index)}
                  className="text-red-600 hover:bg-red-50 p-2 rounded transition"
                  disabled={uploading}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {/* Upload Button */}
          <button
            onClick={handleUpload}
            disabled={uploading || selectedFiles.length === 0}
            className="w-full px-4 py-2 bg-gov-accent text-white rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
          >
            {uploading ? 'Uploading...' : 'Upload Documents'}
          </button>
        </div>
      )}

      {/* Upload Progress */}
      {Object.keys(uploadProgress).length > 0 && (
        <div className="card p-4 space-y-3">
          <h3 className="font-semibold text-gov-900">Upload Progress</h3>
          {Object.entries(uploadProgress).map(([fileName, progress]) => (
            <div key={fileName}>
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm text-gov-900 truncate">{fileName}</p>
                <span className="text-xs font-medium text-gov-600">{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gov-accent h-full rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
