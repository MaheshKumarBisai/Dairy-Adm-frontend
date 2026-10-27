import React, { useState, useEffect } from 'react';
import { X, UploadCloud, CheckCircle2, Loader2, Image as ImageIcon } from 'lucide-react';
import { Product, Category } from '../types';
import { api } from '../services/api';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (product: Product) => void;
  categories: Category[];
  editingProduct?: Product | null;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  categories,
  editingProduct,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [price, setPrice] = useState('40');
  const [unit, setUnit] = useState('500ml');
  const [stock, setStock] = useState('50');

  // 3 Images state
  const [frontUrl, setFrontUrl] = useState<string | null>(null);
  const [backUrl, setBackUrl] = useState<string | null>(null);
  const [detailUrl, setDetailUrl] = useState<string | null>(null);

  const [processingSlot, setProcessingSlot] = useState<'front' | 'back' | 'detail' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (editingProduct) {
      setName(editingProduct.name);
      setDescription(editingProduct.description || '');
      setCategoryId(editingProduct.categoryId);
      setPrice(String(editingProduct.price));
      setUnit(editingProduct.unit || '500ml');
      setStock(String(editingProduct.inventory?.availableQuantity ?? 50));
      setFrontUrl(editingProduct.images?.[0] || editingProduct.imageUrl || null);
      setBackUrl(editingProduct.images?.[1] || null);
      setDetailUrl(editingProduct.images?.[2] || null);
    } else {
      setName('');
      setDescription('');
      setCategoryId(categories[0]?.categoryId || 'CAT-100001');
      setPrice('40');
      setUnit('500ml');
      setStock('50');
      setFrontUrl(null);
      setBackUrl(null);
      setDetailUrl(null);
    }
    setError(null);
  }, [editingProduct, categories, isOpen]);

  if (!isOpen) return null;

  // Handle image upload for a specific slot with auto-white background processing
  const handleFileUpload = async (slot: 'front' | 'back' | 'detail', file: File) => {
    try {
      setProcessingSlot(slot);
      setError(null);

      const filesObj: any = {};
      if (slot === 'front') filesObj.frontImage = file;
      if (slot === 'back') filesObj.backImage = file;
      if (slot === 'detail') filesObj.detailImage = file;

      const result = await api.uploadProductImages(filesObj);
      const processedUrl = result.images[0] || result.primaryUrl;

      if (slot === 'front') setFrontUrl(processedUrl);
      if (slot === 'back') setBackUrl(processedUrl);
      if (slot === 'detail') setDetailUrl(processedUrl);
    } catch (err: any) {
      setError(`Failed to process image: ${err.message}`);
    } finally {
      setProcessingSlot(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide a product name');
      return;
    }
    if (!categoryId) {
      setError('Please select a category');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const allImages = [frontUrl, backUrl, detailUrl].filter(Boolean) as string[];
      const primaryImage = allImages[0] || null;

      if (editingProduct) {
        const updated = await api.updateProduct(editingProduct.productId, {
          name,
          description,
          categoryId,
          price: Number(price),
          unit,
          stock: Number(stock),
          imageUrl: primaryImage || undefined,
          images: allImages,
        });
        onSuccess(updated);
      } else {
        const created = await api.createProduct({
          name,
          description,
          categoryId,
          price: Number(price),
          unit,
          initialStock: Number(stock),
          imageUrl: primaryImage || undefined,
          images: allImages,
        });
        onSuccess(created);
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save product');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 800 }}>
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h3>
            <p style={{ fontSize: 13, color: '#64748B' }}>
              Changes automatically reflect across customer & delivery apps
            </p>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748B' }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && (
              <div
                style={{
                  background: '#FEF2F2',
                  border: '1px solid #FECACA',
                  padding: '10px 14px',
                  borderRadius: 10,
                  color: '#991B1B',
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                {error}
              </div>
            )}

            {/* PRODUCT IMAGES (3 SLOTS WITH AUTO-WHITE BACKGROUND) */}
            <div className="form-group">
              <label className="form-label">Product Images (Up to 3 Angles)</label>
              <div className="image-slots-grid">
                {/* SLOT 1: FRONT VIEW */}
                <label className={`upload-slot ${frontUrl ? 'has-image' : ''}`}>
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      if (e.target.files?.[0]) handleFileUpload('front', e.target.files[0]);
                    }}
                    disabled={processingSlot === 'front'}
                  />
                  {processingSlot === 'front' ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                      <Loader2 size={24} className="animate-spin" color="#059669" />
                      <span style={{ fontSize: 11, color: '#059669', fontWeight: 700 }}>Processing...</span>
                    </div>
                  ) : frontUrl ? (
                    <>
                      <img src={frontUrl} alt="Front View" />
                      <span className="slot-tag">Front View (Primary)</span>
                    </>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: 10 }}>
                      <UploadCloud size={24} color="#94A3B8" />
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#475569' }}>Front View</span>
                    </div>
                  )}
                </label>

                {/* SLOT 2: BACK VIEW */}
                <label className={`upload-slot ${backUrl ? 'has-image' : ''}`}>
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      if (e.target.files?.[0]) handleFileUpload('back', e.target.files[0]);
                    }}
                    disabled={processingSlot === 'back'}
                  />
                  {processingSlot === 'back' ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                      <Loader2 size={24} className="animate-spin" color="#059669" />
                      <span style={{ fontSize: 11, color: '#059669', fontWeight: 700 }}>Processing...</span>
                    </div>
                  ) : backUrl ? (
                    <>
                      <img src={backUrl} alt="Back View" />
                      <span className="slot-tag">Back View</span>
                    </>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: 10 }}>
                      <UploadCloud size={24} color="#94A3B8" />
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#475569' }}>Back View</span>
                    </div>
                  )}
                </label>

                {/* SLOT 3: DETAIL VIEW */}
                <label className={`upload-slot ${detailUrl ? 'has-image' : ''}`}>
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      if (e.target.files?.[0]) handleFileUpload('detail', e.target.files[0]);
                    }}
                    disabled={processingSlot === 'detail'}
                  />
                  {processingSlot === 'detail' ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                      <Loader2 size={24} className="animate-spin" color="#059669" />
                      <span style={{ fontSize: 11, color: '#059669', fontWeight: 700 }}>Processing...</span>
                    </div>
                  ) : detailUrl ? (
                    <>
                      <img src={detailUrl} alt="Detail View" />
                      <span className="slot-tag">Side / Detail</span>
                    </>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: 10 }}>
                      <UploadCloud size={24} color="#94A3B8" />
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#475569' }}>Side View</span>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* BASIC DETAILS */}
            <div className="form-group">
              <label className="form-label">Product Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Pure Farm Cow Milk"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  required
                >
                  {categories.map((c) => (
                    <option key={c.categoryId} value={c.categoryId}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Pack Unit</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. 500ml, 1L, 200g"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Price (₹)</label>
                <input
                  type="number"
                  className="form-input"
                  min="1"
                  step="0.5"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Available Stock</label>
                <input
                  type="number"
                  className="form-input"
                  min="0"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                className="form-textarea"
                rows={3}
                placeholder="Fresh organic milk sourced directly from local ethical dairy farms..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="header-btn" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button
              type="submit"
              className="header-btn primary"
              disabled={isSubmitting || processingSlot !== null}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>{editingProduct ? 'Save Changes' : 'Create Product'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
