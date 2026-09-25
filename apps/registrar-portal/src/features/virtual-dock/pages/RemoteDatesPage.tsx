import { Button, Flex, NativeSelect, Stack, Text } from "@chakra-ui/react";
import { useState } from "react";
import type { IRemoteDateRequest } from "@repo/types";
import {
  EmptyStateComponent,
  PageHeader,
  SectionLoader,
  SurfaceCard,
} from "@repo/ui/elements";
import { CalendarIcon } from "@repo/ui/icons";
import { formatCourtDate } from "@repo/utils";
import {
  useDecideRemoteDate,
  useGetRemoteDateRequests,
} from "@/features/console/api";

function RequestCard({ req }: { req: IRemoteDateRequest }) {
  const decide = useDecideRemoteDate();
  const [date, setDate] = useState(req.proposed_dates[0] ?? "");

  return (
    <SurfaceCard>
      <Text textStyle="mono" color="primary.300">
        {req.suit_number}
      </Text>
      <Text textStyle="tiny-regular" color="gray.200" mb="3">
        Proposed: {req.proposed_dates.map(formatCourtDate).join(" · ")}
      </Text>
      <Flex gap="3" wrap="wrap" align="center">
        <NativeSelect.Root maxW="16rem">
          <NativeSelect.Field
            value={date}
            onChange={(e) => setDate(e.target.value)}
          >
            {req.proposed_dates.map((d) => (
              <option key={d} value={d}>
                {formatCourtDate(d)}
              </option>
            ))}
          </NativeSelect.Field>
          <NativeSelect.Indicator />
        </NativeSelect.Root>
        <Button
          loading={decide.isPending}
          onClick={() =>
            decide.mutate({
              id: req.id,
              decision: "APPROVED",
              approved_date: date,
            })
          }
        >
          Confirm date
        </Button>
        <Button
          variant="dangerOutline"
          onClick={() => decide.mutate({ id: req.id, decision: "REJECTED" })}
        >
          Decline
        </Button>
      </Flex>
    </SurfaceCard>
  );
}

export function RemoteDatesPage() {
  const { data, isLoading } = useGetRemoteDateRequests();
  const pending = (data?.data ?? []).filter((r) => r.status === "PENDING");

  return (
    <>
      <PageHeader
        title="Remote date requests"
        description="Counsel propose dates when a court is verified Not Sitting. Confirm one to fix the next date."
      />
      {isLoading ? (
        <SectionLoader />
      ) : pending.length === 0 ? (
        <EmptyStateComponent
          icon={<CalendarIcon boxSize="10" />}
          title="No pending requests"
        />
      ) : (
        <Stack gap="3">
          {pending.map((r) => (
            <RequestCard key={r.id} req={r} />
          ))}
        </Stack>
      )}
    </>
  );
}
