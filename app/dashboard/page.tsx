"use client";

import TrackedTickers from "@/components/TrackedTickers";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session-client";
import { useState, useEffect } from "react";
import { Plus, Settings, Send, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

interface Tag {
  id: string;
  name: string;
  color: string;
}

interface Ticker {
  symbol: string;
  name: string;
  price: number;
  marketCap: string;
  tags: string[];
  lastFiling?: string;
}

const tagColors = [
  { hex: "#60A5FA", name: "Blue" },
  { hex: "#34D399", name: "Green" },
  { hex: "#F87171", name: "Red" },
  { hex: "#FBBF24", name: "Yellow" },
  { hex: "#A78BFA", name: "Purple" },
  { hex: "#EC4899", name: "Pink" },
  { hex: "#6EE7B7", name: "Emerald" },
  { hex: "#9CA3AF", name: "Gray" },
  { hex: "#FB923C", name: "Orange" },
  { hex: "#C084FC", name: "Violet" },
];

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [tickers, setTickers] = useState<Ticker[]>([]);

  const [tags, setTags] = useState<Tag[]>([
    { id: "1", name: "Tech", color: "#60A5FA" },
    { id: "2", name: "Consumer Electronics", color: "#34D399" },
    { id: "3", name: "Internet", color: "#F87171" },
    { id: "4", name: "Software", color: "#FBBF24" },
  ]);

  const [newTicker, setNewTicker] = useState("");
  const [newTag, setNewTag] = useState("");

  const addTicker = () => {
    if (newTicker) {
      setTickers([
        ...tickers,
        {
          symbol: newTicker.toUpperCase(),
          name: "New Company",
          price: 0,
          marketCap: "N/A",
          tags: [],
        },
      ]);
      setNewTicker("");
    }
  };

  const removeTicker = (symbol: string) => {
    setTickers(tickers.filter((ticker) => ticker.symbol !== symbol));
  };

  const resendSummary = async (symbol: string) => {
    // Implement email resend logic here
    console.log(`Resending summary for ${symbol}`);
  };

  useEffect(() => {
    getSession().then((result) => {
      if (!result.session) {
        redirect("/login");
      }

      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-8 px-4 md:px-8 py-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          My Tickers
        </h2>
      </div>

      <div className="rounded-lg border bg-white dark:bg-gray-800 shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Symbol</TableHead>
              <TableHead>Company Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Market Cap</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {tickers.map((ticker) => (
              <TableRow key={ticker.symbol}>
                <TableCell className="font-medium">{ticker.symbol}</TableCell>
                <TableCell>{ticker.name}</TableCell>
                <TableCell>${ticker.price.toLocaleString()}</TableCell>
                <TableCell>{ticker.marketCap}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {ticker.tags.map((tag) => (
                      <Badge key={tag}>{tag}</Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="icon">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Manage {ticker.symbol}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div>
                            <h4 className="mb-2 font-medium">Assigned Tags</h4>
                            <div className="flex flex-wrap gap-2">
                              {tags.map((tag) => (
                                <Badge
                                  key={tag.id}
                                  style={{ backgroundColor: tag.color }}
                                  className="cursor-pointer text-white"
                                  onClick={() => {
                                    const newTags = ticker.tags.includes(
                                      tag.name,
                                    )
                                      ? ticker.tags.filter(
                                          (t) => t !== tag.name,
                                        )
                                      : [...ticker.tags, tag.name];
                                    setTickers(
                                      tickers.map((t) =>
                                        t.symbol === ticker.symbol
                                          ? { ...t, tags: newTags }
                                          : t,
                                      ),
                                    );
                                  }}
                                >
                                  {tag.name}
                                  {ticker.tags.includes(tag.name) && (
                                    <X className="ml-1 h-3 w-3" />
                                  )}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => resendSummary(ticker.symbol)}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeTicker(ticker.symbol)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="rounded-lg border bg-white dark:bg-gray-800 p-6 shadow">
        <TrackedTickers />
      </div>
    </div>
  );
}
