import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useNavigate } from "@tanstack/react-router";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import numeral from "numeral";
import { Bar, BarChart, CartesianGrid, Legend, XAxis, YAxis } from "recharts";

export function Cashflow({
  yearsRange,
  year,
  annualCashflow,
}: {
  yearsRange: number[];
  year: number;
  annualCashflow: { month: number; income: number; expense: number }[];
}) {
  const { totalIncome, totalExpense } = annualCashflow.reduce(
    (acc, { income, expense }) => {
      (acc.totalIncome += income), (acc.totalExpense += expense);
      return acc;
    },
    { totalIncome: 0, totalExpense: 0 }
  );
  const balance = totalIncome - totalExpense;

  const navigate = useNavigate();

  return (
    <Card className="mb-5">
      <CardHeader>
        <CardTitle className="flex justify-between">
          <span></span>
          <div>
            <Select
              defaultValue={year.toString()}
              onValueChange={(value) => {
                navigate({
                  to: "/dashboard",
                  search: {
                    cfyear: Number(value),
                  },
                });
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {yearsRange.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-[1fr_250px]">
        <ChartContainer
          config={{
            income: {
              label: "수입",
              color: "#84cc16",
            },
            expense: {
              label: "지출",
              color: "#f97316",
            },
          }}
          className="w-full h-[300px]"
        >
          <BarChart data={annualCashflow}>
            <CartesianGrid vertical={false} />
            <YAxis
              tickFormatter={(value) => {
                return `₩${numeral(value).format("0,0")}`;
              }}
            />
            <XAxis
              dataKey="month"
              tickFormatter={(value) => {
                return format(new Date(year, value - 1, 1), "MMM", {
                  locale: ko,
                });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(_, payload) => {
                    return (
                      <div>
                        {format(
                          new Date(year, payload[0]?.payload?.month - 1, 1),
                          "MMM",
                          {
                            locale: ko,
                          }
                        )}
                      </div>
                    );
                  }}
                />
              }
            />
            <Legend align="right" verticalAlign="top" />
            <Bar
              dataKey="income"
              fill="var(--color-income)"
              radius={4}
              name="수입"
            />
            <Bar
              dataKey="expense"
              fill="var(--color-expense)"
              radius={4}
              name="지출"
            />
          </BarChart>
        </ChartContainer>
        <div className="border-l px-4 flex flex-col gap-4 justify-center">
          <div>
            <span className="text-muted-foreground font-bold text-sm">
              수입
            </span>
            <h2 className="text-3xl">
              ₩{numeral(totalIncome).format("0,0[.]00")}
            </h2>
          </div>
          <div className="border-t" />
          <div>
            <span className="text-muted-foreground font-bold text-sm">
              지출
            </span>
            <h2 className="text-3xl">
              ₩{numeral(totalExpense).format("0,0[.]00")}
            </h2>
          </div>
          <div className="border-t" />
          <div>
            <span className="text-muted-foreground font-bold text-sm">
              잔액
            </span>
            <h2
              className={cn(
                "text-3xl font-bold",
                balance >= 0 ? "text-lime-500" : "text-orange-500"
              )}
            >
              ₩{numeral(balance).format("0,0[.]00")}
            </h2>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
