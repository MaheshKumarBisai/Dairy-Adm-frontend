import React, { useState } from 'react';
import { Plus, Edit2, Package, Check, AlertTriangle, Layers } from 'lucide-react';
import { Product, Category } from '../types';

interface ProductsPageProps {
  products: Product[];
  categories: Category[];
  onOpenCreate: () => void;
  onOpenEdit: (product: Product) => void;
  onToggleActive: (product: Product) => void;
}

export const ProductsPage: React.FC<ProductsPageProps> = ({
  products,
  categories,
  onOpenCreate,
  onOpenEdit,
  onToggleActive,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const filtered = products.filter((p) => {
    if (selectedCategory === 'ALL') return true;
    return p.categoryId === selectedCategory;
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        {/* Category filter pills */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button
            className={`header-btn ${selectedCategory === 'ALL' ? 'primary' : ''}`}
            onClick={() => setSelectedCategory('ALL')}
          >
            All Products ({products.length})
          </button>
          {categories.map((c) => {
            const count = products.filter((p) => p.categoryId === c.categoryId).length;
            return (
              <button
                key={c.categoryId}
                className={`header-btn ${selectedCategory === c.categoryId ? 'primary' : ''}`}
                onClick={() => setSelectedCategory(c.categoryId)}
              >
                {c.name} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="card-panel" style={{ padding: 60, textAlign: 'center' }}>
          <Package size={48} color="#CBD5E1" style={{ margin: '0 auto 12px auto' }} />
          <h3 style={{ fontSize: 18, fontWeight: 800 }}>No products found in this category</h3>
          <p style={{ fontSize: 13, color: '#64748B', marginTop: 4, marginBottom: 20 }}>
            Upload a raw image to auto-process white background and add products to the catalog.
          </p>
          <button className="header-btn primary" onClick={onOpenCreate}>
            <Plus size={16} />
            <span>Add First Product</span>
          </button>
        </div>
      ) : (
        <div className="products-grid">
          {filtered.map((product) => {
            const stock = product.inventory?.availableQuantity ?? 0;
            const primaryImg = product.imageUrl || (product.images && product.images[0]);
            const imageCount = product.images?.length || (product.imageUrl ? 1 : 0);

            return (
              <div key={product.productId} className="product-card">
                {/* Image canvas with white background */}
                <div className="product-image-canvas">
                  <div className="product-badge-group">
                    <span className="stock-pill">
                      {stock > 10 ? `${stock} in stock` : stock > 0 ? `Low: ${stock}` : 'Out of stock'}
                    </span>
                    {imageCount > 1 && (
                      <span
                        className="stock-pill"
                        style={{ background: 'rgba(5, 150, 105, 0.9)', display: 'flex', alignItems: 'center', gap: 3 }}
                        title={`${imageCount} images (front, back, reference)`}
                      >
                        <Layers size={10} />
                        <span>{imageCount} Angles</span>
                      </span>
                    )}
                  </div>

                  {primaryImg ? (
                    <img src={primaryImg} alt={product.name} />
                  ) : (
                    <div style={{ color: '#94A3B8', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                      <Package size={36} />
                      <span style={{ fontSize: 12 }}>No image</span>
                    </div>
                  )}
                </div>

                {/* Multi-image thumbnail strip if product has multiple images */}
                {product.images && product.images.length > 1 && (
                  <div
                    style={{
                      display: 'flex',
                      gap: 6,
                      padding: '4px 20px 8px 20px',
                      background: 'transparent',
                    }}
                  >
                    {product.images.map((img, i) => (
                      <div
                        key={i}
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 6,
                          background: '#FFFFFF',
                          border: '1px solid #E2E8F0',
                          overflow: 'hidden',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <img src={img} alt={`Angle ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                      </div>
                    ))}
                  </div>
                )}

                {/* Details */}
                <div className="product-details">
                  <div>
                    <div className="product-category-name">
                      {product.category?.name || 'Dairy'}
                    </div>
                    <h3 className="product-title">{product.name}</h3>
                    <p
                      style={{
                        fontSize: 12,
                        color: '#64748B',
                        lineHeight: 1.4,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {product.description || 'Farm-fresh certified dairy produce.'}
                    </p>
                  </div>

                  <div style={{ paddingTop: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <div className="product-price-row">
                        <span className="product-price">₹{product.price}</span>
                        <span className="product-unit">/ {product.unit}</span>
                      </div>
                      <button
                        className="header-btn"
                        style={{ padding: '6px 12px', fontSize: 12 }}
                        onClick={() => onOpenEdit(product)}
                      >
                        <Edit2 size={13} />
                        <span>Edit</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
