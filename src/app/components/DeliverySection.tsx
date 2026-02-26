import { MapPin, Clock, Truck, ChevronRight } from "lucide-react";

export function DeliverySection() {
  const features = [
    {
      icon: <Truck size={24} className="text-[#ECB159]" />,
      title: "Hot & Fresh Delivery",
      desc: "We deliver within our local area. Order placed, your coffee arrives hot and ready in 30–45 minutes.",
    },
    {
      icon: <Clock size={24} className="text-[#ECB159]" />,
      title: "Open Daily",
      desc: "We're open every day from 10:00 AM to 8:30 PM. Stop by or order ahead — we're always ready.",
    },
    {
      icon: <MapPin size={24} className="text-[#ECB159]" />,
      title: "Local Neighbourhood",
      desc: "Currently delivering in our local area. We're growing — your zone may be next!",
    },
  ];

  return (
    <section id="delivery" className="bg-[#3d1f00] relative overflow-hidden py-20">
      {/* Decorative circle */}
      <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-[#ECB159]/10 pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-[#ECB159]/10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <span className="inline-block text-[#ECB159] uppercase tracking-widest mb-3" style={{ fontSize: "0.78rem", fontWeight: 700 }}>
            Our Delivery
          </span>
          <h2 className="text-white leading-tight" style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)", fontWeight: 800 }}>
            Royal coffee, delivered<br />to your doorstep
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-14">
          {features.map((f) => (
            <div key={f.title} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors">
              <div className="w-12 h-12 bg-[#ECB159]/15 rounded-xl flex items-center justify-center mb-4">
                {f.icon}
              </div>
              <h3 className="text-white mb-2" style={{ fontWeight: 700, fontSize: "1rem" }}>{f.title}</h3>
              <p className="text-white/60" style={{ fontSize: "0.88rem" }}>{f.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA Banner */}
        <div className="bg-[#ECB159] rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-[#2a1500] mb-2" style={{ fontSize: "1.5rem", fontWeight: 800 }}>
              First order? On us! 🎉
            </h3>
            <p className="text-[#5a3510]" style={{ fontSize: "0.95rem" }}>
              Use code <strong>WELCOME</strong> for free delivery on your very first order.
            </p>
          </div>
          <button className="flex items-center gap-2 bg-[#3d1f00] text-white rounded-full px-8 py-3.5 hover:bg-[#5a2e00] transition-colors shrink-0">
            <span style={{ fontSize: "0.95rem" }}>Order Now</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}
