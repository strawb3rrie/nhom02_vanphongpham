"use client";

import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { ROUTES } from "@/lib/constants";
import { useToastStore } from "@/stores/toastStore";
import { MapPin, Phone, Mail, Clock, Send, MessageSquare, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

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
    
    if (!formData.name || !formData.email || !formData.message) {
      addToast({
        title: "Thông tin chưa đủ",
        description: "Vui lòng điền các trường có dấu sao (*) bạn nhé.",
        type: "error"
      });
      setIsSubmitting(false);
      return;
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setFormData({ name: "", email: "", subject: "", message: "" });
      addToast({
        title: "Đã gửi tin nhắn!",
        description: "Cảm ơn bạn. Đội ngũ UTE sẽ phản hồi trong vòng 24h.",
        type: "success"
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section with subtle decor */}
      <div className="relative py-16 md:py-24 overflow-hidden border-b bg-muted/20">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/5 blur-[100px] -z-10" />
        <div className="container mx-auto px-4 relative">
          <div className="flex justify-center mb-6">
            <Breadcrumb items={[{ label: "Liên hệ", href: ROUTES.CONTACT }]} />
          </div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-black font-heading tracking-tight mb-6 uppercase italic">
              Kết nối với <span className="text-primary">chúng tôi</span>
            </h1>
            <p className="text-lg text-muted-foreground font-medium">
              Bạn có thắc mắc về sản phẩm hoặc muốn hợp tác? Đừng ngần ngại, mọi tin nhắn của bạn đều là động lực để chúng tôi hoàn thiện hơn.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
            
            {/* LEFT: Contact Information (2/5 cols) */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2 space-y-10"
            >
              <div>
                <h2 className="text-2xl font-black mb-8 flex items-center gap-3">
                  <MessageSquare className="w-6 h-6 text-primary" />
                  Kênh hỗ trợ
                </h2>
                
                <div className="space-y-8">
                  {[
                    { icon: MapPin, title: "Địa chỉ trụ sở", content: "1 Võ Văn Ngân, P. Linh Chiểu, TP. Thủ Đức, HCM", color: "bg-blue-500/10 text-blue-600" },
                    { icon: Phone, title: "Đường dây nóng", content: "(028) 3896 8641 - 090 123 4567", color: "bg-emerald-500/10 text-emerald-600" },
                    { icon: Mail, title: "Email phản hồi", content: "support@ute-stationery.vn", color: "bg-amber-500/10 text-amber-600" },
                    { icon: Clock, title: "Thời gian phục vụ", content: "T2 - T6: 08:00 - 18:00 | T7: 08:00 - 12:00", color: "bg-purple-500/10 text-purple-600" }
                  ].map((item, idx) => (
                    <div key={idx} className="flex gap-5 group">
                      <div className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 duration-300`}>
                        <item.icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm uppercase tracking-widest text-muted-foreground mb-1">{item.title}</h3>
                        <p className="font-bold text-lg leading-snug">{item.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Map Illustration / Embed */}
              <div className="rounded-[2.5rem] overflow-hidden border-4 border-muted shadow-2xl h-72 group relative">
                <div className="absolute inset-0 bg-primary/10 group-hover:bg-transparent transition-colors z-10 pointer-events-none" />
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.485398611095!2d106.7693072!3d10.8506324!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752763f23816db%3A0x28054039ef721d90!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBTxrAgcGjhuqFtIEvhu7kgdGh14bqtdCBUaMOgbmggcGjhu5EgSOG7kyBDaMOtIE1pbmg!5e0!3m2!1svi!2s!4v1715424567890!5m2!1svi!2s" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen={false} 
                  loading="lazy" 
                  title="UTE Map"
                ></iframe>
              </div>
            </motion.div>

            {/* RIGHT: Contact Form (3/5 cols) */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-3"
            >
              <div className="bg-card border border-border/60 rounded-[3rem] p-8 md:p-12 shadow-xl shadow-primary/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                  <Sparkles className="w-32 h-32" />
                </div>
                
                <h2 className="text-3xl font-black mb-8 italic tracking-tighter uppercase">Để lại lời nhắn</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Tên của bạn *</label>
                      <input 
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Nguyễn Văn A"
                        className="w-full bg-muted/30 border-2 border-transparent focus:border-primary focus:bg-background rounded-2xl px-6 py-4 transition-all outline-none font-bold shadow-inner"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Email liên hệ *</label>
                      <input 
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="name@gmail.com"
                        className="w-full bg-muted/30 border-2 border-transparent focus:border-primary focus:bg-background rounded-2xl px-6 py-4 transition-all outline-none font-bold shadow-inner"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Chủ đề quan tâm</label>
                    <input 
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Hợp tác, bảo hành, góp ý..."
                      className="w-full bg-muted/30 border-2 border-transparent focus:border-primary focus:bg-background rounded-2xl px-6 py-4 transition-all outline-none font-bold shadow-inner"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Nội dung chi tiết *</label>
                    <textarea 
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={5}
                      placeholder="Chúng tôi có thể giúp gì cho bạn?"
                      className="w-full bg-muted/30 border-2 border-transparent focus:border-primary focus:bg-background rounded-2xl px-6 py-4 transition-all outline-none font-medium resize-none shadow-inner"
                    ></textarea>
                  </div>
                  
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-5 bg-primary text-primary-foreground rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-primary/90 hover:-translate-y-1 active:scale-95 transition-all shadow-lg shadow-primary/25 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <>
                        Gửi yêu cầu ngay <Send className="h-5 w-5" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}