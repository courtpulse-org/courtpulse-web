import { Box, Button, Flex, Separator, Stack, Text } from "@chakra-ui/react";
import { useFormik } from "formik";
import { useNavigate, useSearchParams } from "react-router-dom";
import * as Yup from "yup";
import { CustomInput } from "@repo/ui/input";
import { ArrowRightIcon } from "@repo/ui/icons";
import { getInitials } from "@repo/utils";
import { useAuth } from "@/hooks";
import { DEMO_ACCOUNTS } from "@/shared/api";
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

  const signIn = async (values: { email: string; password: string }) => {
    const result = await staffLogin.mutateAsync(values);
    login(result.data.access_token, result.data.refresh_token);
    navigate(decodeRedirectPath(params.get("redirect")) ?? "/", {
      replace: true,
    });
  };

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: schema,
    onSubmit: signIn,
  });

  return (
    <AuthLayout
      title="Sign in"
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
          <Button
            type="submit"
            size="lg"
            loading={staffLogin.isPending && !!formik.values.email}
          >
            Sign in
          </Button>
        </Stack>
      </form>

      <Flex align="center" gap="3" my="7">
        <Separator flex="1" />
        <Text
          textStyle="tiny-semibold"
          color="gray.200"
          textTransform="uppercase"
          letterSpacing="0.06em"
        >
          Demo accounts
        </Text>
        <Separator flex="1" />
      </Flex>
      <Stack gap="2">
        {DEMO_ACCOUNTS.map((a) => (
          <Flex
            key={a.email}
            as="button"
            align="center"
            gap="3"
            p="3"
            bg="white"
            border="1px solid"
            borderColor="gray.75"
            rounded="md"
            textAlign="left"
            cursor="pointer"
            _hover={{ borderColor: "primary.100", boxShadow: "sm" }}
            onClick={() => signIn({ email: a.email, password: a.password })}
          >
            <Flex
              boxSize="9"
              rounded="full"
              bg="primary.50"
              color="primary.300"
              align="center"
              justify="center"
              textStyle="tiny-semibold"
              flexShrink={0}
            >
              {getInitials(...(a.name.split(" ") as [string, string]))}
            </Flex>
            <Box flex="1" minW="0">
              <Text textStyle="small-semibold">{a.name}</Text>
              <Text textStyle="tiny-regular" color="gray.200" truncate>
                {a.label} · {a.detail}
              </Text>
            </Box>
            <ArrowRightIcon color="gray.100" />
          </Flex>
        ))}
      </Stack>
    </AuthLayout>
  );
}
