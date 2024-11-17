/**
 * By default, Remix will handle hydrating your app on the client for you.
 * You are free to delete this file if you'd like to, but if you ever want it revealed again, you can run `npx remix reveal` ✨
 * For more information, see https://remix.run/file-conventions/entry.client
 */

import { PGlite } from "@electric-sql/pglite";
import { PGliteProvider } from "@electric-sql/pglite-react";
import { electricSync } from "@electric-sql/pglite-sync";
import { live } from "@electric-sql/pglite/live";
import { RemixBrowser } from "@remix-run/react";
import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";

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

/*await pgInstance.electric.syncShapeToTable({
  shape: {
    url: `http://localhost:3000/v1/shape?table=batch`,
  },
  table: "batch",
  primaryKey: ["id"],
});*/

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <PGliteProvider db={pgInstance}>
        <RemixBrowser />
      </PGliteProvider>
    </StrictMode>
  );
});
