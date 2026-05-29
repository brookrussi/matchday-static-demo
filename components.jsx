// components.jsx — shared UI atoms

const { useState, useEffect, useRef, useMemo } = React;

// ─── Flag (geometric SVG) ───
function Flag({ team, size = 'md' }) {
  if (!team || team === 'TBD' || typeof team === 'string') {
    return (
      <div className={`flag ${size === 'lg' ? 'lg' : size === 'sm' ? 'sm' : ''}`}
           style={{ background: 'repeating-linear-gradient(45deg, #cdc0a0, #cdc0a0 4px, #e0d4b8 4px, #e0d4b8 8px)' }} />
    );
  }
  const t = team;
  const { type, colors } = t.flag;
  return (
    <div className={`flag ${size === 'lg' ? 'lg' : size === 'sm' ? 'sm' : ''}`}>
      <FlagSvg type={type} colors={colors} />
    </div>
  );
}

function FlagSvg({ type, colors }) {
  if (type === 'vstripes') {
    return (
      <svg viewBox="0 0 30 20" preserveAspectRatio="none" style={{ width: '100%', height: '100%', display: 'block' }}>
        {colors.map((c, i) => (
          <rect key={i} x={i * (30 / colors.length)} y="0" width={30 / colors.length} height="20" fill={c} />
        ))}
      </svg>
    );
  }
  if (type === 'hstripes') {
    return (
      <svg viewBox="0 0 30 20" preserveAspectRatio="none" style={{ width: '100%', height: '100%', display: 'block' }}>
        {colors.map((c, i) => (
          <rect key={i} y={i * (20 / colors.length)} x="0" height={20 / colors.length} width="30" fill={c} />
        ))}
      </svg>
    );
  }
  if (type === 'cross') {
    const [bg, fg] = colors;
    return (
      <svg viewBox="0 0 30 20" preserveAspectRatio="none" style={{ width: '100%', height: '100%', display: 'block' }}>
        <rect width="30" height="20" fill={bg} />
        <rect x="9" y="0" width="4" height="20" fill={fg} />
        <rect x="0" y="8" width="30" height="4" fill={fg} />
      </svg>
    );
  }
  if (type === 'diag') {
    const [a, b] = colors;
    return (
      <svg viewBox="0 0 30 20" preserveAspectRatio="none" style={{ width: '100%', height: '100%', display: 'block' }}>
        <rect width="30" height="20" fill={a} />
        <polygon points="0,0 30,0 0,20" fill={b} />
      </svg>
    );
  }
  if (type === 'circle') {
    const [bg, dot] = colors;
    return (
      <svg viewBox="0 0 30 20" preserveAspectRatio="none" style={{ width: '100%', height: '100%', display: 'block' }}>
        <rect width="30" height="20" fill={bg} />
        <circle cx="15" cy="10" r="5" fill={dot} />
      </svg>
    );
  }
  return null;
}

// ─── Avatar ───
function Avatar({ member, size = 'md' }) {
  if (!member) return null;
  return (
    <div
      className={`avatar ${size === 'lg' ? 'lg' : size === 'xl' ? 'xl' : size === 'sm' ? 'sm' : ''}`}
      style={{ background: member.avatarBg || '#e0d4b8', color: member.avatarFg || '#1c1c1a' }}
      title={member.name}
    >
      {member.initials}
    </div>
  );
}

function AvatarStack({ memberIds, max = 4, size = 'md' }) {
  const list = memberIds.map(id => POD_MEMBER_BY_ID[id]).filter(Boolean);
  const shown = list.slice(0, max);
  const overflow = list.length - shown.length;
  return (
    <div className="avatar-stack">
      {shown.map(m => <Avatar key={m.id} member={m} size={size} />)}
      {overflow > 0 && (
        <div className={`avatar ${size === 'sm' ? 'sm' : ''}`}
             style={{ background: 'var(--parchment-darker)', color: 'var(--ink)', marginLeft: -8 }}>
          +{overflow}
        </div>
      )}
    </div>
  );
}

// ─── Badge ───
function Badge({ children, variant = 'default' }) {
  return <span className={`badge ${variant}`}>{children}</span>;
}

