import { useState, useEffect } from "react";

const GL = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,600&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { background: #F4EFE8; color: #1A1A1A; font-family: 'DM Sans', sans-serif; overflow-x: hidden; }

  @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
  @keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
  @keyframes lineDraw { from { width: 0; } to { width: 100%; } }

  .fu { animation: fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) both; }
  .fu1 { animation-delay: 0.05s; }
  .fu2 { animation-delay: 0.2s; }
  .fu3 { animation-delay: 0.35s; }
  .fu4 { animation-delay: 0.5s; }
  .fu5 { animation-delay: 0.65s; }
  .fu6 { animation-delay: 0.8s; }

  .gold-text {
    background: linear-gradient(90deg, #A07840, #C8A96E 40%, #E2C484 50%, #C8A96E 60%, #A07840);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: shimmer 4s linear infinite;
  }

  .email-in {
    flex: 1;
    background: #FFFFFF;
    border: 1px solid #D4CDBF;
    border-right: none;
    color: #1A1A1A;
    padding: 15px 20px;
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    outline: none;
    border-radius: 4px 0 0 4px;
    transition: border-color 0.2s;
    min-width: 0;
  }
  .email-in::placeholder { color: #A8A099; }
  .email-in:focus { border-color: #C8A96E; }

  .sub-btn {
    background: #1A1A1A;
    color: #F4EFE8;
    border: none;
    padding: 15px 28px;
    font-family: 'DM Sans', sans-serif;
    font-weight: 600;
    font-size: 12px;
    letter-spacing: 2px;
    text-transform: uppercase;
    cursor: pointer;
    border-radius: 0 4px 4px 0;
    transition: background 0.2s;
    white-space: nowrap;
  }
  .sub-btn:hover { background: #2D2D2D; }

  .pill { display: inline-flex; align-items: center; gap: 6px; border: 1px solid #D4CDBF; border-radius: 100px; padding: 5px 13px; font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 1.5px; color: #8A7D6B; }
  .pill-dot { width: 4px; height: 4px; border-radius: 50%; background: #C8A96E; }

  .module-card { padding: 24px 20px; background: #FFFFFF; border: 1px solid #E0D9CE; border-top: 2px solid #C8A96E; transition: box-shadow 0.25s, transform 0.25s; }
  .module-card:hover { box-shadow: 0 8px 32px rgba(0,0,0,0.08); transform: translateY(-2px); }

  .tick-wrap { overflow: hidden; border-top: 1px solid #E0D9CE; border-bottom: 1px solid #E0D9CE; padding: 13px 0; background: #EDE8DF; }
  .tick-inner { display: flex; width: max-content; animation: ticker 32s linear infinite; }
  .tick-item { display: flex; align-items: center; gap: 14px; padding: 0 28px; white-space: nowrap; font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 2px; color: #9A8E80; text-transform: uppercase; }

  nav button { background: none; border: none; cursor: pointer; }
`;

const GOLD = "#C8A96E";
const NAVY = "#1A1A1A";
const CREAM = "#F4EFE8";
const BORDER = "#E0D9CE";

const TICKS = ["Physician-Founded","Clinically Dosed","Zero Proprietary Blends","Third-Party Tested","GLP-1 Companion","Full Label Transparency","Muscle Preservation","GI Support","Metabolic Optimization","Micronutrient Repletion","Dr. Jeff Nazar · Physician"];

const MODULES = [
  { num: "01", title: "Muscle Preservation", desc: "Creatine, HMB, and Leucine, the evidence-based triad for preventing lean mass loss during caloric restriction.", items: ["Creatine Monohydrate · 3,000mg", "HMB (free acid) · 1,500mg", "L-Leucine · 2,000mg"] },
  { num: "02", title: "GI & Gut Support", desc: "Addresses nausea, constipation, and motility issues, the leading drivers of GLP-1 discontinuation.", items: ["Psyllium Husk · 3,000mg", "Ginger Root Extract · 500mg", "Digestive Enzymes · 250mg", "L-Glutamine · 1,000mg"] },
  { num: "03", title: "Metabolic Support", desc: "Complementing GLP-1's mechanism with insulin sensitivity optimization and blood glucose buffering.", items: ["Berberine HCl · 500mg", "R-Alpha Lipoic Acid · 300mg", "Chromium Picolinate · 200mcg"] },
  { num: "04", title: "Micronutrient Repletion", desc: "Eating less means getting less. These correct the predictable deficiencies we see in GLP-1 patients.", items: ["Magnesium Glycinate · 300mg", "Methylcobalamin B12 · 1,000mcg", "Vitamin D3 + K2 · 2,000IU/90mcg", "Zinc Bisglycinate · 15mg"] },
];

const WHY = [
  { label: "Physician Founder", desc: "Not a brand that hired a medical advisor. The physician is the founder. Every formulation decision is a clinical one." },
  { label: "Exact Doses", desc: "Zero proprietary blends. Every ingredient and dose listed exactly as formulated, because you deserve to know what you're taking." },
  { label: "Third-Party Tested", desc: "Every batch independently verified. Certificate of Analysis available via QR code on every container." },
  { label: "Evidence-Based", desc: "Dosed to the clinical literature, not to what fits on a marketing label or looks impressive in a proprietary blend." },
];

export default function KovaVariantC() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [count, setCount] = useState(412);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const s = document.createElement("style");
    s.textContent = GL;
    document.head.appendChild(s);
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => { document.head.removeChild(s); window.removeEventListener("scroll", onScroll); };
  }, []);

  const submit = () => {
    if (!email.includes("@")) return;
    setDone(true);
    setCount(c => c + 1);
  };

  return (
    <div style={{ background: CREAM, minHeight: "100vh" }}>

      {/* NAV */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "0 48px", height: 62,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: scrolled ? "rgba(244,239,232,0.95)" : "transparent",
        borderBottom: scrolled ? `1px solid ${BORDER}` : "1px solid transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        transition: "all 0.35s",
      }}>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 700, letterSpacing: 7, color: NAVY }}>KOVA</div>
        <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
          {["Formula", "Why Kova", "Join Waitlist"].map(label => (
            <button key={label}
              onClick={() => document.getElementById(label.toLowerCase().replace(" ", "-"))?.scrollIntoView({ behavior: "smooth" })}
              style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, letterSpacing: 2, color: "#8A7D6B", textTransform: "uppercase" }}>
              {label}
            </button>
          ))}
        </div>
      </nav>

      {/* HERO */}
      <section style={{
        minHeight: "100vh", display: "flex", alignItems: "center",
        padding: "100px 48px 80px", position: "relative", overflow: "hidden",
      }}>
        {/* Subtle bg circles */}
        <div style={{ position: "absolute", top: "15%", right: "-60px", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(200,169,110,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "20%", left: "-80px", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(200,169,110,0.05) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 760 }}>

          {/* Founder eyebrow */}
          <div className="fu fu1" style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
            <div style={{
              width: 44, height: 44, borderRadius: "50%",
              background: NAVY,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 10, color: GOLD, lineHeight: 1 }}>MD</div>
            </div>
            <div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 13, color: NAVY }}>Dr. Jeff Nazar</div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: 2, color: "#8A7D6B", marginTop: 1 }}>PHYSICIAN · FOUNDER · KOVA CLINICAL</div>
            </div>
          </div>

          {/* Quote block */}
          <div className="fu fu2" style={{
            borderLeft: `3px solid ${GOLD}`,
            paddingLeft: 28,
            marginBottom: 36,
          }}>
            <div style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: "italic",
              fontWeight: 400,
              fontSize: "clamp(24px, 3.5vw, 38px)",
              color: NAVY,
              lineHeight: 1.45,
              marginBottom: 16,
            }}>
              "I formulated this for my own GLP-1 patients. I watched them lose muscle, struggle with side effects, and quietly stop medication that was genuinely helping them. The science to fix this exists. A product that actually used it didn't. So I built it."
            </div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: 3, color: GOLD }}>
              DR. JEFF NAZAR · PHYSICIAN
            </div>
          </div>

          {/* Pills */}
          <div className="fu fu3" style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 36 }}>
            {["Physician-Founded", "GLP-1 Companion", "Zero Proprietary Blends", "Launching 2026"].map(t => (
              <span key={t} className="pill"><span className="pill-dot" />{t}</span>
            ))}
          </div>

          {/* Description */}
          <p className="fu fu4" style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 16, color: "#5A5248",
            lineHeight: 1.8, maxWidth: 520, marginBottom: 40,
          }}>
            A daily supplement stack for adults on semaglutide or tirzepatide — protecting muscle, easing GI side effects, and filling the nutritional gaps your prescription creates.
          </p>

          {/* Email capture */}
          <div className="fu fu5">
            {!done ? (
              <>
                <div style={{ display: "flex", maxWidth: 480, marginBottom: 12 }}>
                  <input type="email" className="email-in" placeholder="your@email.com"
                    value={email} onChange={e => setEmail(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && submit()} />
                  <button className="sub-btn" onClick={submit}>Join Waitlist</button>
                </div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#A8A099" }}>
                  {count.toLocaleString()} people on the waitlist · No spam
                </div>
              </>
            ) : (
              <div style={{
                padding: "22px 28px", maxWidth: 480,
                borderLeft: `3px solid ${GOLD}`,
                background: "#FFFFFF",
                animation: "fadeIn 0.5s ease both",
              }}>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: NAVY, marginBottom: 6 }}>You're on the list.</div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#8A7D6B", lineHeight: 1.65 }}>
                  We'll reach out before launch with early access and the full clinical brief. Welcome to Kova.
                </div>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="fu fu6" style={{
            display: "flex", gap: 40, marginTop: 56,
            paddingTop: 40, borderTop: `1px solid ${BORDER}`,
            flexWrap: "wrap",
          }}>
            {[["4", "Formula Modules"], ["18", "Active Ingredients"], ["0", "Proprietary Blends"]].map(([val, label]) => (
              <div key={label}>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 44, fontWeight: 700, color: GOLD, lineHeight: 1 }}>{val}</div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: 2, color: "#A8A099", marginTop: 4, textTransform: "uppercase" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TICKER */}
      <div className="tick-wrap">
        <div className="tick-inner">
          {[...TICKS, ...TICKS].map((t, i) => (
            <div key={i} className="tick-item">
              <div style={{ width: 3, height: 3, borderRadius: "50%", background: GOLD, flexShrink: 0 }} />
              {t}
            </div>
          ))}
        </div>
      </div>

      {/* FORMULA */}
      <section id="formula" style={{ padding: "100px 48px", background: CREAM }}>
        <div style={{ maxWidth: 1040, margin: "0 auto" }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: 4, color: GOLD, marginBottom: 12 }}>THE FORMULA</div>
          <div style={{ width: 36, height: 1.5, background: GOLD, marginBottom: 24 }} />
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 700, color: NAVY, lineHeight: 1.1, marginBottom: 16 }}>
            Four modules.<br />One daily stack.
          </h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "#5A5248", lineHeight: 1.8, maxWidth: 500, marginBottom: 56 }}>
            Every ingredient has a clinical rationale. Every dose matches the literature. No blends, no filler, no guessing.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10 }}>
            {MODULES.map(m => (
              <div key={m.num} className="module-card">
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 48, fontWeight: 700, color: "rgba(200,169,110,0.15)", lineHeight: 1, marginBottom: 8 }}>{m.num}</div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: 2.5, color: GOLD, marginBottom: 10 }}>{m.title.toUpperCase()}</div>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#7A6E62", lineHeight: 1.65, marginBottom: 14 }}>{m.desc}</p>
                {m.items.map(it => (
                  <div key={it} style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#5A5248", padding: "6px 0", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ width: 3, height: 3, borderRadius: "50%", background: GOLD, flexShrink: 0 }} />
                    {it}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY */}
      <section id="why-kova" style={{ padding: "80px 48px", background: "#EDE8DF", borderTop: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: 1040, margin: "0 auto" }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: 4, color: GOLD, marginBottom: 12 }}>WHY KOVA</div>
          <div style={{ width: 36, height: 1.5, background: GOLD, marginBottom: 40 }} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 2 }}>
            {WHY.map(({ label, desc }) => (
              <div key={label} style={{ padding: "28px 24px", background: "#FFFFFF", border: `1px solid ${BORDER}` }}>
                <div style={{ width: 24, height: 1.5, background: GOLD, marginBottom: 14 }} />
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: 2, color: NAVY, fontWeight: 700, marginBottom: 10, textTransform: "uppercase" }}>{label}</div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#7A6E62", lineHeight: 1.7 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOUNDER FULL */}
      <section style={{ padding: "100px 48px", background: NAVY }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 36 }}>
            <div style={{
              width: 56, height: 56, borderRadius: "50%",
              background: GOLD,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 14, color: NAVY, lineHeight: 1 }}>MD</div>
            </div>
            <div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 600, color: "#F2EDE6" }}>Dr. Jeff Nazar</div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: 2, color: "rgba(200,169,110,0.6)", marginTop: 2 }}>PHYSICIAN · INTEGRATIVE MEDICINE · FOUNDER</div>
            </div>
          </div>

          <div style={{ width: "100%", height: 1, background: "rgba(200,169,110,0.2)", marginBottom: 36 }} />

          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "clamp(20px, 2.5vw, 28px)", color: "rgba(242,237,230,0.85)", lineHeight: 1.65, marginBottom: 32 }}>
            "The supplement industry has a credibility problem. Most brands are marketing companies that happen to sell capsules. Proprietary blends hide underdosed ingredients. Celebrity endorsements replace clinical rationale. My patients who need this most deserve better. You deserve better."
          </div>

          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "rgba(242,237,230,0.5)", lineHeight: 1.75, marginBottom: 40 }}>
            As a physician specializing in integrative medicine, I formulated the Kova GLP-1 Companion Stack based on what the clinical literature actually supports, not what looks impressive on a label. Every ingredient has a reason. Every dose is functional. Nothing is hidden.
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {["Integrative Medicine", "GLP-1 Therapy", "Physician-Founded"].map(t => (
              <span key={t} style={{ border: "1px solid rgba(200,169,110,0.25)", padding: "5px 13px", fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: 1.5, color: "rgba(200,169,110,0.6)", borderRadius: 2 }}>{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* WAITLIST */}
      <section id="join-waitlist" style={{ padding: "100px 48px", background: CREAM, borderTop: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: 560, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: 4, color: GOLD, marginBottom: 12 }}>EARLY ACCESS</div>
          <div style={{ width: 1, height: 40, background: GOLD, margin: "0 auto 28px" }} />
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 700, color: NAVY, lineHeight: 1.1, marginBottom: 16 }}>
            Be first.
          </h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "#5A5248", lineHeight: 1.8, marginBottom: 40 }}>
            Join the waitlist for early access, launch pricing, and the full clinical rationale behind every ingredient, directly from Dr. Nazar.
          </p>

          {!done ? (
            <>
              <div style={{ display: "flex", marginBottom: 12 }}>
                <input type="email" className="email-in" placeholder="your@email.com"
                  value={email} onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && submit()} />
                <button className="sub-btn" onClick={submit}>Join Waitlist</button>
              </div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#A8A099" }}>
                {count.toLocaleString()} people on the waitlist · No spam
              </div>
            </>
          ) : (
            <div style={{
              padding: "28px 32px",
              borderLeft: `3px solid ${GOLD}`,
              background: "#FFFFFF",
              textAlign: "left",
              animation: "fadeIn 0.5s ease both",
            }}>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, color: NAVY, marginBottom: 8 }}>You're on the list.</div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#8A7D6B", lineHeight: 1.65 }}>
                We'll be in touch before launch. Welcome to Kova.
              </div>
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 2, marginTop: 64 }}>
            {[["4","Modules"],["18","Ingredients"],["0","Blends"]].map(([val, label]) => (
              <div key={label} style={{ padding: "24px 16px", background: "#FFFFFF", border: `1px solid ${BORDER}`, textAlign: "center" }}>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 44, fontWeight: 700, color: GOLD, lineHeight: 1 }}>{val}</div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: 2, color: "#A8A099", marginTop: 6, textTransform: "uppercase" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        padding: "32px 48px",
        borderTop: `1px solid ${BORDER}`,
        background: "#EDE8DF",
        display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12,
      }}>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 700, letterSpacing: 6, color: NAVY }}>KOVA</div>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#8A7D6B", fontStyle: "italic" }}>Formulated by medicine. Built for life.</div>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: "#C4BDB0", letterSpacing: 2 }}>© 2026 KOVA CLINICAL · KOVACLINICAL.COM</div>
      </footer>
    </div>
  );
}
