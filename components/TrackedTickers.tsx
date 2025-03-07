"use client";

import { useState, useEffect, useCallback } from "react";
import { debounce } from "lodash";
import TickerSearch from "./TickerSearch";

interface Ticker {
  ticker: string;
  name: string;
}

interface TrackedTicker {
  ticker: string;
  tags: string[];
}

export default function TrackedTickers() {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Ticker[]>([]);
  const [trackedTickers, setTrackedTickers] = useState<TrackedTicker[]>([]);
  const [newTag, setNewTag] = useState<{ [key: string]: string }>({});
  const [error, setError] = useState("");

  const fetchTrackedTickers = async () => {
    const res = await fetch("/api/user/tickers");
    if (res.ok) setTrackedTickers(await res.json());
    else setError("Failed to load tracked tickers");
  };

  useEffect(() => {
    fetchTrackedTickers();
  }, []);

  const debouncedSearch = useCallback(
    debounce(async (q: string) => {
      if (!q) {
        setSearchResults([]);
        return;
      }
      const res = await fetch(`/api/ticker/search?query=${q}`);
      if (res.ok) setSearchResults(await res.json());
      else setError("Search failed");
    }, 300),
    [],
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    debouncedSearch(e.target.value);
  };

  const addTicker = async (ticker: string) => {
    const res = await fetch("/api/user/tickers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ticker }),
    });
    if (res.ok) fetchTrackedTickers();
    else setError((await res.json()).error);
    setQuery("");
    setSearchResults([]);
  };

  const removeTicker = async (ticker: string) => {
    console.log("Removing ticker", ticker);
    const res = await fetch(`/api/user/tickers/${ticker}`, {
      method: "DELETE",
    });
    if (res.ok) fetchTrackedTickers();
    else setError("Failed to remove ticker");
  };

  const addTag = async (ticker: string) => {
    const tag = newTag[ticker]?.trim();
    if (!tag) return;
    const res = await fetch(`/api/user/tickers/${ticker}/tags`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tag }),
    });
    if (res.ok) {
      setNewTag({ ...newTag, [ticker]: "" });
      fetchTrackedTickers();
    } else setError("Failed to add tag");
  };

  const removeTag = async (ticker: string, tag: string) => {
    const res = await fetch(`/api/user/tickers/${ticker}/tags/${tag}`, {
      method: "DELETE",
    });
    if (res.ok) fetchTrackedTickers();
    else setError("Failed to remove tag");
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-50 rounded-lg shadow-md">
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <TickerSearch
        onSelect={addTicker}
        trackedTickers={trackedTickers.map((t) => t.ticker)}
        className="mb-6"
      />
    </div>
  );
}
