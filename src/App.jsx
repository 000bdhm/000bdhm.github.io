import { Routes, Route } from "react-router-dom";
import Spotlight from "./components/Spotlight";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import ProjectDetail from "./components/ProjectDetail";
import NotFound from "./components/NotFound";
import Catapi from "./components/Catapi";
import DiscordCard from "./components/DiscordCard";

function Home() {
  return (
    <main>
      <Hero />
      <Skills />
      <Projects />
      <Contact />
    </main>
  );
}

export default function App() {
  return (
    <div className="relative bg-bg text-text min-h-screen font-body selection:bg-text selection:text-bg">
      <Spotlight />
      <Nav />
      <div className="fixed top-20 right-4 sm:right-6 z-40 hidden sm:block">
        <DiscordCard />
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects/:repo" element={<ProjectDetail />} />
        <Route path="/catapi" element={<Catapi />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}
