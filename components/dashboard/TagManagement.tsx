"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface TickerTagManagementProps {
  symbol: string;
  tags: string[];
  onUpdateTags: (symbol: string, tags: string[]) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TagManagement({
  symbol,
  tags,
  onUpdateTags,
  open,
  onOpenChange,
}: TickerTagManagementProps) {
  const [newTag, setNewTag] = useState("");

  const handleAddTag = () => {
    if (newTag && !tags.includes(newTag)) {
      onUpdateTags(symbol, [...tags, newTag]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    onUpdateTags(
      symbol,
      tags.filter((t) => t !== tag),
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Manage Tags for {symbol}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Add new tag..."
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
              className="flex-1"
            />
            <Button onClick={handleAddTag}>Add</Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="text-gray-800 bg-gray-200"
              >
                {tag}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 ml-2 -mr-2 hover:bg-transparent hover:text-gray-800"
                  onClick={() => handleRemoveTag(tag)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
