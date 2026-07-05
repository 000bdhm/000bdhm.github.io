import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Spotlight from "./components/Spotlight";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import ProjectDetail from "./components/ProjectDetail";
import NotFound from "./components/NotFound";

function CatapiRedirect() {
  useEffect(() => { window.location.replace("https://catapi-lac.vercel.app/catapi"); }, []);
  return null;
}

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
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects/:repo" element={<ProjectDetail />} />
        <Route path="/catapi" element={<CatapiRedirect />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}
