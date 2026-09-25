import { Button, SimpleGrid, Stack } from "@chakra-ui/react";
import { useFormik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import { CustomInput } from "@repo/ui/input";
import { normalizeNigerianPhone } from "@repo/utils";
import { useAuth } from "@/hooks";
import { useAcceptInvite } from "../api";
import { AuthLayout } from "../components/AuthLayout";

const schema = Yup.object({
  first_name: Yup.string().trim().required("First name is required"),
  last_name: Yup.string().trim().required("Last name is required"),
  phone: Yup.string()
    .trim()
    .matches(
      /^(\+?234|0)?[789][01]\d{8}$/,
      "Enter a valid Nigerian phone number",
    )
    .required("Phone number is required"),
  password: Yup.string()
    .min(8, "Use at least 8 characters")
    .required("Choose a password"),
});

export function AcceptInvitePage() {
  const { token = "" } = useParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const accept = useAcceptInvite();

  const formik = useFormik({
    initialValues: { first_name: "", last_name: "", phone: "", password: "" },
    validationSchema: schema,
    onSubmit: async (values) => {
      const result = await accept.mutateAsync({
        ...values,
        token,
        phone: normalizeNigerianPhone(values.phone),
      });
      login(result.data.access_token, result.data.refresh_token);
      navigate("/", { replace: true });
    },
  });

  const err = (name: keyof typeof formik.values) =>
    formik.touched[name] ? formik.errors[name] : undefined;

  return (
    <AuthLayout
      title="Set up your registrar account"
      subtitle="You've been invited to manage courtrooms on CourtPulse."
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
              error={err("first_name")}
            />
            <CustomInput
              label="Last name"
              name="last_name"
              required
              value={formik.values.last_name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={err("last_name")}
            />
          </SimpleGrid>
          <CustomInput
            label="Phone number"
            name="phone"
            type="tel"
            required
            value={formik.values.phone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={err("phone")}
          />
          <CustomInput
            label="Password"
            name="password"
            type="password"
            required
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={err("password")}
          />
          <Button type="submit" size="lg" loading={accept.isPending}>
            Create account
          </Button>
        </Stack>
      </form>
    </AuthLayout>
  );
}