// ─── Icons (drawn inline so they're tunable) ───
const Icon = {
  home: (s = 18) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 11l9-8 9 8" /><path d="M5 10v10h14V10" />
    </svg>
  ),
  calendar: (s = 18) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="16" rx="1" /><path d="M3 10h18" /><path d="M8 3v4M16 3v4" />
    </svg>
  ),
  group: (s = 18) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="9" r="3" /><circle cx="17" cy="10" r="2.5" /><path d="M3 19c.5-3 3-5 6-5s5.5 2 6 5" /><path d="M15 18c.3-2 1.8-3.5 4-3.5" />
    </svg>
  ),
  person: (s = 18) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="9" r="4" /><path d="M4 21c1-4.5 4-7 8-7s7 2.5 8 7" />
    </svg>
  ),
  chevronDown: (s = 14) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  ),
  chevronRight: (s = 14) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 6 15 12 9 18" />
    </svg>
  ),
  back: (s = 18) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 6 9 12 15 18" />
    </svg>
  ),
  check: (s = 14) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="5 12 10 17 19 7" />
    </svg>
  ),
  plus: (s = 14) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  close: (s = 16) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="6" y1="6" x2="18" y2="18" /><line x1="6" y1="18" x2="18" y2="6" />
    </svg>
  ),
  search: (s = 16) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7" /><line x1="16" y1="16" x2="21" y2="21" />
    </svg>
  ),
  share: (s = 16) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="6" cy="12" r="2.5" /><circle cx="18" cy="6" r="2.5" /><circle cx="18" cy="18" r="2.5" />
      <line x1="8" y1="11" x2="16" y2="7" /><line x1="8" y1="13" x2="16" y2="17" />
    </svg>
  ),
  pin: (s = 14) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s7-7 7-12a7 7 0 0 0-14 0c0 5 7 12 7 12z" /><circle cx="12" cy="10" r="2.5" />
    </svg>
  ),
  ball: (s = 18) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="9" />
      <polygon points="12,7 16,10 14.5,15 9.5,15 8,10" fill="currentColor" stroke="none" />
      <line x1="12" y1="3" x2="12" y2="7" /><line x1="20.5" y1="9" x2="16" y2="10" />
      <line x1="3.5" y1="9" x2="8" y2="10" /><line x1="6" y1="20" x2="9.5" y2="15" />
      <line x1="18" y1="20" x2="14.5" y2="15" />
    </svg>
  ),
  trophy: (s = 18) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 4h8v6a4 4 0 01-8 0V4z" /><path d="M8 6H5a2 2 0 002 4M16 6h3a2 2 0 01-2 4" />
      <path d="M12 14v3M9 20h6M10 17h4v3h-4z" />
    </svg>
  ),
};

// ─── Wordmark ───
function Wordmark({ size = 28, color }) {
  return (
    <div style={{
      fontFamily: 'var(--font-display)',
      fontSize: size,
      letterSpacing: '0.02em',
      color: color || 'var(--chalk)',
      lineHeight: 1,
      display: 'inline-flex', alignItems: 'baseline', gap: size * 0.06,
    }}>
      <span>MATCH</span>
      <span style={{ color: 'var(--sienna)' }}>·</span>
      <span>DAY</span>
    </div>
  );
}

