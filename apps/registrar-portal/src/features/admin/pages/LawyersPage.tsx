import { PageHeader } from "@repo/ui/elements";
import { useGetLawyers, useVerifyLawyer } from "../api";
import { UserTable } from "../components/UserTable";

export function LawyersPage() {
  const { data, isLoading } = useGetLawyers();
  const verify = useVerifyLawyer();
  return (
    <>
      <PageHeader
        title="Lawyers"
        description="Self-registered litigators. Verify enrolment numbers against the roll."
      />
      <UserTable
        users={data?.data ?? []}
        isLoading={isLoading}
        idLabel="Enrolment no."
        getId={(u) => u.enrolment_number}
        onVerify={(id) => verify.mutate(id)}
        verifying={verify.isPending}
      />
    </>
  );
}
