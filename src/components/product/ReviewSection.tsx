"use client";

import { useState, useMemo } from "react";
import { Star, MessageSquare, Send } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { useToastStore } from "@/stores/toastStore";
import { Review } from "@/lib/data";
import { cn } from "@/lib/utils";

interface ReviewSectionProps {
  initialReviews: Review[];
  productId: number;
}

export function ReviewSection({ initialReviews, productId }: ReviewSectionProps) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const { isLoggedIn, user } = useAuthStore();
  const { addToast } = useToastStore();

  // Tính toán số sao trung bình
  const averageRating = useMemo(() => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, curr) => acc + curr.rating, 0);
    return (sum / reviews.length).toFixed(1);
  }, [reviews]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLoggedIn) {
      addToast({
        title: "Yêu cầu đăng nhập",
        description: "Vui lòng đăng nhập để gửi đánh giá của bạn.",
        type: "error",
      });
      return;
    }

    if (!comment.trim() || comment.length < 10) {
      addToast({
        title: "Nội dung quá ngắn",
        description: "Vui lòng nhập ít nhất 10 ký tự để đánh giá có ích hơn.",
        type: "error",
      });
      return;
    }

    const newReview: Review = {
      id: Date.now(),
      productId,
      user: user?.name || "Người dùng ẩn danh",
      rating,
      comment,
      date: new Date().toISOString(),
    };

    setReviews((prev) => [newReview, ...prev]);
    setComment("");
    setRating(5);
    
    addToast({
      title: "Đã gửi đánh giá",
      description: "Cảm ơn bạn đã đóng góp ý kiến về sản phẩm này!",
      type: "success",
    });
  };

  return (
    <section id="reviews" className="scroll-mt-24">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b pb-4">
        <div>
          <h2 className="text-2xl font-bold font-heading">Đánh giá sản phẩm</h2>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star 
                  key={s} 
                  className={cn("h-4 w-4", s <= Number(averageRating) ? "fill-yellow-400 text-yellow-400" : "text-muted")} 
                />
              ))}
            </div>
            <span className="text-sm font-medium text-muted-foreground">
              {averageRating} / 5 ({reviews.length} đánh giá)
            </span>
          </div>
        </div>
      </div>

      {/* Review Form */}
      <div className="bg-card border rounded-2xl p-6 mb-12 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
        <h3 className="font-semibold mb-6 flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          Viết đánh giá của bạn
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">Mức độ hài lòng</label>
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="focus:outline-none transition-transform active:scale-90"
                >
                  <Star
                    className={cn(
                      "h-8 w-8 transition-colors duration-200",
                      star <= (hoverRating || rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground/30"
                    )}
                  />
                </button>
              ))}
              <span className="ml-2 text-sm text-muted-foreground self-center italic">
                {rating === 5 ? "Rất tốt" : rating === 4 ? "Tốt" : rating === 3 ? "Bình thường" : "Tệ"}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">Nội dung đánh giá</label>
            <textarea
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={isLoggedIn ? "Sản phẩm dùng tốt không? Giao hàng có nhanh không?" : "Bạn cần đăng nhập để thực hiện chức năng này"}
              disabled={!isLoggedIn}
              className="w-full rounded-xl border bg-background px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all disabled:bg-muted disabled:cursor-not-allowed resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={!isLoggedIn || !comment.trim()}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:shadow-none"
          >
            <Send className="h-4 w-4" />
            Gửi đánh giá ngay
          </button>
        </form>
      </div>

      {/* Review List */}
      <div className="space-y-6">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className="group border rounded-2xl p-6 bg-background hover:border-primary/30 transition-all duration-300">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center font-bold text-primary">
                    {review.user.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-bold flex items-center gap-2">
                      {review.user}
                      {review.user.includes("UTE") && (
                        <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] px-2 py-0.5 rounded-full">
                          Đã mua hàng
                        </span>
                      )}
                    </div>
                    <time className="text-xs text-muted-foreground">
                      {new Date(review.date).toLocaleDateString("vi-VN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </time>
                  </div>
                </div>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "h-3.5 w-3.5",
                        i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted"
                      )}
                    />
                  ))}
                </div>
              </div>
              <p className="text-foreground/80 leading-relaxed pl-13">
                {review.comment}
              </p>
            </div>
          ))
        ) : (
          <div className="text-center py-20 border-2 border-dashed rounded-3xl bg-muted/5">
            <MessageSquare className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-lg font-medium text-muted-foreground">Chưa có đánh giá nào</p>
            <p className="text-sm text-muted-foreground/60">Hãy là người đầu tiên chia sẻ trải nghiệm về sản phẩm này!</p>
          </div>
        )}
      </div>
    </section>
  );
}