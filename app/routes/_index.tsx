import { useEffect, useState } from "react";
import { PGlite } from "@electric-sql/pglite";
import { electricSync } from "@electric-sql/pglite-sync";
import { live } from "@electric-sql/pglite/live";

export default function Index() {
  const [pg, setPg] = useState<PGlite | null>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const initializePglite = async () => {
      try {
        const pgInstance = await PGlite.create({
          dataDir: "idb://my-database",
          extensions: {
            electric: electricSync({ debug: true }),
            live,
          },
        });

        await pgInstance.exec(`
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
        `);

        await pgInstance.electric.syncShapeToTable({
          shape: {
            url: `http://localhost:3000/v1/shape?table=batch`,
          },
          table: "batch",
          primaryKey: ["id"],
        });

        setPg(pgInstance);
        setInitializing(false);
      } catch (error) {
        console.error("Failed to initialize PGlite:", error);
        setInitializing(false);
      }
    };

    initializePglite();

    // Cleanup function
    return () => {
      if (pg) {
        // Close the connection when component unmounts
        pg.close();
      }
    };
  }, []); // Empty dependency array means this runs once on mount

  if (initializing) {
    return <div>Initializing database...</div>;
  }

  return (
    <div className="flex h-screen items-center justify-center">
      {/* Your existing JSX */}
    </div>
  );
}
