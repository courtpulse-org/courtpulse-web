import { Button } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { EmptyStateComponent, PageHeader } from "@repo/ui/elements";
import { CameraIcon } from "@repo/ui/icons";
import { RouteConstants } from "@/shared/constants/routes";

export function CauseListPage() {
  const navigate = useNavigate();
  return (
    <>
      <PageHeader
        title="Cause List Scanner"
        description="Snap the cause list posted outside a courtroom. We read the suit numbers and alert everyone tracking them."
        actions={
          <Button asChild>
            <Link to={RouteConstants.causeList.scan.path}>
              <CameraIcon boxSize="4" /> Scan a cause list
            </Link>
          </Button>
        }
      />
      <EmptyStateComponent
        icon={<CameraIcon boxSize="10" />}
        title="No scans yet"
        description="Your uploaded cause lists and their extracted items will appear here."
        buttonText="Scan a cause list"
        onPrimaryClick={() => navigate(RouteConstants.causeList.scan.path)}
      />
    </>
  );
}
