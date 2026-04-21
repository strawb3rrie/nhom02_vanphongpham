import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug, getProducts, getReviews } from "@/lib/data";
import { formatPrice } from "@/lib/utils";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { Star, Truck, Shield, RotateCcw, Share2, Heart } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { BulkOrderForm } from "@/components/product/BulkOrderForm";
import { RelatedProducts } from "@/components/product/RelatedProducts";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ReviewSection } from "@/components/product/ReviewSection";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

/** * 1. Tối ưu SEO với Dynamic Metadata
 */
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  
  if (!product) return { title: "Sản phẩm không tồn tại" };

  return {
    title: `${product.name} | Cửa hàng của bạn`,
    description: product.description,
    openGraph: {
      images: [product.images[0]],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // Fetch dữ liệu song song để tối ưu tốc độ tải trang
  const [products, reviews] = await Promise.all([
    getProducts(),
    getReviews(product.id)
  ]);

  const discount = product.originalPrice 
    ? Math.round((1 - product.price / product.originalPrice) * 100) 
    : 0;

  return (
    <div className="container mx-auto px-4 py-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <Breadcrumb 
          items={[
            { label: "Sản phẩm", href: ROUTES.PRODUCTS },
            { label: product.category, href: `${ROUTES.PRODUCTS}?category=${product.category}` },
            { label: product.name }
          ]} 
        />
        <div className="flex gap-2">
          <button className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground" title="Chia sẻ">
            <Share2 className="h-5 w-5" />
          </button>
          <button className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-red-500" title="Yêu thích">
            <Heart className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-16">
        {/* Cột trái: Hình ảnh sản phẩm */}
        <div className="lg:col-span-6 xl:col-span-5">
          <div className="sticky top-24">
            <ProductGallery images={product.images} name={product.name} />
            
            {/* Đặc điểm nổi bật nhanh */}
            <div className="grid grid-cols-3 gap-4 mt-8">
              {[
                { icon: Truck, label: "Giao nhanh", desc: "2-3 ngày" },
                { icon: Shield, label: "Bảo hành", desc: "12 tháng" },
                { icon: RotateCcw, label: "Đổi trả", desc: "7 ngày" },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center p-3 rounded-2xl bg-muted/20 border border-border/50">
                  <item.icon className="h-5 w-5 text-primary mb-1" />
                  <span className="text-[10px] uppercase font-bold text-muted-foreground">{item.label}</span>
                  <span className="text-xs font-medium">{item.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Cột phải: Thông tin & Đặt hàng */}
        <div className="lg:col-span-6 xl:col-span-7 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="rounded-full px-4 py-1 bg-primary/5 text-primary border-primary/20">
                {product.category}
              </Badge>
              {product.stock > 0 ? (
                <span className="text-xs font-medium text-emerald-600 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  Còn hàng
                </span>
              ) : (
                <span className="text-xs font-medium text-red-600">Hết hàng</span>
              )}
            </div>

            <h1 className="text-3xl md:text-4xl xl:text-5xl font-heading font-black tracking-tight leading-tight">
              {product.name}
            </h1>
            
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-1.5">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-muted'}`} />
                  ))}
                </div>
                <span className="font-bold">{product.rating}</span>
                <span className="text-muted-foreground text-sm">({product.reviewCount} đánh giá)</span>
              </div>
              <div className="h-4 w-[1px] bg-border" />
              <span className="text-sm text-muted-foreground">
                Đã bán: <span className="font-semibold text-foreground">{product.stock > 100 ? "500+" : "120"}</span>
              </span>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-secondary/30 border border-border/40">
            <div className="flex items-baseline gap-4 mb-2">
              <span className="text-4xl font-black text-primary tracking-tighter">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-xl text-muted-foreground line-through decoration-red-500/50">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
              {discount > 0 && (
                <Badge variant="destructive" className="rounded-lg shadow-lg shadow-red-500/20">
                  -{discount}%
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground italic">* Giá đã bao gồm thuế VAT và phí đóng gói</p>
          </div>

          <p className="text-lg text-muted-foreground leading-relaxed italic">
            &ldquo;{product.description}&rdquo;
          </p>

          <BulkOrderForm product={product} />
        </div>
      </div>

      {/* Tabs / Chi tiết thêm */}
      <div className="mt-24 grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-8 space-y-20">
          {/* Thông số kỹ thuật */}
          <section id="specs" className="scroll-mt-24">
            <div className="flex items-center gap-3 mb-8">
              <h2 className="text-2xl font-bold font-heading">Thông số kỹ thuật</h2>
              <div className="h-px flex-1 bg-border" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.entries(product.specs).map(([key, value]) => (
                <div key={key} className="flex flex-col p-4 rounded-2xl border bg-card hover:border-primary/30 transition-colors">
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">{key}</span>
                  <span className="font-medium">{value}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Đánh giá */}
          <ReviewSection initialReviews={reviews} productId={product.id} />
        </div>

        {/* Sidebar quảng cáo hoặc thông tin phụ */}
        <aside className="lg:col-span-4 space-y-8">
          <div className="p-8 rounded-3xl bg-primary text-primary-foreground space-y-4 sticky top-24 shadow-2xl shadow-primary/20">
            <h3 className="text-xl font-bold">Ưu đãi độc quyền</h3>
            <ul className="space-y-3 text-sm opacity-90">
              <li className="flex gap-2">✓ Giảm thêm 5% cho đơn đầu tiên</li>
              <li className="flex gap-2">✓ Miễn phí vận chuyển từ 500k</li>
              <li className="flex gap-2">✓ Tặng kèm quà tặng bí mật</li>
            </ul>
            <button className="w-full py-3 bg-white text-primary rounded-xl font-bold hover:bg-opacity-90 transition-all">
              Nhận tư vấn ngay
            </button>
          </div>
        </aside>
      </div>

      {/* Sản phẩm liên quan */}
      <div className="mt-24">
        <RelatedProducts currentProductId={product.id} currentCategory={product.category} allProducts={products} />
      </div>
    </div>
  );
}