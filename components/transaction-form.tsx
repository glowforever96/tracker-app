import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import { Select, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { SelectContent } from "@radix-ui/react-select";

const transactionFormSchema = z.object({
  transactionType: z.enum(["수입", "지출"]),
  categoryId: z.coerce.number().positive("카테고리를 선택 해주세요!"),
  transactionDate: z
    .date()
    .max(new Date(), "거래 일시는 미래가 될 수 없습니다!"),
  amount: z.coerce.number().positive("총액는 0 이상만 가능합니다!"),
  description: z
    .string()
    .min(3, "설명은 3자 이상 입력 해주세요!")
    .max(300, "설명은 최대 300자를 초과 할 수 없습니다!"),
});

export default function TransactionForm() {
  const form = useForm<z.infer<typeof transactionFormSchema>>({
    resolver: zodResolver(transactionFormSchema),
  });

  return (
    <Form {...form}>
      <form>
        <fieldset className="grid grid-cols-2 gap-y-5 gap-x-2">
          <FormField
            control={form.control}
            name="transactionType"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>거래 유형</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="거래 유형" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="수입">수입</SelectItem>
                        <SelectItem value="지출">지출</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              );
            }}
          />
        </fieldset>
      </form>
    </Form>
  );
}
