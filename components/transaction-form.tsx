import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { addDays, format } from "date-fns";
import { ko } from "date-fns/locale";
import { Calendar } from "./ui/calendar";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Input } from "./ui/input";
import { categoriesTable } from "@/db/schema";

export const transactionFormSchema = z.object({
  transactionType: z.enum(["수입", "지출"]),
  categoryId: z.coerce.number().positive("카테고리를 선택 해주세요!"),
  transactionDate: z
    .date()
    .max(addDays(new Date(), 1), "거래 일시는 미래가 될 수 없습니다!"),
  amount: z.coerce.number().positive("총액는 0 이상만 가능합니다!"),
  description: z
    .string()
    .min(3, "설명은 3자 이상 입력 해주세요!")
    .max(300, "설명은 최대 300자를 초과 할 수 없습니다!"),
});

export default function TransactionForm({
  categories,
  onSubmit,
  defaultValues,
}: {
  categories: (typeof categoriesTable.$inferSelect)[];
  onSubmit: (data: z.infer<typeof transactionFormSchema>) => Promise<void>;
  defaultValues?: {
    transactionType: "수입" | "지출";
    amount: number;
    categoryId: number;
    description: string;
    transactionDate: Date;
  };
}) {
  const form = useForm<z.infer<typeof transactionFormSchema>>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: {
      transactionType: "수입",
      categoryId: 0,
      amount: 0,
      description: "",
      transactionDate: new Date(),
      ...defaultValues,
    },
  });

  const transactionType = form.watch("transactionType");

  const filteredCategories = categories.filter(
    (c) => c.type === transactionType
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <fieldset
          className="grid grid-cols-2 gap-y-5 gap-x-2"
          disabled={form.formState.isSubmitting}
        >
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
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>카테고리</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value.toString()}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="카테고리" />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredCategories.map((category) => (
                          <SelectItem
                            key={category.id}
                            value={category.id.toString()}
                          >
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            control={form.control}
            name="transactionDate"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>거래 일시</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? (
                            format(field.value, "PPP", { locale: ko })
                          ) : (
                            <span>날짜를 선택해주세요.</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          disabled={{
                            after: new Date(),
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>총액</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" step={0.01} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        </fieldset>
        <fieldset
          disabled={form.formState.isSubmitting}
          className="mt-5 flex flex-col gap-5"
        >
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>설명</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <Button type="submit">
            {form.formState.isSubmitting ? "제출중..." : "제출"}
          </Button>
        </fieldset>
      </form>
    </Form>
  );
}
