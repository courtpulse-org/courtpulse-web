import { Button, Flex, Stack, Text } from "@chakra-ui/react";
import {
  EmptyStateComponent,
  PageHeader,
  SectionLoader,
  SurfaceCard,
} from "@repo/ui/elements";
import { ScaleIcon } from "@repo/ui/icons";
import { formatNaira, timeAgo } from "@repo/utils";
import { useGetDisputes, useResolveDispute } from "../api";

export function DisputesPage() {
  const { data, isLoading } = useGetDisputes();
  const resolve = useResolveDispute();
  const open = (data?.data ?? []).filter((d) => d.status === "OPEN");

  return (
    <>
      <PageHeader
        title="Disputes"
        description="Brief-holding disagreements awaiting a decision on the escrowed fee."
      />
      {isLoading ? (
        <SectionLoader />
      ) : open.length === 0 ? (
        <EmptyStateComponent
          icon={<ScaleIcon boxSize="10" />}
          title="No open disputes"
        />
      ) : (
        <Stack gap="3">
          {open.map((d) => (
            <SurfaceCard key={d.id}>
              <Flex justify="space-between" gap="3" wrap="wrap">
                <Text textStyle="mono" color="primary.300">
                  {d.brief.suit_number}
                </Text>
                <Text textStyle="default-semibold">
                  {formatNaira(d.brief.fee_amount)}
                </Text>
              </Flex>
              <Text textStyle="small-regular" my="2">
                {d.reason}
              </Text>
              <Text textStyle="tiny-regular" color="gray.200" mb="3">
                Raised {timeAgo(d.created_at)}
              </Text>
              <Flex gap="3" wrap="wrap">
                <Button
                  size="sm"
                  loading={resolve.isPending}
                  onClick={() =>
                    resolve.mutate({ id: d.id, outcome: "RELEASE_TO_HOLDER" })
                  }
                >
                  Release to standing-in counsel
                </Button>
                <Button
                  size="sm"
                  variant="dangerOutline"
                  onClick={() =>
                    resolve.mutate({ id: d.id, outcome: "REFUND_REQUESTER" })
                  }
                >
                  Refund requester
                </Button>
              </Flex>
            </SurfaceCard>
          ))}
        </Stack>
      )}
    </>
  );
}
