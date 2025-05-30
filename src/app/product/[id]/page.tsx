// app/product/[id]/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Product = {
  _id: string;
  name: string;
  image: string;
  price: number;
  description: string;
};

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (!id) return;
    fetch(`https://glore-bd-backend-node-mongo.vercel.app/api/product/${id}`)
      .then(res => res.json())
      .then(data => setProduct(data.product))
      .catch(err => console.error("Error fetching product:", err));
  }, [id]);

  if (!product) return <p className="p-6">Loading product...</p>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-[400px] object-cover rounded-xl mb-6"
      />
      <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
      <p className="text-xl text-gray-600 mb-2">${product.price}</p>
      <p className="text-lg text-gray-800">{product.description}</p>
    </div>
  );
}
