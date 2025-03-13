"use client";

import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TickerActionsProps {
  symbol: string;
  onResendSummary: (symbol: string) => void;
  onRemoveTicker: (symbol: string) => void;
  onOpenTagManagement: (symbol: string) => void;
}

export function TickerActions({
  symbol,
  onResendSummary,
  onRemoveTicker,
  onOpenTagManagement,
}: TickerActionsProps) {
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
        <DropdownMenuItem onClick={() => onOpenTagManagement(symbol)}>
          Manage Tags
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onResendSummary(symbol)}>
          Resend Summary
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => onRemoveTicker(symbol)}
          className="text-red-600"
        >
          Remove Ticker
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
