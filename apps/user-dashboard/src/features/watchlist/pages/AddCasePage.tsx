import { Button, Stack } from "@chakra-ui/react";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { PageHeader, SurfaceCard } from "@repo/ui/elements";
import { CustomInput, CustomSelect } from "@repo/ui/input";
import { useGetCourtrooms, useGetDivisions } from "@/shared/api";
import { RouteConstants } from "@/shared/constants/routes";
import { useCreateWatchlistCase } from "../api";

const schema = Yup.object({
  suit_number: Yup.string().trim().required("Suit number is required"),
  title: Yup.string().trim(),
  division_id: Yup.string().required("Choose a judicial division"),
  courtroom_id: Yup.string().required("Choose a courtroom"),
  scheduled_date: Yup.string().required("Choose the scheduled date"),
});

export function AddCasePage() {
  const navigate = useNavigate();
  const create = useCreateWatchlistCase();

  const formik = useFormik({
    initialValues: {
      suit_number: "",
      title: "",
      division_id: "",
      courtroom_id: "",
      scheduled_date: "",
    },
    validationSchema: schema,
    onSubmit: async (values) => {
      await create.mutateAsync({ ...values, title: values.title || undefined });
      navigate(RouteConstants.watchlist.base.path);
    },
  });

  const divisions = useGetDivisions();
  const courtrooms = useGetCourtrooms(
    { division_id: formik.values.division_id },
    { enabled: !!formik.values.division_id },
  );

  const err = (name: keyof typeof formik.values) =>
    formik.touched[name] ? formik.errors[name] : undefined;

  return (
    <>
      <PageHeader
        title="Add a matter"
        description="Specify the judicial division, courtroom, suit number and scheduled date."
      />
      <SurfaceCard maxW="36rem">
        <form onSubmit={formik.handleSubmit}>
          <Stack gap="5">
            <CustomInput
              label="Suit number"
              name="suit_number"
              placeholder="LD/1234/2026"
              required
              value={formik.values.suit_number}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={err("suit_number")}
            />
            <CustomInput
              label="Matter title (optional)"
              name="title"
              placeholder="Adekunle v. Lagos State"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <CustomSelect
              label="Judicial division"
              name="division_id"
              placeholder="Select division"
              required
              options={(divisions.data?.data ?? []).map((d) => ({
                label: d.name,
                value: d.id,
              }))}
              value={formik.values.division_id}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                formik.setFieldValue("courtroom_id", "");
                formik.handleChange(e);
              }}
              onBlur={formik.handleBlur}
              error={err("division_id")}
            />
            <CustomSelect
              label="Courtroom"
              name="courtroom_id"
              placeholder="Select courtroom"
              required
              disabled={!formik.values.division_id}
              options={(courtrooms.data?.data ?? []).map((c) => ({
                label: c.name,
                value: c.id,
              }))}
              value={formik.values.courtroom_id}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={err("courtroom_id")}
            />
            <CustomInput
              label="Scheduled date"
              name="scheduled_date"
              type="date"
              required
              value={formik.values.scheduled_date}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={err("scheduled_date")}
            />
            <Stack direction="row" justify="flex-end" gap="3">
              <Button
                variant="outlineSecondary"
                onClick={() => navigate(RouteConstants.watchlist.base.path)}
              >
                Cancel
              </Button>
              <Button type="submit" loading={create.isPending}>
                Add to watchlist
              </Button>
            </Stack>
          </Stack>
        </form>
      </SurfaceCard>
    </>
  );
}
