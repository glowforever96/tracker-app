import authMiddleware from "@/authMiddleware";
import { db } from "@/db";
import { transactionsTable } from "@/db/schema";
import { createServerFn } from "@tanstack/react-start";
import { addDays } from "date-fns";
import { z } from "zod";

const transactionSchema = z.object({
  categoryId: z.coerce.number().positive("카테고리를 선택 해주세요!"),
  transactionDate: z.string().refine((value) => {
    const parseDate = new Date(value);
    return !isNaN(parseDate.getTime()) && parseDate <= addDays(new Date(), 1);
  }),
  amount: z.coerce.number().positive("총액는 0 이상만 가능합니다!"),
  description: z
    .string()
    .min(3, "설명은 3자 이상 입력 해주세요!")
    .max(300, "설명은 최대 300자를 초과 할 수 없습니다!"),
});

export const createTransaction = createServerFn({
  method: "POST",
})
  .middleware([authMiddleware])
  .validator((data: z.infer<typeof transactionSchema>) =>
    transactionSchema.parse(data)
  )
  .handler(async ({ data, context }) => {
    const userId = context.userId;
    const transaction = await db
      .insert(transactionsTable)
      .values({
        userId,
        amount: data.amount.toString(),
        description: data.description,
        categoryId: data.categoryId,
        transactionDate: data.transactionDate,
      })
      .returning();
    return transaction;
  });
