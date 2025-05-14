import { createFileRoute } from "@tanstack/react-router";
import { RecentTransaction } from "./-recent-transactions";
import { getRecentTransactions } from "@/data/getRecentTransactions";
import { getAnnualCashflow } from "@/data/getAnnualCashflow";
import { getTransactionYearsRange } from "@/data/getTransactionYearsRange";
import { Cashflow } from "./-cashflow";
import { z } from "zod";

const today = new Date();

const searchSchema = z.object({
  cfyear: z
    .number()
    .min(today.getFullYear() - 100)
    .max(today.getFullYear())
    .catch(today.getFullYear())
    .optional(),
});

export const Route = createFileRoute("/_authed/dashboard/")({
  validateSearch: searchSchema,
  component: RouteComponent,
  loaderDeps: ({ search }) => {
    return {
      cfyear: search.cfyear,
    };
  },
  loader: async ({ deps }) => {
    const [transactions, cashflow, yearsRange] = await Promise.all([
      getRecentTransactions(),
      getAnnualCashflow({
        data: {
          year: deps.cfyear ?? today.getFullYear(),
        },
      }),
      getTransactionYearsRange(),
    ]);

    return {
      transactions,
      cashflow,
      yearsRange,
      cfyear: deps.cfyear ?? today.getFullYear(),
    };
  },
});

function RouteComponent() {
  const { transactions, cashflow, yearsRange, cfyear } = Route.useLoaderData();

  console.log(transactions, cashflow);
  return (
    <div className="max-w-screen-xl mx-auto py-5 ">
      <h1 className="text-4xl font-semibold pb-5">dashboard</h1>
      <Cashflow
        yearsRange={yearsRange}
        year={cfyear}
        annualCashflow={cashflow}
      />
      <RecentTransaction transactions={transactions} />
    </div>
  );
}
