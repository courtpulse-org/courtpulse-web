import { SimpleGrid } from "@chakra-ui/react";
import { useState } from "react";
import {
  EmptyStateComponent,
  PageHeader,
  SectionLoader,
} from "@repo/ui/elements";
import { CalendarIcon } from "@repo/ui/icons";
import { SegmentedControl } from "@/components/common";
import { DateRequestCard } from "@/components/requests/DateRequestCard";
import { useDateRequests } from "@/shared/api";

export function DateRequestsPage() {
  const { data, isLoading } = useDateRequests();
  const [view, setView] = useState<"pending" | "decided">("pending");
  const all = data?.data ?? [];
  const rows = all.filter((r) =>
    view === "pending" ? r.status === "PENDING" : r.status !== "PENDING",
  );
  const pending = all.filter((r) => r.status === "PENDING").length;

  return (
    <>
      <PageHeader
        title="Date requests"
        description="When a court doesn't sit, counsel propose new dates instead of queueing at the registry. You confirm one from the judge's diary."
        actions={
          <SegmentedControl
            value={view}
            onChange={setView}
            options={[
              { value: "pending", label: `Awaiting you (${pending})` },
              { value: "decided", label: "Decided" },
            ]}
          />
        }
      />
      {isLoading ? (
        <SectionLoader />
      ) : rows.length === 0 ? (
        <EmptyStateComponent
          icon={<CalendarIcon boxSize="10" />}
          title={
            view === "pending" ? "You're all caught up" : "Nothing decided yet"
          }
        />
      ) : (
        <SimpleGrid columns={{ base: 1, xl: 2 }} gap="4">
          {rows.map((r) => (
            <DateRequestCard key={r.id} request={r} />
          ))}
        </SimpleGrid>
      )}
    </>
  );
}
