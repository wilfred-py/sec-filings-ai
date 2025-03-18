"use client";

import { useState } from "react";
import { TickerTable } from "./TickerTable";
import { TagManagement } from "./TagManagement";
import { useTickerData } from "./useTickerData";
import TickerSearch from "@/components/TickerSearch";

export default function DashboardPage() {
  const {
    tickers,
    loading,
    error,
    addTicker,
    updateTags,
    removeTicker,
    resendSummary,
  } = useTickerData();
  const [selectedTicker, setSelectedTicker] = useState<string | null>(null);

  const handleOpenTagManagement = (symbol: string) => setSelectedTicker(symbol);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="flex">
      <div className="flex-1 space-y-8 px-4 md:px-8 py-6">
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
        <TickerTable
          tickers={tickers}
          onResendSummary={resendSummary}
          onRemoveTicker={removeTicker}
          onOpenTagManagement={handleOpenTagManagement}
        />
        {selectedTicker && (
          <TagManagement
            symbol={selectedTicker}
            tags={
              tickers
                .find((t) => t.symbol === selectedTicker)
                ?.tags.map((tag) =>
                  typeof tag === "string"
                    ? { name: tag, color: "#3b82f6" }
                    : tag,
                ) || []
            }
            onUpdateTags={(symbol, tagObjects) =>
              updateTags(
                symbol,
                tagObjects.map((tag) => tag.name),
              )
            }
            open={!!selectedTicker}
            onOpenChange={(open) => !open && setSelectedTicker(null)}
          />
        )}
      </div>
    </div>
  );
}
