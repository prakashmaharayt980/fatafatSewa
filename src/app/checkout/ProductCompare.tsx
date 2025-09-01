import React from 'react';

export const ProductCompare = ({ products = [] }) => {
  if (products.length === 0) return <p>No products to compare.</p>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded-xl shadow-md">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-4 text-left font-bold">Feature</th>
            {products.map((product) => (
              <th key={product.id} className="p-4 text-left font-bold">
                {product.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="border-t">
            <td className="p-4 font-medium">Price</td>
            {products.map((product) => (
              <td key={product.id} className="p-4">
                ${product.price.toFixed(2)}
              </td>
            ))}
          </tr>
          <tr className="border-t">
            <td className="p-4 font-medium">Description</td>
            {products.map((product) => (
              <td key={product.id} className="p-4">
                {product.description || 'N/A'}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};