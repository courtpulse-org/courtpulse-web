import {
  Box,
  Button,
  Checkbox,
  Flex,
  Image,
  Input,
  Spinner,
  Stack,
  Table,
  Text,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { BUSINESS_LABEL } from "@repo/types";
import { CameraIcon, UploadIcon, WarningIcon } from "@repo/ui/icons";
import { looksLikeSuitNumber, normalizeSuitNumber } from "@repo/utils";
import { AppDialog } from "@/components/common";
import {
  useAddItems,
  useReadCauseListPhoto,
  type ItemInput,
} from "@/shared/api";

interface Props {
  open: boolean;
  onClose: () => void;
  courtroomId: string;
  date: string;
}

type Row = ItemInput & { include: boolean };

/** Photograph the paper list → review what was read → add to the digital list. */
export function ImportPhotoDialog({ open, onClose, courtroomId, date }: Props) {
  const read = useReadCauseListPhoto();
  const add = useAddItems();
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [rows, setRows] = useState<Row[] | null>(null);

  useEffect(() => {
    if (!open) {
      setFile(null);
      setRows(null);
      setPreview(null);
    }
  }, [open]);

  const onFile = async (f: File | null) => {
    if (!f) return;
    setFile(f);
    setPreview(f.type.startsWith("image/") ? URL.createObjectURL(f) : null);
    const result = await read.mutateAsync({
      courtroom_id: courtroomId,
      file: f,
    });
    setRows(result.data.items.map((i) => ({ ...i, include: true })));
  };

  const included = rows?.filter((r) => r.include) ?? [];

  return (
    <AppDialog
      open={open}
      onClose={onClose}
      size="xl"
      title="Import from a photo"
      description="Snap the printed cause list. We read the suit numbers and parties; you check them before they go live."
      footer={
        rows ? (
          <Button
            w={{ base: "full", md: "auto" }}
            disabled={included.length === 0}
            loading={add.isPending}
            onClick={async () => {
              await add.mutateAsync({
                courtroom_id: courtroomId,
                date,
                items: included.map((r) => ({
                  suit_number: normalizeSuitNumber(r.suit_number),
                  title: r.title,
                  business: r.business,
                  claimant_counsel: r.claimant_counsel,
                  defendant_counsel: r.defendant_counsel,
                })),
              });
              onClose();
            }}
          >
            Add {included.length} matters to the list
          </Button>
        ) : undefined
      }
    >
      {!file && (
        <Flex
          direction="column"
          align="center"
          justify="center"
          gap="3"
          border="2px dashed"
          borderColor="gray.100"
          rounded="lg"
          py="10"
          px="6"
          textAlign="center"
          bg="gray.25"
          cursor="pointer"
          onClick={() => fileRef.current?.click()}
        >
          <Flex
            boxSize="12"
            rounded="full"
            bg="primary.50"
            color="primary.300"
            align="center"
            justify="center"
            fontSize="xl"
          >
            <CameraIcon />
          </Flex>
          <Text textStyle="default-semibold">
            Take a photo or choose a file
          </Text>
          <Text textStyle="small-regular" color="gray.200" maxW="22rem">
            Whole sheet in frame, straight on, good light. JPG, PNG or PDF.
          </Text>
          <Button size="sm" variant="outline">
            <UploadIcon /> Choose file
          </Button>
          <Input
            ref={fileRef}
            type="file"
            accept="image/*,application/pdf"
            capture="environment"
            display="none"
            onChange={(e) => onFile(e.target.files?.[0] ?? null)}
          />
        </Flex>
      )}

      {file && !rows && (
        <Flex direction="column" align="center" gap="4" py="8">
          {preview && (
            <Image
              src={preview}
              alt=""
              maxH="10rem"
              rounded="md"
              border="1px solid"
              borderColor="gray.75"
            />
          )}
          <Flex align="center" gap="3">
            <Spinner color="primary.300" />
            <Text textStyle="small-medium">Reading the cause list…</Text>
          </Flex>
        </Flex>
      )}

      {rows && (
        <Stack gap="3">
          <Text textStyle="small-regular" color="gray.300">
            Found <b>{rows.length}</b> matters. Rows marked{" "}
            <WarningIcon color="warning.600" /> need a second look.
          </Text>
          <Box
            border="1px solid"
            borderColor="gray.75"
            rounded="md"
            overflowX="auto"
          >
            <Table.Root size="sm">
              <Table.Header>
                <Table.Row bg="gray.25">
                  <Table.ColumnHeader w="2.5rem" />
                  <Table.ColumnHeader minW="12rem">
                    Suit number
                  </Table.ColumnHeader>
                  <Table.ColumnHeader>Parties</Table.ColumnHeader>
                  <Table.ColumnHeader>Business</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {rows.map((r, idx) => {
                  const bad = !looksLikeSuitNumber(r.suit_number);
                  return (
                    <Table.Row key={idx} bg={bad ? "warning.50" : undefined}>
                      <Table.Cell>
                        <Checkbox.Root
                          checked={r.include}
                          onCheckedChange={(e) =>
                            setRows((rs) =>
                              rs!.map((x, j) =>
                                j === idx ? { ...x, include: !!e.checked } : x,
                              ),
                            )
                          }
                          colorPalette="primary"
                        >
                          <Checkbox.HiddenInput />
                          <Checkbox.Control />
                        </Checkbox.Root>
                      </Table.Cell>
                      <Table.Cell>
                        <Flex align="center" gap="1.5">
                          {bad && (
                            <WarningIcon color="warning.600" flexShrink={0} />
                          )}
                          <Input
                            size="sm"
                            h="8"
                            textStyle="mono"
                            fontSize="xs"
                            value={r.suit_number}
                            onChange={(e) =>
                              setRows((rs) =>
                                rs!.map((x, j) =>
                                  j === idx
                                    ? { ...x, suit_number: e.target.value }
                                    : x,
                                ),
                              )
                            }
                          />
                        </Flex>
                      </Table.Cell>
                      <Table.Cell textStyle="tiny-regular">
                        {r.title}
                      </Table.Cell>
                      <Table.Cell textStyle="tiny-regular">
                        {r.business ? BUSINESS_LABEL[r.business] : "—"}
                      </Table.Cell>
                    </Table.Row>
                  );
                })}
              </Table.Body>
            </Table.Root>
          </Box>
        </Stack>
      )}
    </AppDialog>
  );
}
