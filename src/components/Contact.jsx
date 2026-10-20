import { useState } from "react";
import { motion } from "framer-motion";
import SectionTitle from "./SectionTitle";
import Button from "./Button";
import { profile, contact } from "../data/content";
import { EASE, VIEWPORT } from "./motion/motion-presets";
import { useClickSound } from "../hooks/useClickSound";
import "./Contact.css";

const grid = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};
const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

const EMPTY = { name: "", subject: "", message: "" };

// One line per state, announced politely to screen readers as it changes.
const STATUS = {
  idle: "",
  sending: "Sending…",
  sent: "Message sent — I'll reply within two business days.",
  error: "Couldn't send. Open it in your mail app instead.",
  // The endpoint refuses an origin it has not activated. That is a setup
  // state, not a visitor's fault, so it gets its own line.
  inactive: "This form isn't live yet — the direct email link works.",
};

export default function Contact() {
  const play = useClickSound();
  const [values, setValues] = useState(EMPTY);
  const [status, setStatus] = useState("idle");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  // Escape hatch: the same message, handed to the visitor's mail client.
  // Built from the current field values, so nothing typed is lost when the
  // network is the thing that failed.
  const mailto = `mailto:${profile.email}?subject=${encodeURIComponent(
    values.subject
  )}&body=${encodeURIComponent(`${values.message}\n\n— ${values.name}`)}`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Honeypot: the endpoint silently drops a submission whose `_honey`
    // field carries a value, so a filled hidden input never reaches the
    // inbox. Read it from the DOM rather than from state — that is what a
    // bot actually fills in.
    const honey = new FormData(e.currentTarget).get("_honey") || "";

    setStatus("sending");

    try {
      const res = await fetch(contact.endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: values.name,
          subject: values.subject,
          message: values.message,
          // The visitor's subject becomes the email's subject line.
          _subject: values.subject,
          _template: "table",
          _honey: honey,
        }),
      });
      const data = await res.json().catch(() => null);
      // FormSubmit answers 200 even when it refuses the submission, and the
      // flag comes back as the string "false" — so read it as a truthy
      // string-or-boolean, not as a boolean.
      const ok =
        res.ok && data && (data.success === true || data.success === "true");
      if (!ok) {
        throw new Error(data?.message || "Send failed");
      }
      setValues(EMPTY);
      setStatus("sent");
    } catch (err) {
      // The endpoint explains itself ("This form needs Activation", etc.).
      // An unactivated form is the owner's problem, not the visitor's, so it
      // gets a different line; everything else stays generic.
      const reason = err.message || "";
      console.warn("[contact] send failed:", reason);
      setStatus(
        reason.toLowerCase().includes("activation") ? "inactive" : "error"
      );
    }
  };

  return (
    <section id="contact" className="section contact">
      <div className="container">
        <SectionTitle
          index="04"
          label="Contact"
          title="Have a project in mind? Let's talk."
          lead="I take on a small number of engagements each quarter. Send a short note describing what you're building and I'll reply within two business days."
        />

        <motion.div
          className="contact__grid"
          variants={grid}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
        >
          <motion.form
            className="contact__form"
            variants={item}
            onSubmit={handleSubmit}
          >
            <div className="contact__field">
              <label className="label" htmlFor="contact-name">
                Name
              </label>
              <input
                id="contact-name"
                className="contact__input"
                type="text"
                name="name"
                value={values.name}
                onChange={handleChange}
                autoComplete="name"
                placeholder="Your name"
                minLength={2}
                required
              />
            </div>

            <div className="contact__field">
              <label className="label" htmlFor="contact-subject">
                Subject
              </label>
              <input
                id="contact-subject"
                className="contact__input"
                type="text"
                name="subject"
                value={values.subject}
                onChange={handleChange}
                autoComplete="off"
                placeholder="What it's about"
                minLength={3}
                required
              />
            </div>

            <div className="contact__field">
              <label className="label" htmlFor="contact-message">
                Message
              </label>
              <textarea
                id="contact-message"
                className="contact__input contact__input--area"
                name="message"
                value={values.message}
                onChange={handleChange}
                placeholder="Tell me about the project, the timeline, and the budget."
                rows={6}
                minLength={10}
                required
              />
            </div>

            {/* Honeypot — off-screen, out of the tab order, and ignored by
                screen readers. Bots fill it; people never see it. A filled
                `_honey` field makes the endpoint drop the submission. */}
            <input
              className="contact__trap"
              type="text"
              name="_honey"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
            />

            <div className="contact__submit">
              <Button type="submit" variant="primary" disabled={status === "sending"}>
                {status === "sending" ? "Sending" : "Send Message"}
              </Button>
              <p
                className={`contact__status contact__status--${status}`}
                role="status"
                aria-live="polite"
              >
                {STATUS[status]}
              </p>
            </div>

            {status === "error" || status === "inactive" ? (
              <a className="contact__fallback" href={mailto}>
                Open in mail app
                <span aria-hidden="true">↗</span>
              </a>
            ) : null}
          </motion.form>

          <motion.aside className="contact__side" variants={item}>
            <div className="contact__block">
              <span className="label">Direct</span>
              <a
                className="contact__email"
                href={`mailto:${profile.email}`}
                onClick={() => play("tap")}
              >
                {profile.email}
              </a>
            </div>

            <div className="contact__block">
              <span className="label">Elsewhere</span>
              <ul className="contact__socials" role="list">
                {profile.socials.map((s) => (
                  <li key={s.label}>
                    <a
                      className="contact__social"
                      href={s.href}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => play("tap")}
                    >
                      <span>{s.label}</span>
                      <span aria-hidden="true">↗</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="contact__block">
              <span className="label">Response</span>
              <p className="body contact__note">
                Replies sent from a personal address. For NDAs, request via
                email and I'll forward a template.
              </p>
            </div>
          </motion.aside>
        </motion.div>
      </div>
    </section>
  );
}
