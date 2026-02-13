import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import Home from "@/pages/Home";
import Contact from "@/pages/Contact";
import AboutMe from "@/pages/AboutMe";
import WritingList from "@/pages/WritingList";
import WritingDetail from "@/pages/WritingDetail";
import Musings from "@/pages/Musings";
import StartHere from "@/pages/StartHere";
import Projects from "@/pages/Projects";
import Reads from "@/pages/Reads";
import Resume from "@/pages/Resume";
import CertificatesPage from "@/pages/CertificatesPage";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/contact" component={Contact} />
      <Route path="/about" component={AboutMe} />
      <Route path="/writing" component={WritingList} />
      <Route path="/writing/:id" component={WritingDetail} />
      <Route path="/musings" component={Musings} />
      <Route path="/start-here" component={StartHere} />
      <Route path="/projects" component={Projects} />
      <Route path="/reads" component={Reads} />
      <Route path="/resume" component={Resume} />
      <Route path="/certificates" component={CertificatesPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
