import { getTeam } from "@/lib/data";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { ROUTES, SITE_CONFIG } from "@/lib/constants";
import Image from "next/image";
import { ExternalLink, Target, Award, Users } from "lucide-react";

export default async function AboutPage() {
  const team = await getTeam();

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb items={[{ label: "Giới thiệu", href: ROUTES.ABOUT }]} />
      
      {/* Hero Section */}
      <section className="py-12 md:py-20 text-center max-w-4xl mx-auto flex flex-col items-center">
        <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">Về chúng tôi</h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          {SITE_CONFIG.name} là đồ án website thương mại điện tử chuyên cung cấp các sản phẩm văn phòng phẩm, dụng cụ học tập chất lượng cao. Được phát triển bởi nhóm sinh viên đam mê công nghệ với mục tiêu tối ưu hóa trải nghiệm mua sắm trực tuyến.
        </p>
      </section>

      {/* Stats/Values Section */}
      <section className="py-12 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-card border rounded-2xl p-8 flex flex-col items-center text-center hover:border-primary transition-colors cursor-default">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6">
              <Target className="h-8 w-8" />
            </div>
            <h3 className="font-bold text-xl mb-3">Sứ mệnh</h3>
            <p className="text-muted-foreground">Cung cấp giải pháp văn phòng phẩm toàn diện, chất lượng với giá cả phải chăng cho mọi đối tượng khách hàng.</p>
          </div>
          
          <div className="bg-card border rounded-2xl p-8 flex flex-col items-center text-center hover:border-primary transition-colors cursor-default">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6">
              <Award className="h-8 w-8" />
            </div>
            <h3 className="font-bold text-xl mb-3">Chất lượng</h3>
            <p className="text-muted-foreground">Cam kết sản phẩm chính hãng, xuất xứ rõ ràng từ các thương hiệu uy tín trong và ngoài nước.</p>
          </div>
          
          <div className="bg-card border rounded-2xl p-8 flex flex-col items-center text-center hover:border-primary transition-colors cursor-default">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6">
              <Users className="h-8 w-8" />
            </div>
            <h3 className="font-bold text-xl mb-3">Tận tâm</h3>
            <p className="text-muted-foreground">Dịch vụ khách hàng tận tụy, hỗ trợ đổi trả nhanh chóng và luôn đặt trải nghiệm người dùng lên hàng đầu.</p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-muted/30 rounded-3xl mb-12">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold mb-4">Đội ngũ phát triển</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Những cá nhân đam mê và nỗ lực đứng sau dự án {SITE_CONFIG.name}.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member) => (
              <div key={member.id} className="bg-background border rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow group flex flex-col items-center text-center">
                <div className="relative w-32 h-32 rounded-full border-4 border-muted overflow-hidden mb-6 group-hover:border-primary/20 transition-colors">
                  <Image 
                    src={member.avatar} 
                    alt={member.name}
                    fill
                    sizes="128px"
                    className="object-cover"
                  />
                </div>
                
                <h3 className="text-xl font-bold font-heading mb-1">{member.name}</h3>
                <div className="text-primary font-medium mb-3">{member.role}</div>
                
                <div className="bg-muted px-4 py-2 rounded-full text-sm font-mono mb-6">
                  MSSV: {member.mssv}
                </div>
                
                <a 
                  href={member.github} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="mt-auto flex items-center justify-center gap-2 w-full py-3 border rounded-xl hover:bg-muted font-medium transition-colors"
                >
                  <ExternalLink className="h-5 w-5" />
                  <span>GitHub Profile</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
