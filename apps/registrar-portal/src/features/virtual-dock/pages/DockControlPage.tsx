import { Button, Flex, HStack, Stack, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PageHeader, SectionLoader, SurfaceCard } from "@repo/ui/elements";
import { CustomInput } from "@repo/ui/input";
import { useGetDock, useUpdateDock } from "@/features/console/api";

/** "Currently calling Item #4" — big, thumb-sized next/previous controls. */
export function DockControlPage() {
  const { courtroomId = "" } = useParams();
  const { data, isLoading } = useGetDock(courtroomId);
  const update = useUpdateDock();
  const [current, setCurrent] = useState(1);
  const [total, setTotal] = useState(20);

  useEffect(() => {
    if (data?.data) {
      setCurrent(data.data.current_item);
      setTotal(data.data.total_items);
    }
  }, [data]);

  if (isLoading) return <SectionLoader />;

  const push = (item: number) => {
    const next = Math.min(Math.max(item, 1), total);
    setCurrent(next);
    update.mutate({
      courtroom_id: courtroomId,
      current_item: next,
      total_items: total,
    });
  };

  return (
    <Stack gap="4" maxW="36rem">
      <PageHeader title="Order of business" />
      <SurfaceCard textAlign="center" py="8">
        <Text
          textStyle="tiny-medium"
          color="gray.200"
          textTransform="uppercase"
        >
          Currently calling
        </Text>
        <Text
          fontFamily="serif"
          fontSize="6xl"
          color="primary.300"
          lineHeight="1.1"
        >
          Item #{current}
        </Text>
        <Text textStyle="small-regular" color="gray.200">
          of {total}
        </Text>
        <HStack gap="3" mt="6" justify="center">
          <Button
            size="xl"
            variant="outlineSecondary"
            onClick={() => push(current - 1)}
            disabled={current <= 1}
          >
            Previous
          </Button>
          <Button
            size="xl"
            onClick={() => push(current + 1)}
            disabled={current >= total}
            loading={update.isPending}
          >
            Call next
          </Button>
        </HStack>
      </SurfaceCard>
      <SurfaceCard>
        <Flex gap="3" align="flex-end">
          <CustomInput
            label="Items on today's list"
            type="number"
            value={total}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setTotal(Math.max(1, Number(e.target.value)))
            }
          />
          <Button variant="outline" onClick={() => push(current)}>
            Save
          </Button>
        </Flex>
      </SurfaceCard>
    </Stack>
  );
}
