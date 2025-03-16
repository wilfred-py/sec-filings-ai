import { debounce } from "lodash";
import { useState, useCallback } from "react";

interface Ticker {
  ticker: string;
  name: string;
}

interface TickerSearchProps {
  onSelect: (ticker: string) => void;
  trackedTickers: string[];
  className?: string;
}

export default function TickerSearch({
  onSelect,
  trackedTickers,
  className = "",
}: TickerSearchProps) {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Ticker[]>([]);
  const [error, setError] = useState("");

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

  const handleSelect = (ticker: string) => {
    onSelect(ticker);
    setQuery("");
    setSearchResults([]);
  };

  return (
    <div className={`relative ${className}`}>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <input
        type="text"
        value={query}
        onChange={handleSearch}
        placeholder="Search tickers (e.g. AAPL, WMT, DIS, JPM)"
        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {searchResults.length > 0 && (
        <ul className="absolute left-0 right-0 z-20 mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {searchResults.map((result) => {
            const isTracked = trackedTickers.includes(result.ticker);
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
                    onClick={() => handleSelect(result.ticker)}
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
  );
}
