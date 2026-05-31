import { motion } from "framer-motion";
import SectionTitle from "./SectionTitle";
import ProjectCard from "./ProjectCard";
import GithubContributions from "./GithubContributions";
import { projects } from "../data/content";
import { EASE, VIEWPORT } from "./motion/motion-presets";
import "./Projects.css";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

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

        <motion.ul
          className="projects__grid"
          role="list"
          variants={container}
          initial="hidden"
          whileInView="show"
          exit="hidden"
          viewport={VIEWPORT}
        >
          {projects.map((p) => (
            <motion.li key={p.title} variants={item}>
              <ProjectCard project={p} />
            </motion.li>
          ))}
        </motion.ul>

        <GithubContributions />
      </div>
    </section>
  );
}
