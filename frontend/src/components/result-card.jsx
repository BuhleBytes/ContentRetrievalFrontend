import { ChevronDown, ChevronUp, FileText, Flame } from "lucide-react";
import { useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

export function ResultCard({ result }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getSimilarityColor = (similarity) => {
    const value = parseFloat(similarity);
    if (value >= 0.8) return "text-success";
    if (value >= 0.6) return "text-accent";
    return "text-muted-foreground";
  };

  const handleReadMore = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Card className="p-5 space-y-4 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-accent shrink-0" />
          <h3 className="font-semibold text-lg">Result #{result.id}</h3>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-muted-foreground">Similarity:</span>
          <span
            className={`font-bold ${getSimilarityColor(result.similarity)}`}
          >
            {result.similarity}
          </span>
          {parseFloat(result.similarity) >= 0.8 && (
            <Flame className="w-4 h-4 text-destructive" />
          )}
        </div>
      </div>

      {/* Metadata */}
      <div className="flex flex-wrap gap-2 text-sm">
        <Badge variant="secondary" className="gap-1">
          📁 {result.category}
        </Badge>
        <Badge variant="outline" className="gap-1">
          🌐 {result.url}
        </Badge>
        <Badge variant="outline" className="gap-1">
          📊 Chunk {result.chunk}
        </Badge>
      </div>

      {/* Content Preview */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground">
          📝 Content Preview:
        </p>
        <p
          className={`text-sm leading-relaxed text-foreground/90 ${
            isExpanded ? "" : "line-clamp-3"
          }`}
        >
          {isExpanded ? result.fullContent || result.preview : result.preview}
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2 pt-2">
        <Button
          variant="default"
          size="sm"
          className="bg-accent hover:bg-accent/90"
          onClick={handleReadMore}
        >
          {isExpanded ? (
            <>
              <ChevronUp className="w-3 h-3 mr-1" />
              Show Less
            </>
          ) : (
            <>
              <ChevronDown className="w-3 h-3 mr-1" />
              Read More
            </>
          )}
        </Button>
      </div>
    </Card>
  );
}
