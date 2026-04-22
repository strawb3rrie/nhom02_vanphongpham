"use client";

import Image from "next/image";
import { useOrderStore } from "@/stores/orderStore";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { formatPrice } from "@/lib/utils";
import { ROUTES } from "@/lib/constants";
import Link from "next/link";
import { Package, Clock, Filter, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

export default function OrdersPage() {
  const { orders, cancelOrder } = useOrderStore();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending": return <Badge variant="outline" className="border-yellow-500 text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-950/20 px-3 py-1 text-sm">Chờ xác nhận</Badge>;
      case "processing": return <Badge variant="outline" className="border-primary text-primary bg-primary/10 px-3 py-1 text-sm">Đang xử lý</Badge>;
      case "shipped": return <Badge variant="outline" className="border-purple-500 text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/20 px-3 py-1 text-sm">Đang giao</Badge>;
      case "delivered": return <Badge variant="outline" className="border-green-500 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/20 px-3 py-1 text-sm">Đã giao</Badge>;
      case "cancelled": return <Badge variant="destructive" className="px-3 py-1 text-sm">Đã hủy</Badge>;
      default: return <Badge variant="secondary">Chưa rõ</Badge>;
    }
  };

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb items={[{ label: "Lịch sử đơn hàng" }]} />
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center mt-8">
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
            <Package className="h-10 w-10 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold font-heading mb-2">Chưa có đơn hàng nào</h1>
          <p className="text-muted-foreground mb-8 max-w-md">
            Bạn chưa thực hiện đơn đặt hàng nào trong thời gian qua.
          </p>
          <Link 
            href={ROUTES.PRODUCTS}
            className="px-8 py-3 bg-primary text-primary-foreground rounded-full font-bold hover:bg-primary/90 transition-colors"
          >
            Mua sắm ngay
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb items={[{ label: "Lịch sử đơn hàng" }]} />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading">Đơn hàng của bạn</h1>
          <p className="text-muted-foreground mt-1">Theo dõi trạng thái giao hàng</p>
        </div>
        
        <div className="flex items-center gap-2 text-sm border rounded-lg px-3 py-2 bg-card">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select className="bg-transparent focus:outline-none">
            <option value="all">Tất cả đơn hàng</option>
            <option value="last30">30 ngày qua</option>
            <option value="last6m">6 tháng qua</option>
          </select>
        </div>
      </div>

      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="bg-card border rounded-2xl overflow-hidden shadow-sm">
            {/* Order Header */}
            <div className="bg-muted/40 p-4 md:p-6 border-b flex flex-col md:flex-row justify-between gap-4 md:items-center">
              <div className="flex flex-col md:flex-row gap-4 md:gap-8">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Mã đơn hàng</p>
                  <p className="font-bold font-mono">{order.id}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Ngày đặt</p>
                  <p className="font-medium flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                    {new Date(order.date).toLocaleDateString('vi-VN', {
                      day: '2-digit', month: '2-digit', year: 'numeric',
                      hour: '2-digit', minute: '2-digit'
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Tổng tiền</p>
                  <p className="font-bold text-primary">{formatPrice(order.total)}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {getStatusBadge(order.status)}
              </div>
            </div>

            {/* Order Items */}
            <div className="p-4 md:p-6">
              <div className="space-y-4">
                {order.items.slice(0, 2).map((item) => (
                  <div key={item.product.id} className="flex gap-4">
                    <div className="w-20 h-20 bg-white border rounded overflow-hidden shrink-0 relative p-1">
                      <Image src={item.product.images[0]} alt="" fill className="object-contain p-1" sizes="80px" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium line-clamp-1">{item.product.name}</h4>
                      <p className="text-sm text-muted-foreground mt-1">Phân loại: {item.product.category}</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="font-medium">{formatPrice(item.price)} <span className="text-muted-foreground text-sm font-normal">x {item.quantity}</span></span>
                      </div>
                    </div>
                  </div>
                ))}
                
                {order.items.length > 2 && (
                  <div className="pt-2 text-sm text-primary font-medium flex items-center gap-1">
                    Xem thêm {order.items.length - 2} sản phẩm khác <ArrowRight className="h-3 w-3" />
                  </div>
                )}
              </div>
            </div>

            {/* Order Footer */}
            <div className="bg-muted/10 p-4 md:p-6 border-t flex flex-col sm:flex-row justify-between gap-4 items-center">
              <div className="text-sm text-muted-foreground w-full sm:w-auto">
                <span className="font-medium text-foreground">Giao đến:</span> {order.shippingAddress.fullName} - {order.shippingAddress.phone}
              </div>
              <div className="flex gap-3 w-full sm:w-auto">
                {order.status === "pending" && (
                  <button 
                    onClick={() => cancelOrder(order.id)}
                    className="flex-1 sm:flex-none px-4 py-2 border border-destructive text-destructive rounded-lg hover:bg-destructive hover:text-white transition-colors text-sm font-medium"
                  >
                    Hủy đơn
                  </button>
                )}
                <button className="flex-1 sm:flex-none px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium">
                  Mua lại
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
