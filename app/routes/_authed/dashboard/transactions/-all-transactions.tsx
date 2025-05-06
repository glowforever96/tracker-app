import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link } from "@tanstack/react-router";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { useState } from "react";

export default function AllTransactions({
  month,
  year,
}: {
  month: number;
  year: number;
}) {
  const [selectedYear, setSelectedYear] = useState(year);
  const [selectedMonth, setSelectedMonth] = useState(month);

  const selectedDate = new Date(year, month - 1, 1);

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="flex justify-between">
          <span>{format(selectedDate, "MMM yyyy년", { locale: ko })} 거래</span>
          <div className="flex gap-1">
            <Select
              value={selectedMonth.toString()}
              onValueChange={(value) => setSelectedMonth(Number(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="월" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 12 }).map((_, idx) => (
                  <SelectItem key={idx} value={`${idx + 1}`}>
                    {format(
                      new Date(selectedDate.getFullYear(), idx, 1),
                      "MMM",
                      { locale: ko }
                    )}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={selectedYear.toString()}
              onValueChange={(value) => setSelectedYear(Number(value))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent></SelectContent>
            </Select>
            <Button asChild>
              <Link
                to="/dashboard/transactions"
                search={{
                  month: selectedMonth,
                  year: 2024,
                }}
              >
                조회
              </Link>
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
    </Card>
  );
}
