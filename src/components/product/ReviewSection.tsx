"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { useToastStore } from "@/stores/toastStore";
import { Review } from "@/lib/data";

interface ReviewSectionProps {
  initialReviews: Review[];
  productId: number;
}

export function ReviewSection({ initialReviews, productId }: ReviewSectionProps) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const { isLoggedIn, user } = useAuthStore();
  const { addToast } = useToastStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      addToast({
        title: "Yêu cầu đăng nhập",
        description: "Bạn cần đăng nhập để gửi đánh giá.",
        type: "error"
      });
      return;
    }
    if (!comment.trim()) {
      addToast({
        title: "Lỗi",
        description: "Vui lòng nhập nội dung đánh giá.",
        type: "error"
      });
      return;
    }

    const newReview: Review = {
      id: Date.now(),
      productId,
      user: user?.name || "Người dùng ẩn danh",
      rating,
      comment,
      date: new Date().toISOString()
    };

    // Add to the top of the local state array
    setReviews([newReview, ...reviews]);
    setComment("");
    setRating(5);
    
    addToast({
      title: "Đánh giá thành công",
      description: "Cảm ơn bạn đã để lại đánh giá cho sản phẩm.",
      type: "success"
    });
  };

  return (
    <section id="reviews">
      <h2 className="text-2xl font-bold font-heading mb-6 border-b pb-2">Đánh giá sản phẩm</h2>
      
      {/* Review Form */}
      <div className="bg-muted/30 border p-6 rounded-xl mb-12 shadow-sm">
        <h3 className="font-semibold mb-4 text-lg">Viết đánh giá của bạn</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">Đánh giá sao</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="focus:outline-none hover:scale-110 transition-transform"
                >
                  <Star className={`h-6 w-6 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted'}`} />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">Lời đánh giá</label>
            <textarea 
              rows={3} 
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={isLoggedIn ? "Chia sẻ cảm nhận của bạn về sản phẩm này..." : "Vui lòng đăng nhập để viết đánh giá"}
              disabled={!isLoggedIn}
              className="w-full rounded-xl border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 resize-none transition-shadow"
            />
          </div>
          <button 
            type="submit" 
            disabled={!isLoggedIn}
            className="bg-primary text-primary-foreground px-8 py-2.5 rounded-full font-medium hover:bg-primary/90 hover:shadow-md transition-all duration-300 disabled:opacity-50 disabled:hover:shadow-none disabled:hover:-translate-y-0"
          >
            Gửi đánh giá
          </button>
        </form>
      </div>

      {/* Review List */}
      {reviews.length > 0 ? (
        <div className="space-y-6">
          {reviews.map((review) => (
             <div key={review.id} className="border rounded-xl p-6 bg-card hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="font-bold flex items-center gap-2">
                    {review.user}
                    {review.user === "Người dùng UTE" && (
                      <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-semibold">Demo</span>
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(review.date).toLocaleDateString('vi-VN')}
                  </p>
                </div>
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-4 w-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted'}`} 
                    />
                  ))}
                </div>
              </div>
              <p className="text-foreground leading-relaxed">{review.comment}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border rounded-xl bg-muted/10 border-dashed">
          <p className="text-muted-foreground">Chưa có đánh giá nào cho sản phẩm này.</p>
          <p className="text-sm text-muted-foreground mt-1">Hãy là người đầu tiên đánh giá!</p>
        </div>
      )}
    </section>
  );
}
