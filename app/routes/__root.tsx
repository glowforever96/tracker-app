import type { ReactNode } from "react";
import {
  Outlet,
  createRootRoute,
  HeadContent,
  Scripts,
  Link,
  useNavigate,
} from "@tanstack/react-router";

import appCss from "@/styles/app.css?url";
import poppins100 from "@fontsource/poppins/100.css?url";
import poppins200 from "@fontsource/poppins/200.css?url";
import poppins300 from "@fontsource/poppins/300.css?url";
import poppins400 from "@fontsource/poppins/400.css?url";
import poppins500 from "@fontsource/poppins/500.css?url";
import poppins600 from "@fontsource/poppins/600.css?url";
import poppins700 from "@fontsource/poppins/700.css?url";
import poppins800 from "@fontsource/poppins/800.css?url";
import poppins900 from "@fontsource/poppins/900.css?url";
import { ChartColumnBigIcon } from "lucide-react";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/tanstack-react-start";
import { Button } from "@/components/ui/button";
import { getSignedInUserId } from "@/data/getSignedInUserId";
import { koKR } from "@clerk/localizations";
import { Toaster } from "@/components/ui/sonner";

export const Route = createRootRoute({
  notFoundComponent() {
    return (
      <div className="text-3xl text-center py-10 text-muted-foreground">
        요청하신 페이지를 찾을 수 없습니다!
      </div>
    );
  },
  beforeLoad: async () => {
    const userId = await getSignedInUserId();
    return {
      userId,
    };
  },
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "TanStack Start Starter",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      {
        rel: "stylesheet",
        href: poppins100,
      },
      {
        rel: "stylesheet",
        href: poppins200,
      },
      {
        rel: "stylesheet",
        href: poppins300,
      },
      {
        rel: "stylesheet",
        href: poppins400,
      },
      {
        rel: "stylesheet",
        href: poppins500,
      },
      {
        rel: "stylesheet",
        href: poppins600,
      },
      {
        rel: "stylesheet",
        href: poppins700,
      },
      {
        rel: "stylesheet",
        href: poppins800,
      },
      {
        rel: "stylesheet",
        href: poppins900,
      },
    ],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  const navigate = useNavigate();
  return (
    <ClerkProvider localization={koKR}>
      <html>
        <head>
          <HeadContent />
        </head>
        <body>
          <nav className="bg-primary p-4 h-20 text-white flex items-center justify-between">
            <Link to="/" className="flex gap-1 items-center font-bold text-2xl">
              <ChartColumnBigIcon className="text-lime-500" /> 사임쌓임
            </Link>
            <div>
              <SignedOut>
                <div className="text-white flex items-center">
                  <Button
                    asChild
                    variant="link"
                    className="text-white cursor-pointer"
                  >
                    <SignInButton
                      forceRedirectUrl={
                        import.meta.env.VITE_CLERK_SIGN_IN_FORCE_REDIRECT_URL
                      }
                    >
                      로그인
                    </SignInButton>
                  </Button>
                  <div className="w-[1px] h-8 bg-zinc-700" />
                  <Button
                    asChild
                    variant="link"
                    className="text-white cursor-pointer"
                  >
                    <SignUpButton>회원가입</SignUpButton>
                  </Button>
                </div>
              </SignedOut>
              <SignedIn>
                <UserButton
                  showName
                  appearance={{
                    elements: {
                      userButtonAvatarBox: {
                        border: "1px solid white",
                      },
                      userButtonOuterIdentifier: {
                        color: "white",
                      },
                    },
                  }}
                >
                  <UserButton.MenuItems>
                    <UserButton.Action
                      label="대시보드"
                      labelIcon={<ChartColumnBigIcon size={16} />}
                      onClick={() => {
                        navigate({
                          to: "/dashboard",
                        });
                      }}
                    />
                  </UserButton.MenuItems>
                </UserButton>
              </SignedIn>
            </div>
          </nav>
          {children}
          <Toaster richColors />
          <Scripts />
        </body>
      </html>
    </ClerkProvider>
  );
}
