import { Stack } from "@chakra-ui/react";
import {
  EmptyStateComponent,
  PageHeader,
  SectionLoader,
} from "@repo/ui/elements";
import { useGetMyBriefs } from "../api";
import { BriefCard } from "../components/BriefCard";

export function MyBriefsPage() {
  const { data, isLoading } = useGetMyBriefs();
  const briefs = data?.data ?? [];

  return (
    <>
      <PageHeader
        title="My briefs"
        description="Requests you posted and briefs you're holding."
      />
      {isLoading ? (
        <SectionLoader />
      ) : briefs.length === 0 ? (
        <EmptyStateComponent
          title="Nothing yet"
          description="Your requests and accepted briefs will show here."
        />
      ) : (
        <Stack gap="3">
          {briefs.map((b) => (
            <BriefCard key={b.id} brief={b} />
          ))}
        </Stack>
      )}
    </>
  );
}
