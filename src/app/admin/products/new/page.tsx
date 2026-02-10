'use client';

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
import { useRouter } from 'next/navigation';
import { useProducts } from '@/hooks/use-products';
import { useCategories } from '@/hooks/use-categories';
import Link from 'next/link';
import { IKUpload } from 'imagekitio-react';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import NextImage from 'next/image';
import { X, ArrowLeft } from 'lucide-react';

const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.coerce.number().min(0.01, 'Price must be greater than 0'),
  category_id: z.string().min(1, 'Category is required'),
  stock: z.coerce.number().min(0, 'Stock cannot be negative'),
  images: z.array(z.string()).min(1, 'At least one image is required'),
});

type ProductFormValues = z.infer<typeof productSchema>;

export default function NewProductPage() {
  const router = useRouter();
  const { addProduct } = useProducts();
  const { categories } = useCategories();
  const { toast } = useToast();
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [isUploading, setIsUploading] = useState(false);
  
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
    form.setValue('images', imageUrls);
  }, [imageUrls, form]);


  async function onSubmit(data: ProductFormValues) {
    setIsSubmitting(true);
    const productData = {
      ...data,
      images: imageUrls, 
    };
    await addProduct(productData);
    router.push('/admin/products');
    setIsSubmitting(false);
  }

  const removeImage = (urlToRemove: string) => {
    setImageUrls(prev => prev.filter(url => url !== urlToRemove));
  };

  return (
    <div>
      <div className="flex flex-col gap-4 mb-8">
        <Button variant="ghost" onClick={() => router.back()} className="w-fit p-0 h-auto hover:bg-transparent text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to list
        </Button>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Add New Product</h1>
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
                  <Input placeholder="e.g. Elegant Trench Coat" {...field} disabled={isSubmitting} />
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
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
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
                      onSuccess={(res) => {
                        setImageUrls((prev) => [...prev, res.url]);
                        setIsUploading(false);
                        toast({ title: 'Image uploaded successfully!' });
                      }}
                      onError={(err) => {
                        console.error('Image upload error:', err);
                        setIsUploading(false);
                        toast({ variant: 'destructive', title: 'Image upload failed.' });
                      }}
                      disabled={isSubmitting || isUploading}
                    />
                    {isUploading && <p className="mt-2 text-sm text-muted-foreground animate-pulse">Uploading...</p>}
                  </div>
                </FormControl>
                <FormDescription>
                  Upload one or more images for the product (up to 5 images recommended).
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {imageUrls.length > 0 && (
            <div>
              <h4 className="font-medium mb-2 text-sm">Uploaded Images Preview:</h4>
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
              {isSubmitting ? 'Adding Product...' : 'Add Product'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
