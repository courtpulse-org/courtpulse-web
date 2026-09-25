import {
  Badge,
  Box,
  Button,
  Flex,
  IconButton,
  Menu,
  Portal,
  Stack,
  Table,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import type { ICauseList, ICauseListItem } from "@repo/types";
import { EmptyStateComponent, SectionLoader } from "@repo/ui/elements";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CalendarIcon,
  CameraIcon,
  CheckIcon,
  DotsIcon,
  EditIcon,
  ListChecksIcon,
  PlayIcon,
  PlusIcon,
  SendIcon,
  SkipIcon,
  TrashIcon,
} from "@repo/ui/icons";
import { formatCourtTime } from "@repo/utils";
import { BusinessTag, OutcomeBadge, SectionCard } from "@/components/common";
import {
  useCallItem,
  useCallNext,
  useCauseList,
  useMoveItem,
  usePublishList,
  useRemoveItem,
  useSetOutcome,
  useUnpublishList,
} from "@/shared/api";
import { AdjournDialog } from "./AdjournDialog";
import { BulkAdjournDialog } from "./BulkAdjournDialog";
import { ImportPhotoDialog } from "./ImportPhotoDialog";
import { ItemFormDialog } from "./ItemFormDialog";

const OPEN = ["PENDING", "STOOD_DOWN", "CALLED"];

interface Props {
  courtroomId: string;
  date: string;
  isToday: boolean;
  notSitting: boolean;
}

