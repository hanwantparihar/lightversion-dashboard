"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Table2,
  Search,
  FileDown,
  Download,
  Printer,
} from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle, Input, DropdownSelect, Button } from "@/components/ui";
import { PageStack, EmployeesTable, TablePagination } from "@/components";
import type { EmployeeRow } from "@/components/tables/employees-table";

const emps: EmployeeRow[] = [
  { id: 1, n: "Laura Mitchell", p: "CEO", o: "New York", a: 42, d: "2018-03-15", s: 245000 },
  { id: 2, n: "James Carter", p: "CTO", o: "San Francisco", a: 39, d: "2019-01-10", s: 210000 },
  { id: 3, n: "Sophia Nguyen", p: "Lead Designer", o: "London", a: 34, d: "2020-06-22", s: 125000 },
  { id: 4, n: "Ethan Brooks", p: "Sr. Developer", o: "New York", a: 31, d: "2021-02-14", s: 135000 },
  { id: 5, n: "Olivia Peterson", p: "Marketing Mgr", o: "Chicago", a: 36, d: "2019-09-05", s: 115000 },
  { id: 6, n: "Noah Williams", p: "Data Analyst", o: "London", a: 28, d: "2022-04-18", s: 92000 },
  { id: 7, n: "Emma Johnson", p: "Product Mgr", o: "San Francisco", a: 33, d: "2020-11-30", s: 140000 },
  { id: 8, n: "Liam Davis", p: "DevOps Eng", o: "Tokyo", a: 30, d: "2021-08-12", s: 118000 },
  { id: 9, n: "Ava Thompson", p: "UX Researcher", o: "Berlin", a: 29, d: "2022-01-25", s: 98000 },
  { id: 10, n: "Mason Garcia", p: "Backend Dev", o: "New York", a: 27, d: "2023-03-08", s: 105000 },
  { id: 11, n: "Isabella Brown", p: "Frontend Dev", o: "Toronto", a: 26, d: "2023-05-14", s: 100000 },
  { id: 12, n: "Logan Wilson", p: "QA Engineer", o: "London", a: 32, d: "2021-07-20", s: 95000 },
];

export default function DataTables() {
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState("id");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return emps.filter((e) =>
      Object.values(e).some((v) =>
        String(v).toLowerCase().includes(q)
      )
    );
  }, [search]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const av = a[sortKey as keyof EmployeeRow];
      const bv = b[sortKey as keyof EmployeeRow];
      const cmp =
        typeof av === "number" && typeof bv === "number"
          ? av - bv
          : String(av).localeCompare(String(bv));
      return sortDirection === "asc" ? cmp : -cmp;
    });
  }, [filtered, sortKey, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const pageRows = sorted.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    setPage(1);
  }, [search, pageSize]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  return (
    <PageStack>
      <Card>
        <CardHeader>
          <CardTitle className="fc g2">
            <Table2 size={16} />
            Employee Data Table
          </CardTitle>
        </CardHeader>
        <CardContent style={{ padding: 0 }}>
          <div className="dt-f">
            <div className="fc g2 text-[13px] font-semibold text-muted-foreground">
              Show
              <DropdownSelect
                style={{ width: 66 }}
                value={String(pageSize)}
                onChange={(v) => setPageSize(Number(v))}
                options={[
                  { value: "5", label: "5" },
                  { value: "10", label: "10" },
                  { value: "25", label: "25" },
                ]}
              />
              entries
            </div>
            <div className="fc g2 flex-wrap">
              <div className="relative">
                <Search
                  size={15}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  placeholder="Search…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-9 w-[200px] rounded-lg pl-9"
                />
              </div>
              <Button type="button" size="sm" variant="default">
                <FileDown />
                CSV
              </Button>
              <Button type="button" size="sm" variant="success">
                <Download />
                Excel
              </Button>
              <Button type="button" size="sm" variant="info">
                <Printer />
                Print
              </Button>
            </div>
          </div>

          <EmployeesTable
            employees={pageRows}
            sortKey={sortKey}
            sortDirection={sortDirection}
            onSort={handleSort}
          />

          <TablePagination
            page={page}
            totalPages={totalPages}
            totalItems={sorted.length}
            pageSize={pageSize}
            onPageChange={setPage}
          />
        </CardContent>
      </Card>
    </PageStack>
  );
}
