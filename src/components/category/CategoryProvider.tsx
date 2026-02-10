'use client';

import type { Category } from '@/lib/types';
import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/firebase/config';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';

interface CategoryContextType {
  categories: Category[];
  loading: boolean;
  addCategory: (category: Omit<Category, 'id' | 'created_at'>) => Promise<void>;
  updateCategory: (categoryId: string, category: Omit<Category, 'id' | 'created_at'>) => Promise<void>;
  deleteCategory: (categoryId: string) => Promise<void>;
}

export const CategoryContext = createContext<CategoryContextType | null>(null);

export const CategoryProvider = ({ children }: { children: React.ReactNode }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "categories"));
      const fetchedCategories: Category[] = [];
      querySnapshot.forEach((doc) => {
        fetchedCategories.push({ id: doc.id, ...doc.data() } as Category);
      });
      setCategories(fetchedCategories.sort((a, b) => a.name.localeCompare(b.name)));
    } catch (error: any) {
      console.error("Failed to fetch categories from Firestore", error);
      toast({ 
        variant: 'destructive', 
        title: "Error fetching categories",
        description: error.message || "Could not fetch categories. Ensure Firestore is set up and the 'categories' collection exists."
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);


  const addCategory = useCallback(async (categoryData: Omit<Category, 'id' | 'created_at'>) => {
    try {
      const docRef = await addDoc(collection(db, 'categories'), {
        ...categoryData,
        created_at: serverTimestamp(),
      });
      const newCategory = { id: docRef.id, ...categoryData } as Category;
      setCategories(prev => [...prev, newCategory].sort((a, b) => a.name.localeCompare(b.name)));
      toast({
        title: "Category Created",
        description: `The category "${categoryData.name}" has been created.`,
      });
    } catch (error: any) {
      console.error('Error adding category:', error);
      toast({ 
        variant: 'destructive', 
        title: "Error creating category.",
        description: error.message || "Please check Firestore permissions."
      });
    }
  }, [toast]);

  const updateCategory = useCallback(async (categoryId: string, categoryData: Omit<Category, 'id' | 'created_at'>) => {
    try {
      const categoryRef = doc(db, 'categories', categoryId);
      await updateDoc(categoryRef, categoryData);
       setCategories((prevCategories) =>
        prevCategories.map((c) => (c.id === categoryId ? { ...c, ...categoryData } as Category : c)).sort((a, b) => a.name.localeCompare(b.name))
      );
      toast({
        title: "Category Updated",
        description: `The category "${categoryData.name}" has been updated.`,
      });
    } catch (error: any) {
      console.error('Error updating category:', error);
      toast({ 
        variant: 'destructive', 
        title: "Error updating category.",
        description: error.message || "Please check Firestore permissions."
      });
    }
  }, [toast]);

  const deleteCategory = useCallback(async (categoryId: string) => {
    const categoryToDelete = categories.find(c => c.id === categoryId);
    if (!categoryToDelete) return;

    try {
      await deleteDoc(doc(db, 'categories', categoryId));
      setCategories((prevCategories) => prevCategories.filter((category) => category.id !== categoryId));
      toast({
        variant: 'destructive',
        title: "Category Deleted",
        description: `The category "${categoryToDelete.name}" has been deleted.`,
      });
    } catch (error: any) {
      console.error('Error deleting category:', error);
      toast({ 
        variant: 'destructive', 
        title: "Error deleting category.",
        description: error.message || "Please check Firestore permissions."
      });
    }
  }, [toast, categories]);

  return (
    <CategoryContext.Provider
      value={{
        categories,
        loading,
        addCategory,
        updateCategory,
        deleteCategory,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};
