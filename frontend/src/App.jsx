import { Menu, X } from "lucide-react";
import { useState } from "react";
import { ChatInterface } from "./components/chat-interface";
import { ConfigSidebar } from "./components/config-sidebar";
import { Button } from "./components/ui/button";
import { WelcomeScreen } from "./components/welcome-screen";

function App() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchMode, setSearchMode] = useState("semantic");
  const [numResults, setNumResults] = useState(5);
  const [categories, setCategories] = useState(["all"]);
  const [keywords, setKeywords] = useState("");
  const [semanticWeight, setSemanticWeight] = useState(70);

  const handleQuickStart = () => {
    setShowWelcome(false);
  };

  const handleConfigure = () => {
    setShowWelcome(false);
    setSidebarOpen(true);
  };

  if (showWelcome) {
    return (
      <WelcomeScreen
        onQuickStart={handleQuickStart}
        onConfigure={handleConfigure}
      />
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-80" : "w-0"
        } relative border-r border-border bg-sidebar transition-all duration-300 ease-in-out overflow-hidden flex-shrink-0`}
      >
        {/* Close button INSIDE sidebar (only visible when open) */}
        {sidebarOpen && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(false)}
            className="absolute right-4 top-4 z-50 hover:bg-sidebar-accent"
          >
            <X className="h-5 w-5" />
          </Button>
        )}

        <div className="w-80 h-full">
          <ConfigSidebar
            searchMode={searchMode}
            setSearchMode={setSearchMode}
            numResults={numResults}
            setNumResults={setNumResults}
            categories={categories}
            setCategories={setCategories}
            keywords={keywords}
            setKeywords={setKeywords}
            semanticWeight={semanticWeight}
            setSemanticWeight={setSemanticWeight}
          />
        </div>
      </div>

      {/* Open button OUTSIDE sidebar (only visible when closed) */}
      {!sidebarOpen && (
        <Button
          variant="outline"
          size="icon"
          onClick={() => setSidebarOpen(true)}
          className="fixed left-4 top-4 z-50 bg-background shadow-lg"
        >
          <Menu className="h-5 w-5" />
        </Button>
      )}

      {/* Main chat area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <ChatInterface
          searchMode={searchMode}
          numResults={numResults}
          categories={categories}
          keywords={keywords}
          semanticWeight={semanticWeight}
        />
      </div>
    </div>
  );
}

export default App;
