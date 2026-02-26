import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, Search, Menu, X, User, LogOut } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { AuthModal } from "./AuthModal";

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { cartCount, setIsCartOpen } = useCart();
  const { user, signOut } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const location = useLocation();
  const isMenuPage = location.pathname === "/menu";

  return (
    <nav className="w-full bg-[#fdf6ec] sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 shrink-0">
          <img
            src="/logo.png"
            alt="Cafe of Thrones"
            className="h-12 w-auto"
          />
          <div className="flex flex-col leading-tight">
            <span
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: "1rem",
                fontWeight: 600,
                letterSpacing: "0.12em",
                color: "#c9973a",
              }}
            >
              CAFE OF THRONES
            </span>
            <span
              className="hidden sm:block"
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: "0.6rem",
                fontWeight: 400,
                letterSpacing: "0.2em",
                color: "#c9973a",
                opacity: 0.75,
              }}
            >
              COFFEE · SNACKS · CHILL
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className={`${!isMenuPage ? "text-[#ECB159] border-b-2 border-[#ECB159]" : "text-[#3d1f00] hover:text-[#ECB159]"} pb-0.5 transition-colors`} style={{ fontSize: "0.95rem" }}>Home</Link>
          <Link to="/menu" className={`${isMenuPage ? "text-[#ECB159] border-b-2 border-[#ECB159]" : "text-[#3d1f00] hover:text-[#ECB159]"} pb-0.5 transition-colors`} style={{ fontSize: "0.95rem" }}>Full Menu</Link>
          <Link to="/#delivery" className="text-[#3d1f00] hover:text-[#ECB159] transition-colors" style={{ fontSize: "0.95rem" }}>Delivery</Link>
        </div>

        {/* Search + Cart */}
        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center bg-white border border-[#e8d9c8] rounded-full px-4 py-2 gap-2 w-44">
            <Search size={15} className="text-[#aaa]" />
            <input
              type="text"
              placeholder="Cappuccino"
              className="bg-transparent outline-none text-sm text-[#555] w-full placeholder:text-[#bbb]"
            />
          </div>
          <button
            className="relative w-9 h-9 bg-[#3d1f00] rounded-full flex items-center justify-center hover:bg-[#5a2e00] transition-colors"
            onClick={() => setIsCartOpen(true)}
          >
            <ShoppingCart size={16} className="text-white" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#ECB159] rounded-full text-[10px] text-white flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </button>

          {user ? (
            <button
              onClick={() => signOut()}
              className="relative w-9 h-9 bg-[#fdf6ec] border border-[#e8d9c8] rounded-full flex items-center justify-center hover:bg-[#f0e4d4] transition-colors text-[#3d1f00]"
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          ) : (
            <button
              onClick={() => setAuthModalOpen(true)}
              className="relative w-9 h-9 bg-[#ECB159] rounded-full flex items-center justify-center hover:bg-[#d49a3d] transition-colors text-white shadow-sm"
              title="Login"
            >
              <User size={16} />
            </button>
          )}
        </div>

        {/* Mobile menu button */}
        <button className="md:hidden text-[#3d1f00]" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#fdf6ec] border-t border-[#e8d9c8] px-6 pb-4 flex flex-col gap-4">
          <Link to="/" onClick={() => setMenuOpen(false)} className={`${!isMenuPage ? "text-[#ECB159]" : "text-[#3d1f00]"} py-2 border-b border-[#f0e4d4]`}>Home</Link>
          <Link to="/menu" onClick={() => setMenuOpen(false)} className={`${isMenuPage ? "text-[#ECB159]" : "text-[#3d1f00]"} py-2 border-b border-[#f0e4d4]`}>Full Menu</Link>
          <Link to="/#delivery" onClick={() => setMenuOpen(false)} className="text-[#3d1f00] py-2 border-b border-[#f0e4d4]">Delivery</Link>

          {user ? (
            <button onClick={() => { signOut(); setMenuOpen(false); }} className="text-left text-[#3d1f00] py-2 border-b border-[#f0e4d4] flex items-center gap-2">
              <LogOut size={16} /> Logout
            </button>
          ) : (
            <button onClick={() => { setAuthModalOpen(true); setMenuOpen(false); }} className="text-left text-[#ECB159] py-2 border-b border-[#f0e4d4] flex items-center gap-2 font-bold">
              <User size={16} /> Login / Sign Up
            </button>
          )}

          <div className="flex items-center bg-white border border-[#e8d9c8] rounded-full px-4 py-2 gap-2 mt-2">
            <Search size={15} className="text-[#aaa]" />
            <input type="text" placeholder="Search coffee..." className="bg-transparent outline-none text-sm text-[#555] w-full" />
          </div>
        </div>
      )}

      {/* Auth Modal Overlay */}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </nav>
  );
}
