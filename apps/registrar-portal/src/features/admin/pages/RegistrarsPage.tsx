import { Badge, Box, Button, Code, Flex, Table, Text } from "@chakra-ui/react";
import { useState } from "react";
import type { IUser } from "@repo/types";
import { PageHeader, SectionLoader } from "@repo/ui/elements";
import { CustomInput } from "@repo/ui/input";
import { PlusIcon } from "@repo/ui/icons";
import { AppDialog, FormField, SectionCard } from "@/components/common";
import {
  courtroomLabel,
  useInviteRegistrar,
  useRegistrars,
  useSetRegistrarCourtrooms,
  useVerifyUser,
} from "@/shared/api";
import { CourtroomPicker } from "../components/CourtroomPicker";

export function RegistrarsPage() {
  const { data, isLoading } = useRegistrars();
  const verify = useVerifyUser();
  const setRooms = useSetRegistrarCourtrooms();
  const invite = useInviteRegistrar();
  const [editing, setEditing] = useState<IUser | null>(null);
  const [rooms, setRoomsDraft] = useState<string[]>([]);
  const [inviting, setInviting] = useState(false);
  const [email, setEmail] = useState("");
  const [inviteRooms, setInviteRooms] = useState<string[]>([]);
  const [link, setLink] = useState<string | null>(null);

  const registrars = data?.data ?? [];

  return (
    <>
      <PageHeader
        title="Registrars"
        description="Court registrars and clerks, and the courtrooms each one posts for. Onboarding is by invitation and needs your verification."
        actions={
          <Button
            onClick={() => {
              setInviting(true);
              setLink(null);
              setEmail("");
              setInviteRooms([]);
            }}
          >
            <PlusIcon /> Invite registrar
          </Button>
        }
      />
      <SectionCard flush>
        {isLoading ? (
          <SectionLoader />
        ) : (
          <Box overflowX="auto">
            <Table.Root>
              <Table.Header>
                <Table.Row bg="gray.25">
                  <Table.ColumnHeader>Registrar</Table.ColumnHeader>
                  <Table.ColumnHeader>Courtrooms</Table.ColumnHeader>
                  <Table.ColumnHeader>Status</Table.ColumnHeader>
                  <Table.ColumnHeader />
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {registrars.map((u) => (
                  <Table.Row key={u.id}>
                    <Table.Cell>
                      <Text textStyle="small-semibold">
                        {u.first_name} {u.last_name}
                      </Text>
                      <Text textStyle="tiny-regular" color="gray.200">
                        {u.staff_title} · {u.email}
                      </Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Flex gap="1" wrap="wrap">
                        {(u.courtroom_ids ?? []).length === 0 ? (
                          <Text textStyle="tiny-regular" color="gray.200">
                            None assigned
                          </Text>
                        ) : (
                          u.courtroom_ids!.map((id) => (
                            <Badge
                              key={id}
                              variant="outline"
                              colorPalette="gray"
                              size="sm"
                            >
                              {courtroomLabel(id)}
                            </Badge>
                          ))
                        )}
                      </Flex>
                    </Table.Cell>
                    <Table.Cell>
                      <Badge
                        colorPalette={u.is_verified ? "success" : "warning"}
                        variant="subtle"
                      >
                        {u.is_verified ? "Verified" : "Pending"}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell>
                      <Flex gap="2" justify="flex-end">
                        {!u.is_verified && (
                          <Button
                            size="sm"
                            loading={verify.isPending}
                            onClick={() => verify.mutate(u.id)}
                          >
                            Verify
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outlineSecondary"
                          onClick={() => {
                            setEditing(u);
                            setRoomsDraft(u.courtroom_ids ?? []);
                          }}
                        >
                          Courtrooms
                        </Button>
                      </Flex>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Box>
        )}
      </SectionCard>

      <AppDialog
        open={!!editing}
        onClose={() => setEditing(null)}
        title={`Courtrooms for ${editing?.first_name ?? ""} ${editing?.last_name ?? ""}`}
        description="They can post status, run cause lists and confirm dates only for these."
        footer={
          <Button
            loading={setRooms.isPending}
            onClick={async () => {
              await setRooms.mutateAsync({
                id: editing!.id,
                courtroom_ids: rooms,
              });
              setEditing(null);
            }}
          >
            Save {rooms.length} courtrooms
          </Button>
        }
      >
        <CourtroomPicker value={rooms} onChange={setRoomsDraft} />
      </AppDialog>

      <AppDialog
        open={inviting}
        onClose={() => setInviting(false)}
        title="Invite a registrar"
        description="They get an email link to set up their account. You verify them before they can post."
        footer={
          link ? (
            <Button variant="outline" onClick={() => setInviting(false)}>
              Done
            </Button>
          ) : (
            <Button
              disabled={!email}
              loading={invite.isPending}
              onClick={async () => {
                const r = await invite.mutateAsync({
                  email,
                  courtroom_ids: inviteRooms,
                });
                setLink(r.data.link);
              }}
            >
              Send invitation
            </Button>
          )
        }
      >
        {link ? (
          <FormField
            label="Invitation sent"
            hint="In this demo no email goes out — open the link in a private window to try onboarding."
          >
            <Code p="3" rounded="md" wordBreak="break-all" whiteSpace="normal">
              {link}
            </Code>
          </FormField>
        ) : (
          <Flex direction="column" gap="4">
            <CustomInput
              label="Work email"
              type="email"
              placeholder="registrar@lagosjudiciary.gov.ng"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
            />
            <FormField label="Courtrooms">
              <CourtroomPicker value={inviteRooms} onChange={setInviteRooms} />
            </FormField>
          </Flex>
        )}
      </AppDialog>
    </>
  );
}
