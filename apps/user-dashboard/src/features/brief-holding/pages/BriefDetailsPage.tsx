import { Button, Stack, Text } from "@chakra-ui/react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { PageHeader, SectionLoader, SurfaceCard } from "@repo/ui/elements";
import { CustomTextArea } from "@repo/ui/input";
import { formatCourtDate, formatNaira, humanizeEnum } from "@repo/utils";
import { useCurrentUser } from "@/hooks";
import {
  useAcceptBrief,
  useCancelBrief,
  useCompleteBrief,
  useGetBrief,
} from "../api";

export function BriefDetailsPage() {
  const { id = "" } = useParams();
  const { userData } = useCurrentUser();
  const { data, isLoading } = useGetBrief(id);
  const accept = useAcceptBrief();
  const cancel = useCancelBrief();
  const complete = useCompleteBrief();
  const [notes, setNotes] = useState("");

  const brief = data?.data;
  if (isLoading || !brief) return <SectionLoader />;

  const isRequester = brief.requested_by === userData?.id;
  const isHolder = brief.accepted_by === userData?.id;

  return (
    <>
      <PageHeader
        title={brief.suit_number}
        description={`${humanizeEnum(brief.matter_type)} · ${formatCourtDate(brief.scheduled_date)} · ${formatNaira(brief.fee_amount)} in escrow`}
        actions={
          <>
            {isRequester && brief.status === "OPEN" && (
              <Button
                variant="dangerOutline"
                loading={cancel.isPending}
                onClick={() => cancel.mutate(brief.id)}
              >
                Cancel request
              </Button>
            )}
            {!isRequester && brief.status === "OPEN" && (
              <Button
                loading={accept.isPending}
                onClick={() => accept.mutate(brief.id)}
              >
                Hold this brief
              </Button>
            )}
          </>
        }
      />
      <Stack gap="4" maxW="36rem">
        <SurfaceCard>
          <Text
            textStyle="tiny-medium"
            color="gray.200"
            textTransform="uppercase"
            mb="2"
          >
            Status
          </Text>
          <Text textStyle="default-semibold">{humanizeEnum(brief.status)}</Text>
          {brief.instructions && (
            <>
              <Text
                textStyle="tiny-medium"
                color="gray.200"
                textTransform="uppercase"
                mt="4"
                mb="2"
              >
                Instructions
              </Text>
              <Text textStyle="small-regular">{brief.instructions}</Text>
            </>
          )}
        </SurfaceCard>

        {isHolder &&
          (brief.status === "ACCEPTED" || brief.status === "IN_PROGRESS") && (
            <SurfaceCard>
              <Text textStyle="h4" mb="3">
                Session notes
              </Text>
              <Stack gap="4">
                <CustomTextArea
                  placeholder="What happened in court — the next date, any orders made."
                  rows={5}
                  value={notes}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setNotes(e.target.value)
                  }
                />
                <Button
                  alignSelf="flex-end"
                  disabled={notes.trim().length < 10}
                  loading={complete.isPending}
                  onClick={() =>
                    complete.mutate({ id: brief.id, session_notes: notes })
                  }
                >
                  Submit and release escrow
                </Button>
              </Stack>
            </SurfaceCard>
          )}

        {brief.session_notes && (
          <SurfaceCard>
            <Text textStyle="h4" mb="2">
              Session notes
            </Text>
            <Text textStyle="small-regular">{brief.session_notes}</Text>
          </SurfaceCard>
        )}
      </Stack>
    </>
  );
}
