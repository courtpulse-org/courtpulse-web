import { Box, Button, Input, Stack, Text } from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader, SurfaceCard } from "@repo/ui/elements";
import { CustomSelect } from "@repo/ui/input";
import { useGetCourtrooms } from "@/shared/api";
import { RouteConstants } from "@/shared/constants/routes";
import { useUploadScan } from "../api";

export function ScanPage() {
  const navigate = useNavigate();
  const [courtroomId, setCourtroomId] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const courtrooms = useGetCourtrooms();
  const upload = useUploadScan();

  const submit = async () => {
    if (!file || !courtroomId) return;
    const result = await upload.mutateAsync({
      courtroom_id: courtroomId,
      image: file,
    });
    navigate(
      RouteConstants.causeList.scanResult.generate({ id: result.data.id }),
    );
  };

  return (
    <>
      <PageHeader title="Scan a cause list" />
      <SurfaceCard maxW="36rem">
        <Stack gap="5">
          <CustomSelect
            label="Courtroom"
            placeholder="Which courtroom is this list posted at?"
            required
            options={(courtrooms.data?.data ?? []).map((c) => ({
              label: c.name,
              value: c.id,
            }))}
            value={courtroomId}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setCourtroomId(e.target.value)
            }
          />
          <Box>
            <Text textStyle="tiny-semibold" color="field.label" mb="2">
              Photo
            </Text>
            {/* `capture` opens the rear camera directly on phones. */}
            <Input
              type="file"
              accept="image/*"
              capture="environment"
              p="2"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
            <Text textStyle="tiny-regular" color="gray.200" mt="1">
              Get the whole sheet in frame, straight on, in good light.
            </Text>
          </Box>
          <Button
            size="lg"
            disabled={!file || !courtroomId}
            loading={upload.isPending}
            onClick={submit}
          >
            Upload and read
          </Button>
        </Stack>
      </SurfaceCard>
    </>
  );
}
