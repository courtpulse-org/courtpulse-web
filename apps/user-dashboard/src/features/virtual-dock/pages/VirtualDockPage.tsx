import { Stack } from "@chakra-ui/react";
import { EmptyStateComponent, PageHeader } from "@repo/ui/elements";
import { MonitorIcon } from "@repo/ui/icons";

export function VirtualDockPage() {
  return (
    <Stack gap="4">
      <PageHeader
        title="Virtual Dock"
        description="Live order of business per courtroom — which item is being called right now."
      />
      <EmptyStateComponent
        icon={<MonitorIcon boxSize="10" />}
        title="Pick a courtroom from the Court Pulse board"
        description="The dock shows the registrar's live call order, or the crowd-verified position when no registrar is online."
      />
    </Stack>
  );
}
