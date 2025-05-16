import { Button } from "@/components/ui/button";
import {
  SignedOut,
  SignIn,
  SignInButton,
  SignUpButton,
} from "@clerk/tanstack-react-start";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { ChartColumnBigIcon } from "lucide-react";

export const Route = createFileRoute("/")({
  component: RouteComponent,
  beforeLoad({ context }) {
    if (context.userId) redirect({ to: "/dashboard", throw: true });
  },
});

function RouteComponent() {
  return (
    <div className="min-h-[400px] h-[calc(100vh-80px)] flex items-center justify-center relative">
      <img
        src=""
        alt=""
        className="absolute top-0 left-0 object-cover object-center size-full opacity-50"
      />
      <div className="flex flex-col gap-4 text-center relative z-10">
        <h1 className="text-5xl font-bold flex gap-1 items-center justify-center">
          <ChartColumnBigIcon size={60} className="text-lime-500" /> 사임쌓임
        </h1>
        <p className="text-2xl">금융 관리, 이제 손쉽게!</p>
        <SignedOut>
          <div className="flex gap-2 items-center justify-center">
            <Button asChild size="lg" className="bg-lime-600 hover:bg-lime-700">
              <SignInButton>로그인</SignInButton>
            </Button>
            <Button asChild size="lg">
              <SignUpButton>회원가입</SignUpButton>
            </Button>
          </div>
        </SignedOut>
      </div>
    </div>
  );
}
