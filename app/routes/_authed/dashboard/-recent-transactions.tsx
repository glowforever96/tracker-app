import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import numeral from "numeral";

export function RecentTransaction({
  transactions,
}: {
  transactions: {
    id: number;
    description: string;
    amount: string;
    category: string | null;
    transactionType: "수입" | "지출" | null;
    transactionDate: string;
  }[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between">
          <span>최근 거래</span>
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link to="/dashboard/transactions">전체 보기</Link>
            </Button>
            <Button asChild>
              <Link to="/dashboard/transactions/new">새 거래 생성</Link>
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {" "}
        {!!transactions.length && (
          <Table className="mt-4">
            <TableHeader>
              <TableRow>
                <TableHead>거래 일시</TableHead>
                <TableHead>설명</TableHead>
                <TableHead>거래 유형</TableHead>
                <TableHead>카테고리</TableHead>
                <TableHead>총액</TableHead>
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
