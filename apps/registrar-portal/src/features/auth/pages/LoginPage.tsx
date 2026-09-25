import { Button, Stack } from "@chakra-ui/react";
import { useFormik } from "formik";
import { useNavigate, useSearchParams } from "react-router-dom";
import * as Yup from "yup";
import { CustomInput } from "@repo/ui/input";
import { useAuth } from "@/hooks";
import { decodeRedirectPath } from "@/utils/redirect";
import { useStaffLogin } from "../api";
import { AuthLayout } from "../components/AuthLayout";

const schema = Yup.object({
  email: Yup.string()
    .trim()
    .email("Enter a valid email")
    .required("Email is required"),
  password: Yup.string().required("Password is required"),
});

export function LoginPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { login } = useAuth();
  const staffLogin = useStaffLogin();

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: schema,
    onSubmit: async (values) => {
      const result = await staffLogin.mutateAsync(values);
      login(result.data.access_token, result.data.refresh_token);
      navigate(decodeRedirectPath(params.get("redirect")) ?? "/", {
        replace: true,
      });
    },
  });

  return (
    <AuthLayout
      title="Registrar sign in"
      subtitle="Use the email your invitation was sent to."
    >
      <form onSubmit={formik.handleSubmit}>
        <Stack gap="5">
          <CustomInput
            label="Email"
            name="email"
            type="email"
            required
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email ? formik.errors.email : undefined}
          />
          <CustomInput
            label="Password"
            name="password"
            type="password"
            required
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password ? formik.errors.password : undefined}
          />
          <Button type="submit" size="lg" loading={staffLogin.isPending}>
            Sign in
          </Button>
        </Stack>
      </form>
    </AuthLayout>
  );
}
