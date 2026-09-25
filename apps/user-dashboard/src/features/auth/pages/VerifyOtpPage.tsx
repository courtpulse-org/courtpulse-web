import { Button, Stack, Text } from "@chakra-ui/react";
import { useState } from "react";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { OtpInput } from "@repo/ui/input";
import { maskPhone } from "@repo/utils";
import { useAuth } from "@/hooks";
import { storage } from "@/lib/storage";
import { RouteConstants } from "@/shared/constants/routes";
import { decodeRedirectPath } from "@/utils/redirect";
import { useRequestOtp, useVerifyOtp } from "../api";
import { AuthLayout } from "../components/AuthLayout";

export function VerifyOtpPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { login } = useAuth();
  const [code, setCode] = useState<string[]>([]);

  const phone = storage.session.getValue<string>("pending_otp_phone");
  const verifyOtp = useVerifyOtp();
  const resend = useRequestOtp({
    meta: { successMessage: "A new code is on its way." },
  });

  if (!phone) return <Navigate to={RouteConstants.auth.login.path} replace />;

  const submit = async (value: string) => {
    const result = await verifyOtp.mutateAsync({ phone, code: value });
    login(result.data.access_token, result.data.refresh_token);
    storage.session.clearValue("pending_otp_phone");
    navigate(decodeRedirectPath(params.get("redirect")) ?? "/", {
      replace: true,
    });
  };

  return (
    <AuthLayout
      title="Enter your code"
      subtitle={`We sent a 6-digit code to ${maskPhone(phone)}.`}
    >
      <Stack gap="6">
        <OtpInput
          value={code}
          onChange={setCode}
          onComplete={submit}
          disabled={verifyOtp.isPending}
        />
        <Button
          size="lg"
          loading={verifyOtp.isPending}
          disabled={code.join("").length < 6}
          onClick={() => submit(code.join(""))}
        >
          Verify and continue
        </Button>
        <Text textStyle="small-regular" color="gray.200" textAlign="center">
          Didn't get it?{" "}
          <Button
            variant="ghost"
            size="sm"
            loading={resend.isPending}
            onClick={() => resend.mutate({ phone })}
          >
            Resend code
          </Button>
        </Text>
      </Stack>
    </AuthLayout>
  );
}
