import TransactionForm from "@/components/transaction-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCategories } from "@/data/getCategories";
import { getTransaction } from "@/data/getTransaction";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_authed/dashboard/transactions/$transactionId/_layout/"
)({
  component: RouteComponent,
  loader: async ({ params }) => {
    const [categories, transaction] = await Promise.all([
      getCategories(),
      getTransaction({
        data: {
          transactionId: Number(params.transactionId),
        },
      }),
    ]);

    return {
      categories,
      transaction,
    };
  },
});

function RouteComponent() {
  const { categories, transaction } = Route.useLoaderData();

  const handleSubmit = async () => {};
  return (
    <Card className="max-w-screen-md mt-4">
      <CardHeader>
        <CardTitle>거래 수정</CardTitle>
      </CardHeader>
      <CardContent>
        <TransactionForm
          categories={categories}
          onSubmit={handleSubmit}
          defaultValues={{
            amount: Number(transaction.amount),
            categoryId: transaction.categoryId,
            description: transaction.description,
            transactionDate: new Date(transaction.transactionDate),
            transactionType:
              categories.find((c) => c.id === transaction.categoryId)?.type ??
              "수입",
          }}
        />
      </CardContent>
    </Card>
  );
}