export function CauseListPanel({
  courtroomId,
  date,
  isToday,
  notSitting,
}: Props) {
  const [params, setParams] = useSearchParams();
  const { data, isLoading } = useCauseList(courtroomId, date);
  const list = data?.data as ICauseList | undefined;

  const [editing, setEditing] = useState<ICauseListItem | null | "new">(null);
  const [adjourning, setAdjourning] = useState<{
    item: ICauseListItem;
    mode: "ADJOURNED" | "RESERVED";
  } | null>(null);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);

  // Deep link from "Not sitting → give new dates".
  useEffect(() => {
    if (
      params.get("adjourn") === "1" &&
      list &&
      list.items.some((i) => OPEN.includes(i.outcome ?? "PENDING"))
    ) {
      setBulkOpen(true);
      params.delete("adjourn");
      setParams(params, { replace: true });
    }
  }, [params, setParams, list]);

  const publish = usePublishList();
  const unpublish = useUnpublishList();
  const callNext = useCallNext();

  if (isLoading || !list) return <SectionLoader h="20rem" />;

  const items = list.items;
  const count = (o: string[]) =>
    items.filter((i) => o.includes(i.outcome ?? "PENDING")).length;
  const openCount = count(OPEN);
  const current = items.find((i) => i.id === list.current_item_id);

  return (
    <Stack gap="4">
      <SectionCard
        title={
          <Flex align="center" gap="2" wrap="wrap">
            Cause list
            <Badge
              colorPalette={list.status === "PUBLISHED" ? "success" : "gray"}
              variant="subtle"
              rounded="full"
            >
              {list.status === "PUBLISHED"
                ? `Published ${list.published_at ? formatCourtTime(list.published_at) : ""}`
                : "Draft — counsel can't see it yet"}
            </Badge>
            {list.source === "OCR" && (
              <Badge colorPalette="info" variant="outline" rounded="full">
                From a spotter's photo
              </Badge>
            )}
          </Flex>
        }
        description={
          items.length
            ? `${items.length} matters · ${count(["HEARD"])} heard · ${count(["ADJOURNED", "RESERVED"])} adjourned · ${count(["STOOD_DOWN"])} stood down · ${openCount} still to take`
            : undefined
        }
        actions={
          <>
            <Button
              size="sm"
              variant="outlineSecondary"
              onClick={() => setImportOpen(true)}
            >
              <CameraIcon /> Import photo
            </Button>
            <Button
              size="sm"
              variant="outlineSecondary"
              onClick={() => setEditing("new")}
            >
              <PlusIcon /> Add matter
            </Button>
            {isToday && openCount > 0 && (
              <Button
                size="sm"
                variant={notSitting ? "primary" : "outline"}
                onClick={() => setBulkOpen(true)}
              >
                <CalendarIcon /> Give dates ({openCount})
              </Button>
            )}
            {list.status === "DRAFT" ? (
              <Button
                size="sm"
                variant="secondary"
                disabled={!items.length}
                loading={publish.isPending}
                onClick={() =>
                  publish.mutate({ courtroom_id: courtroomId, date })
                }
              >
                <SendIcon /> Publish
              </Button>
            ) : (
              <Button
                size="sm"
                variant="ghost"
                loading={unpublish.isPending}
                onClick={() =>
                  unpublish.mutate({ courtroom_id: courtroomId, date })
                }
              >
                Unpublish
              </Button>
            )}
          </>
        }
        flush
      >
        {notSitting && isToday && openCount > 0 && (
          <Flex
            bg="error.50"
            color="error.500"
            px="5"
            py="3"
            gap="3"
            align="center"
            justify="space-between"
            wrap="wrap"
            borderBottom="1px solid"
            borderColor="error.75"
          >
            <Text textStyle="small-medium">
              Court isn't sitting. {openCount} matters still need new dates —
              counsel are waiting for them.
            </Text>
            <Button
              size="sm"
              variant="danger"
              onClick={() => setBulkOpen(true)}
            >
              Give dates now
            </Button>
          </Flex>
        )}

        {isToday && !notSitting && items.length > 0 && (
          <Flex
            px={{ base: "4", md: "5" }}
            py="3"
            bg={current ? "success.50" : "gray.25"}
            borderBottom="1px solid"
            borderColor="gray.75"
            align={{ base: "stretch", md: "center" }}
            gap="3"
            direction={{ base: "column", md: "row" }}
          >
            <Box flex="1" minW="0">
              <Text
                textStyle="tiny-semibold"
                color={current ? "success.400" : "gray.200"}
                textTransform="uppercase"
                letterSpacing="0.05em"
              >
                {current
                  ? `Now calling · Item ${current.item_number} of ${items.length}`
                  : "Nothing called yet"}
              </Text>
              {current && (
                <Text textStyle="small-semibold" truncate>
                  <Text as="span" textStyle="mono" mr="2">
                    {current.suit_number}
                  </Text>
                  {current.title}
                </Text>
              )}
            </Box>
            <Flex gap="2" wrap="wrap">
              {current && (
                <>
                  <CurrentItemActions
                    item={current}
                    onAdjourn={(mode) => setAdjourning({ item: current, mode })}
                  />
                </>
              )}
              <Button
                size="sm"
                loading={callNext.isPending}
                onClick={() => callNext.mutate(courtroomId)}
                disabled={openCount === 0}
              >
                <SkipIcon /> Call next
              </Button>
            </Flex>
          </Flex>
        )}

        {items.length === 0 ? (
          <Box p="5">
            <EmptyStateComponent
              size="inline"
              icon={<ListChecksIcon boxSize="8" />}
              title="No matters on this list yet"
              description="Add matters one by one, or photograph the printed list and import it."
              buttonText="Import from photo"
              onPrimaryClick={() => setImportOpen(true)}
              secondaryButtonText="Add a matter"
              onSecondaryClick={() => setEditing("new")}
            />
          </Box>
        ) : (
          <Box overflowX="auto">
            <Table.Root size="md" interactive>
              <Table.Header>
                <Table.Row bg="gray.25">
                  <Table.ColumnHeader w="3.5rem">#</Table.ColumnHeader>
                  <Table.ColumnHeader minW="16rem">Matter</Table.ColumnHeader>
                  <Table.ColumnHeader
                    display={{ base: "none", lg: "table-cell" }}
                  >
                    Counsel (claimant · defendant)
                  </Table.ColumnHeader>
                  <Table.ColumnHeader minW="9rem">Outcome</Table.ColumnHeader>
                  <Table.ColumnHeader w="1%" />
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {items.map((item, idx) => (
                  <ItemRow
                    key={item.id}
                    item={item}
                    isFirst={idx === 0}
                    isLast={idx === items.length - 1}
                    isCurrent={item.id === list.current_item_id}
                    isToday={isToday}
                    onEdit={() => setEditing(item)}
                    onAdjourn={(mode) => setAdjourning({ item, mode })}
                  />
                ))}
              </Table.Body>
            </Table.Root>
          </Box>
        )}
      </SectionCard>

      <ItemFormDialog
        open={editing !== null}
        onClose={() => setEditing(null)}
        courtroomId={courtroomId}
        date={date}
        item={editing === "new" ? null : editing}
      />
      <AdjournDialog
        item={adjourning?.item ?? null}
        mode={adjourning?.mode}
        courtroomId={courtroomId}
        onClose={() => setAdjourning(null)}
      />
      <BulkAdjournDialog
        open={bulkOpen}
        onClose={() => setBulkOpen(false)}
        list={list}
      />
      <ImportPhotoDialog
        open={importOpen}
        onClose={() => setImportOpen(false)}
        courtroomId={courtroomId}
        date={date}
      />
    </Stack>
  );
}

