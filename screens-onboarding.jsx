// screens-onboarding.jsx — Welcome, Team picker, Timezone, Pod creation

const { useState: useState_ob, useEffect: useEffect_ob } = React;

// ─── Screen 0: Welcome ───
function WelcomeScreen({ onSubmit }) {
  const [phone, setPhone] = useState_ob('');
  const [sent, setSent] = useState_ob(false);
  const valid = phone.replace(/\D/g, '').length >= 10;

  return (
    <div className="pitch-bg" style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}>
      {/* Decorative top */}
      <div style={{ paddingTop: 80, paddingInline: 28, color: 'var(--chalk)' }}>
        <div className="mono allcaps" style={{ fontSize: 10, color: 'var(--gold)', marginBottom: 14, letterSpacing: '0.2em' }}>
          ◆ THE MATCHDAY PROGRAMME ◆
        </div>
        <Wordmark size={52} />
        <div className="editorial" style={{ fontStyle: 'italic', fontSize: 18, marginTop: 12, color: 'var(--parchment)', lineHeight: 1.35 }}>
          Your tournament,<br />in good company.
        </div>
      </div>

      {/* Mock crest */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <svg viewBox="0 0 200 200" style={{ width: 200, height: 200, opacity: 0.95 }}>
          <defs>
            <pattern id="grain" patternUnits="userSpaceOnUse" width="4" height="4">
              <rect width="4" height="4" fill="transparent" />
              <circle cx="2" cy="2" r="0.5" fill="rgba(0,0,0,0.1)" />
            </pattern>
          </defs>
          {/* Shield */}
          <path d="M100 10 L180 30 L175 110 Q170 160 100 190 Q30 160 25 110 L20 30 Z"
                fill="var(--parchment)" stroke="var(--ink)" strokeWidth="3" />
          <path d="M100 10 L180 30 L175 110 Q170 160 100 190 Q30 160 25 110 L20 30 Z"
                fill="url(#grain)" />
          {/* Inner border */}
          <path d="M100 24 L168 40 L164 108 Q160 152 100 178 Q40 152 36 108 L32 40 Z"
                fill="none" stroke="var(--ink)" strokeWidth="1.5" opacity="0.4" />
          {/* Center "26" */}
          <text x="100" y="118" textAnchor="middle"
                fontFamily="Bebas Neue, sans-serif" fontSize="72"
                fill="var(--ink)" letterSpacing="0">'26</text>
          {/* Star */}
          <text x="100" y="48" textAnchor="middle"
                fontFamily="DM Mono, monospace" fontSize="10" letterSpacing="0.2em"
                fill="var(--ink)" fontWeight="700">EST. JUNE 2026</text>
          {/* Bottom banner */}
          <rect x="40" y="138" width="120" height="18" fill="var(--sienna)" stroke="var(--ink)" strokeWidth="1.5" />
          <text x="100" y="151" textAnchor="middle"
                fontFamily="DM Mono, monospace" fontSize="9" letterSpacing="0.22em"
                fill="var(--chalk)" fontWeight="700">VOL. ONE</text>
        </svg>
      </div>

      {/* Phone input */}
      <div style={{ padding: '0 22px 56px' }}>
        {sent ? (
          <div className="paper card" style={{ padding: 18, textAlign: 'center' }}>
            <div className="mono allcaps" style={{ fontSize: 10, color: 'var(--sienna)', marginBottom: 6 }}>Magic link sent</div>
            <div className="display" style={{ fontSize: 22, color: 'var(--ink)', marginBottom: 8 }}>
              CHECK YOUR TEXTS
            </div>
            <div style={{ fontSize: 12, color: 'var(--slate)', marginBottom: 16 }}>
              Sent to {phone}. Tap the link to come in.
            </div>
            <button className="btn primary block" onClick={onSubmit}>
              Continue (demo)
            </button>
          </div>
        ) : (
          <>
            <label className="mono allcaps" style={{ fontSize: 10, color: 'var(--gold)', display: 'block', marginBottom: 8 }}>
              YOUR PHONE NUMBER
            </label>
            <input
              className="input"
              type="tel"
              placeholder="(555) 123-4567"
              value={phone}
              onChange={e => setPhone(e.target.value)}
            />
            <button
              className="btn primary block lg"
              style={{ marginTop: 14 }}
              disabled={!valid}
              onClick={() => setSent(true)}
            >
              Send my link
            </button>
            <div style={{ fontSize: 11, color: 'rgba(247,242,232,0.5)', marginTop: 14, textAlign: 'center', letterSpacing: '0.04em' }}>
              No password. We text you a link.
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Screen 1: Onboarding — team selection ───
function OnboardingTeamsScreen({ onNext }) {
  const [selected, setSelected] = useState_ob(new Set(['arg', 'ica', 'mar']));
  const toggle = (id) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelected(next);
  };

  return (
    <div className="pitch-bg" style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '52px 20px 12px', color: 'var(--chalk)' }}>
        <div className="mono allcaps" style={{ fontSize: 10, color: 'var(--gold)', marginBottom: 8 }}>STEP 1 OF 2</div>
        <div className="display" style={{ fontSize: 30, lineHeight: 1, marginBottom: 6 }}>
          WHO ARE YOU<br />FOLLOWING?
        </div>
        <div style={{ fontSize: 13, color: 'rgba(247,242,232,0.7)', letterSpacing: '0.02em' }}>
          Pick at least one. Add more later.
        </div>
      </div>

      <div className="scroll-area" style={{ flex: 1, padding: '8px 16px 110px' }}>
        {['A', 'B', 'C', 'D'].map(grp => (
          <div key={grp} style={{ marginBottom: 18 }}>
            <SectionHeader label={`Group ${grp}`} color="var(--chalk)" />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {TEAMS.filter(t => t.group === grp).map(t => {
                const on = selected.has(t.id);
                return (
                  <button key={t.id} onClick={() => toggle(t.id)} className="paper card"
                    style={{
                      padding: 10,
                      display: 'flex', alignItems: 'center', gap: 10,
                      background: on ? 'var(--sky)' : 'var(--parchment)',
                      borderColor: 'var(--ink)',
                      boxShadow: on ? 'var(--shadow-card-lg)' : 'var(--shadow-card)',
                      transform: on ? 'translate(-2px,-2px)' : 'none',
                      transition: 'transform 100ms, box-shadow 100ms',
                      textAlign: 'left',
                    }}>
                    <Flag team={t} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="display" style={{ fontSize: 16, color: 'var(--ink)', lineHeight: 1 }}>
                        {t.name.toUpperCase()}
                      </div>
                      <div className="mono" style={{ fontSize: 10, color: 'var(--slate)', letterSpacing: '0.1em' }}>
                        FIFA #{t.rank}
                      </div>
                    </div>
                    {on && <div style={{ color: 'var(--ink)' }}>{Icon.check(16)}</div>}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '12px 18px 32px',
        background: 'linear-gradient(to top, var(--pitch) 60%, rgba(26,46,26,0))',
      }}>
        <button className="btn primary block lg" disabled={selected.size === 0} onClick={onNext}>
          Next — {selected.size} {selected.size === 1 ? 'team' : 'teams'} ›
        </button>
      </div>
    </div>
  );
}

// ─── Screen 2: Timezone + Name ───
function OnboardingProfileScreen({ onNext }) {
  const [name, setName] = useState_ob('Riley');
  const [tz, setTz] = useState_ob('America/New_York');

  const tzs = [
    { v: 'America/New_York',   l: 'Eastern Time — New York' },
    { v: 'America/Chicago',    l: 'Central Time — Chicago' },
    { v: 'America/Denver',     l: 'Mountain Time — Denver' },
    { v: 'America/Los_Angeles',l: 'Pacific Time — Los Angeles' },
    { v: 'America/Mexico_City',l: 'Mexico City' },
    { v: 'Europe/London',      l: 'London' },
    { v: 'Europe/Berlin',      l: 'Berlin' },
    { v: 'Asia/Tokyo',         l: 'Tokyo' },
  ];

  return (
    <div className="pitch-bg" style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '52px 22px 12px', color: 'var(--chalk)' }}>
        <div className="mono allcaps" style={{ fontSize: 10, color: 'var(--gold)', marginBottom: 8 }}>STEP 2 OF 2</div>
        <div className="display" style={{ fontSize: 30, lineHeight: 1, marginBottom: 6 }}>
          NAME &amp;<br />HOME GROUND
        </div>
        <div style={{ fontSize: 13, color: 'rgba(247,242,232,0.7)' }}>
          So we put kickoff times in your clock.
        </div>
      </div>

      <div style={{ flex: 1, padding: '18px 22px', display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div>
          <label className="mono allcaps" style={{ fontSize: 10, color: 'var(--chalk)', display: 'block', marginBottom: 8 }}>
            DISPLAY NAME
          </label>
          <input className="input" value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div>
          <label className="mono allcaps" style={{ fontSize: 10, color: 'var(--chalk)', display: 'block', marginBottom: 8 }}>
            TIMEZONE
          </label>
          <select className="input" value={tz} onChange={e => setTz(e.target.value)}
                  style={{ appearance: 'none' }}>
            {tzs.map(t => <option key={t.v} value={t.v}>{t.l}</option>)}
          </select>
          <div style={{ fontSize: 11, color: 'rgba(247,242,232,0.5)', marginTop: 6, lineHeight: 1.5 }}>
            We use this to show you kickoff times correctly. We don't track your location.
          </div>
        </div>
      </div>

      <div style={{ padding: '12px 22px 32px' }}>
        <button className="btn primary block lg" disabled={!name || !tz} onClick={onNext}>
          Build my dashboard ›
        </button>
      </div>
    </div>
  );
}

// ─── Screen 3: Pod creation ───
function PodCreationScreen({ onDone, onSkip }) {
  const [podName, setPodName] = useState_ob('The Offside Trap');
  const [created, setCreated] = useState_ob(false);

  if (created) {
    return (
      <div className="pitch-bg" style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '52px 22px 0', color: 'var(--chalk)' }}>
          <div className="mono allcaps" style={{ fontSize: 10, color: 'var(--gold)', marginBottom: 8 }}>POD CREATED</div>
          <div className="display" style={{ fontSize: 30, lineHeight: 1, marginBottom: 14 }}>
            {podName.toUpperCase()}
          </div>
        </div>
        <div style={{ flex: 1, padding: '18px 22px' }}>
          <div className="paper card" style={{ padding: 16 }}>
            <div className="mono allcaps" style={{ fontSize: 10, color: 'var(--slate)', marginBottom: 4 }}>INVITE LINK</div>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--ink)',
              padding: 10,
              background: 'var(--parchment-dark)',
              borderRadius: 4,
              wordBreak: 'break-all',
              marginBottom: 12,
              border: '1px dashed var(--ink)',
            }}>
              matchday.app/join/k3p–9q42
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn primary" style={{ flex: 1 }}>
                {Icon.share(13)} Copy link
              </button>
              <button className="btn dark" style={{ flex: 1 }}>
                Text it
              </button>
            </div>
          </div>
          <div className="editorial" style={{
            fontStyle: 'italic',
            color: 'var(--parchment)',
            fontSize: 15,
            marginTop: 22,
            lineHeight: 1.5,
            textAlign: 'center',
          }}>
            "A pod's just a group of mates with opinions. Invite the loud ones first."
          </div>
        </div>
        <div style={{ padding: '12px 22px 32px' }}>
          <button className="btn primary block lg" onClick={onDone}>
            Into the dashboard ›
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pitch-bg" style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '52px 22px 12px', color: 'var(--chalk)' }}>
        <div className="mono allcaps" style={{ fontSize: 10, color: 'var(--gold)', marginBottom: 8 }}>NEW POD</div>
        <div className="display" style={{ fontSize: 32, lineHeight: 1, marginBottom: 6 }}>
          CREATE<br />YOUR CREW
        </div>
        <div style={{ fontSize: 13, color: 'rgba(247,242,232,0.7)' }}>
          A pod is your private group for watching, voting and predicting together.
        </div>
      </div>

      <div style={{ flex: 1, padding: '24px 22px' }}>
        <label className="mono allcaps" style={{ fontSize: 10, color: 'var(--chalk)', display: 'block', marginBottom: 8 }}>
          POD NAME
        </label>
        <input className="input" value={podName} onChange={e => setPodName(e.target.value)}
               placeholder="The Offside Trap" />
        <div style={{ marginTop: 18, fontSize: 11, color: 'rgba(247,242,232,0.5)', lineHeight: 1.6 }}>
          We'll generate an invite link you can share. Anyone with the link joins the pod.
        </div>
      </div>

      <div style={{ padding: '12px 22px 32px' }}>
        <button className="btn primary block lg" disabled={!podName.trim()} onClick={() => setCreated(true)}>
          Create pod ›
        </button>
        <button className="btn ghost block" onClick={onSkip} style={{ marginTop: 6, color: 'rgba(247,242,232,0.6)' }}>
          I'll do this later
        </button>
      </div>
    </div>
  );
}

Object.assign(window, { WelcomeScreen, OnboardingTeamsScreen, OnboardingProfileScreen, PodCreationScreen });
