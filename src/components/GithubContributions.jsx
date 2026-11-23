import { useEffect, useState } from "react";
import { ActivityGrid } from "@/components/activity-grid";
import { profile } from "../data/content";
import { useClickSound } from "../hooks/useClickSound";
import "./GithubContributions.css";

const USERNAME = "shiroshimazo";
const TITLE = "Focus sessions";
const API = `https://github-contributions-api.jogruber.de/v4/${USERNAME}?y=last`;
const githubUrl = profile.socials.find((social) => social.label === "GitHub")?.href
  ?? `https://github.com/${USERNAME}`;

export default function GithubContributions() {
  const [sessions, setSessions] = useState(null);
  const [error, setError] = useState(false);
  const play = useClickSound();

  useEffect(() => {
    const controller = new AbortController();
    fetch(API, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("Could not fetch GitHub activity");
        return response.json();
      })
      .then(({ contributions }) => {
        if (!Array.isArray(contributions) || !contributions.length) {
          throw new Error("Invalid GitHub activity data");
        }
        if (!controller.signal.aborted) setSessions(contributions);
      })
      .catch(() => {
        if (!controller.signal.aborted) setError(true);
      });
    return () => controller.abort();
  }, []);

  const githubLink = (
    <a className="ghc__link" href={githubUrl} target="_blank" rel="noreferrer" onClick={() => play("tap")}>
      View on GitHub
    </a>
  );

  return (
    <div className="ghc">
      {sessions ? (
        <ActivityGrid title={TITLE} data={sessions} palette="green" unit="contribution">
          {githubLink}
        </ActivityGrid>
      ) : (
        <div className="activity-grid">
          <div className="activity-grid__heading">
            <h2>{TITLE}</h2>
            {githubLink}
          </div>
          <p className="ghc__status" role="status">
            {error ? "Could not load GitHub activity." : "Loading GitHub activity…"}
          </p>
        </div>
      )}
    </div>
  );
}
