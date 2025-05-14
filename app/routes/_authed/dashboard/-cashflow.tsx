import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "@tanstack/react-router";
import { Bar, BarChart } from "recharts";

export function Cashflow({
  yearsRange,
  year,
  annualCashflow,
}: {
  yearsRange: number[];
  year: number;
  annualCashflow: { month: number; income: number; expense: number }[];
}) {
  const navigate = useNavigate();

  return (
    <Card className="mb-5">
      <CardHeader>
        <CardTitle className="flex justify-between">
          <span>Cashflow</span>
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
      <CardContent>
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
            <Bar dataKey="income" fill="var(--color-income)" radius={4} />
            <Bar dataKey="expense" fill="var(--color-expense)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
