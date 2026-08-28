import { FileClock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/states";
import { PageHeader } from "@/components/admin-ui";
import { requireAdmin } from "@/lib/db/auth";

export const metadata = { title: "Applications" };

export default async function AdminApplicationsPage() {
  await requireAdmin();
  return (
    <>
      <PageHeader
        title="Applications"
        description="Transfer, HP termination and NOC applications filed by citizens."
      />

      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="text-base">Not yet server-side</CardTitle>
          <CardDescription>
            Applications and payments currently live in each citizen&apos;s browser, not in the
            database, so there is nothing for an admin to list here. This is stated on the public
            How-it-works page too rather than hidden. Persisting them per-citizen needs a real
            identity to attach them to, which is the next step.
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardContent className="p-0">
          <EmptyState
            icon={<FileClock aria-hidden />}
            title="No applications to show"
            description="Once applications are persisted server-side they will appear here with their stage timeline."
          />
        </CardContent>
      </Card>
    </>
  );
}
