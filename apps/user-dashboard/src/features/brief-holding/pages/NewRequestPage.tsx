import { Button, Stack } from "@chakra-ui/react";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { PageHeader, SurfaceCard } from "@repo/ui/elements";
import { CustomInput, CustomSelect, CustomTextArea } from "@repo/ui/input";
import { nairaToKobo } from "@repo/utils";
import { useGetCourtrooms } from "@/shared/api";
import { RouteConstants } from "@/shared/constants/routes";
import { useCreateBrief } from "../api";

const MATTER_TYPES = [
  { label: "Adjournment", value: "ADJOURNMENT" },
  { label: "Mention", value: "MENTION" },
  { label: "Date taking", value: "DATE_TAKING" },
] as const;

const schema = Yup.object({
  suit_number: Yup.string().trim().required("Suit number is required"),
  courtroom_id: Yup.string().required("Choose a courtroom"),
  matter_type: Yup.string()
    .oneOf(MATTER_TYPES.map((m) => m.value))
    .required(),
  scheduled_date: Yup.string().required("Choose the date"),
  fee_naira: Yup.number()
    .min(1000, "Minimum fee is ₦1,000")
    .required("Set a fee"),
  instructions: Yup.string().trim(),
});

export function NewRequestPage() {
  const navigate = useNavigate();
  const courtrooms = useGetCourtrooms();
  const create = useCreateBrief();

  const formik = useFormik({
    initialValues: {
      suit_number: "",
      courtroom_id: "",
      matter_type: "ADJOURNMENT" as (typeof MATTER_TYPES)[number]["value"],
      scheduled_date: "",
      fee_naira: 5000,
      instructions: "",
    },
    validationSchema: schema,
    onSubmit: async ({ fee_naira, instructions, ...rest }) => {
      const result = await create.mutateAsync({
        ...rest,
        fee_amount: nairaToKobo(fee_naira),
        instructions: instructions || undefined,
      });
      navigate(RouteConstants.briefs.details.generate({ id: result.data.id }));
    },
  });

  const err = (name: keyof typeof formik.values) =>
    formik.touched[name] ? (formik.errors[name] as string) : undefined;

  return (
    <>
      <PageHeader
        title="Request cover"
        description="Restricted to routine matters. The fee goes into escrow and releases when the standing-in counsel files session notes."
      />
      <SurfaceCard maxW="36rem">
        <form onSubmit={formik.handleSubmit}>
          <Stack gap="5">
            <CustomInput
              label="Suit number"
              name="suit_number"
              required
              value={formik.values.suit_number}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={err("suit_number")}
            />
            <CustomSelect
              label="Courtroom"
              name="courtroom_id"
              placeholder="Select courtroom"
              required
              options={(courtrooms.data?.data ?? []).map((c) => ({
                label: c.name,
                value: c.id,
              }))}
              value={formik.values.courtroom_id}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={err("courtroom_id")}
            />
            <CustomSelect
              label="Matter type"
              name="matter_type"
              required
              options={[...MATTER_TYPES]}
              value={formik.values.matter_type}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={err("matter_type")}
            />
            <CustomInput
              label="Date"
              name="scheduled_date"
              type="date"
              required
              value={formik.values.scheduled_date}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={err("scheduled_date")}
            />
            <CustomInput
              label="Fee (₦)"
              name="fee_naira"
              type="number"
              required
              helperText="Held in escrow until the session is completed."
              value={formik.values.fee_naira}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={err("fee_naira")}
            />
            <CustomTextArea
              label="Instructions (optional)"
              name="instructions"
              placeholder="e.g. Take a date not earlier than 3 weeks; opposing counsel is Mr. Bello."
              value={formik.values.instructions}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <Stack direction="row" justify="flex-end" gap="3">
              <Button variant="outlineSecondary" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button type="submit" loading={create.isPending}>
                Post and fund escrow
              </Button>
            </Stack>
          </Stack>
        </form>
      </SurfaceCard>
    </>
  );
}
