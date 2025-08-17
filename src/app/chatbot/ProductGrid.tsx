import React from 'react';

const formatPrice = (price: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);

const ProductGrid = ({ products }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-[300px] sm:w-[350px]">
    {products.map((product) => (
      <div
        key={product.id}
        className="bg-white border rounded-lg shadow-sm p-3 flex flex-col items-center"
      >
        <img
          src={product.imageurl}
          alt={product.name}
          className="w-24 h-24 object-cover rounded mb-2"
        />
        <div className="font-semibold text-sm text-center">{product.name}</div>
        <div className="text-xs text-gray-500 text-center mb-1">{product.description}</div>
        <div className="flex items-center gap-2">
          <span className="text-blue-600 font-bold">{formatPrice(product.discounted_price)}</span>
          {product.discounted_price < product.price && (
            <span className="text-xs line-through text-gray-400">{formatPrice(product.price)}</span>
          )}
        </div>
      </div>
    ))}
  </div>
);

export default ProductGrid;