// ─── Match Card ───
function MatchCard({
  match, podId, watching, onClick, onToggleWatch, onPredict,
  variant = 'default', // 'default' | 'compact' | 'hero'
}) {
  const isTbd = match.home === 'TBD';
  const home = isTbd ? null : TEAM_BY_ID[match.home];
  const away = isTbd ? null : TEAM_BY_ID[match.away];
  const labels = matchLabels(match);
  const finalMatch = isFinal(match);
  const live = isLive(match);
  const locked = isLocked(match.kickoff_utc) && !finalMatch;
  const userTz = 'America/New_York';
  const { day, time } = fmtKickoff(match.kickoff_utc, userTz);
  const rel = relativeDay(match.kickoff_utc, userTz);

  const watchers = podId ? (POD_WATCHING[match.id] || []) : [];
  const everyoneIn = podId && watchers.length === PODS.find(p => p.id === podId).members.length;

  const votes = podId ? VENUE_VOTES[`${podId}:${match.id}`] : null;
  const topVote = votes ? [...votes.options].sort((a, b) => b.voters.length - a.voters.length)[0] : null;
  const totalVotes = votes ? votes.options.reduce((s, o) => s + o.voters.length, 0) : 0;

  const myPrediction = podId ? PREDICTIONS[`${podId}:${match.id}:me`] : null;

  // Stage label
  const stageLabel = match.stage === 'group' ? `Group ${match.group}` :
                     match.stage === 'round_of_16' ? 'Round of 16' :
                     match.stage === 'quarterfinal' ? 'Quarterfinal' :
                     match.stage === 'semifinal' ? 'Semifinal' :
                     match.stage === 'final' ? 'Final' : match.stage;

  return (
    <div className="paper card" onClick={onClick}
      style={{
        padding: '14px 14px 12px',
        marginBottom: 14,
        cursor: onClick ? 'pointer' : 'default',
      }}>
      {/* Top row: badges + time */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
        <Badge>{stageLabel}</Badge>
        {labels.slice(0, 1).map(l => (
          <Badge key={l} variant={l === 'UPSET WATCH' ? 'gold' : l === 'BIG MATCH' ? 'sienna' : 'default'}>{l}</Badge>
        ))}
        {everyoneIn && !finalMatch && <Badge variant="sky">Everyone's in</Badge>}
        {locked && <Badge variant="red">Locked</Badge>}
        {finalMatch && <Badge variant="dark">Final</Badge>}
        <div style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--slate)', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>
          {rel ? <strong style={{ color: 'var(--ink)' }}>{rel}</strong> : day} · {time}
        </div>
      </div>

      {/* Teams row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        {/* Home */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 8, minWidth: 0, overflow: 'hidden' }}>
          <Flag team={home} />
          <div className="display" style={{
            fontSize: 19, color: 'var(--ink)', lineHeight: 1,
            maxWidth: '100%',
            wordBreak: 'break-word',
            hyphens: 'auto',
          }}>
            {isTbd ? <span style={{ color: 'var(--slate)', fontSize: 12 }}>{match.tbdLabel?.[0] || 'TBD'}</span> : home.name}
          </div>
        </div>
        {/* Score or vs */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 44 }}>
          {finalMatch ? (
            <div style={{ display: 'flex', gap: 6, alignItems: 'baseline' }}>
              <span className="display" style={{ fontSize: 34, color: 'var(--ink)' }}>{match.result.h}</span>
              <span className="display" style={{ fontSize: 20, color: 'var(--slate)' }}>—</span>
              <span className="display" style={{ fontSize: 34, color: 'var(--ink)' }}>{match.result.a}</span>
            </div>
          ) : live ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <Badge variant="red">Live</Badge>
            </div>
          ) : (
            <div className="mono allcaps" style={{ fontSize: 11, color: 'var(--slate)' }}>vs</div>
          )}
        </div>
        {/* Away */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, minWidth: 0, overflow: 'hidden' }}>
          <Flag team={away} />
          <div className="display" style={{
            fontSize: 19, color: 'var(--ink)', lineHeight: 1,
            maxWidth: '100%',
            textAlign: 'right',
            wordBreak: 'break-word',
            hyphens: 'auto',
          }}>
            {isTbd ? <span style={{ color: 'var(--slate)', fontSize: 12 }}>{match.tbdLabel?.[1] || 'TBD'}</span> : away.name}
          </div>
        </div>
      </div>

      {/* Watchers row */}
      {podId && watchers.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <AvatarStack memberIds={watchers} max={5} size="sm" />
          <div style={{ fontSize: 11, color: 'var(--slate)', letterSpacing: '0.05em' }}>
            {watchers.length} watching
          </div>
        </div>
      )}

      {/* Venue summary */}
      {podId && watching && (
        <div style={{
          fontSize: 12, color: 'var(--ink)',
          padding: '8px 10px',
          background: 'var(--parchment-dark)',
          border: '1px dashed var(--ink)',
          borderRadius: 4,
          marginBottom: 12,
          display: 'flex', alignItems: 'center', gap: 8,
          whiteSpace: 'nowrap', overflow: 'hidden',
        }}>
          <span style={{ color: 'var(--slate)', flexShrink: 0 }}>{Icon.pin(12)}</span>
          {totalVotes > 0 && topVote ? (
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
              <strong>{topVote.label}</strong> · {topVote.voters.length} {topVote.voters.length === 1 ? 'vote' : 'votes'}
            </span>
          ) : (
            <span style={{ color: 'var(--slate)' }}>Vote on where to watch</span>
          )}
        </div>
      )}

      {/* Actions row */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <button
          className={`btn ${watching ? 'dark' : 'primary'} sm`}
          disabled={locked || finalMatch || live}
          onClick={(e) => { e.stopPropagation(); onToggleWatch && onToggleWatch(); }}
        >
          {finalMatch ? 'Watched' :
           watching ? <>{Icon.check(12)} Watching</> :
           <>{Icon.plus(12)} Add</>}
        </button>
        {watching && !finalMatch && !locked && (
          myPrediction ? (
            <div style={{
              marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '6px 10px',
              background: 'var(--gold)',
              border: '1.5px solid var(--ink)',
              borderRadius: 4,
              boxShadow: 'var(--shadow-button)',
              fontFamily: 'var(--font-display)',
              fontSize: 16,
              letterSpacing: '0.04em',
            }}>
              <span style={{ fontSize: 9, fontFamily: 'var(--font-mono)', letterSpacing: '0.12em', color: 'var(--ink)' }}>YOU</span>
              {myPrediction.h}–{myPrediction.a}
            </div>
          ) : (
            <button className="btn sm gold" onClick={(e) => { e.stopPropagation(); onPredict && onPredict(); }}
              style={{ marginLeft: 'auto' }}>
              Predict
            </button>
          )
        )}
        {watching && finalMatch && myPrediction && (() => {
          const pts = calcPoints(myPrediction, match.result);
          return (
            <div style={{
              marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 8,
              fontSize: 11, color: 'var(--slate)', letterSpacing: '0.06em'
            }}>
              <span>You: {myPrediction.h}–{myPrediction.a}</span>
              <span style={{
                padding: '3px 7px',
                background: pts === 3 ? 'var(--gold)' : pts === 1 ? 'var(--sky)' : 'var(--parchment-dark)',
                border: '1px solid var(--ink)',
                borderRadius: 3,
                fontFamily: 'var(--font-display)', fontSize: 14, letterSpacing: '0.04em',
                color: 'var(--ink)',
              }}>+{pts} {pts === 1 ? 'pt' : 'pts'}</span>
            </div>
          );
        })()}
      </div>
    </div>
  );
}

