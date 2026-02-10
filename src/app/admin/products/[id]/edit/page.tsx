'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useRouter, useParams, notFound } from 'next/navigation';
import { useProducts } from '@/hooks/use-products';
import { useCategories } from '@/hooks/use-categories';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { IKUpload } from 'imagekitio-react';
import { useToast } from '@/hooks/use-toast';
import NextImage from 'next/image';
import { X, ArrowLeft } from 'lucide-react';
import type { Product } from '@/lib/types';
import { db } from '@/firebase/config';
import { doc, getDoc } from 'firebase/firestore';


const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.coerce.number().min(0.01, 'Price must be greater than 0'),
  category_id: z.string().min(1, 'Category is required'),
  stock: z.coerce.number().min(0, 'Stock cannot be negative'),
  images: z.array(z.string()).min(1, 'At least one image is required'),
});

type ProductFormValues = z.infer<typeof productSchema>;

function ProductFormSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-20 w-full" />
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="space-y-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
       <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
         <Skeleton className="h-28 w-full border-2 border-dashed rounded-lg" />
      </div>
    </div>
  );
}

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const { updateProduct } = useProducts();
  const { categories } = useCategories();
  const productId = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      category_id: '',
      stock: 0,
      images: [],
    },
  });

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;
      setLoading(true);
      try {
        const productRef = doc(db, 'products', productId);
        const docSnap = await getDoc(productRef);
        
        if (!docSnap.exists()) {
          console.error('No such product found!');
          notFound();
        } else {
          const data = docSnap.data();
          const productData = { id: docSnap.id, ...data } as Product;
          setProduct(productData);
          form.reset({
              name: productData.name,
              description: productData.description,
              price: productData.price,
              category_id: productData.category_id,
              stock: productData.stock,
              images: productData.images || [],
          });
          setImageUrls(productData.images || []);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        notFound();
      }
      setLoading(false);
    };

    fetchProduct();
  }, [productId, form]);
  
  useEffect(() => {
    form.setValue('images', imageUrls);
  }, [imageUrls, form]);

  async function onSubmit(data: ProductFormValues) {
    setIsSubmitting(true);
    const productData = {
      ...data,
      images: imageUrls,
    };
    await updateProduct(productId, productData);
    router.push('/admin/products');
    setIsSubmitting(false);
  }

  const handleUploadSuccess = (res: any) => {
    setImageUrls((prev) => [...prev, res.url]);
    setIsUploading(false);
    toast({ title: 'Image uploaded successfully!' });
  };
  
  const handleUploadError = (err: any) => {
    console.error('Image upload error:', err);
    setIsUploading(false);
    toast({ variant: 'destructive', title: 'Image upload failed.' });
  };

  const removeImage = (urlToRemove: string) => {
    setImageUrls(prev => prev.filter(url => url !== urlToRemove));
  };


  if (loading || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold">Edit Product</h1>
        </div>
        <ProductFormSkeleton />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex items-center justify-between flex-1">
          <h1 className="text-3xl font-bold">Edit Product</h1>
          <Button asChild variant="outline">
            <Link href="/admin/products">Cancel</Link>
          </Button>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Elegant Trench Coat" {...field} disabled={isSubmitting}/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Describe the product..." {...field} disabled={isSubmitting}/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid md:grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} disabled={isSubmitting}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stock</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} disabled={isSubmitting}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} disabled={isSubmitting}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="images"
            render={() => (
              <FormItem>
                <FormLabel>Product Images</FormLabel>
                 <FormControl>
                  <div className="p-4 border-2 border-dashed rounded-lg text-center">
                    <IKUpload
                      folder="/products"
                      multiple
                      onUploadStart={() => setIsUploading(true)}
                      onSuccess={handleUploadSuccess}
                      onError={handleUploadError}
                      disabled={isSubmitting || isUploading}
                    />
                    {isUploading && <p className="mt-2 text-sm text-muted-foreground animate-pulse">Uploading...</p>}
                  </div>
                </FormControl>
                <FormDescription>
                  Upload new images. They will be added to the existing ones.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
           {imageUrls.length > 0 && (
            <div>
              <h4 className="font-medium mb-2 text-sm">Image Previews:</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {imageUrls.map((url, index) => (
                  <div key={index} className="relative aspect-square group">
                    <NextImage src={url} alt={`Uploaded product image ${index + 1}`} fill sizes="(max-width: 768px) 50vw, 20vw" className="object-cover rounded-md" />
                     <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeImage(url)}
                      disabled={isSubmitting}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => router.push('/admin/products')} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
