export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type Database = {
    public: {
        Tables: {
            order_items: {
                Row: {
                    created_at: string
                    id: string
                    order_id: string
                    product_id: number | null
                    product_name: string
                    quantity: number
                    total_price: number
                    unit_price: number
                }
                Insert: {
                    created_at?: string
                    id?: string
                    order_id: string
                    product_id?: number | null
                    product_name: string
                    quantity: number
                    total_price: number
                    unit_price: number
                }
                Update: {
                    created_at?: string
                    id?: string
                    order_id?: string
                    product_id?: number | null
                    product_name?: string
                    quantity?: number
                    total_price?: number
                    unit_price?: number
                }
                Relationships: [
                    {
                        foreignKeyName: "order_items_order_id_fkey"
                        columns: ["order_id"]
                        isOneToOne: false
                        referencedRelation: "orders"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "order_items_product_id_fkey"
                        columns: ["product_id"]
                        isOneToOne: false
                        referencedRelation: "products"
                        referencedColumns: ["id"]
                    },
                ]
            }
            orders: {
                Row: {
                    created_at: string
                    customer_name: string
                    customer_phone: string
                    delivery_address: string | null
                    id: string
                    status: Database["public"]["Enums"]["order_status"] | null
                    table_number: string | null
                    total_amount: number
                    type: Database["public"]["Enums"]["order_type"]
                    updated_at: string
                    user_id: string | null
                }
                Insert: {
                    created_at?: string
                    customer_name: string
                    customer_phone: string
                    delivery_address?: string | null
                    id?: string
                    status?: Database["public"]["Enums"]["order_status"] | null
                    table_number?: string | null
                    total_amount: number
                    type: Database["public"]["Enums"]["order_type"]
                    updated_at?: string
                    user_id?: string | null
                }
                Update: {
                    created_at?: string
                    customer_name?: string
                    customer_phone?: string
                    delivery_address?: string | null
                    id?: string
                    status?: Database["public"]["Enums"]["order_status"] | null
                    table_number?: string | null
                    total_amount?: number
                    type?: Database["public"]["Enums"]["order_type"]
                    updated_at?: string
                    user_id?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "orders_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                ]
            }
            products: {
                Row: {
                    created_at: string
                    description: string | null
                    id: number
                    image_url: string | null
                    is_available: boolean | null
                    name: string
                    price: number
                    rating: number | null
                    tags: string[] | null
                }
                Insert: {
                    created_at?: string
                    description?: string | null
                    id?: number
                    image_url?: string | null
                    is_available?: boolean | null
                    name: string
                    price: number
                    rating?: number | null
                    tags?: string[] | null
                }
                Update: {
                    created_at?: string
                    description?: string | null
                    id?: number
                    image_url?: string | null
                    is_available?: boolean | null
                    name?: string
                    price?: number
                    rating?: number | null
                    tags?: string[] | null
                }
                Relationships: []
            }
            profiles: {
                Row: {
                    address: string | null
                    created_at: string
                    full_name: string | null
                    id: string
                    phone_number: string | null
                    updated_at: string
                }
                Insert: {
                    address?: string | null
                    created_at?: string
                    full_name?: string | null
                    id: string
                    phone_number?: string | null
                    updated_at?: string
                }
                Update: {
                    address?: string | null
                    created_at?: string
                    full_name?: string | null
                    id?: string
                    phone_number?: string | null
                    updated_at?: string
                }
                Relationships: []
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            order_status:
            | "pending"
            | "preparing"
            | "out_for_delivery"
            | "delivered"
            | "cancelled"
            order_type: "home_delivery" | "table_order"
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
    PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
            Row: infer R
        }
    ? R
    : never
    : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
            Row: infer R
        }
    ? R
    : never
    : never

export type TablesInsert<
    PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
        Insert: infer I
    }
    ? I
    : never
    : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
    }
    ? I
    : never
    : never

export type TablesUpdate<
    PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
        Update: infer U
    }
    ? U
    : never
    : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
    }
    ? U
    : never
    : never

export type Enums<
    PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
    EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
    ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
    : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
    PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
    CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
        schema: keyof Database
    }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
    ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
    : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
