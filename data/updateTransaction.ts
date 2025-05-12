import authMiddleware from "@/authMiddleware";
import { db } from "@/db";
import { transactionsTable } from "@/db/schema";
import { createServerFn } from "@tanstack/react-start";
import { addDays } from "date-fns";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
const schema = z.object({
  id: z.number(),
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
export const updateTransaction = createServerFn({
  method: "POST",
})
  .middleware([authMiddleware])
  .validator((data: z.infer<typeof schema>) => schema.parse(data))
  .handler(async ({ context, data }) => {
    await db
      .update(transactionsTable)
      .set({
        amount: data.amount.toString(),
        categoryId: data.categoryId,
        transactionDate: data.transactionDate,
        description: data.description,
      })
      .where(
        and(
          eq(transactionsTable.id, data.id),
          eq(transactionsTable.userId, context.userId)
        )
      );
  });
