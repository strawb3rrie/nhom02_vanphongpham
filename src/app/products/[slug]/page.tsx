import { notFound } from "next/navigation";
import { getProductBySlug, getProducts, getReviews } from "@/lib/data";
import { formatPrice } from "@/lib/utils";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { ROUTES } from "@/lib/constants";
import { Star, Truck, Shield, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { BulkOrderForm } from "@/components/product/BulkOrderForm";
import { RelatedProducts } from "@/components/product/RelatedProducts";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ReviewSection } from "@/components/product/ReviewSection";

interface ProductPageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({
    slug: product.slug,
  }));
}

// Ensure parallel params fetching behavior compatibility with Next.js 15
export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const [products, reviews] = await Promise.all([
    getProducts(),
    getReviews(product.id)
  ]);

  const discount = product.originalPrice 
    ? Math.round((1 - product.price / product.originalPrice) * 100) 
    : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb 
        items={[
          { label: "Sản phẩm", href: ROUTES.PRODUCTS },
          { label: product.name }
        ]} 
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-6 mb-16">
        {/* Product Gallery (Simplified for single image demo) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <ProductGallery images={product.images} name={product.name} />
          {discount > 0 && (
            <Badge variant="destructive" className="w-fit text-sm px-3 py-1">
              Giảm {discount}%
            </Badge>
          )}
        </div>

        {/* Product Info */}
        <div className="lg:col-span-7 flex flex-col">
          <Badge variant="secondary" className="w-fit mb-4 uppercase tracking-wider">{product.category}</Badge>
          <h1 className="text-3xl md:text-4xl font-heading font-bold mb-4">{product.name}</h1>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-1">
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              <span className="font-bold text-lg">{product.rating}</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-muted-foreground"></div>
            <a href="#reviews" className="text-muted-foreground hover:text-primary transition-colors hover:underline">
              {product.reviewCount} Đánh giá
            </a>
            <div className="w-1 h-1 rounded-full bg-muted-foreground"></div>
            <span className="text-muted-foreground">Đã bán {product.stock > 100 ? "100+" : product.stock}</span>
          </div>

          <div className="flex items-end gap-4 mb-6">
            <div className="text-4xl font-bold text-primary tracking-tight">
              {formatPrice(product.price)}
            </div>
            {product.originalPrice && (
              <div className="text-lg text-muted-foreground line-through mb-1">
                {formatPrice(product.originalPrice)}
              </div>
            )}
          </div>

          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            {product.description}
          </p>

          <div className="grid grid-cols-3 gap-2 md:gap-4 p-4 bg-muted/30 rounded-xl border border-dashed mb-8">
            <div className="flex flex-col items-center justify-center text-center gap-2">
              <Truck className="h-6 w-6 text-primary" />
              <span className="text-sm font-medium">Giao hàng toàn quốc</span>
            </div>
            <div className="flex flex-col items-center justify-center text-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              <span className="text-sm font-medium">Chính hãng 100%</span>
            </div>
            <div className="flex flex-col items-center justify-center text-center gap-2">
              <RotateCcw className="h-6 w-6 text-primary" />
              <span className="text-sm font-medium">Đổi trả 7 ngày</span>
            </div>
          </div>

          {/* Setup BulkOrderForm component separated for client-side functionality */}
          <BulkOrderForm product={product} />

        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-16">
        <div className="col-span-2 space-y-12">
          {/* Specifications */}
          <section id="specs">
            <h2 className="text-2xl font-bold font-heading mb-6 border-b pb-2">Thông số kỹ thuật</h2>
            <div className="border rounded-xl overflow-hidden">
              <table className="w-full text-left">
                <tbody className="divide-y">
                  {Object.entries(product.specs).map(([key, value]) => (
                    <tr key={key} className="hover:bg-muted/30 transition-colors">
                      <th className="py-4 px-6 bg-muted/50 font-medium w-1/3">{key}</th>
                      <td className="py-4 px-6 text-muted-foreground">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Reviews */}
          <ReviewSection initialReviews={reviews} productId={product.id} />
        </div>
      </div>

      {/* Related Products */}
      <RelatedProducts currentProductId={product.id} currentCategory={product.category} allProducts={products} />
    </div>
  );
}
