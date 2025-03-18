"use client";

import { useState, useEffect } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session-client";

interface Ticker {
  symbol: string;
  name?: string;
  tags: string[];
  lastFiling?: string;
}

interface TickerResponse {
  ticker: string;
  name?: string;
  tags?: string[];
  lastFiling?: string;
}

export const useTickerData = () => {
  const [tickers, setTickers] = useState<Ticker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initialize = async () => {
      try {
        const { session } = await getSession();
        if (!session) redirect("/login");

        const res = await fetch("/api/user/tickers", {
          credentials: "include",
        });
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Failed to fetch tickers");
        }
        const data: TickerResponse[] = await res.json();
        setTickers(
          data.map((t) => ({
            symbol: t.ticker,
            name: t.name || "Unknown",
            tags: t.tags || [],
            lastFiling: t.lastFiling,
          })),
        );
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unexpected error occurred",
        );
      } finally {
        setLoading(false);
      }
    };
    initialize();
  }, []);

  const addTicker = async (symbol: string) => {
    try {
      const res = await fetch("/api/user/tickers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticker: symbol }),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to add ticker");
      setTickers([...tickers, { symbol, tags: [], name: "Unknown" }]);
    } catch (error) {
      console.error("Error adding ticker:", error);
      setError(`Failed to add ${symbol}.`);
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
      console.error("Error updating tags:", error);
      setError(`Failed to update tags for ${symbol}.`);
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
      console.error("Error removing ticker:", error);
      setError(`Failed to remove ${symbol}.`);
    }
  };

  const resendSummary = async (symbol: string) => {
    console.log(`Resending summary for ${symbol}`);
    // Add email logic later
  };

  return {
    tickers,
    loading,
    error,
    addTicker,
    updateTags,
    removeTicker,
    resendSummary,
  };
};
