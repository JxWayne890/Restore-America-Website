import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import Locations from "./pages/Locations";
import LocationDetail from "./pages/LocationDetail";
import ChatWidget from "./components/ChatWidget";
import StormAlertBanner from "./components/StormAlertBanner";

function Router() {
  const [location] = useLocation();
  const isAdmin = location.startsWith("/admin");

  return (
    <>
      {/* Storm alert banner shown on all public pages */}
      {!isAdmin && <StormAlertBanner />}

      <Switch>
        <Route path={"/"} component={Home} />
        <Route path={"/locations"} component={Locations} />
        <Route path={"/locations/:slug"}>
          {(params) => <LocationDetail slug={params.slug} />}
        </Route>
        <Route path={"/admin"} component={Admin} />
        <Route path={"/404"} component={NotFound} />
        {/* Final fallback route */}
        <Route component={NotFound} />
      </Switch>

      {/* AI Chat widget shown on all public pages */}
      {!isAdmin && <ChatWidget />}
    </>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
