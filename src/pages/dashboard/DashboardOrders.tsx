/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { dashboardService } from '../../services/dashboard.service';
import { StatisticCard } from '../../components/crm/StatisticCard';
import { DataTable } from '../../components/crm/DataTable';
import { DateRangePicker } from '../../components/crm/DateRangePicker';
import { ExportMenu } from '../../components/crm/ExportMenu';
import { SearchBar } from '../../components/crm/SearchBar';
import { Card } from '../../components/ui';
import { ShoppingCart, CheckCircle, Clock, XCircle, Truck, PackageCheck, Filter, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

export const DashboardOrders: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'pending' | 'cancelled'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchOrdersData = async () => {
    setLoading(true);
    try {
      const dbData = await dashboardService.getDashboardData();
      setData(dbData);
      
      // Let's create an expanded list of orders for demonstration
      const initialOrders = [
        ...(dbData.widgets?.recentOrders || []),
        { id: "ORD-4817", customer: "Vikram Singh", amount: 12500, status: "completed", date: "Yesterday", delivery: "Delivered" },
        { id: "ORD-4816", customer: "Apex Consulting", amount: 25000, status: "completed", date: "2 days ago", delivery: "Delivered" },
        { id: "ORD-4815", customer: "Vertex Retail", amount: 6200, status: "cancelled", date: "3 days ago", delivery: "Returned" },
        { id: "ORD-4814", customer: "Nova Healthcare", amount: 15400, status: "pending", date: "3 days ago", delivery: "In Transit" },
        { id: "ORD-4813", customer: "David Miller", amount: 4800, status: "completed", date: "4 days ago", delivery: "Delivered" }
      ];
      setFilteredOrders(initialOrders);
    } catch (err) {
      toast.error('Failed to load orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrdersData();
  }, []);

  useEffect(() => {
    if (!data) return;
    
    const baseOrders = [
      ...(data.widgets?.recentOrders || []),
      { id: "ORD-4817", customer: "Vikram Singh", amount: 12500, status: "completed", date: "Yesterday", delivery: "Delivered" },
      { id: "ORD-4816", customer: "Apex Consulting", amount: 25000, status: "completed", date: "2 days ago", delivery: "Delivered" },
      { id: "ORD-4815", customer: "Vertex Retail", amount: 6200, status: "cancelled", date: "3 days ago", delivery: "Returned" },
      { id: "ORD-4814", customer: "Nova Healthcare", amount: 15400, status: "pending", date: "3 days ago", delivery: "In Transit" },
      { id: "ORD-4813", customer: "David Miller", amount: 4800, status: "completed", date: "4 days ago", delivery: "Delivered" }
    ];

    let result = baseOrders;

    if (statusFilter !== 'all') {
      result = result.filter(o => o.status === statusFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(o => 
        o.id.toLowerCase().includes(q) || 
        o.customer.toLowerCase().includes(q)
      );
    }

    setFilteredOrders(result);
  }, [statusFilter, searchQuery, data]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-emerald-600 bg-emerald-500/10 border-emerald-500/10';
      case 'pending': return 'text-amber-600 bg-amber-500/10 border-amber-500/10';
      case 'cancelled': return 'text-rose-600 bg-rose-500/10 border-rose-500/10';
      default: return 'text-slate-500 bg-slate-500/10 border-slate-500/10';
    }
  };

  const getDeliveryIcon = (delivery: string) => {
    switch (delivery) {
      case 'Delivered': return <PackageCheck className="w-3.5 h-3.5 text-emerald-500" />;
      case 'In Transit': return <Truck className="w-3.5 h-3.5 text-blue-500 animate-bounce" />;
      case 'Returned': return <XCircle className="w-3.5 h-3.5 text-rose-500" />;
      default: return <Clock className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  if (loading || !data) {
    return (
      <div className="space-y-6 text-left p-6">
        <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 bg-slate-100 dark:bg-slate-900 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const stats = data.statistics;

  const orderColumns = [
    {
      key: 'id',
      label: 'Order ID',
      sortable: true,
      render: (row: any) => <span className="font-mono text-[10px] font-bold text-indigo-600 dark:text-indigo-400">{row.id}</span>
    },
    {
      key: 'customer',
      label: 'Customer Name',
      sortable: true,
      render: (row: any) => <span className="font-bold text-slate-800 dark:text-slate-100">{row.customer}</span>
    },
    {
      key: 'amount',
      label: 'Total Value',
      sortable: true,
      render: (row: any) => <span className="font-bold font-mono">₹{row.amount.toLocaleString()}</span>
    },
    {
      key: 'status',
      label: 'Sales Status',
      render: (row: any) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg border text-[10px] font-bold uppercase font-mono tracking-wider ${getStatusColor(row.status)}`}>
          {row.status}
        </span>
      )
    },
    {
      key: 'delivery',
      label: 'Delivery Stage',
      render: (row: any) => (
        <span className="flex items-center gap-1.5 font-sans font-semibold text-[11px] text-slate-600 dark:text-slate-350">
          {getDeliveryIcon(row.delivery || 'Pending')}
          <span>{row.delivery || 'Awaiting Shipment'}</span>
        </span>
      )
    },
    {
      key: 'date',
      label: 'Timeline Timestamp',
      render: (row: any) => <span className="font-mono text-[10px] text-slate-400">{row.date}</span>
    }
  ];

  const orderActions = [
    {
      label: 'Mark Shipped / In Transit',
      icon: <Truck className="w-3.5 h-3.5 text-indigo-500" />,
      onClick: (row: any) => {
        toast.success(`Order ${row.id} set to In Transit!`);
        fetchOrdersData();
      }
    },
    {
      label: 'Deliver Order',
      icon: <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />,
      onClick: (row: any) => {
        toast.success(`Order ${row.id} marked as fully Delivered!`);
        fetchOrdersData();
      }
    }
  ];

  return (
    <div className="space-y-6 text-left">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-800 dark:text-slate-100 uppercase tracking-wider font-mono flex items-center gap-2">
            <ShoppingCart className="text-indigo-500 w-5 h-5" /> Inbound Order Operations
          </h1>
          <p className="text-xs text-slate-400 dark:text-slate-500 font-light mt-0.5">
            Audit logs of incoming customer purchases, fulfillment dispatch tracks, and cancellation anomalies.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <DateRangePicker onRangeSelect={() => {}} />
          <ExportMenu reportType="Inbound Orders Audit" />
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatisticCard 
          title="Inbound Orders" 
          value={stats.todayOrders.value} 
          growth={stats.todayOrders.growth} 
          growthDirection={stats.todayOrders.status} 
          icon={<ShoppingCart className="w-4 h-4 text-indigo-500" />} 
        />
        <StatisticCard 
          title="Fulfillments Pending" 
          value={stats.pendingOrders.value} 
          growth={stats.pendingOrders.growth} 
          growthDirection={stats.pendingOrders.status} 
          icon={<Clock className="w-4 h-4 text-amber-500" />} 
        />
        <StatisticCard 
          title="Successfully Completed" 
          value={stats.completedOrders.value} 
          growth={stats.completedOrders.growth} 
          growthDirection={stats.completedOrders.status} 
          icon={<CheckCircle className="w-4 h-4 text-emerald-500" />} 
        />
        <StatisticCard 
          title="Cancelled Orders" 
          value={stats.inventoryAlerts.value} 
          growthDirection="stable" 
          icon={<XCircle className="w-4 h-4 text-rose-500" />} 
        />
      </div>

      {/* Filters and List */}
      <Card variant="glass" className="p-5 border-slate-200/50 dark:border-slate-850 bg-white/50 dark:bg-slate-950/20 rounded-2xl space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-indigo-500" />
            <h3 className="text-xs font-black text-slate-700 dark:text-slate-200 uppercase tracking-wider font-mono">
              Fulfillment Log Directory
            </h3>
          </div>

          {/* Tab switches for order status filters */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-900 p-0.5 rounded-xl border border-slate-200/50 dark:border-slate-850">
            {(['all', 'completed', 'pending', 'cancelled'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setStatusFilter(filter)}
                className={`px-3 py-1 text-[10px] font-black uppercase font-mono rounded-lg transition-all cursor-pointer ${
                  statusFilter === filter
                    ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <SearchBar 
          placeholder="Search logs by Order ID or Customer..." 
          onSearch={handleSearch} 
          suggestions={['ORD-4821', 'Aman Verma', 'TechVantage']} 
        />

        {/* Orders Table */}
        {filteredOrders.length > 0 ? (
          <DataTable 
            columns={orderColumns} 
            data={filteredOrders} 
            actions={orderActions} 
          />
        ) : (
          <div className="py-12 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
            <span className="text-xs text-slate-400">No active orders matching the filter query found.</span>
          </div>
        )}
      </Card>
    </div>
  );
};
