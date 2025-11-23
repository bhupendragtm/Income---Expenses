import { useState } from 'react';
import apiClient from '../api/client';

export default function FileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<any | null>(null);
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError('');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      setFile(droppedFile);
      setError('');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const res = await apiClient.uploadFile(file);
      setUploadedFile(res.data || res);
      setFile(null);
      alert('File uploaded successfully');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">File Upload</h1>

      <div className="bg-white rounded-lg shadow-md p-8 space-y-6">
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className="border-2 border-dashed border-blue-400 rounded-lg p-8 text-center cursor-pointer hover:border-blue-600 transition"
        >
          <div className="text-gray-600">
            <p className="text-lg font-semibold mb-2">Drag and drop your file here</p>
            <p className="text-sm text-gray-500">or click to select</p>
          </div>
          <input
            type="file"
            onChange={handleFileChange}
            className="hidden"
            id="fileInput"
          />
          <label htmlFor="fileInput" className="cursor-pointer">
            <div className="mt-4">
              {file ? (
                <p className="text-blue-600 font-semibold">{file.name}</p>
              ) : (
                <p className="text-gray-500">No file selected</p>
              )}
            </div>
          </label>
        </div>

        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>}

        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 transition font-semibold"
        >
          {uploading ? 'Uploading...' : 'Upload File'}
        </button>

        {uploadedFile && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-800 mb-2">File Uploaded Successfully</h3>
            <div className="text-sm text-green-700 space-y-1">
              <p>
                <strong>Filename:</strong> {uploadedFile.filename || uploadedFile.originalname}
              </p>
              {uploadedFile.url && (
                <p>
                  <strong>URL:</strong>{' '}
                  <a href={uploadedFile.url} target="_blank" rel="noopener noreferrer" className="underline">
                    {uploadedFile.url}
                  </a>
                </p>
              )}
              {uploadedFile.size && <p>
                <strong>Size:</strong> {(uploadedFile.size / 1024).toFixed(2)} KB
              </p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
