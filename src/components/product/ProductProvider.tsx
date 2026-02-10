'use client';

import type { Product } from '@/lib/types';
import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/firebase/config';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';


type ProductInsert = Omit<Product, 'id' | 'created_at'>;
type ProductUpdate = Partial<ProductInsert>;

interface ProductContextType {
  products: Product[];
  loading: boolean;
  addProduct: (product: ProductInsert) => Promise<void>;
  updateProduct: (productId: string, product: ProductUpdate) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
}

export const ProductContext = createContext<ProductContextType | null>(null);

export const ProductProvider = ({ children }: { children: React.ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "products"));
      const fetchedProducts: Product[] = [];
      querySnapshot.forEach((doc) => {
        fetchedProducts.push({ id: doc.id, ...doc.data() } as Product);
      });
      fetchedProducts.sort((a, b) => a.name.localeCompare(b.name));
      setProducts(fetchedProducts);
    } catch (error) {
      console.error("Failed to fetch products from Firestore", error);
      toast({ 
        variant: 'destructive', 
        title: 'Error fetching products',
        description: "Could not fetch products. Ensure Firestore is set up and the 'products' collection exists."
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const addProduct = useCallback(async (productData: ProductInsert) => {
    try {
      await addDoc(collection(db, 'products'), {
        ...productData,
        created_at: serverTimestamp(),
      });
      await fetchProducts(); // Re-fetch to get the new product with its ID and ensure local state is in sync
      toast({
        title: "Product Created",
        description: `The product "${productData.name}" has been created.`,
      });
    } catch(error) {
      console.error('Error adding product:', error);
      toast({ variant: 'destructive', title: 'Error creating product.' });
    }
  }, [toast, fetchProducts]);

  const updateProduct = useCallback(async (productId: string, productData: ProductUpdate) => {
    try {
      const productRef = doc(db, 'products', productId);
      await updateDoc(productRef, productData);
      setProducts((prev) => prev.map((p) => (p.id === productId ? { ...p, ...productData } as Product : p)).sort((a,b) => a.name.localeCompare(b.name)));
      toast({
        title: "Product Updated",
        description: `The product has been updated.`,
      });
    } catch (error) {
      console.error('Error updating product:', error);
      toast({ variant: 'destructive', title: 'Error updating product.' });
    }
  }, [toast]);

  const deleteProduct = useCallback(async (productId: string) => {
    const productToDelete = products.find(p => p.id === productId);
    if (!productToDelete) return;

    try {
      await deleteDoc(doc(db, 'products', productId));
      setProducts((prev) => prev.filter((product) => product.id !== productId));
      toast({
        variant: 'destructive',
        title: "Product Deleted",
        description: `The product "${productToDelete.name}" has been deleted.`,
      });
    } catch(error) {
      console.error('Error deleting product:', error);
      toast({ variant: 'destructive', title: 'Error deleting product.' });
    }
  }, [toast, products]);

  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        addProduct,
        updateProduct,
        deleteProduct,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
