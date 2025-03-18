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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface TickerTagManagementProps {
  symbol: string;
  tags: { name: string; color: string }[];
  onUpdateTags: (
    symbol: string,
    tags: { name: string; color: string }[],
  ) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const defaultColors = ["#D1D5DB", "#60A5FA", "#34D399", "#F87171"];

export function TagManagement({
  symbol,
  tags,
  onUpdateTags,
  open,
  onOpenChange,
}: TickerTagManagementProps) {
  const [newTag, setNewTag] = useState("");
  const [selectedColor, setSelectedColor] = useState(defaultColors[0]);

  const handleAddTag = () => {
    if (newTag && !tags.some((t) => t.name === newTag)) {
      onUpdateTags(symbol, [...tags, { name: newTag, color: selectedColor }]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagName: string) => {
    onUpdateTags(
      symbol,
      tags.filter((t) => t.name !== tagName),
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
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-10 p-0"
                  style={{ backgroundColor: selectedColor }}
                />
              </PopoverTrigger>
              <PopoverContent className="w-40 p-2">
                <div className="grid gap-2">
                  {defaultColors.map((color) => (
                    <button
                      key={color}
                      className={`w-8 h-8 rounded-full border-2 ${
                        selectedColor === color
                          ? "border-gray-900"
                          : "border-transparent"
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => setSelectedColor(color)}
                    />
                  ))}
                </div>
              </PopoverContent>
            </Popover>
            <Button onClick={handleAddTag}>Add</Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge
                key={tag.name}
                variant="outline"
                style={{ backgroundColor: tag.color }}
                className="text-white"
              >
                {tag.name}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 ml-2 hover:bg-transparent hover:text-white"
                  onClick={() => handleRemoveTag(tag.name)}
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
