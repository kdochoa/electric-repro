import { useShape } from "@electric-sql/react";

export default function Index() {
  const { isLoading, data, error, lastSyncedAt } = useShape<{ title: string }>({
    url: `http://localhost:3000/v1/shape`,
    table: "batch",
  });
  return <div className="flex h-screen items-center justify-center"></div>;
}
