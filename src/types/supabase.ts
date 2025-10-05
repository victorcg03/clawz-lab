export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          extensions?: Json;
          operationName?: string;
          query?: string;
          variables?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string;
          actor_id: string | null;
          created_at: string | null;
          entity: string;
          entity_id: string;
          id: string;
          meta: Json | null;
        };
        Insert: {
          action: string;
          actor_id?: string | null;
          created_at?: string | null;
          entity: string;
          entity_id: string;
          id?: string;
          meta?: Json | null;
        };
        Update: {
          action?: string;
          actor_id?: string | null;
          created_at?: string | null;
          entity?: string;
          entity_id?: string;
          id?: string;
          meta?: Json | null;
        };
        Relationships: [];
      };
      cart_items: {
        Row: {
          cart_id: string | null;
          created_at: string | null;
          custom_sizes: Json | null;
          id: string;
          qty: number;
          size_profile_id: string | null;
          variant_id: string | null;
        };
        Insert: {
          cart_id?: string | null;
          created_at?: string | null;
          custom_sizes?: Json | null;
          id?: string;
          qty: number;
          size_profile_id?: string | null;
          variant_id?: string | null;
        };
        Update: {
          cart_id?: string | null;
          created_at?: string | null;
          custom_sizes?: Json | null;
          id?: string;
          qty?: number;
          size_profile_id?: string | null;
          variant_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'cart_items_cart_id_fkey';
            columns: ['cart_id'];
            isOneToOne: false;
            referencedRelation: 'carts';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'cart_items_size_profile_id_fkey';
            columns: ['size_profile_id'];
            isOneToOne: false;
            referencedRelation: 'size_profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'cart_items_variant_id_fkey';
            columns: ['variant_id'];
            isOneToOne: false;
            referencedRelation: 'product_variants';
            referencedColumns: ['id'];
          },
        ];
      };
      carts: {
        Row: {
          created_at: string | null;
          id: string;
          status: string;
          user_id: string | null;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          status: string;
          user_id?: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          status?: string;
          user_id?: string | null;
        };
        Relationships: [];
      };
      collections: {
        Row: {
          created_at: string | null;
          description_i18n: Json | null;
          hero_image: string | null;
          id: string;
          name_i18n: Json;
          slug: string;
        };
        Insert: {
          created_at?: string | null;
          description_i18n?: Json | null;
          hero_image?: string | null;
          id?: string;
          name_i18n: Json;
          slug: string;
        };
        Update: {
          created_at?: string | null;
          description_i18n?: Json | null;
          hero_image?: string | null;
          id?: string;
          name_i18n?: Json;
          slug?: string;
        };
        Relationships: [];
      };
      custom_request_media: {
        Row: {
          created_at: string | null;
          file_url: string;
          id: string;
          kind: string | null;
          request_id: string | null;
          title: string | null;
        };
        Insert: {
          created_at?: string | null;
          file_url: string;
          id?: string;
          kind?: string | null;
          request_id?: string | null;
          title?: string | null;
        };
        Update: {
          created_at?: string | null;
          file_url?: string;
          id?: string;
          kind?: string | null;
          request_id?: string | null;
          title?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'custom_request_media_request_id_fkey';
            columns: ['request_id'];
            isOneToOne: false;
            referencedRelation: 'custom_requests';
            referencedColumns: ['id'];
          },
        ];
      };
      custom_requests: {
        Row: {
          brief: string | null;
          colors: Json | null;
          contact_name: string;
          created_at: string | null;
          email: string;
          extras: Json | null;
          finish: string | null;
          id: string;
          length: string | null;
          measurement: Json | null;
          phone: string | null;
          shape: string | null;
          status: string;
          target_date: string | null;
          theme: string | null;
          user_id: string | null;
        };
        Insert: {
          brief?: string | null;
          colors?: Json | null;
          contact_name: string;
          created_at?: string | null;
          email: string;
          extras?: Json | null;
          finish?: string | null;
          id?: string;
          length?: string | null;
          measurement?: Json | null;
          phone?: string | null;
          shape?: string | null;
          status?: string;
          target_date?: string | null;
          theme?: string | null;
          user_id?: string | null;
        };
        Update: {
          brief?: string | null;
          colors?: Json | null;
          contact_name?: string;
          created_at?: string | null;
          email?: string;
          extras?: Json | null;
          finish?: string | null;
          id?: string;
          length?: string | null;
          measurement?: Json | null;
          phone?: string | null;
          shape?: string | null;
          status?: string;
          target_date?: string | null;
          theme?: string | null;
          user_id?: string | null;
        };
        Relationships: [];
      };
      discounts: {
        Row: {
          active: boolean | null;
          code: string;
          ends_at: string | null;
          id: string;
          starts_at: string | null;
          type: string;
          value: number;
        };
        Insert: {
          active?: boolean | null;
          code: string;
          ends_at?: string | null;
          id?: string;
          starts_at?: string | null;
          type: string;
          value: number;
        };
        Update: {
          active?: boolean | null;
          code?: string;
          ends_at?: string | null;
          id?: string;
          starts_at?: string | null;
          type?: string;
          value?: number;
        };
        Relationships: [];
      };
      messages: {
        Row: {
          author: string;
          content: string;
          created_at: string | null;
          id: string;
          request_id: string | null;
        };
        Insert: {
          author: string;
          content: string;
          created_at?: string | null;
          id?: string;
          request_id?: string | null;
        };
        Update: {
          author?: string;
          content?: string;
          created_at?: string | null;
          id?: string;
          request_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'messages_request_id_fkey';
            columns: ['request_id'];
            isOneToOne: false;
            referencedRelation: 'custom_requests';
            referencedColumns: ['id'];
          },
        ];
      };
      order_items: {
        Row: {
          created_at: string | null;
          custom_sizes: Json | null;
          id: string;
          order_id: string | null;
          qty: number;
          size_profile_id: string | null;
          unit_price: number;
          variant_id: string | null;
        };
        Insert: {
          created_at?: string | null;
          custom_sizes?: Json | null;
          id?: string;
          order_id?: string | null;
          qty: number;
          size_profile_id?: string | null;
          unit_price: number;
          variant_id?: string | null;
        };
        Update: {
          created_at?: string | null;
          custom_sizes?: Json | null;
          id?: string;
          order_id?: string | null;
          qty?: number;
          size_profile_id?: string | null;
          unit_price?: number;
          variant_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'order_items_order_id_fkey';
            columns: ['order_id'];
            isOneToOne: false;
            referencedRelation: 'orders';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'order_items_size_profile_id_fkey';
            columns: ['size_profile_id'];
            isOneToOne: false;
            referencedRelation: 'size_profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'order_items_variant_id_fkey';
            columns: ['variant_id'];
            isOneToOne: false;
            referencedRelation: 'product_variants';
            referencedColumns: ['id'];
          },
        ];
      };
      orders: {
        Row: {
          created_at: string | null;
          id: string;
          notes: string | null;
          shipping_address: Json | null;
          status: string;
          total: number;
          user_id: string | null;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          notes?: string | null;
          shipping_address?: Json | null;
          status: string;
          total: number;
          user_id?: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          notes?: string | null;
          shipping_address?: Json | null;
          status?: string;
          total?: number;
          user_id?: string | null;
        };
        Relationships: [];
      };
      product_variants: {
        Row: {
          active: boolean | null;
          colorway: string | null;
          finish: string | null;
          id: string;
          images: Json | null;
          length: string | null;
          price: number | null;
          product_id: string | null;
          shape: string | null;
          sku: string | null;
          stock: number | null;
        };
        Insert: {
          active?: boolean | null;
          colorway?: string | null;
          finish?: string | null;
          id?: string;
          images?: Json | null;
          length?: string | null;
          price?: number | null;
          product_id?: string | null;
          shape?: string | null;
          sku?: string | null;
          stock?: number | null;
        };
        Update: {
          active?: boolean | null;
          colorway?: string | null;
          finish?: string | null;
          id?: string;
          images?: Json | null;
          length?: string | null;
          price?: number | null;
          product_id?: string | null;
          shape?: string | null;
          sku?: string | null;
          stock?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'product_variants_product_id_fkey';
            columns: ['product_id'];
            isOneToOne: false;
            referencedRelation: 'products';
            referencedColumns: ['id'];
          },
        ];
      };
      products: {
        Row: {
          active: boolean | null;
          base_price: number;
          collection_id: string | null;
          created_at: string | null;
          description_i18n: Json | null;
          id: string;
          name_i18n: Json;
          slug: string;
        };
        Insert: {
          active?: boolean | null;
          base_price: number;
          collection_id?: string | null;
          created_at?: string | null;
          description_i18n?: Json | null;
          id?: string;
          name_i18n: Json;
          slug: string;
        };
        Update: {
          active?: boolean | null;
          base_price?: number;
          collection_id?: string | null;
          created_at?: string | null;
          description_i18n?: Json | null;
          id?: string;
          name_i18n?: Json;
          slug?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'products_collection_id_fkey';
            columns: ['collection_id'];
            isOneToOne: false;
            referencedRelation: 'collections';
            referencedColumns: ['id'];
          },
        ];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          created_at: string | null;
          full_name: string | null;
          id: string;
          is_admin: boolean | null;
          phone: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string | null;
          full_name?: string | null;
          id: string;
          is_admin?: boolean | null;
          phone?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string | null;
          full_name?: string | null;
          id?: string;
          is_admin?: boolean | null;
          phone?: string | null;
        };
        Relationships: [];
      };
      quotes: {
        Row: {
          amount: number;
          created_at: string | null;
          currency: string;
          expires_at: string | null;
          id: string;
          message: string | null;
          request_id: string | null;
          status: string;
        };
        Insert: {
          amount: number;
          created_at?: string | null;
          currency?: string;
          expires_at?: string | null;
          id?: string;
          message?: string | null;
          request_id?: string | null;
          status?: string;
        };
        Update: {
          amount?: number;
          created_at?: string | null;
          currency?: string;
          expires_at?: string | null;
          id?: string;
          message?: string | null;
          request_id?: string | null;
          status?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'quotes_request_id_fkey';
            columns: ['request_id'];
            isOneToOne: false;
            referencedRelation: 'custom_requests';
            referencedColumns: ['id'];
          },
        ];
      };
      size_profiles: {
        Row: {
          created_at: string | null;
          id: string;
          left_index: number | null;
          left_middle: number | null;
          left_pinky: number | null;
          left_ring: number | null;
          left_thumb: number | null;
          name: string;
          right_index: number | null;
          right_middle: number | null;
          right_pinky: number | null;
          right_ring: number | null;
          right_thumb: number | null;
          user_id: string | null;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          left_index?: number | null;
          left_middle?: number | null;
          left_pinky?: number | null;
          left_ring?: number | null;
          left_thumb?: number | null;
          name: string;
          right_index?: number | null;
          right_middle?: number | null;
          right_pinky?: number | null;
          right_ring?: number | null;
          right_thumb?: number | null;
          user_id?: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          left_index?: number | null;
          left_middle?: number | null;
          left_pinky?: number | null;
          left_ring?: number | null;
          left_thumb?: number | null;
          name?: string;
          right_index?: number | null;
          right_middle?: number | null;
          right_pinky?: number | null;
          right_ring?: number | null;
          right_thumb?: number | null;
          user_id?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] &
        DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] &
        DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const;
