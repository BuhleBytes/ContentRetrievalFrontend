import { Menu, X } from "lucide-react"; // ✅ Import Menu and X
import { useEffect, useState } from "react";
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

  // Chat management state
  const [currentChatId, setCurrentChatId] = useState(null);
  const [currentMessages, setCurrentMessages] = useState([]);
  const [savedChats, setSavedChats] = useState([]);

  // Load saved chats from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("intelligent-search-chats");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setSavedChats(parsed);
      } catch (e) {
        console.error("Failed to load chats:", e);
      }
    }
  }, []);

  // Save chats to localStorage whenever they change
  useEffect(() => {
    if (savedChats.length > 0) {
      localStorage.setItem(
        "intelligent-search-chats",
        JSON.stringify(savedChats)
      );
    }
  }, [savedChats]);

  const handleQuickStart = () => {
    setShowWelcome(false);
    handleNewChat();
  };

  const handleConfigure = () => {
    setShowWelcome(false);
    setSidebarOpen(true);
    handleNewChat();
  };

  const handleNewChat = () => {
    if (currentChatId && currentMessages.length > 0) {
      const chatToSave = {
        id: currentChatId,
        name: currentChatId,
        messages: currentMessages,
        timestamp: new Date().toISOString(),
      };

      setSavedChats((prev) => {
        const existing = prev.find((chat) => chat.id === currentChatId);
        if (existing) {
          return prev.map((chat) =>
            chat.id === currentChatId ? chatToSave : chat
          );
        }
        return [...prev, chatToSave];
      });
    }

    const nextChatNumber = savedChats.length + 1;
    const newChatId = `Chat ${nextChatNumber}`;

    setCurrentChatId(newChatId);
    setCurrentMessages([]);
  };

  const handleLoadChat = (chatId) => {
    if (currentChatId && currentMessages.length > 0) {
      const chatToSave = {
        id: currentChatId,
        name: currentChatId,
        messages: currentMessages,
        timestamp: new Date().toISOString(),
      };

      setSavedChats((prev) => {
        const existing = prev.find((chat) => chat.id === currentChatId);
        if (existing) {
          return prev.map((chat) =>
            chat.id === currentChatId ? chatToSave : chat
          );
        }
        return [...prev, chatToSave];
      });
    }

    const chatToLoad = savedChats.find((chat) => chat.id === chatId);
    if (chatToLoad) {
      setCurrentChatId(chatToLoad.id);
      setCurrentMessages(chatToLoad.messages);
    }
  };

  const handleClearHistory = () => {
    setSavedChats([]);
    localStorage.removeItem("intelligent-search-chats");

    if (currentChatId && currentMessages.length > 0) {
      setCurrentChatId(null);
      setCurrentMessages([]);
    }
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
      {/* TOGGLE BUTTON - OUTSIDE SIDEBAR (ALWAYS VISIBLE) */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className={`fixed top-4 z-50 bg-background shadow-lg transition-all duration-300 ${
          sidebarOpen ? "left-[304px]" : "left-4"
        }`}
      >
        {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-80" : "w-0"
        } relative border-r border-border bg-sidebar transition-all duration-300 ease-in-out overflow-hidden flex-shrink-0`}
      >
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
            onNewChat={handleNewChat}
            savedChats={savedChats}
            currentChatId={currentChatId}
            onLoadChat={handleLoadChat}
            onClearHistory={handleClearHistory}
          />
        </div>
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <ChatInterface
          searchMode={searchMode}
          numResults={numResults}
          categories={categories}
          keywords={keywords}
          semanticWeight={semanticWeight}
          messages={currentMessages}
          setMessages={setCurrentMessages}
          currentChatId={currentChatId}
        />
      </div>
    </div>
  );
}

export default App;
