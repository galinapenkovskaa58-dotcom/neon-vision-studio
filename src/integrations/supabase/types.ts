export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      bookings: {
        Row: {
          created_at: string | null
          id: string
          messenger: Database["public"]["Enums"]["messenger_type"]
          messenger_username: string | null
          name: string
          phone: string
          references_text: string | null
          status: Database["public"]["Enums"]["booking_status"] | null
          style: string | null
          tariff_id: string | null
          updated_at: string | null
          urgency: Database["public"]["Enums"]["booking_urgency"] | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          messenger?: Database["public"]["Enums"]["messenger_type"]
          messenger_username?: string | null
          name: string
          phone: string
          references_text?: string | null
          status?: Database["public"]["Enums"]["booking_status"] | null
          style?: string | null
          tariff_id?: string | null
          updated_at?: string | null
          urgency?: Database["public"]["Enums"]["booking_urgency"] | null
        }
        Update: {
          created_at?: string | null
          id?: string
          messenger?: Database["public"]["Enums"]["messenger_type"]
          messenger_username?: string | null
          name?: string
          phone?: string
          references_text?: string | null
          status?: Database["public"]["Enums"]["booking_status"] | null
          style?: string | null
          tariff_id?: string | null
          updated_at?: string | null
          urgency?: Database["public"]["Enums"]["booking_urgency"] | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_tariff_id_fkey"
            columns: ["tariff_id"]
            isOneToOne: false
            referencedRelation: "tariffs"
            referencedColumns: ["id"]
          },
        ]
      }
      portfolio: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          id: string
          image_url: string
          image_urls: string[]
          service: string
          sort_order: number | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url: string
          image_urls?: string[]
          service?: string
          sort_order?: number | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string
          image_urls?: string[]
          service?: string
          sort_order?: number | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      portfolio_submissions: {
        Row: {
          approved_at: string | null
          client_name: string
          created_at: string
          description: string | null
          external_link: string | null
          id: string
          media_urls: string[]
          review_id: string | null
          service: string
          status: Database["public"]["Enums"]["review_status"]
          updated_at: string
        }
        Insert: {
          approved_at?: string | null
          client_name: string
          created_at?: string
          description?: string | null
          external_link?: string | null
          id?: string
          media_urls?: string[]
          review_id?: string | null
          service: string
          status?: Database["public"]["Enums"]["review_status"]
          updated_at?: string
        }
        Update: {
          approved_at?: string | null
          client_name?: string
          created_at?: string
          description?: string | null
          external_link?: string | null
          id?: string
          media_urls?: string[]
          review_id?: string | null
          service?: string
          status?: Database["public"]["Enums"]["review_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "portfolio_submissions_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          },
        ]
      }
      promocodes: {
        Row: {
          code: string
          created_at: string
          discount_percent: number
          id: string
          is_used: boolean
          portfolio_submission_id: string | null
          review_id: string | null
          source: Database["public"]["Enums"]["promocode_source"]
          used_at: string | null
          used_for_booking_id: string | null
        }
        Insert: {
          code: string
          created_at?: string
          discount_percent: number
          id?: string
          is_used?: boolean
          portfolio_submission_id?: string | null
          review_id?: string | null
          source: Database["public"]["Enums"]["promocode_source"]
          used_at?: string | null
          used_for_booking_id?: string | null
        }
        Update: {
          code?: string
          created_at?: string
          discount_percent?: number
          id?: string
          is_used?: boolean
          portfolio_submission_id?: string | null
          review_id?: string | null
          source?: Database["public"]["Enums"]["promocode_source"]
          used_at?: string | null
          used_for_booking_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "promocodes_portfolio_submission_id_fkey"
            columns: ["portfolio_submission_id"]
            isOneToOne: false
            referencedRelation: "portfolio_submissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "promocodes_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "promocodes_used_for_booking_id_fkey"
            columns: ["used_for_booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      questions: {
        Row: {
          created_at: string
          id: string
          messenger: Database["public"]["Enums"]["messenger_type"]
          messenger_username: string | null
          name: string
          phone: string
          question: string
          status: Database["public"]["Enums"]["question_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          messenger?: Database["public"]["Enums"]["messenger_type"]
          messenger_username?: string | null
          name: string
          phone: string
          question: string
          status?: Database["public"]["Enums"]["question_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          messenger?: Database["public"]["Enums"]["messenger_type"]
          messenger_username?: string | null
          name?: string
          phone?: string
          question?: string
          status?: Database["public"]["Enums"]["question_status"]
          updated_at?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          client_name: string
          created_at: string | null
          email: string | null
          id: string
          is_visible: boolean | null
          photo_url: string | null
          rating: number | null
          service: string
          sort_order: number | null
          status: Database["public"]["Enums"]["review_status"]
          submitted_at: string
          text: string
        }
        Insert: {
          client_name: string
          created_at?: string | null
          email?: string | null
          id?: string
          is_visible?: boolean | null
          photo_url?: string | null
          rating?: number | null
          service?: string
          sort_order?: number | null
          status?: Database["public"]["Enums"]["review_status"]
          submitted_at?: string
          text: string
        }
        Update: {
          client_name?: string
          created_at?: string | null
          email?: string | null
          id?: string
          is_visible?: boolean | null
          photo_url?: string | null
          rating?: number | null
          service?: string
          sort_order?: number | null
          status?: Database["public"]["Enums"]["review_status"]
          submitted_at?: string
          text?: string
        }
        Relationships: []
      }
      styles: {
        Row: {
          category: string
          color_from: string
          color_to: string
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          image_1: string | null
          image_2: string | null
          image_3: string | null
          is_visible: boolean | null
          service: string
          sort_order: number | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category?: string
          color_from?: string
          color_to?: string
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          image_1?: string | null
          image_2?: string | null
          image_3?: string | null
          is_visible?: boolean | null
          service?: string
          sort_order?: number | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          color_from?: string
          color_to?: string
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          image_1?: string | null
          image_2?: string | null
          image_3?: string | null
          is_visible?: boolean | null
          service?: string
          sort_order?: number | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      tariffs: {
        Row: {
          created_at: string | null
          description: string | null
          features: Json | null
          icon_url: string | null
          id: string
          is_active: boolean | null
          name: string
          price: number
          service: string
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          features?: Json | null
          icon_url?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          price: number
          service?: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          features?: Json | null
          icon_url?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          price?: number
          service?: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
      booking_status: "new" | "in_progress" | "completed" | "cancelled"
      booking_urgency: "normal" | "urgent"
      messenger_type: "telegram" | "whatsapp" | "other"
      promocode_source: "review" | "portfolio"
      question_status: "new" | "in_progress" | "answered" | "closed"
      review_status: "pending" | "approved" | "rejected"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
      booking_status: ["new", "in_progress", "completed", "cancelled"],
      booking_urgency: ["normal", "urgent"],
      messenger_type: ["telegram", "whatsapp", "other"],
      promocode_source: ["review", "portfolio"],
      question_status: ["new", "in_progress", "answered", "closed"],
      review_status: ["pending", "approved", "rejected"],
    },
  },
} as const
