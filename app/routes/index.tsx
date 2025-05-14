import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: RouteComponent,
  beforeLoad({ context }) {
    if (context.userId) redirect({ to: "/dashboard", throw: true });
  },
});

function RouteComponent() {
  return <div></div>;
}