function CurrentItemActions({
  item,
  onAdjourn,
}: {
  item: ICauseListItem;
  onAdjourn: (mode: "ADJOURNED" | "RESERVED") => void;
}) {
  const setOutcome = useSetOutcome();
  return (
    <>
      <Button
        size="sm"
        variant="outlineSecondary"
        loading={setOutcome.isPending}
        onClick={() => setOutcome.mutate({ id: item.id, outcome: "HEARD" })}
      >
        <CheckIcon /> Heard
      </Button>
      <Button
        size="sm"
        variant="outlineSecondary"
        onClick={() => onAdjourn("ADJOURNED")}
      >
        <CalendarIcon /> Adjourn
      </Button>
      <Button
        size="sm"
        variant="outlineSecondary"
        onClick={() =>
          setOutcome.mutate({ id: item.id, outcome: "STOOD_DOWN" })
        }
      >
        Stand down
      </Button>
    </>
  );
}

interface RowProps {
  item: ICauseListItem;
  isFirst: boolean;
  isLast: boolean;
  isCurrent: boolean;
  isToday: boolean;
  onEdit: () => void;
  onAdjourn: (mode: "ADJOURNED" | "RESERVED") => void;
}

function ItemRow({
  item,
  isFirst,
  isLast,
  isCurrent,
  isToday,
  onEdit,
  onAdjourn,
}: RowProps) {
  const call = useCallItem();
  const setOutcome = useSetOutcome();
  const move = useMoveItem();
  const remove = useRemoveItem();
  const done = ["HEARD", "ADJOURNED", "RESERVED", "STRUCK_OUT"].includes(
    item.outcome ?? "",
  );

  return (
    <Table.Row
      bg={isCurrent ? "success.50" : undefined}
      opacity={done ? 0.72 : 1}
    >
      <Table.Cell>
        <Flex
          boxSize="8"
          rounded="md"
          align="center"
          justify="center"
          textStyle="mono"
          fontWeight="600"
          bg={isCurrent ? "success.300" : "gray.50"}
          color={isCurrent ? "white" : "gray.400"}
        >
          {item.item_number}
        </Flex>
      </Table.Cell>
      <Table.Cell>
        <Flex align="center" gap="2" wrap="wrap">
          <Text textStyle="mono" color="primary.300" fontSize="sm">
            {item.suit_number}
          </Text>
          <BusinessTag business={item.business} />
        </Flex>
        <Text textStyle="small-regular" color="gray.400" lineClamp={1}>
          {item.title ?? "—"}
        </Text>
        {item.note && (
          <Text textStyle="tiny-regular" color="gray.200" lineClamp={1}>
            {item.note}
          </Text>
        )}
      </Table.Cell>
      <Table.Cell display={{ base: "none", lg: "table-cell" }}>
        <Text textStyle="tiny-regular" color="gray.400">
          <Text as="span" color="gray.200">
            C ·{" "}
          </Text>
          {item.claimant_counsel ?? "—"}
        </Text>
        <Text textStyle="tiny-regular" color="gray.400">
          <Text as="span" color="gray.200">
            D ·{" "}
          </Text>
          {item.defendant_counsel ?? "—"}
        </Text>
      </Table.Cell>
      <Table.Cell>
        <OutcomeBadge outcome={item.outcome} nextDate={item.next_date} />
      </Table.Cell>
      <Table.Cell>
        <Flex gap="1" justify="flex-end">
          {isToday && !isCurrent && !done && (
            <Button
              size="sm"
              variant="ghost"
              loading={call.isPending}
              onClick={() => call.mutate(item.id)}
            >
              <PlayIcon /> Call
            </Button>
          )}
          <Menu.Root positioning={{ placement: "bottom-end" }}>
            <Menu.Trigger asChild>
              <IconButton size="sm" variant="ghost" aria-label="More actions">
                <DotsIcon />
              </IconButton>
            </Menu.Trigger>
            <Portal>
              <Menu.Positioner>
                <Menu.Content minW="210px">
                  {isToday && (
                    <Menu.ItemGroup>
                      <Menu.ItemGroupLabel>Record outcome</Menu.ItemGroupLabel>
                      <Menu.Item
                        value="heard"
                        onClick={() =>
                          setOutcome.mutate({ id: item.id, outcome: "HEARD" })
                        }
                      >
                        <CheckIcon /> Heard
                      </Menu.Item>
                      <Menu.Item
                        value="adjourn"
                        onClick={() => onAdjourn("ADJOURNED")}
                      >
                        <CalendarIcon /> Adjourn to a date…
                      </Menu.Item>
                      <Menu.Item
                        value="stand"
                        onClick={() =>
                          setOutcome.mutate({
                            id: item.id,
                            outcome: "STOOD_DOWN",
                          })
                        }
                      >
                        Stand down
                      </Menu.Item>
                      <Menu.Item
                        value="reserve"
                        onClick={() => onAdjourn("RESERVED")}
                      >
                        Reserve judgment…
                      </Menu.Item>
                      <Menu.Item
                        value="struck"
                        onClick={() =>
                          setOutcome.mutate({
                            id: item.id,
                            outcome: "STRUCK_OUT",
                          })
                        }
                      >
                        Strike out
                      </Menu.Item>
                      {item.outcome !== "PENDING" && (
                        <Menu.Item
                          value="reset"
                          onClick={() =>
                            setOutcome.mutate({
                              id: item.id,
                              outcome: "PENDING",
                              notify: false,
                            })
                          }
                        >
                          Reset to not yet called
                        </Menu.Item>
                      )}
                    </Menu.ItemGroup>
                  )}
                  <Menu.Separator />
                  <Menu.Item value="edit" onClick={onEdit}>
                    <EditIcon /> Edit
                  </Menu.Item>
                  <Menu.Item
                    value="up"
                    disabled={isFirst}
                    onClick={() =>
                      move.mutate({ id: item.id, direction: "up" })
                    }
                  >
                    <ArrowUpIcon /> Move up
                  </Menu.Item>
                  <Menu.Item
                    value="down"
                    disabled={isLast}
                    onClick={() =>
                      move.mutate({ id: item.id, direction: "down" })
                    }
                  >
                    <ArrowDownIcon /> Move down
                  </Menu.Item>
                  <Menu.Item
                    value="remove"
                    color="error.300"
                    onClick={() => remove.mutate(item.id)}
                  >
                    <TrashIcon /> Remove
                  </Menu.Item>
                </Menu.Content>
              </Menu.Positioner>
            </Portal>
          </Menu.Root>
        </Flex>
      </Table.Cell>
    </Table.Row>
  );
}
