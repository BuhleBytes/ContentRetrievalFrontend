import { Loader2, Send, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ChatMessage } from "./chat-message";
import { ResultCard } from "./result-card";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

export function ChatInterface({
  searchMode,
  numResults,
  categories,
  keywords,
  semanticWeight,
}) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isSearching) return;

    const userMessage = {
      id: Date.now().toString(),
      type: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsSearching(true);

    // Simulate bot response
    setTimeout(() => {
      const botMessage = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: `🔍 Searching with your current settings...\n\nCurrent Configuration:\n• Search Mode: ${
          searchMode === "semantic" ? "Semantic Search" : "Hybrid Search"
        }\n• Results: ${numResults} chunks\n• Filter: ${
          categories.includes("all") ? "All Categories" : categories.join(", ")
        }${
          searchMode === "hybrid" && keywords ? `\n• Keywords: ${keywords}` : ""
        }\n\n✓ Found ${numResults} results in 0.3s`,
        timestamp: new Date(),
        config: {
          searchMode,
          numResults,
          categories,
          keywords,
          semanticWeight,
        },
      };
      setMessages((prev) => [...prev, botMessage]);

      // Simulate results
      setTimeout(() => {
        const mockResults = Array.from({ length: numResults }, (_, i) => ({
          id: i + 1,
          similarity: (0.95 - i * 0.05).toFixed(3),
          category: categories.includes("all")
            ? [
                "Research Publication",
                "Educational",
                "Technical Documentation",
              ][i % 3]
            : categories[0],
          url: "pmc.ncbi.nlm.nih.gov/articles/...",
          chunk: `${i + 45} of 67`,
          preview:
            "The alarming nuclear arms race that the five nuclear powers launched in the second half of the twentieth century was the result of the special status they enjoyed during the Cold War period. This unprecedented development led to significant environmental and health consequences...",
        }));

        const resultsMessage = {
          id: (Date.now() + 2).toString(),
          type: "results",
          content: "",
          timestamp: new Date(),
          results: mockResults,
        };
        setMessages((prev) => [...prev, resultsMessage]);
        setIsSearching(false);
      }, 800);
    }, 500);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] space-y-4 text-center">
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-accent" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">Ready to search</h3>
                <p className="text-muted-foreground max-w-md">
                  Ask me anything about machine learning, wildlife conservation,
                  nuclear testing, or TensorFlow optimization!
                </p>
              </div>
              <div className="flex flex-wrap gap-2 justify-center pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setInput(
                      "How did Cold War politics lead to environmental health problems?"
                    )
                  }
                >
                  Try example query
                </Button>
              </div>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <div key={message.id}>
                  {message.type === "results" ? (
                    <div className="space-y-3">
                      {message.results?.map((result) => (
                        <ResultCard key={result.id} result={result} />
                      ))}
                    </div>
                  ) : (
                    <ChatMessage message={message} />
                  )}
                </div>
              ))}
              {isSearching && (
                <div className="flex items-center gap-2 text-muted-foreground p-4">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Processing your query...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>
      </div>

      {/* Input area */}
      <div className="border-t border-border bg-background p-4 flex-shrink-0">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="relative">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your query here... (Shift+Enter for new line)"
                className="min-h-[100px] pr-12 resize-none"
                disabled={isSearching}
              />
              <Button
                type="submit"
                size="icon"
                disabled={!input.trim() || isSearching}
                className="absolute bottom-2 right-2 bg-accent hover:bg-accent/90"
              >
                {isSearching ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              💡 Try: "How does TensorFlow optimize graphs?" or use /help for
              commands
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
