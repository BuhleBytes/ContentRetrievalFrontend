import {
  BarChart3,
  Filter,
  Key,
  RotateCcw,
  Scale,
  Search,
  Settings,
} from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { ScrollArea } from "./ui/scroll-area";
import { Slider } from "./ui/slider";

export function ConfigSidebar({
  searchMode,
  setSearchMode,
  numResults,
  setNumResults,
  categories,
  setCategories,
  keywords,
  setKeywords,
  semanticWeight,
  setSemanticWeight,
}) {
  const [conversationHistory, setConversationHistory] = useState({
    today: ["Cold War & health problems...", "Gorilla conservation efforts..."],
    yesterday: ["Machine learning basics...", "TensorFlow optimization..."],
  });

  const categoryOptions = [
    { id: "all", label: "All Categories" },
    { id: "News", label: "News" },
    { id: "Educational", label: "Educational" },
    { id: "Technical Documentation", label: "Technical Documentation" },
    { id: "Research Publication", label: "Research Publication" },
  ];

  const handleCategoryToggle = (categoryId) => {
    if (categoryId === "all") {
      setCategories(["all"]);
    } else {
      const newCategories = categories.includes(categoryId)
        ? categories.filter((c) => c !== categoryId)
        : [...categories.filter((c) => c !== "all"), categoryId];
      setCategories(newCategories.length === 0 ? ["all"] : newCategories);
    }
  };

  const handleReset = () => {
    setSearchMode("semantic");
    setNumResults(5);
    setCategories(["all"]);
    setKeywords("");
    setSemanticWeight(70);
  };

  const handleClearHistory = () => {
    setConversationHistory({
      today: [],
      yesterday: [],
    });
  };

  const keywordWeight = 100 - semanticWeight;

  const hasHistory =
    conversationHistory.today.length > 0 ||
    conversationHistory.yesterday.length > 0;

  return (
    <ScrollArea className="h-full">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-2 pb-4 border-b border-sidebar-border">
          <Settings className="w-5 h-5 text-sidebar-primary" />
          <h2 className="font-semibold text-lg text-sidebar-foreground">
            Search Configuration
          </h2>
        </div>

        {/* Search Mode */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-sidebar-primary" />
            <Label className="text-sm font-medium">Search Mode</Label>
          </div>
          <RadioGroup
            value={searchMode}
            onValueChange={(value) => setSearchMode(value)}
          >
            <div className="flex items-center space-x-2 py-2">
              <RadioGroupItem value="semantic" id="semantic" />
              <Label htmlFor="semantic" className="font-normal cursor-pointer">
                Semantic Search
              </Label>
            </div>
            <div className="flex items-center space-x-2 py-2">
              <RadioGroupItem value="hybrid" id="hybrid" />
              <Label htmlFor="hybrid" className="font-normal cursor-pointer">
                Hybrid Search
              </Label>
            </div>
          </RadioGroup>
          <p className="text-xs text-muted-foreground">
            {searchMode === "semantic"
              ? "Pure AI-powered conceptual similarity"
              : "Combines semantic + keyword matching"}
          </p>
        </div>

        {/* Number of Results */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-sidebar-primary" />
            <Label className="text-sm font-medium">Number of Results</Label>
          </div>
          <div className="space-y-2">
            <Slider
              value={[numResults]}
              onValueChange={(value) => setNumResults(value[0])}
              min={1}
              max={20}
              step={1}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>1</span>
              <span className="font-medium text-sidebar-foreground">
                Currently: {numResults} results
              </span>
              <span>20</span>
            </div>
          </div>
          {numResults > 10 && (
            <p className="text-xs text-destructive">
              ⚠️ Large result sets may be harder to scan
            </p>
          )}
        </div>

        {/* Category Filter */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-sidebar-primary" />
            <Label className="text-sm font-medium">Category Filter</Label>
          </div>
          <div className="space-y-2">
            {categoryOptions.map((category) => (
              <div key={category.id} className="flex items-center space-x-2">
                <Checkbox
                  id={category.id}
                  checked={categories.includes(category.id)}
                  onCheckedChange={() => handleCategoryToggle(category.id)}
                />
                <Label
                  htmlFor={category.id}
                  className="text-sm font-normal cursor-pointer"
                >
                  {category.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Keyword Filter (Hybrid Only) */}
        {searchMode === "hybrid" && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-sidebar-primary" />
              <Label className="text-sm font-medium">Keyword Filter</Label>
            </div>
            <Input
              placeholder="Enter keywords (space-separated)"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Optional: Keywords will boost chunks containing these terms
            </p>
          </div>
        )}

        {/* Hybrid Search Weights */}
        {searchMode === "hybrid" && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-sidebar-primary" />
              <Label className="text-sm font-medium">
                Hybrid Search Weights
              </Label>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Semantic Understanding:</span>
                  <span className="font-medium text-accent">
                    {semanticWeight}%
                  </span>
                </div>
                <Slider
                  value={[semanticWeight]}
                  onValueChange={(value) => setSemanticWeight(value[0])}
                  min={0}
                  max={100}
                  step={5}
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Keyword Matching:</span>
                  <span className="font-medium text-accent">
                    {keywordWeight}%
                  </span>
                </div>
                <Slider
                  value={[keywordWeight]}
                  onValueChange={(value) => setSemanticWeight(100 - value[0])}
                  min={0}
                  max={100}
                  step={5}
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">Total: 100%</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-4 space-y-2">
          <Button onClick={handleReset} variant="outline" className="w-full">
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset to Default
          </Button>
        </div>

        {/* Quick Stats */}
        <Card className="p-4 space-y-2 bg-sidebar-accent">
          <div className="flex items-center gap-2 pb-2 border-b border-sidebar-border">
            <BarChart3 className="w-4 h-4 text-sidebar-primary" />
            <h3 className="font-medium text-sm">Quick Stats</h3>
          </div>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Database:</span>
              <span className="font-medium">251 chunks</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Model:</span>
              <span className="font-medium">all-mpnet-base-v2</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Dimensions:</span>
              <span className="font-medium">768</span>
            </div>
          </div>
        </Card>

        {/* Conversation History */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-sidebar-border">
            <h3 className="font-medium text-sm">Conversation History</h3>
          </div>

          {!hasHistory ? (
            <div className="text-center py-6">
              <p className="text-sm text-muted-foreground">
                No conversation history yet
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {conversationHistory.today.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">
                    Today
                  </p>
                  <div className="space-y-1">
                    {conversationHistory.today.map((chat, index) => (
                      <button
                        key={index}
                        className="w-full text-left text-sm p-2 rounded hover:bg-sidebar-accent transition-colors truncate"
                      >
                        {chat}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {conversationHistory.yesterday.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">
                    Yesterday
                  </p>
                  <div className="space-y-1">
                    {conversationHistory.yesterday.map((chat, index) => (
                      <button
                        key={index}
                        className="w-full text-left text-sm p-2 rounded hover:bg-sidebar-accent transition-colors truncate"
                      >
                        {chat}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <Button
            variant="ghost"
            size="sm"
            className="w-full text-xs"
            onClick={handleClearHistory}
            disabled={!hasHistory}
          >
            Clear History
          </Button>
        </div>
      </div>
    </ScrollArea>
  );
}
