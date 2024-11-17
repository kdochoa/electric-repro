CREATE TABLE IF NOT EXISTS "batch" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "metrc_batch_id" text,
    "strain_id" uuid,
    "weight_mg" numeric,
    "product_type_id" uuid,
    "facility_id" uuid,
    "notes" text,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
    "deleted_at" timestamp with time zone
);