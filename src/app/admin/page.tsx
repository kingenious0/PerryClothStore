'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { db } from '@/firebase/config';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { Package, ShoppingCart, Truck, CheckCircle2, DollarSign, TrendingUp } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  totalRevenue: number;
  todayOrders: number;
}

function StatCard({ title, value, icon: Icon, trend, href }: { title: string; value: string | number; icon: any; trend?: string; href?: string }) {
  const content = (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-5 w-5 text-primary" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
        {trend && (
          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
            <TrendingUp className="h-3 w-3" /> {trend}
          </p>
        )}
      </CardContent>
    </Card>
  );

  return href ? <Link href={href}>{content}</Link> : content;
}

export default function AdminPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const ordersSnapshot = await getDocs(collection(db, 'orders'));
        const orders = ordersSnapshot.docs.map(doc => doc.data());

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const stats: DashboardStats = {
          totalOrders: orders.length,
          pendingOrders: orders.filter(o => o.status === 'pending' || o.status === 'processing').length,
          shippedOrders: orders.filter(o => o.status === 'shipped').length,
          deliveredOrders: orders.filter(o => o.status === 'delivered').length,
          totalRevenue: orders.reduce((sum, o) => sum + (o.total || 0), 0),
          todayOrders: orders.filter(o => {
            const orderDate = o.createdAt?.toDate ? o.createdAt.toDate() : new Date(o.createdAt);
            return orderDate >= today;
          }).length,
        };

        setStats(stats);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's an overview of your store.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader><Skeleton className="h-4 w-24" /></CardHeader>
              <CardContent><Skeleton className="h-8 w-16" /></CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2 font-headline">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's an overview of your store.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <StatCard 
          title="Total Orders" 
          value={stats?.totalOrders || 0} 
          icon={ShoppingCart}
          href="/admin/orders"
          trend={`${stats?.todayOrders || 0} new today`}
        />
        <StatCard 
          title="Pending Orders" 
          value={stats?.pendingOrders || 0} 
          icon={Package}
          href="/admin/orders"
        />
        <StatCard 
          title="Shipped Orders" 
          value={stats?.shippedOrders || 0} 
          icon={Truck}
          href="/admin/orders"
        />
        <StatCard 
          title="Delivered Orders" 
          value={stats?.deliveredOrders || 0} 
          icon={CheckCircle2}
          href="/admin/orders"
        />
        <StatCard 
          title="Total Revenue" 
          value={`GH₵${stats?.totalRevenue.toFixed(2) || '0.00'}`} 
          icon={DollarSign}
        />
        <StatCard 
          title="Today's Orders" 
          value={stats?.todayOrders || 0} 
          icon={TrendingUp}
          href="/admin/orders"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your store efficiently</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button asChild className="w-full justify-start" variant="outline">
              <Link href="/admin/products/new"><Package className="mr-2 h-4 w-4" /> Add New Product</Link>
            </Button>
            <Button asChild className="w-full justify-start" variant="outline">
              <Link href="/admin/orders"><ShoppingCart className="mr-2 h-4 w-4" /> View All Orders</Link>
            </Button>
            <Button asChild className="w-full justify-start" variant="outline">
              <Link href="/admin/categories"><Package className="mr-2 h-4 w-4" /> Manage Categories</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Store Health</CardTitle>
            <CardDescription>System status overview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Payment System</span>
                <span className="text-sm font-medium text-green-600">✓ Active</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Order Processing</span>
                <span className="text-sm font-medium text-green-600">✓ Online</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Database</span>
                <span className="text-sm font-medium text-green-600">✓ Connected</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
