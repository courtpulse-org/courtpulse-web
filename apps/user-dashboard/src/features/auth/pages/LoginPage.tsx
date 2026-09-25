import { Button, Stack, Text } from "@chakra-ui/react";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { CustomInput } from "@repo/ui/input";
import { normalizeNigerianPhone } from "@repo/utils";
import { storage } from "@/lib/storage";
import { RouteConstants } from "@/shared/constants/routes";
import { useRequestOtp } from "../api";
import { AuthLayout } from "../components/AuthLayout";

const schema = Yup.object({
  enrolment_number: Yup.string()
    .trim()
    .required("Your Supreme Court enrolment number is required"),
  phone: Yup.string()
    .trim()
    .matches(
      /^(\+?234|0)?[789][01]\d{8}$/,
      "Enter a valid Nigerian phone number",
    )
    .required("Phone number is required"),
});

export function LoginPage() {
  const navigate = useNavigate();
  const requestOtp = useRequestOtp();

  const formik = useFormik({
    initialValues: { enrolment_number: "", phone: "" },
    validationSchema: schema,
    onSubmit: async (values) => {
      const phone = normalizeNigerianPhone(values.phone);
      await requestOtp.mutateAsync({
        phone,
        enrolment_number: values.enrolment_number,
      });
      storage.session.setValue("pending_otp_phone", phone);
      navigate(
        `${RouteConstants.auth.verifyOtp.path}${window.location.search}`,
      );
    },
  });

  return (
    <AuthLayout
      title="Sign in"
      subtitle="We'll text a one-time code to your registered phone."
    >
      <form onSubmit={formik.handleSubmit}>
        <Stack gap="5">
          <CustomInput
            label="Enrolment number"
            name="enrolment_number"
            placeholder="SCN/12345/2015"
            required
            value={formik.values.enrolment_number}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.enrolment_number
                ? formik.errors.enrolment_number
                : undefined
            }
          />
          <CustomInput
            label="Phone number"
            name="phone"
            type="tel"
            placeholder="0803 123 4567"
            required
            value={formik.values.phone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.phone ? formik.errors.phone : undefined}
          />
          <Button type="submit" size="lg" loading={requestOtp.isPending}>
            Send code
          </Button>
          <Text textStyle="small-regular" color="gray.200" textAlign="center">
            New to CourtPulse?{" "}
            <Link to={RouteConstants.auth.signup.path}>
              <Text as="span" color="primary.300" fontWeight="600">
                Create an account
              </Text>
            </Link>
          </Text>
        </Stack>
      </form>
    </AuthLayout>
  );
}
