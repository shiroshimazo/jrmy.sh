import SectionTitle from "./SectionTitle";
import { profile, skills, experience } from "../data/content";
import "./About.css";

export default function About() {
  return (
    <section id="about" className="section about">
      <div className="container">
        <SectionTitle
          index="02"
          label="About"
          title="A designer-engineer focused on clarity and craft."
          lead={profile.intro}
        />

        <div className="about__grid">
          <div className="about__pane">
            <span className="label about__pane-title">Profile</span>
            <p className="body">
              I work across the stack but care most about the surface where
              software meets people. My approach is restrained: clear types,
              tight spacing, considered motion.
            </p>
            <dl className="about__facts">
              <div>
                <dt className="label">Based</dt>
                <dd className="body about__fact">{profile.location}</dd>
              </div>
              <div>
                <dt className="label">Focus</dt>
                <dd className="body about__fact">Interface systems</dd>
              </div>
              <div>
                <dt className="label">Available</dt>
                <dd className="body about__fact">Selective freelance</dd>
              </div>
            </dl>
          </div>

          <div className="about__pane">
            <span className="label about__pane-title">Skills</span>
            <ul className="skills">
              {skills.map((g) => (
                <li key={g.group} className="skills__group">
                  <span className="label skills__group-title">{g.group}</span>
                  <ul className="skills__items">
                    {g.items.map((s) => (
                      <li key={s} className="skills__item">
                        {s}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="about__timeline">
          <div className="about__timeline-head">
            <span className="label">Experience & Education</span>
            <span className="label about__count">
              {String(experience.length).padStart(2, "0")} entries
            </span>
          </div>

          <ol className="timeline">
            {experience.map((e) => (
              <li key={e.role + e.period} className="timeline__row">
                <span className="label timeline__period">{e.period}</span>
                <div className="timeline__body">
                  <h3 className="h2 timeline__role">{e.role}</h3>
                  <span className="label timeline__company">{e.company}</span>
                  <p className="body">{e.summary}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
