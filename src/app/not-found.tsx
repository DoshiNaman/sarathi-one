import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/states";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <EmptyState
      title="This page does not exist"
      description="The link may be out of date. Everything starts from the home page."
      action={
        <Button nativeButton={false} render={<Link href="/" />}>
          Go home
        </Button>
      }
    />
  );
}
