import { Button, SimpleGrid, Stack, Text } from "@chakra-ui/react";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { CustomInput } from "@repo/ui/input";
import { normalizeNigerianPhone } from "@repo/utils";
import { storage } from "@/lib/storage";
import { RouteConstants } from "@/shared/constants/routes";
import { useRegisterLawyer } from "../api";
import { AuthLayout } from "../components/AuthLayout";

const schema = Yup.object({
  first_name: Yup.string().trim().required("First name is required"),
  last_name: Yup.string().trim().required("Last name is required"),
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
  email: Yup.string().trim().email("Enter a valid email").optional(),
});

export function SignupPage() {
  const navigate = useNavigate();
  const register = useRegisterLawyer();

  const formik = useFormik({
    initialValues: {
      first_name: "",
      last_name: "",
      enrolment_number: "",
      phone: "",
      email: "",
    },
    validationSchema: schema,
    onSubmit: async (values) => {
      const phone = normalizeNigerianPhone(values.phone);
      await register.mutateAsync({
        ...values,
        phone,
        email: values.email || undefined,
      });
      storage.session.setValue("pending_otp_phone", phone);
      navigate(RouteConstants.auth.verifyOtp.path);
    },
  });

  const fieldError = (name: keyof typeof formik.values) =>
    formik.touched[name] ? formik.errors[name] : undefined;

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Self-registration for litigating lawyers. We verify your enrolment number and phone."
    >
      <form onSubmit={formik.handleSubmit}>
        <Stack gap="5">
          <SimpleGrid columns={{ base: 1, sm: 2 }} gap="4">
            <CustomInput
              label="First name"
              name="first_name"
              required
              value={formik.values.first_name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={fieldError("first_name")}
            />
            <CustomInput
              label="Last name"
              name="last_name"
              required
              value={formik.values.last_name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={fieldError("last_name")}
            />
          </SimpleGrid>
          <CustomInput
            label="Enrolment number"
            name="enrolment_number"
            placeholder="SCN/12345/2015"
            required
            value={formik.values.enrolment_number}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={fieldError("enrolment_number")}
          />
          <CustomInput
            label="Phone number"
            name="phone"
            type="tel"
            placeholder="0803 123 4567"
            helperText="Alerts arrive here by SMS and WhatsApp."
            required
            value={formik.values.phone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={fieldError("phone")}
          />
          <CustomInput
            label="Email (optional)"
            name="email"
            type="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={fieldError("email")}
          />
          <Button type="submit" size="lg" loading={register.isPending}>
            Continue
          </Button>
          <Text textStyle="small-regular" color="gray.200" textAlign="center">
            Already registered?{" "}
            <Link to={RouteConstants.auth.login.path}>
              <Text as="span" color="primary.300" fontWeight="600">
                Sign in
              </Text>
            </Link>
          </Text>
        </Stack>
      </form>
    </AuthLayout>
  );
}
