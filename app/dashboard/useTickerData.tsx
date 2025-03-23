"use client";

import { useState, useEffect } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session-client";

interface Ticker {
  symbol: string;
  name?: string;
  tags: { name: string; color: string }[];
  lastFiling?: string;
}

interface TickerResponse {
  ticker: string;
  name?: string;
  tags?: { name: string; color: string }[];
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
          err instanceof Error ? err.message : "Could not load tickers.",
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
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to add ticker");
      }
      const data = await res.json(); // Expect { ticker, name }
      setTickers([
        ...tickers,
        { symbol, name: data.name || "Unknown", tags: [] },
      ]);
    } catch (err) {
      setError(
        `Failed to add ${symbol}: ${err instanceof Error ? err.message : "Unknown error"}`,
      );
    }
  };

  const updateTags = async (
    symbol: string,
    newTags: { name: string; color: string }[],
  ) => {
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
    } catch (err) {
      setError(
        `Failed to update tags for ${symbol}: ${err instanceof Error ? err.message : "Unknown error"}`,
      );
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
    } catch (err) {
      setError(
        `Failed to remove ${symbol}: ${err instanceof Error ? err.message : "Unknown error"}`,
      );
    }
  };

  const resendSummary = async (symbol: string) => {
    try {
      const res = await fetch(`/api/filings/${symbol}/resend`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to resend summary");
    } catch (err) {
      setError(
        `Failed to resend summary for ${symbol}: ${err instanceof Error ? err.message : "Unknown error"}`,
      );
    }
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
