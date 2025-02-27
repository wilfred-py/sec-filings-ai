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

interface Tag {
  id: string;
  name: string;
  color: string;
}

interface TagManagementProps {
  tags: Tag[];
  onTagAdd: (name: string, color: string) => void;
  onTagRemove: (id: string) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const tagColors = [
  ["#60A5FA", "#34D399", "#F87171", "#FBBF24"],
  ["#A78BFA", "#EC4899", "#6EE7B7", "#9CA3AF"],
  ["#FB923C", "#C084FC", "#4ADE80", "#F472B6"],
];

export function TagManagement({
  tags,
  onTagAdd,
  onTagRemove,
  open,
  onOpenChange,
}: TagManagementProps) {
  const [newTag, setNewTag] = useState("");
  const [selectedColor, setSelectedColor] = useState("#60A5FA");

  const handleAddTag = () => {
    if (newTag && !tags.some((tag) => tag.name === newTag)) {
      onTagAdd(newTag, selectedColor);
      setNewTag("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Manage Tags</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex items-center space-x-2">
            <Input
              placeholder="New tag..."
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
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
                  {tagColors.map((row, i) => (
                    <div key={i} className="flex justify-between">
                      {row.map((color) => (
                        <button
                          key={color}
                          className={`w-8 h-8 rounded-full border-2 transition-all ${
                            selectedColor === color
                              ? "border-gray-900 dark:border-white scale-110"
                              : "border-transparent"
                          }`}
                          style={{ backgroundColor: color }}
                          onClick={() => setSelectedColor(color)}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
            <Button onClick={handleAddTag}>Add Tag</Button>
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
                  onClick={() => onTagRemove(tag.id)}
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
