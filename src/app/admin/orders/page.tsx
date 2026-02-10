'use client';

import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { db } from '@/firebase/config';
import { collection, getDocs, updateDoc, doc, onSnapshot, query, orderBy, getDoc } from 'firebase/firestore';
import type { Order } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Search, 
  Eye, 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  MoreVertical,
  Calendar,
  User,
  Mail,
  MapPin,
  CreditCard,
  ChevronRight
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

const statusColors = {
  'processing': 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  'shipped': 'bg-purple-500/10 text-purple-600 border-purple-500/20',
  'delivered': 'bg-green-500/10 text-green-600 border-green-500/20',
  'cancelled': 'bg-red-500/10 text-red-600 border-red-500/20',
  'confirmed': 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20',
  'pending': 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
};

const statusIcons = {
  'processing': <Clock className="h-4 w-4" />,
  'shipped': <Truck className="h-4 w-4" />,
  'delivered': <CheckCircle2 className="h-4 w-4" />,
  'cancelled': <Package className="h-4 w-4" />,
  'confirmed': <CheckCircle2 className="h-4 w-4" />,
  'pending': <Clock className="h-4 w-4" />,
};

function OrdersTableSkeleton() {
  return (
    <div className="rounded-3xl border border-slate-100 bg-white overflow-hidden shadow-sm">
      <Table>
        <TableHeader className="bg-slate-50/50">
          <TableRow>
            <TableHead className="w-[100px]">Order ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead className="w-[100px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...Array(5)].map((_, i) => (
            <TableRow key={i}>
              <TableCell><Skeleton className="h-4 w-16" /></TableCell>
              <TableCell>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-48" />
                </div>
              </TableCell>
              <TableCell><Skeleton className="h-6 w-24 rounded-full" /></TableCell>
              <TableCell><Skeleton className="h-4 w-24" /></TableCell>
              <TableCell className="text-right"><Skeleton className="h-4 w-16 ml-auto" /></TableCell>
              <TableCell><Skeleton className="h-8 w-8 rounded-full ml-auto" /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default function AdminOrdersPage() {
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const fetchedOrders: Order[] = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                const createdAt = data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : new Date().toISOString();
                fetchedOrders.push({ 
                  id: doc.id, 
                  ...data, 
                  created_at: createdAt,
                  customer_name: data.customerName || data.customer_name || data.shippingAddress?.fullName || 'Unknown',
                  customer_email: data.customerEmail || data.customer_email || 'Unknown',
                  customer_address: data.shippingAddress?.addressLine1 || data.customer_address || 'Unknown',
                  items: data.items || [],
                  total: data.total || 0,
                  status: data.status || 'pending'
                } as Order);
            });
            console.log('Fetched orders:', fetchedOrders.length);
            setOrders(fetchedOrders);
            setLoading(false);
        }, (error) => {
            console.error('Error fetching orders:', error);
            toast({
                variant: 'destructive',
                title: 'Error loading orders',
                description: error.message
            });
            setLoading(false);
        });

        return () => unsubscribe();
    }, [toast]);

    const handleStatusUpdate = async (orderId: string, newStatus: string) => {
      try {
        // Get current order to append to timeline
        const orderRef = doc(db, 'orders', orderId);
        const orderSnap = await getDoc(orderRef);
        const currentOrder = orderSnap.data();
        
        // Create status labels
        const statusLabels: Record<string, string> = {
          'pending': 'Order Pending',
          'confirmed': 'Payment Confirmed',
          'processing': 'Order Processing',
          'shipped': 'Order Shipped',
          'delivered': 'Order Delivered',
          'cancelled': 'Order Cancelled'
        };
        
        // Create timeline event
        const timelineEvent = {
          status: newStatus.toLowerCase(),
          timestamp: new Date(),
          note: `Order status updated to ${statusLabels[newStatus] || newStatus}`,
          location: null,
        };
        
        // Append to existing timeline
        const updatedTimeline = [
          timelineEvent,
          ...(currentOrder?.timeline || [])
        ];
        
        // Prepare update object
        const updateData: any = {
          status: newStatus,
          timeline: updatedTimeline,
          updatedAt: new Date(),
        };
        
        // Add specific timestamps based on status
        if (newStatus === 'shipped') {
          updateData.shippedAt = new Date();
        } else if (newStatus === 'delivered') {
          updateData.deliveredAt = new Date();
        } else if (newStatus === 'cancelled') {
          updateData.cancelledAt = new Date();
        }
        
        await updateDoc(orderRef, updateData);
        
        toast({
          title: 'Status updated',
          description: `Order is now ${newStatus}.`,
        });
      } catch (error) {
        console.error('Error updating status:', error);
        toast({
          variant: 'destructive',
          title: 'Update failed',
          description: 'Could not update order status.'
        });
      }
    };

    const filteredOrders = orders.filter(order => 
      order.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <div className="space-y-8 pb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <Button 
                variant="ghost" 
                onClick={() => router.back()} 
                className="mb-4 -ml-2 text-muted-foreground hover:text-foreground group"
            >
                <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                Back to Dashboard
            </Button>
            <h1 className="text-4xl font-bold font-headline tracking-tight">Order Management</h1>
            <p className="text-muted-foreground mt-1">Track and manage customer orders in real-time.</p>
          </div>
          
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search orders, customers..." 
              className="pl-10 rounded-2xl border-slate-200 h-10 shadow-sm focus:ring-primary/20"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {loading ? <OrdersTableSkeleton /> : (
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50/50 border-b border-slate-100">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="font-bold py-5 pl-8 text-slate-500 uppercase tracking-widest text-[10px]">Reference</TableHead>
                  <TableHead className="font-bold py-5 text-slate-500 uppercase tracking-widest text-[10px]">Customer</TableHead>
                  <TableHead className="font-bold py-5 text-slate-500 uppercase tracking-widest text-[10px]">Status</TableHead>
                  <TableHead className="font-bold py-5 text-slate-500 uppercase tracking-widest text-[10px]">Date</TableHead>
                  <TableHead className="font-bold py-5 text-right text-slate-500 uppercase tracking-widest text-[10px]">Total</TableHead>
                  <TableHead className="font-bold py-5 pr-8 text-right text-slate-500 uppercase tracking-widest text-[10px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length > 0 ? filteredOrders.map((order) => (
                  <TableRow key={order.id} className="group hover:bg-slate-50/50 transition-colors border-b border-slate-50 last:border-none">
                    <TableCell className="py-6 pl-8">
                      <code className="text-[10px] font-black bg-slate-100 px-2 py-1 rounded-md text-slate-600">
                        {order.id.slice(0, 8).toUpperCase()}
                      </code>
                    </TableCell>
                    <TableCell className="py-6">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900 leading-tight">{order.customer_name}</span>
                        <span className="text-xs text-muted-foreground mt-0.5">{order.customer_email}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-6">
                      <Badge 
                        variant="outline" 
                        className={cn(
                          "rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider gap-2 border-2",
                          statusColors[order.status as keyof typeof statusColors] || 'bg-slate-50 text-slate-500'
                        )}
                      >
                        {statusIcons[order.status as keyof typeof statusIcons] || <Package className="h-3 w-3" />}
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-6">
                      <div className="flex items-center gap-2 text-slate-500">
                        <Calendar className="h-3 w-3" />
                        <span className="text-xs font-medium">{new Date(order.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-6 text-right font-black text-slate-900">
                      GH₵{order.total.toFixed(2)}
                    </TableCell>
                    <TableCell className="py-6 pr-8 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-9 w-9 rounded-full hover:bg-slate-100 transition-colors"
                          onClick={() => setSelectedOrder(order)}
                        >
                          <Eye className="h-4 w-4 text-slate-500" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-slate-100">
                              <MoreVertical className="h-4 w-4 text-slate-500" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 shadow-2xl border-slate-100">
                            <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-slate-400 font-black px-3 py-2">Update Status</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleStatusUpdate(order.id, 'processing')} className="rounded-xl px-3 py-2 cursor-pointer gap-2 focus:bg-blue-50 focus:text-blue-600 transition-colors">
                              <Clock className="h-4 w-4" /> Processing
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusUpdate(order.id, 'shipped')} className="rounded-xl px-3 py-2 cursor-pointer gap-2 focus:bg-purple-50 focus:text-purple-600 transition-colors">
                              <Truck className="h-4 w-4" /> Shipped
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusUpdate(order.id, 'delivered')} className="rounded-xl px-3 py-2 cursor-pointer gap-2 focus:bg-green-50 focus:text-green-600 transition-colors">
                              <CheckCircle2 className="h-4 w-4" /> Delivered
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusUpdate(order.id, 'cancelled')} className="rounded-xl px-3 py-2 cursor-pointer gap-2 focus:bg-red-50 focus:text-red-600 transition-colors">
                              <Package className="h-4 w-4" /> Cancelled
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-64 text-center">
                      <div className="flex flex-col items-center justify-center space-y-3 opacity-30">
                        <Package className="h-12 w-12" />
                        <p className="text-sm font-medium">No orders found.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Order Details Sheet */}
        <Sheet open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
          <SheetContent className="w-full sm:max-w-2xl bg-white border-none p-0 overflow-hidden shadow-2xl">
            {selectedOrder && (
              <div className="flex flex-col h-full">
                <SheetHeader className="p-10 pb-6 bg-slate-50/50 border-b border-slate-100 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                    <Package className="h-40 w-40" />
                  </div>
                  <div className="flex items-center gap-3 mb-4">
                    <Badge variant="outline" className="rounded-md bg-white font-black text-[10px] border-slate-200">
                      ORDER #{selectedOrder.id.slice(0, 8).toUpperCase()}
                    </Badge>
                    <Badge 
                      className={cn(
                        "rounded-full px-3 py-0.5 text-[9px] font-black uppercase tracking-[0.2em] border-none shadow-sm",
                        statusColors[selectedOrder.status as keyof typeof statusColors] || 'bg-slate-200 text-slate-800'
                      )}
                    >
                      {selectedOrder.status}
                    </Badge>
                  </div>
                  <SheetTitle className="text-4xl font-bold font-headline leading-tight">Order Details</SheetTitle>
                  <SheetDescription className="text-slate-500 font-medium pt-2 flex items-center gap-2">
                    Placed on {new Date(selectedOrder.created_at).toLocaleString(undefined, { dateStyle: 'long', timeStyle: 'short' })}
                  </SheetDescription>
                </SheetHeader>

                <ScrollArea className="flex-grow p-10">
                  <div className="space-y-12">
                    {/* Customer Info */}
                    <section className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="space-y-4">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Customer</h3>
                        <div className="flex items-start gap-4 p-5 rounded-3xl bg-slate-50 border border-slate-100 group transition-colors hover:border-primary/20">
                          <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center shadow-sm border border-slate-100">
                            <User className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{selectedOrder.customer_name}</p>
                            <div className="flex items-center gap-2 mt-1 text-slate-500 text-sm">
                              <Mail className="h-3 w-3" />
                              <span>{selectedOrder.customer_email}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Shipping To</h3>
                        <div className="flex items-start gap-4 p-5 rounded-3xl bg-slate-50 border border-slate-100 group transition-colors hover:border-primary/20">
                          <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center shadow-sm border border-slate-100">
                            <MapPin className="h-5 w-5 text-primary" />
                          </div>
                          <div className="text-sm">
                            <p className="font-medium text-slate-600 leading-relaxed italic">{selectedOrder.customer_address}</p>
                          </div>
                        </div>
                      </div>
                    </section>

                    <Separator className="bg-slate-100" />

                    {/* Order Items */}
                    <section className="space-y-6">
                      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center justify-between">
                        <span>Items List</span>
                        <span className="text-slate-500">{selectedOrder.items?.length || 0} Products</span>
                      </h3>
                      <div className="space-y-4">
                        {selectedOrder.items?.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-6 p-4 rounded-3xl hover:bg-slate-50 transition-colors border-2 border-transparent hover:border-slate-50">
                            <div className="h-20 w-16 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center flex-shrink-0 font-black text-slate-400 text-xs shadow-inner">
                              #{idx + 1}
                            </div>
                            <div className="flex-grow">
                              <p className="font-bold text-slate-900">{item.name}</p>
                              <div className="flex items-center gap-2 mt-1">
                                {item.size && <Badge variant="secondary" className="bg-slate-100 text-[10px] border-none font-bold py-0.5">{item.size}</Badge>}
                                {item.color && <Badge variant="secondary" className="bg-slate-100 text-[10px] border-none font-bold py-0.5">{item.color}</Badge>}
                                <span className="text-xs text-slate-400 font-medium ml-2">Qty: {item.quantity}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-black text-slate-900">GH₵{(item.price * item.quantity).toFixed(2)}</p>
                              <p className="text-[10px] text-slate-400 leading-none">GH₵{item.price.toFixed(2)} ea</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>

                    <Separator className="bg-slate-100" />

                    {/* Payment Summary */}
                    <section className="bg-slate-900 h-48 rounded-[2.5rem] p-10 flex flex-col justify-between text-white shadow-2xl shadow-slate-900/30">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/5">
                              <CreditCard className="h-5 w-5 text-primary-foreground" />
                            </div>
                            <div>
                              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Grand Total</p>
                              <p className="text-2xl font-bold font-headline leading-none pt-1">
                                Paid via {selectedOrder.paymentMethod || selectedOrder.paymentChannel || 'Paystack'}
                              </p>
                            </div>
                          </div>
                          <Badge className="bg-green-500 hover:bg-green-500 text-[10px] font-black border-none px-4 py-1">SECURE</Badge>
                        </div>
                        <div className="flex justify-between items-end">
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Authorized Amount</p>
                            <p className="text-5xl font-black font-headline tracking-tighter">GH₵{selectedOrder.total.toFixed(2)}</p>
                          </div>
                          <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest text-right">Includes Taxes & Fees</p>
                        </div>
                    </section>
                  </div>
                </ScrollArea>
                <div className="p-10 bg-slate-50/50 border-t border-slate-100 flex items-center gap-4">
                  <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mr-auto">Fast Actions:</h4>
                  <Button 
                    variant="outline" 
                    className="rounded-full h-12 border-2 px-8 font-bold hover:bg-slate-900 hover:text-white transition-all"
                    onClick={() => {
                        window.print();
                    }}
                  >
                    Print Invoice
                  </Button>
                  <Button 
                    className="rounded-full h-12 px-8 font-bold shadow-lg transition-all"
                    onClick={() => setSelectedOrder(null)}
                  >
                    Done Viewing
                  </Button>
                </div>
              </div>
            )}
          </SheetContent>
        </Sheet>
      </div>
    );
}
