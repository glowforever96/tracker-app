import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Link } from "@tanstack/react-router";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { useState } from "react";
import numeral from "numeral";
import { PencilIcon } from "lucide-react";

export default function AllTransactions({
  yearsRange,
  month,
  year,
  transactions,
}: {
  yearsRange: number[];
  month: number;
  year: number;
  transactions: {
    id: number;
    description: string;
    amount: string;
    category: string | null;
    transactionType: "수입" | "지출" | null;
    transactionDate: string;
  }[];
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
              <SelectContent>
                {yearsRange.map((year) => (
                  <SelectItem value={year.toString()} key={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button asChild>
              <Link
                to="/dashboard/transactions"
                search={{
                  month: selectedMonth,
                  year: selectedYear,
                }}
              >
                조회
              </Link>
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Button asChild>
          <Link to="/dashboard/transactions/new">새 거래 등록</Link>
        </Button>
        {!transactions.length && (
          <p className="text-center py-10 text-lg text-muted-foreground">
            거래 내역이 없습니다.
          </p>
        )}
        {!!transactions.length && (
          <Table className="mt-4">
            <TableHeader>
              <TableRow>
                <TableHead>거래 일시</TableHead>
                <TableHead>설명</TableHead>
                <TableHead>거래 유형</TableHead>
                <TableHead>카테고리</TableHead>
                <TableHead>총액</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map(
                ({
                  id,
                  transactionDate,
                  description,
                  transactionType,
                  category,
                  amount,
                }) => (
                  <TableRow key={id}>
                    <TableCell>
                      {format(transactionDate, "MMM do", { locale: ko })}
                    </TableCell>
                    <TableCell>{description}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          transactionType === "수입"
                            ? "bg-lime-500"
                            : "bg-orange-500"
                        }
                      >
                        {transactionType}
                      </Badge>
                    </TableCell>
                    <TableCell>{category}</TableCell>
                    <TableCell>₩{numeral(amount).format("0,0[.]00")}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="icon"
                        aria-label="거래 수정"
                        asChild
                      >
                        <Link
                          to="/dashboard/transactions/$transactionId"
                          params={{ transactionId: id.toString() }}
                        >
                          <PencilIcon />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
