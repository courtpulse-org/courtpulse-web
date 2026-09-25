import { Button, Stack, Switch, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import type { INotificationPreferences } from "@repo/types";
import { PageHeader, SectionLoader, SurfaceCard } from "@repo/ui/elements";
import {
  useGetNotificationPreferences,
  useUpdateNotificationPreferences,
} from "@/features/notifications/api";

const CHANNELS: {
  key: keyof INotificationPreferences;
  label: string;
  hint: string;
}[] = [
  { key: "whatsapp", label: "WhatsApp", hint: "Fastest in court corridors." },
  { key: "sms", label: "SMS", hint: "Works without data." },
  {
    key: "push",
    label: "Browser push",
    hint: "When this tab is open or installed.",
  },
];

export function SettingsNotificationsPage() {
  const { data, isLoading } = useGetNotificationPreferences();
  const update = useUpdateNotificationPreferences();
  const [prefs, setPrefs] = useState<INotificationPreferences>({
    sms: true,
    whatsapp: true,
    push: false,
  });

  useEffect(() => {
    if (data?.data) setPrefs(data.data);
  }, [data]);

  if (isLoading) return <SectionLoader />;

  return (
    <>
      <PageHeader
        title="Alert channels"
        description="Where verified status changes and cause list matches reach you."
      />
      <SurfaceCard maxW="36rem">
        <Stack gap="5">
          {CHANNELS.map((c) => (
            <Switch.Root
              key={c.key}
              checked={prefs[c.key]}
              onCheckedChange={(e) =>
                setPrefs((p) => ({ ...p, [c.key]: e.checked }))
              }
              colorPalette="primary"
              display="flex"
              justifyContent="space-between"
            >
              <Switch.Label>
                <Text textStyle="small-semibold">{c.label}</Text>
                <Text textStyle="tiny-regular" color="gray.200">
                  {c.hint}
                </Text>
              </Switch.Label>
              <Switch.HiddenInput />
              <Switch.Control />
            </Switch.Root>
          ))}
          <Button
            alignSelf="flex-end"
            loading={update.isPending}
            onClick={() => update.mutate(prefs)}
          >
            Save
          </Button>
        </Stack>
      </SurfaceCard>
    </>
  );
}
