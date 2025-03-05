"use client";

import { useState, useEffect, useCallback } from "react";
import { debounce } from "lodash";

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
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Ticker Management
      </h2>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <div className="mb-6">
        <input
          type="text"
          value={query}
          onChange={handleSearch}
          placeholder="Search tickers (e.g., AAPL)"
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {searchResults.length > 0 && (
          <ul className="mt-2 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
            {searchResults.map((result) => {
              const isTracked = trackedTickers.some(
                (t) => t.ticker === result.ticker,
              );
              return (
                <li
                  key={result.ticker}
                  className="p-3 flex justify-between items-center hover:bg-gray-100"
                >
                  <span className="text-gray-700">
                    {result.ticker} - {result.name}
                  </span>
                  {!isTracked && (
                    <button
                      onClick={() => addTicker(result.ticker)}
                      className="text-blue-600 hover:underline"
                    >
                      Add
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
      <div>
        <h3 className="text-lg font-medium mb-3 text-gray-700">
          Tracked Tickers
        </h3>
        {trackedTickers.length === 0 ? (
          <p className="text-gray-500">No tickers tracked yet.</p>
        ) : (
          trackedTickers.map((t) => (
            <div
              key={t.ticker}
              className="mb-4 p-4 bg-white border border-gray-200 rounded-md shadow-sm"
            >
              <div className="flex justify-between items-center">
                <span className="text-gray-800 font-medium">{t.ticker}</span>
                <button
                  onClick={() => removeTicker(t.ticker)}
                  className="text-red-600 hover:underline"
                >
                  Remove
                </button>
              </div>
              <div className="mt-2">
                <span className="text-gray-600">Tags: </span>
                {t.tags.length === 0 ? (
                  <span className="text-gray-500">None</span>
                ) : (
                  t.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full mr-2"
                    >
                      {tag}
                      <button
                        onClick={() => removeTag(t.ticker, tag)}
                        className="ml-1 text-red-600 hover:text-red-800"
                      >
                        ×
                      </button>
                    </span>
                  ))
                )}
                <input
                  type="text"
                  value={newTag[t.ticker] || ""}
                  onChange={(e) =>
                    setNewTag({ ...newTag, [t.ticker]: e.target.value })
                  }
                  onKeyPress={(e) => e.key === "Enter" && addTag(t.ticker)}
                  placeholder="Add tag"
                  className="mt-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
