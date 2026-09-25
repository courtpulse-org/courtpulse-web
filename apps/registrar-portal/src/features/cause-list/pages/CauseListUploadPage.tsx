import { Box, Button, Input, Stack, Text } from "@chakra-ui/react";
import { useState } from "react";
import { PageHeader, SurfaceCard } from "@repo/ui/elements";
import { CustomSelect } from "@repo/ui/input";
import {
  useGetMyCourtrooms,
  useUploadOfficialCauseList,
} from "@/features/console/api";

export function CauseListUploadPage() {
  const courtrooms = useGetMyCourtrooms();
  const upload = useUploadOfficialCauseList();
  const [courtroomId, setCourtroomId] = useState("");
  const [file, setFile] = useState<File | null>(null);

  return (
    <>
      <PageHeader
        title="Upload today's cause list"
        description="A photo or scan of the official list. We match every suit number against lawyers' watchlists."
      />
      <SurfaceCard maxW="36rem">
        <Stack gap="5">
          <CustomSelect
            label="Courtroom"
            placeholder="Select courtroom"
            required
            options={(courtrooms.data?.data ?? []).map((r) => ({
              label: r.courtroom.name,
              value: r.courtroom.id,
            }))}
            value={courtroomId}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setCourtroomId(e.target.value)
            }
          />
          <Box>
            <Text textStyle="tiny-semibold" color="field.label" mb="2">
              Photo or PDF
            </Text>
            <Input
              type="file"
              accept="image/*,application/pdf"
              capture="environment"
              p="2"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </Box>
          <Button
            size="lg"
            disabled={!file || !courtroomId}
            loading={upload.isPending}
            onClick={() =>
              file && upload.mutate({ courtroom_id: courtroomId, image: file })
            }
          >
            Upload
          </Button>
        </Stack>
      </SurfaceCard>
    </>
  );
}
