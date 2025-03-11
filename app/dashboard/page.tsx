"use client";

import { redirect } from "next/navigation";
import { getSession } from "@/lib/session-client";
import { useState, useEffect } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import TickerSearch from "@/components/TickerSearch";

interface Ticker {
  symbol: string;
  name?: string;
  price?: number;
  marketCap?: string;
  tags: string[];
  lastFiling?: string;
}

const columns: ColumnDef<Ticker>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "symbol",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Symbol
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("symbol")}</div>
    ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Company Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "tags",
    header: "Tags",
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-1">
        {(row.getValue("tags") as string[]).map((tag) => (
          <span
            key={tag}
            className="bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded"
          >
            {tag}
          </span>
        ))}
      </div>
    ),
    filterFn: (row, id, value) => {
      const tags = row.getValue(id) as string[];
      return value.some((v: string) => tags.includes(v));
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const ticker = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <DialogTrigger asChild>
                <span className="cursor-pointer">Manage Tags</span>
              </DialogTrigger>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleResendSummary(ticker.symbol)}
            >
              Resend Summary
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => handleRemoveTicker(ticker.symbol)}
              className="text-red-600"
            >
              Remove Ticker
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

function handleRemoveTicker(symbol: string) {
  // Defined globally to avoid passing as prop (simpler for this example)
  // Will be moved into component logic below
}

function handleResendSummary(symbol: string) {
  // Same reasoning
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [tickers, setTickers] = useState<Ticker[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  useEffect(() => {
    console.log("Dashboard page mounted, starting initialization");

    const initialize = async () => {
      console.log("Initialize function called");

      try {
        console.log("Getting session...");
        const { session } = await getSession();
        console.log(
          "Session result:",
          session ? "Session exists" : "No session",
        );

        if (!session) {
          console.log("No session, redirecting to login");
          redirect("/login");
        }

        console.log("About to fetch tickers");
        const res = await fetch("/api/user/tickers", {
          credentials: "include",
        });

        console.log("Fetch response status:", res.status);
        if (!res.ok) throw new Error("Failed to fetch tickers");

        const data = await res.json();
        console.log("API response:", data);

        setTickers(
          data.map(
            (t: {
              ticker: string;
              name?: string;
              tags?: string[];
              lastFiling?: string;
            }) => ({
              symbol: t.ticker,
              name: t.name || "Unknown",
              tags: t.tags || [],
              lastFiling: t.lastFiling,
            }),
          ),
        );
      } catch (error) {
        console.error("Error in initialize:", error);
        setError("Could not load tickers. Please try again.");
      } finally {
        console.log("Setting loading to false");
        setLoading(false);
      }
    };

    initialize().catch((error) => {
      console.error("Unhandled error in initialize:", error);
      setLoading(false);
      setError("An unexpected error occurred. Please try again.");
    });

    return () => {
      console.log("Dashboard component unmounting");
    };
  }, []);

  useEffect(() => {
    if (tickers.length > 0) {
      console.log("First ticker:", tickers[0]);
    }
  }, [tickers]);

  const addTicker = async (symbol: string) => {
    try {
      const res = await fetch("/api/user/tickers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticker: symbol }),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to add ticker");
      setTickers([
        ...tickers,
        { symbol, tags: [], name: "Unknown", price: 0, marketCap: "N/A" },
      ]);
    } catch (error) {
      console.error(`Failed to add ${symbol}:`, error);
      setError(`Failed to add ${symbol}. Please try again.`);
    }
  };

  const removeTicker = async (symbol: string) => {
    try {
      const res = await fetch(`/api/user/tickers/${symbol}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to remove ticker");
      setTickers(tickers.filter((t) => t.symbol !== symbol));
    } catch (error) {
      console.error(`Failed to remove ${symbol}:`, error);
      setError(`Failed to remove ${symbol}. Please try again.`);
    }
  };

  const updateTags = async (symbol: string, newTags: string[]) => {
    try {
      const res = await fetch(`/api/user/tickers/${symbol}/tags`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tags: newTags }),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to update tags");
      setTickers(
        tickers.map((t) => (t.symbol === symbol ? { ...t, tags: newTags } : t)),
      );
    } catch (error) {
      console.error(`Failed to update tags for ${symbol}:`, error);
      setError(`Failed to update tags for ${symbol}.`);
    }
  };

  const resendSummary = async (symbol: string) => {
    console.log(`Resending summary for ${symbol}`); // Add email logic later
  };

  const table = useReactTable({
    data: tickers,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="space-y-8 px-4 md:px-8 py-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          My Tickers
        </h2>
      </div>

      <div className="rounded-lg bg-white dark:bg-gray-800 p-6 shadow">
        <TickerSearch
          onSelect={addTicker}
          trackedTickers={tickers.map((t) => t.symbol)}
        />
      </div>

      <div className="rounded-lg bg-white dark:bg-gray-800 shadow">
        <div className="flex items-center py-4 px-6">
          <Input
            placeholder="Filter tickers..."
            value={
              (table.getColumn("symbol")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("symbol")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="rounded-md mx-6 mb-6">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No tickers added yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4 px-6">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} ticker(s) selected.
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      {/* Tag Management Dialog - Scoped to each row */}
      {tickers.map((ticker) => (
        <Dialog key={ticker.symbol}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Manage {ticker.symbol}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <h4 className="mb-2 font-medium">Tags</h4>
                <Input
                  placeholder="Add new tag"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      const newTag = (e.target as HTMLInputElement).value;
                      if (newTag && !ticker.tags.includes(newTag)) {
                        updateTags(ticker.symbol, [...ticker.tags, newTag]);
                        (e.target as HTMLInputElement).value = "";
                      }
                    }
                  }}
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {ticker.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded cursor-pointer"
                      onClick={() =>
                        updateTags(
                          ticker.symbol,
                          ticker.tags.filter((t) => t !== tag),
                        )
                      }
                    >
                      {tag} <X className="inline h-3 w-3 ml-1" />
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      ))}
    </div>
  );
}
