'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useCategories } from '@/hooks/use-categories';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { MoreHorizontal, PlusCircle, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import type { Category } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

const categorySchema = z.object({
  name: z.string().min(1, 'Category name is required'),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

function CategoriesTableSkeleton() {
  return (
    <div className="rounded-lg border shadow-sm">
        <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(3)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-8 w-8 inline-block" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
    </div>
  )
}

export default function AdminCategoriesPage() {
  const router = useRouter();
  const { categories, loading, addCategory, updateCategory, deleteCategory } = useCategories();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: '' },
  });

  useEffect(() => {
    if (editingCategory) {
      form.reset({ name: editingCategory.name });
    } else {
      form.reset({ name: '' });
    }
  }, [editingCategory, form]);

  const onSubmit = async (data: CategoryFormValues) => {
    setIsSubmitting(true);
    if (editingCategory) {
      await updateCategory(editingCategory.id, data);
    } else {
      await addCategory(data);
    }
    setEditingCategory(null);
    form.reset();
    setIsSubmitting(false);
  };

  const handleEditClick = (category: Category) => {
    setEditingCategory(category);
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
    form.reset();
  };

  const handleDeleteClick = (category: Category) => {
    setCategoryToDelete(category);
  };

  const handleConfirmDelete = async () => {
    if (categoryToDelete) {
      await deleteCategory(categoryToDelete.id);
      setCategoryToDelete(null);
    }
  };

  return (
    <>
    <div className="mb-8">
      <Button variant="ghost" onClick={() => router.back()} className="p-0 h-auto hover:bg-transparent text-muted-foreground hover:text-foreground">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>
    </div>
    <div className="grid gap-8 md:grid-cols-3">
      <div className="md:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>{editingCategory ? 'Edit Category' : 'Add Category'}</CardTitle>
            <CardDescription>
              {editingCategory
                ? `Update the details for "${editingCategory.name}".`
                : 'Create a new product category.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Apparel" {...field} disabled={isSubmitting} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex gap-2">
                  {editingCategory && (
                    <Button type="button" variant="outline" onClick={handleCancelEdit} className="w-full" disabled={isSubmitting}>
                      Cancel
                    </Button>
                  )}
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : editingCategory ? 'Save Changes' : 'Add Category'}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
      <div className="md:col-span-2">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Categories</h1>
          <Button size="sm" className="h-8 gap-1" onClick={() => router.push('/admin/products/new')}>
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Add Product
            </span>
          </Button>
        </div>
        {loading ? <CategoriesTableSkeleton /> : (
            <div className="rounded-lg border shadow-sm">
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {categories.map((category) => (
                    <TableRow key={category.id}>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell className="text-right">
                        <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleEditClick(category)}>
                            Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                            onClick={() => handleDeleteClick(category)}
                            className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                            >
                            Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            </div>
        )}
      </div>
    </div>
    <AlertDialog open={!!categoryToDelete} onOpenChange={(open) => !open && setCategoryToDelete(null)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the category
            "{categoryToDelete?.name}". Products in this category will not be deleted but will become uncategorized.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setCategoryToDelete(null)}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirmDelete}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </>
  );
}
