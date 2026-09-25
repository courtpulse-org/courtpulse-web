import { Button, Stack, Text } from "@chakra-ui/react";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { PageHeader, SurfaceCard } from "@repo/ui/elements";
import { CustomSelect, CustomTextArea } from "@repo/ui/input";
import { useCreateBroadcast, useGetMyCourtrooms } from "@/features/console/api";
import { RouteConstants } from "@/shared/constants/routes";

const MAX = 280;

const schema = Yup.object({
  courtroom_id: Yup.string(),
  message: Yup.string().trim().max(MAX).required("Write the announcement"),
});

export function NewBroadcastPage() {
  const navigate = useNavigate();
  const courtrooms = useGetMyCourtrooms();
  const create = useCreateBroadcast();
  const rows = courtrooms.data?.data ?? [];

  const formik = useFormik({
    initialValues: { courtroom_id: "", message: "" },
    validationSchema: schema,
    onSubmit: async (values) => {
      const target =
        rows.find((r) => r.courtroom.id === values.courtroom_id) ?? rows[0];
      if (!target) return;
      await create.mutateAsync({
        division_id: target.courtroom.division_id,
        courtroom_id: values.courtroom_id || undefined,
        message: values.message,
      });
      navigate(RouteConstants.broadcasts.base.path);
    },
  });

  return (
    <>
      <PageHeader
        title="New broadcast"
        description="Sent immediately by SMS, WhatsApp and push."
      />
      <SurfaceCard maxW="36rem">
        <form onSubmit={formik.handleSubmit}>
          <Stack gap="5">
            <CustomSelect
              label="Courtroom"
              name="courtroom_id"
              placeholder="Whole division"
              options={rows.map((r) => ({
                label: r.courtroom.name,
                value: r.courtroom.id,
              }))}
              value={formik.values.courtroom_id}
              onChange={formik.handleChange}
            />
            <CustomTextArea
              label="Message"
              name="message"
              required
              placeholder="Court 3 sitting suspended until 11:30 AM due to chamber meeting."
              value={formik.values.message}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.message ? formik.errors.message : undefined}
            />
            <Text
              textStyle="tiny-regular"
              color="gray.200"
              alignSelf="flex-end"
            >
              {formik.values.message.length}/{MAX}
            </Text>
            <Button
              type="submit"
              size="lg"
              loading={create.isPending}
              disabled={rows.length === 0}
            >
              Send broadcast
            </Button>
          </Stack>
        </form>
      </SurfaceCard>
    </>
  );
}
