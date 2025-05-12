import TransactionForm, {
  transactionFormSchema,
} from "@/components/transaction-form";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { deleteTransaction } from "@/data/deleteTransaction";
import { getCategories } from "@/data/getCategories";
import { getTransaction } from "@/data/getTransaction";
import { updateTransaction } from "@/data/updateTransaction";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { format } from "date-fns";
import { Trash2Icon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

export const Route = createFileRoute(
  "/_authed/dashboard/transactions/$transactionId/_layout/"
)({
  component: RouteComponent,
  errorComponent: () => {
    return (
      <div className="text-3xl text-muted-foreground">잘못된 접근입니다!</div>
    );
  },
  loader: async ({ params }) => {
    const [categories, transaction] = await Promise.all([
      getCategories(),
      getTransaction({
        data: {
          transactionId: Number(params.transactionId),
        },
      }),
    ]);
    if (!transaction) {
      throw new Error("해당하는 거래 기록을 찾을수 없습니다.");
    }
    return {
      categories,
      transaction,
    };
  },
});

function RouteComponent() {
  const [isDeleting, setIsDeleting] = useState(false);
  const { categories, transaction } = Route.useLoaderData();
  const navigate = useNavigate();

  const handleSubmit = async (data: z.infer<typeof transactionFormSchema>) => {
    await updateTransaction({
      data: {
        id: transaction.id,
        amount: data.amount,
        transactionDate: format(data.transactionDate, "yyyy-MM-dd"),
        categoryId: data.categoryId,
        description: data.description,
      },
    });
    toast.success("성공!", {
      description: "거래 수정이 완료되었습니다.",
    });
    navigate({
      to: "/dashboard/transactions",
      search: {
        month: data.transactionDate.getMonth() + 1,
        year: data.transactionDate.getFullYear(),
      },
    });
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    await deleteTransaction({
      data: {
        transactionId: transaction.id,
      },
    });
    toast.success("성공!", {
      description: "거래 삭제가 완료되었습니다.",
    });
    setIsDeleting(false);
    navigate({
      to: "/dashboard/transactions",
      search: {
        month: Number(transaction.transactionDate.split("-")[1]),
        year: Number(transaction.transactionDate.split("-")[0]),
      },
    });
  };

  return (
    <Card className="max-w-screen-md mt-4">
      <CardHeader>
        <CardTitle className="flex justify-between">
          <span>거래 수정</span>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="icon">
                <Trash2Icon />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  정말 거래를 삭제하시겠습니까?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  해당 작업은 취소할 수 없습니다.
                  <br />
                  해당 거래는 영구적으로 삭제됩니다.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>취소</AlertDialogCancel>
                <Button
                  variant="destructive"
                  disabled={isDeleting}
                  onClick={handleDeleteConfirm}
                >
                  삭제
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardTitle>
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
