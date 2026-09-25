import { SimpleGrid, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import {
  EmptyStateComponent,
  PageHeader,
  SectionLoader,
  SurfaceCard,
} from "@repo/ui/elements";
import { useGetMyCourtrooms } from "@/features/console/api";
import { RouteConstants } from "@/shared/constants/routes";

export function DockIndexPage() {
  const { data, isLoading } = useGetMyCourtrooms();
  const rows = data?.data ?? [];

  return (
    <>
      <PageHeader
        title="Virtual Dock"
        description="Run the live order of business for each courtroom."
      />
      {isLoading ? (
        <SectionLoader />
      ) : rows.length === 0 ? (
        <EmptyStateComponent title="No courtrooms assigned" />
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2 }} gap="4">
          {rows.map((r) => (
            <Link
              key={r.courtroom.id}
              to={RouteConstants.dock.courtroom.generate({
                courtroomId: r.courtroom.id,
              })}
            >
              <SurfaceCard _hover={{ borderColor: "primary.100" }}>
                <Text textStyle="h4">{r.courtroom.name}</Text>
                <Text textStyle="tiny-regular" color="gray.200">
                  Open dock controls
                </Text>
              </SurfaceCard>
            </Link>
          ))}
        </SimpleGrid>
      )}
    </>
  );
}
