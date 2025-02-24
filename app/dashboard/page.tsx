"use client";

import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/session-server";
import { logout } from "@/app/actions/log-out";
import { useState } from "react";
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

export default async function Dashboard() {
  const { session, user } = await getCurrentSession();
  if (session === null || user === null) {
    return redirect("/login");
  }

  return (
    <div className="space-y-8 px-4 md:px-8 py-6">
      <div className="flex items-center justify-between">
        <div>
          <div>{user.oauthProfiles?.[0]?.displayName}</div>
          <form action={logout}>
            <button type="submit">Logout</button>
          </form>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          My Tickers
        </h2>
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Add ticker..."
            value={newTicker}
            onChange={(e) => setNewTicker(e.target.value)}
            className="w-40"
          />
          <Button
            onClick={addTicker}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="mr-2 h-4 w-4" /> Add
          </Button>
        </div>
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
                      <Badge
                        key={tag}
                        style={{ backgroundColor: getTagColor(tag) }}
                        className="text-white"
                      >
                        {tag}
                      </Badge>
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
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Tag Management
        </h3>
        <div className="flex items-center space-x-2 mb-4">
          <Input
            placeholder="New tag..."
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            className="w-full max-w-xs"
          />
          <div className="flex items-center space-x-2">
            {tagColors.map((color) => (
              <button
                key={color.hex}
                className={`w-6 h-6 rounded-full border-2 ${
                  selectedColor === color.hex
                    ? "border-gray-900 dark:border-white"
                    : "border-transparent"
                }`}
                style={{ backgroundColor: color.hex }}
                onClick={() => setSelectedColor(color.hex)}
                title={color.name}
              />
            ))}
          </div>
          <Button onClick={addTag}>Add Tag</Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge
              key={tag.id}
              variant="outline"
              style={{ backgroundColor: tag.color }}
              className="text-white text-sm"
            >
              {tag.name}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 ml-2 -mr-2 hover:bg-transparent hover:text-white"
                onClick={() => removeTag(tag.id)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}

const [tickers, setTickers] = useState<Ticker[]>([
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    price: 175.84,
    marketCap: "2.8T",
    tags: ["Tech", "Consumer Electronics"],
    lastFiling: "2024-02-15",
  },
  {
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    price: 143.96,
    marketCap: "1.8T",
    tags: ["Tech", "Internet"],
    lastFiling: "2024-02-10",
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corporation",
    price: 402.65,
    marketCap: "3.1T",
    tags: ["Tech", "Software"],
    lastFiling: "2024-02-01",
  },
]);

const [tags, setTags] = useState<Tag[]>([
  { id: "1", name: "Tech", color: "#60A5FA" },
  { id: "2", name: "Consumer Electronics", color: "#34D399" },
  { id: "3", name: "Internet", color: "#F87171" },
  { id: "4", name: "Software", color: "#FBBF24" },
]);

const [newTicker, setNewTicker] = useState("");
const [newTag, setNewTag] = useState("");
const [selectedColor, setSelectedColor] = useState(tagColors[0].hex);

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

const addTag = () => {
  if (newTag && !tags.some((tag) => tag.name === newTag)) {
    setTags([
      ...tags,
      {
        id: Date.now().toString(),
        name: newTag,
        color: selectedColor,
      },
    ]);
    setNewTag("");
  }
};

const removeTag = (id: string) => {
  setTags(tags.filter((tag) => tag.id !== id));
};

const getTagColor = (tagName: string) => {
  return tags.find((tag) => tag.name === tagName)?.color || "#9CA3AF";
};

const resendSummary = async (symbol: string) => {
  // Implement email resend logic here
  console.log(`Resending summary for ${symbol}`);
};
