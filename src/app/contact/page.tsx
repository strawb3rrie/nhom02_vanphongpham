"use client";

import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { ROUTES } from "@/lib/constants";
import { useState } from "react";
import { useToastStore } from "@/stores/toastStore";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";

export default function ContactPage() {
  const { addToast } = useToastStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Validate
    if (!formData.name || !formData.email || !formData.message) {
      addToast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ các thông tin bắt buộc.",
        type: "error"
      });
      setIsSubmitting(false);
      return;
    }

    // Mock API
    setTimeout(() => {
      setIsSubmitting(false);
      setFormData({ name: "", email: "", subject: "", message: "" });
      addToast({
        title: "Gửi thành công",
        description: "Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi sớm nhất.",
        type: "success"
      });
    }, 1500);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb items={[{ label: "Liên hệ", href: ROUTES.CONTACT }]} />
      
      <div className="max-w-5xl mx-auto mt-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-heading font-bold mb-4">Liên hệ với chúng tôi</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Chúng tôi luôn sẵn sàng lắng nghe và trả lời mọi thắc mắc của bạn. Vui lòng để lại thông tin hoặc liên hệ qua các kênh dưới đây.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div>
            <h2 className="text-2xl font-bold font-heading mb-6">Thông tin liên hệ</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0 text-primary">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Địa chỉ</h3>
                  <p className="text-muted-foreground mt-1">
                    1 Võ Văn Ngân, Phường Linh Chiểu,<br />Thủ Đức, TP.Hồ Chí Minh
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0 text-primary">
                  <Phone className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Điện thoại</h3>
                  <p className="text-muted-foreground mt-1">
                    Chăm sóc khách hàng: (028) 3896 8641<br />
                    Tư vấn mua sỉ: 090 123 4567
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0 text-primary">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Email</h3>
                  <p className="text-muted-foreground mt-1">
                    Hỗ trợ: support@ute-stationery.vn<br />
                    Doanh nghiệp: b2b@ute-stationery.vn
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0 text-primary">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Giờ làm việc</h3>
                  <p className="text-muted-foreground mt-1">
                    Thứ 2 - Thứ 6: 08:00 - 18:00<br />
                    Thứ 7: 08:00 - 12:00
                  </p>
                </div>
              </div>
            </div>

            {/* Google Maps (Fake for Demo or Real iframe) */}
            <div className="mt-8 rounded-2xl overflow-hidden border bg-muted h-64 relative">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.4205948965935!2d106.75670881521683!3d10.854026392268753!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752797e339f8df%3A0xc6cbda1871a2d59!2zMSBWw7UgVsSDbiBOZ8OibiwgTGluaCBDaGnhu4N1LCBUaOG7pyDEkOG7qWMsIFRow6BuaCBwaOG7kSBI4buTIENow60gTWluaA!5e0!3m2!1svi!2s!4v1689405623053!5m2!1svi!2s" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={false} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Bản đồ vị trí UTE-Stationery"
              ></iframe>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-card border rounded-3xl p-8 shadow-sm h-fit">
            <h2 className="text-2xl font-bold font-heading mb-6">Gửi tin nhắn</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">Họ và tên *</label>
                <input 
                  type="text" 
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border rounded-xl px-4 py-3 bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email *</label>
                <input 
                  type="email" 
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border rounded-xl px-4 py-3 bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium">Chủ đề</label>
                <input 
                  type="text" 
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full border rounded-xl px-4 py-3 bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>
              
              <div className="space-y-2 mb-6">
                <label htmlFor="message" className="text-sm font-medium">Nội dung tin nhắn *</label>
                <textarea 
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className="w-full border rounded-xl px-4 py-3 bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-y"
                ></textarea>
              </div>
              
              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-transform active:scale-95 disabled:opacity-70 mt-4"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    Gửi tin nhắn <Send className="h-5 w-5 ml-1" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
