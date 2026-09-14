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
      audit_logs: {
        Row: {
          action: string
          created_at: string
          details: Json
          id: string
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json
          id?: string
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json
          id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      dataset_versions: {
        Row: {
          created_at: string
          error_count: number
          id: string
          notes: string | null
          published_at: string | null
          record_count: number
          source_filename: string | null
          status: Database["public"]["Enums"]["dataset_status"]
          uploaded_by: string | null
          version: number
          warning_count: number
        }
        Insert: {
          created_at?: string
          error_count?: number
          id?: string
          notes?: string | null
          published_at?: string | null
          record_count?: number
          source_filename?: string | null
          status?: Database["public"]["Enums"]["dataset_status"]
          uploaded_by?: string | null
          version: number
          warning_count?: number
        }
        Update: {
          created_at?: string
          error_count?: number
          id?: string
          notes?: string | null
          published_at?: string | null
          record_count?: number
          source_filename?: string | null
          status?: Database["public"]["Enums"]["dataset_status"]
          uploaded_by?: string | null
          version?: number
          warning_count?: number
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          key: string
          updated_at?: string
          value?: Json
        }
        Update: {
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      stocks: {
        Row: {
          bse_symbol: string | null
          business_activity_status: string | null
          charting_symbol: string | null
          company_name: string
          compliance_date: string | null
          created_at: string
          currency: string | null
          dataset_version_id: string
          exchange: string | null
          financial_screening_status: string | null
          id: string
          notes: string | null
          nse_symbol: string | null
          price: number | null
          price_display: string | null
          record_updated_at: string | null
          search_text: string | null
          source: string | null
          status: Database["public"]["Enums"]["compliance_status"]
          symbol: string
        }
        Insert: {
          bse_symbol?: string | null
          business_activity_status?: string | null
          charting_symbol?: string | null
          company_name: string
          compliance_date?: string | null
          created_at?: string
          currency?: string | null
          dataset_version_id: string
          exchange?: string | null
          financial_screening_status?: string | null
          id?: string
          notes?: string | null
          nse_symbol?: string | null
          price?: number | null
          price_display?: string | null
          record_updated_at?: string | null
          search_text?: string | null
          source?: string | null
          status?: Database["public"]["Enums"]["compliance_status"]
          symbol: string
        }
        Update: {
          bse_symbol?: string | null
          business_activity_status?: string | null
          charting_symbol?: string | null
          company_name?: string
          compliance_date?: string | null
          created_at?: string
          currency?: string | null
          dataset_version_id?: string
          exchange?: string | null
          financial_screening_status?: string | null
          id?: string
          notes?: string | null
          nse_symbol?: string | null
          price?: number | null
          price_display?: string | null
          record_updated_at?: string | null
          search_text?: string | null
          source?: string | null
          status?: Database["public"]["Enums"]["compliance_status"]
          symbol?: string
        }
        Relationships: [
          {
            foreignKeyName: "stocks_dataset_version_id_fkey"
            columns: ["dataset_version_id"]
            isOneToOne: false
            referencedRelation: "dataset_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
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
      admin_overview: { Args: never; Returns: Json }
      claim_first_admin: { Args: never; Returns: boolean }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      publish_dataset: {
        Args: { _dataset_id: string }
        Returns: {
          created_at: string
          error_count: number
          id: string
          notes: string | null
          published_at: string | null
          record_count: number
          source_filename: string | null
          status: Database["public"]["Enums"]["dataset_status"]
          uploaded_by: string | null
          version: number
          warning_count: number
        }
        SetofOptions: {
          from: "*"
          to: "dataset_versions"
          isOneToOne: true
          isSetofReturn: false
        }
      }
    }
    Enums: {
      app_role: "admin"
      compliance_status:
        | "COMPLIANT"
        | "NON_COMPLIANT"
        | "UNDER_REVIEW"
        | "NOT_AVAILABLE"
      dataset_status: "draft" | "active" | "archived" | "failed"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      app_role: ["admin"],
      compliance_status: [
        "COMPLIANT",
        "NON_COMPLIANT",
        "UNDER_REVIEW",
        "NOT_AVAILABLE",
      ],
      dataset_status: ["draft", "active", "archived", "failed"],
    },
  },
} as const
