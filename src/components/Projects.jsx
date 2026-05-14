import SectionTitle from "./SectionTitle";
import ProjectCard from "./ProjectCard";
import { projects } from "../data/content";
import "./Projects.css";

export default function Projects() {
  return (
    <section id="projects" className="section projects">
      <div className="container">
        <SectionTitle
          index="03"
          label="Selected Work"
          title="Projects engineered with restraint."
          lead="A short index of recent work. Each shipped end-to-end with attention to typography, performance, and information density."
        />

        <ul className="projects__grid" role="list">
          {projects.map((p) => (
            <li key={p.title}>
              <ProjectCard project={p} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
