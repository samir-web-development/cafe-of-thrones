import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { Database } from "../types/supabase";

type Product = Database["public"]["Tables"]["products"]["Row"];

export function useProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function getProducts() {
            try {
                setLoading(true);
                // We order by price to maintain the existing sort logic from Home.tsx
                const { data, error } = await supabase
                    .from("products")
                    .select("*")
                    .eq("is_available", true)
                    .order("price", { ascending: true });

                if (error) {
                    throw error;
                }

                if (data) {
                    setProducts(data);
                }
            } catch (err: any) {
                console.error("Error fetching products:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        getProducts();
    }, []);

    return { products, loading, error };
}