// ─── Bottom navigation ───
function BottomNav({ active, onChange }) {
  const items = [
    { id: 'dashboard', label: 'Home',     icon: Icon.home },
    { id: 'schedule',  label: 'Schedule', icon: Icon.calendar },
    { id: 'pods',      label: 'Pods',     icon: Icon.group },
    { id: 'profile',   label: 'You',      icon: Icon.person },
  ];
  return (
    <div className="bottom-nav">
      {items.map(it => (
        <button key={it.id} className={active === it.id ? 'active' : ''} onClick={() => onChange(it.id)}>
          {it.icon(20)}
          <span>{it.label}</span>
          <div className="nav-dot" />
        </button>
      ))}
    </div>
  );
}

// ─── Section header with rule lines ───
function SectionHeader({ label, action, color = 'var(--chalk)' }) {
  return (
    <div className="section-rule" style={{ color }}>
      <span className="label">{label}</span>
      <span className="line" />
      {action}
    </div>
  );
}

// ─── Number stepper ───
function NumberStepper({ value, onChange, min = 0, max = 12 }) {
  return (
    <div className="stepper">
      <button onClick={() => onChange(Math.max(min, value - 1))}>−</button>
      <div className="val">{value}</div>
      <button onClick={() => onChange(Math.min(max, value + 1))}>+</button>
    </div>
  );
}

Object.assign(window, {
  Flag, FlagSvg, Avatar, AvatarStack, Badge, Icon, Wordmark,
  MatchCard, BottomNav, SectionHeader, NumberStepper,
});
