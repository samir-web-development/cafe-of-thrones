import { Instagram, Twitter, Facebook, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer id="footer" className="bg-[#2a1500] text-white py-14">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="col-span-1 sm:col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-[#ECB159] rounded-full flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
                  <path d="M4 8h14v2a7 7 0 01-14 0V8z" fill="#3d1f00" />
                  <path d="M16 8c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2" stroke="#3d1f00" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <div>
                <span className="font-serif italic" style={{ fontSize: "1.1rem" }}>Cafe</span>
                <span className="text-[#ECB159] font-serif italic ml-1" style={{ fontSize: "1.1rem" }}>of Thrones</span>
              </div>
            </div>
            <p className="text-white/60 mb-5 leading-relaxed" style={{ fontSize: "0.88rem" }}>
              Newly opened with big dreams. We brew every cup with care and serve every customer like royalty.
            </p>
            <div className="flex items-center gap-3">
              {[Instagram, Twitter, Facebook].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#ECB159] transition-colors">
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[#ECB159] mb-4" style={{ fontWeight: 700, fontSize: "0.9rem" }}>Quick Links</h4>
            <ul className="space-y-2">
              {["Our Story", "Our Menu", "Delivery", "Contact Us"].map((link) => (
                <li key={link}>
                  <a href="#" className="text-white/60 hover:text-[#ECB159] transition-colors" style={{ fontSize: "0.88rem" }}>{link}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Menu */}
          <div>
            <h4 className="text-[#ECB159] mb-4" style={{ fontWeight: 700, fontSize: "0.9rem" }}>Our Specials</h4>
            <ul className="space-y-2">
              {["Cappuccino", "Vanilla Latte", "Espresso", "Hazelnut Latte", "Cold Brew"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-white/60 hover:text-[#ECB159] transition-colors" style={{ fontSize: "0.88rem" }}>{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-[#ECB159] mb-4" style={{ fontWeight: 700, fontSize: "0.9rem" }}>Stay in the Loop</h4>
            <p className="text-white/60 mb-4" style={{ fontSize: "0.85rem" }}>We're new and growing! Subscribe for launch offers, new items, and updates.</p>
            <div className="flex items-center bg-white/10 rounded-full overflow-hidden pr-1">
              <input
                type="email"
                placeholder="Your email"
                className="bg-transparent px-4 py-2.5 text-white placeholder:text-white/40 outline-none flex-1 text-sm"
              />
              <button className="w-8 h-8 bg-[#ECB159] rounded-full flex items-center justify-center hover:bg-[#d49a3d] transition-colors shrink-0">
                <Mail size={14} className="text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/40" style={{ fontSize: "0.82rem" }}>
            © 2025 Cafe of Thrones. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            {["Privacy Policy", "Terms of Service"].map((t) => (
              <a key={t} href="#" className="text-white/40 hover:text-white/70 transition-colors" style={{ fontSize: "0.82rem" }}>{t}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
