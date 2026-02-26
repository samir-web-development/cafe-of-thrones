import { Hero } from "../components/Hero";
import { MenuSection } from "../components/MenuSection";
import { AboutSection } from "../components/AboutSection";
import { DeliverySection } from "../components/DeliverySection";

const cappuccinoImg = "https://images.unsplash.com/photo-1703013132195-691ce55017c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXBwdWNjaW5vJTIwY29mZmVlJTIwY3VwJTIwbGF0dGUlMjBhcnR8ZW58MXx8fHwxNzcxNzg1ODY2fDA&ixlib=rb-4.1.0&q=80&w=1080";
const shopImg = "https://images.unsplash.com/photo-1766289199024-8d1cd0249c37?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBzaG9wJTIwaW50ZXJpb3IlMjBjb3p5JTIwYW1iaWFuY2V8ZW58MXx8fHwxNzcxNzg1ODcxfDA&ixlib=rb-4.1.0&q=80&w=1080";

import { useProducts } from "../../hooks/useProducts";
export function Home() {
    const { products, loading } = useProducts();

    // Map database results to format expected by MenuSection
    const mappedProducts = products.map((p: any) => ({
        id: p.id,
        name: p.name,
        price: `₹ ${p.price}`,
        rating: p.rating || 0,
        image: p.image_url || "",
        tags: p.tags || [],
        description: p.description || undefined
    }));

    return (
        <>
            <Hero cappuccinoImg={cappuccinoImg} />
            {loading ? (
                <div className="py-20 text-center text-[#9e7c5a]">Loading royal delicacies...</div>
            ) : (
                <MenuSection items={mappedProducts} />
            )}
            <AboutSection shopImage={shopImg} />
            <DeliverySection />
        </>
    );
}
