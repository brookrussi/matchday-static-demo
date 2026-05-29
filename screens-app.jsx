// screens-app.jsx — Dashboard, Leaderboard, Match Detail, Schedule, Pods, Profile

const { useState: useStateApp, useMemo: useMemoApp, useEffect: useEffectApp, useRef: useRefApp } = React;

// ═══════════════════════════════════════════════════════════════════════
// DASHBOARD
// ═══════════════════════════════════════════════════════════════════════
function DashboardScreen({
  activePodId, onSwitchPod, openMatch, watched, onToggleWatch, onPredict,
  tab, setTab, onOpenLeaderboardDetail,
}) {
  const pod = PODS.find(p => p.id === activePodId);
  const userTz = 'America/New_York';
  const watchedIds = watched[activePodId] || [];

  // Sort: upcoming first by kickoff, then live, then past (collapsed at bottom)
  const matchEntries = watchedIds
    .map(id => MATCHES.find(m => m.id === id))
    .filter(Boolean)
    .sort((a, b) => new Date(a.kickoff_utc) - new Date(b.kickoff_utc));

  const upcoming = matchEntries.filter(m => !isFinal(m));
  const past = matchEntries.filter(m => isFinal(m));

  // Overlap card: next match where ≥2 pod members are watching
  const overlap = upcoming.find(m => (POD_WATCHING[m.id] || []).length >= 2);

  return (
    <>
      {/* App header */}
      <div style={{ padding: '54px 18px 14px', color: 'var(--chalk)' }}>
        <button onClick={onSwitchPod} style={{
          display: 'flex', alignItems: 'center', gap: 6,
          color: 'rgba(247,242,232,0.7)', fontSize: 10,
          letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 4,
        }}>
          ACTIVE POD {Icon.chevronDown(11)}
        </button>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 10 }}>
          <div className="display" style={{ fontSize: 26, lineHeight: 0.95, color: 'var(--chalk)', flex: 1, minWidth: 0, overflowWrap: 'break-word' }}>
            {pod.name}
          </div>
          <div style={{ fontSize: 10, color: 'rgba(247,242,232,0.55)', letterSpacing: '0.08em', whiteSpace: 'nowrap', paddingBottom: 4, textTransform: 'uppercase' }}>
            {pod.members.length} members
          </div>
        </div>

        {/* Tab toggle: Matches / Leaderboard */}
        <div style={{ marginTop: 16, display: 'flex', gap: 8, alignItems: 'center' }}>
          <div className="tab-toggle">
            <button className={tab === 'matches' ? 'active' : ''} onClick={() => setTab('matches')}>Matches</button>
            <button className={tab === 'leaderboard' ? 'active' : ''} onClick={() => setTab('leaderboard')}>Leaderboard</button>
          </div>
          <div style={{ marginLeft: 'auto', fontSize: 10, color: 'rgba(247,242,232,0.5)', letterSpacing: '0.1em', whiteSpace: 'nowrap' }}>
            FRI · JUN 19
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="scroll-area" style={{ flex: 1, padding: '8px 16px 110px' }}>
        {tab === 'matches' ? (
          <DashboardMatchesTab
            overlap={overlap}
            upcoming={upcoming}
            past={past}
            activePodId={activePodId}
            watched={watchedIds}
            openMatch={openMatch}
            onToggleWatch={onToggleWatch}
            onPredict={onPredict}
          />
        ) : (
          <LeaderboardTab podId={activePodId} onOpenDetail={onOpenLeaderboardDetail} />
        )}
      </div>
    </>
  );
}

function DashboardMatchesTab({ overlap, upcoming, past, activePodId, watched, openMatch, onToggleWatch, onPredict }) {
  return (
    <>
      {/* Overlap hero card */}
      {overlap && (
        <div className="card lg-shadow paper" style={{
          padding: 14,
          background: 'var(--gold)',
          marginBottom: 18,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <span className="badge dark">UP NEXT TOGETHER</span>
            <div className="mono allcaps" style={{ marginLeft: 'auto', fontSize: 10, color: 'var(--ink)' }}>
              {fmtKickoff(overlap.kickoff_utc, 'America/New_York').day} · {fmtKickoff(overlap.kickoff_utc, 'America/New_York').time}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <Flag team={TEAM_BY_ID[overlap.home]} size="lg" />
            <div style={{ flex: 1 }}>
              <div className="display" style={{ fontSize: 24, lineHeight: 1, color: 'var(--ink)' }}>
                {TEAM_BY_ID[overlap.home].name.toUpperCase()}<br />
                <span style={{ fontSize: 18, color: 'var(--slate)' }}>VS</span><br />
                {TEAM_BY_ID[overlap.away].name.toUpperCase()}
              </div>
            </div>
            <Flag team={TEAM_BY_ID[overlap.away]} size="lg" />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <AvatarStack memberIds={POD_WATCHING[overlap.id] || []} max={5} />
            <div style={{ fontSize: 11, color: 'var(--ink)', letterSpacing: '0.04em', whiteSpace: 'nowrap', textTransform: 'uppercase', fontWeight: 600 }}>
              ALL {PODS.find(p => p.id === activePodId).members.length} ARE IN
            </div>
          </div>
          {(() => {
            const votes = VENUE_VOTES[`${activePodId}:${overlap.id}`];
            const top = votes ? [...votes.options].sort((a, b) => b.voters.length - a.voters.length)[0] : null;
            return (
              <div style={{
                fontSize: 12, color: 'var(--ink)',
                padding: '8px 10px',
                background: 'rgba(28,28,26,0.08)',
                border: '1px dashed var(--ink)',
                borderRadius: 4,
                marginBottom: 12,
              }}>
                {top && top.voters.length > 0 ? (
                  <span><span className="mono allcaps" style={{ fontSize: 9, marginRight: 6 }}>WATCHING AT</span>
                  <strong>{top.label}</strong> · {top.voters.length} {top.voters.length === 1 ? 'vote' : 'votes'}</span>
                ) : (
                  <span style={{ color: 'var(--slate)' }}>No venue picked yet</span>
                )}
              </div>
            );
          })()}
          <button className="btn dark block sm" onClick={() => openMatch(overlap.id)}>
            Open match ›
          </button>
        </div>
      )}

      <SectionHeader label="Your matches" color="rgba(247,242,232,0.85)" />

      {upcoming.length === 0 && past.length === 0 && (
        <div className="paper card" style={{ padding: 22, textAlign: 'center' }}>
          <div className="editorial" style={{ fontStyle: 'italic', fontSize: 18, color: 'var(--ink)', marginBottom: 8 }}>
            Your dashboard is empty.
          </div>
          <div style={{ fontSize: 13, color: 'var(--slate)' }}>
            Browse the schedule and add matches you'll be watching.
          </div>
        </div>
      )}

      {upcoming.map(m => (
        <MatchCard
          key={m.id}
          match={m}
          podId={activePodId}
          watching={watched.includes(m.id)}
          onClick={() => openMatch(m.id)}
          onToggleWatch={() => onToggleWatch(m.id)}
          onPredict={() => onPredict(m.id)}
        />
      ))}

      {past.length > 0 && (
        <>
          <SectionHeader label="Already played" color="rgba(247,242,232,0.5)" />
          <div style={{ opacity: 0.85 }}>
            {past.map(m => (
              <MatchCard
                key={m.id}
                match={m}
                podId={activePodId}
                watching={watched.includes(m.id)}
                onClick={() => openMatch(m.id)}
              />
            ))}
          </div>
        </>
      )}
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// LEADERBOARD TAB
// ═══════════════════════════════════════════════════════════════════════
function LeaderboardTab({ podId, onOpenDetail }) {
  const entries = leaderboard(podId);
  return (
    <>
      <SectionHeader label="The standings" color="rgba(247,242,232,0.85)" />
      <div className="paper card" style={{ padding: 12 }}>
        {entries.map((e, i) => {
          const tag = leaderboardTag(e, i, entries);
          const rank = i + 1;
          const isMe = e.member.isMe;
          return (
            <button key={e.uid} onClick={() => onOpenDetail(e.uid)} style={{
              display: 'grid',
              gridTemplateColumns: '32px 44px 1fr auto',
              alignItems: 'center', gap: 12,
              width: '100%',
              padding: '12px 4px',
              borderBottom: i < entries.length - 1 ? '1px dashed rgba(28,28,26,0.2)' : 'none',
              textAlign: 'left',
            }}>
              {/* Rank */}
              <div className="display" style={{
                fontSize: 28,
                color: rank === 1 ? 'var(--gold-deep)' : 'var(--ink)',
                lineHeight: 1,
                textAlign: 'center',
                fontVariantNumeric: 'tabular-nums',
              }}>
                {rank}
              </div>
              <Avatar member={e.member} size="lg" />
              <div style={{ minWidth: 0 }}>
                <div className="display" style={{
                  fontSize: 17, color: 'var(--ink)', lineHeight: 1,
                  display: 'flex', alignItems: 'center', gap: 6,
                }}>
                  {e.member.name.toUpperCase()}
                  {isMe && <span className="badge sienna" style={{ fontSize: 8, padding: '2px 5px' }}>YOU</span>}
                </div>
                {tag && (
                  <div className="editorial" style={{
                    fontStyle: 'italic', fontSize: 12, color: 'var(--slate)', marginTop: 3,
                  }}>
                    {tag}
                  </div>
                )}
                {!tag && (
                  <div className="mono" style={{ fontSize: 10, color: 'var(--slate)', marginTop: 3, letterSpacing: '0.06em' }}>
                    {e.exact} exact · {e.wins}/{e.predictions} called
                  </div>
                )}
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="display" style={{
                  fontSize: 28, color: 'var(--ink)', lineHeight: 1,
                  fontVariantNumeric: 'tabular-nums',
                }}>{e.pts}</div>
                <div className="mono allcaps" style={{ fontSize: 9, color: 'var(--slate)', letterSpacing: '0.12em' }}>
                  PTS
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="editorial" style={{
        fontStyle: 'italic',
        fontSize: 13,
        color: 'rgba(247,242,232,0.75)',
        marginTop: 18,
        padding: '0 6px',
        lineHeight: 1.5,
      }}>
        Three points for an exact score. One for calling the winner. Nothing for being confidently wrong.
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// MATCH DETAIL
// ═══════════════════════════════════════════════════════════════════════
function MatchDetailScreen({ matchId, activePodId, onBack, watched, onToggleWatch, predictions, setPrediction }) {
  const match = MATCHES.find(m => m.id === matchId);
  if (!match) return null;
  const isTbd = match.home === 'TBD';
  const home = isTbd ? null : TEAM_BY_ID[match.home];
  const away = isTbd ? null : TEAM_BY_ID[match.away];
  const watching = (watched[activePodId] || []).includes(match.id);
  const finalMatch = isFinal(match);
  const userTz = 'America/New_York';
  const { day, time } = fmtKickoff(match.kickoff_utc, userTz);
  const locked = isLocked(match.kickoff_utc) && !finalMatch;

  const minsLeft = minutesUntil(match.kickoff_utc);
  const hrsLeft = Math.floor(minsLeft / 60);
  const minsTo = minsLeft % 60;
  const labels = matchLabels(match);

  // Prediction state
  const predKey = `${activePodId}:${match.id}:me`;
  const myPrediction = predictions[predKey];
  const [predHome, setPredHome] = useStateApp(myPrediction?.h ?? 1);
  const [predAway, setPredAway] = useStateApp(myPrediction?.a ?? 1);
  const [showCalSheet, setShowCalSheet] = useStateApp(false);
  const [showVenuePropose, setShowVenuePropose] = useStateApp(false);

  // Venue votes (read from constant, with override layer)
  const [venueState, setVenueState] = useStateApp(() => {
    const base = VENUE_VOTES[`${activePodId}:${match.id}`];
    if (base) return JSON.parse(JSON.stringify(base));
    return {
      options: [
        { id: 'v1', label: 'Bar', address: null, voters: [] },
        { id: 'v2', label: "Someone's place", address: null, voters: [] },
        { id: 'v3', label: 'Solo', address: null, voters: [] },
      ],
    };
  });

  const myVote = venueState.options.find(o => o.voters.includes('me'));
  const totalVoters = venueState.options.reduce((s, o) => s + o.voters.length, 0);

  const vote = (optId) => {
    setVenueState(prev => ({
      options: prev.options.map(o => ({
        ...o,
        voters: o.id === optId
          ? (o.voters.includes('me') ? o.voters.filter(v => v !== 'me') : [...o.voters.filter(v => v !== 'me'), 'me'])
          : o.voters.filter(v => v !== 'me'),
      })),
    }));
  };

  // Pod activity (members + predictions)
  const podMembers = PODS.find(p => p.id === activePodId).members;
  const watchingMembers = (POD_WATCHING[match.id] || []).filter(uid => podMembers.includes(uid));

  // Stage label
  const stageLabel = match.stage === 'group' ? `GROUP ${match.group}` :
                     match.stage === 'round_of_16' ? 'ROUND OF 16' :
                     match.stage === 'quarterfinal' ? 'QUARTERFINAL' :
                     match.stage === 'semifinal' ? 'SEMIFINAL' :
                     match.stage === 'final' ? 'FINAL' : match.stage.toUpperCase();

  return (
    <>
      {/* Header */}
      <div className="pitch-bg" style={{ padding: '52px 18px 22px', position: 'relative', flexShrink: 0 }}>
        <button onClick={onBack} style={{ color: 'var(--chalk)', display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          {Icon.back(16)} Back
        </button>

        {/* Stage + labels */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 14, marginBottom: 16 }}>
          <Badge variant="default">{stageLabel}</Badge>
          {labels.map(l => (
            <Badge key={l} variant={l === 'UPSET WATCH' ? 'gold' : l === 'BIG MATCH' ? 'sienna' : 'default'}>{l}</Badge>
          ))}
          {finalMatch && <Badge variant="dark">FINAL</Badge>}
          {locked && <Badge variant="red">LOCKED</Badge>}
        </div>

        {/* Teams */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr auto 1fr',
          alignItems: 'center', gap: 12, color: 'var(--chalk)',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 10, minWidth: 0, overflow: 'hidden' }}>
            <Flag team={home} size="lg" />
            <div className="display" style={{ fontSize: 24, lineHeight: 0.95, wordBreak: 'break-word' }}>
              {isTbd ? (match.tbdLabel?.[0] || 'TBD') : home.name}
            </div>
            {!isTbd && <div className="mono" style={{ fontSize: 10, opacity: 0.7, letterSpacing: '0.1em', whiteSpace: 'nowrap' }}>FIFA #{home.rank}</div>}
          </div>

          {finalMatch ? (
            <div style={{ display: 'flex', gap: 6, alignItems: 'baseline' }}>
              <span className="display" style={{ fontSize: 48, color: 'var(--chalk)' }}>{match.result.h}</span>
              <span className="display" style={{ fontSize: 24, color: 'rgba(247,242,232,0.4)' }}>—</span>
              <span className="display" style={{ fontSize: 48, color: 'var(--chalk)' }}>{match.result.a}</span>
            </div>
          ) : (
            <div className="display" style={{ fontSize: 24, color: 'rgba(247,242,232,0.4)' }}>VS</div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10, minWidth: 0, overflow: 'hidden' }}>
            <Flag team={away} size="lg" />
            <div className="display" style={{ fontSize: 24, lineHeight: 0.95, textAlign: 'right', wordBreak: 'break-word' }}>
              {isTbd ? (match.tbdLabel?.[1] || 'TBD') : away.name}
            </div>
            {!isTbd && <div className="mono" style={{ fontSize: 10, opacity: 0.7, letterSpacing: '0.1em', whiteSpace: 'nowrap' }}>FIFA #{away.rank}</div>}
          </div>
        </div>

        {/* Meta */}
        <div style={{
          marginTop: 18, display: 'flex', justifyContent: 'space-between', gap: 12,
          fontFamily: 'var(--font-mono)', fontSize: 11, color: 'rgba(247,242,232,0.7)',
          padding: '10px 12px',
          background: 'rgba(0,0,0,0.25)',
          borderRadius: 4,
          border: '1px solid rgba(247,242,232,0.15)',
          letterSpacing: '0.05em',
          lineHeight: 1.4,
        }}>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ color: 'var(--gold)', fontSize: 9, marginBottom: 4, whiteSpace: 'nowrap' }}>KICKOFF</div>
            <div style={{ whiteSpace: 'nowrap' }}>{day}</div>
            <div style={{ whiteSpace: 'nowrap' }}>{time}</div>
          </div>
          <div style={{ textAlign: 'right', minWidth: 0, flex: 1 }}>
            <div style={{ color: 'var(--gold)', fontSize: 9, marginBottom: 4, whiteSpace: 'nowrap' }}>VENUE</div>
            <div>{match.venue}</div>
            <div>{match.city}</div>
          </div>
        </div>

        {!finalMatch && !locked && minsLeft > 0 && minsLeft < 60 * 24 * 2 && (
          <div className="editorial" style={{
            marginTop: 12, color: 'var(--gold)', fontSize: 14,
            fontStyle: 'italic', textAlign: 'center',
          }}>
            Kickoff in {hrsLeft > 0 ? `${hrsLeft}h ` : ''}{minsTo}m
          </div>
        )}

        {/* CTA row */}
        <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
          <button className={`btn ${watching ? 'dark' : 'primary'}`}
                  style={{ flex: 1 }}
                  disabled={locked || finalMatch}
                  onClick={() => onToggleWatch(match.id)}>
            {finalMatch ? 'Watched' : watching ? <>{Icon.check(13)} Watching</> : <>{Icon.plus(13)} Add</>}
          </button>
          <button className="btn" onClick={() => setShowCalSheet(true)}>
            {Icon.calendar(13)} Calendar
          </button>
        </div>
      </div>

      {/* Scrollable body on parchment */}
      <div className="scroll-area paper" style={{ flex: 1, minHeight: 0, background: 'var(--parchment)', padding: '18px 16px 170px', borderTop: '1.5px solid var(--ink)' }}>

        {/* Venue voting (only if watching this match) */}
        {watching && !finalMatch && (
          <>
            <SectionHeader label="Where are we watching?" color="var(--ink)" />
            <div className="card" style={{ padding: 6, marginBottom: 16 }}>
              {venueState.options.map((opt, idx) => {
                const mine = opt.voters.includes('me');
                return (
                  <div key={opt.id} style={{
                    display: 'grid', gridTemplateColumns: '1fr auto', gap: 10,
                    padding: '12px 10px',
                    borderBottom: idx < venueState.options.length - 1 ? '1px dashed rgba(28,28,26,0.2)' : 'none',
                    alignItems: 'center',
                  }}>
                    <div style={{ minWidth: 0 }}>
                      <div className="display" style={{ fontSize: 17, color: 'var(--ink)', lineHeight: 1.1 }}>
                        {opt.label.toUpperCase()}
                      </div>
                      {opt.address && (
                        <div style={{ fontSize: 11, color: 'var(--slate)', marginTop: 2, display: 'flex', gap: 4, alignItems: 'center' }}>
                          {Icon.pin(10)} {opt.address}
                        </div>
                      )}
                      <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                        {opt.voters.length > 0 ? (
                          <>
                            <AvatarStack memberIds={opt.voters} max={4} size="sm" />
                            <span className="mono" style={{ fontSize: 10, color: 'var(--slate)', letterSpacing: '0.06em' }}>
                              {opt.voters.length} {opt.voters.length === 1 ? 'vote' : 'votes'}
                            </span>
                          </>
                        ) : (
                          <span className="mono" style={{ fontSize: 10, color: 'var(--slate)', letterSpacing: '0.06em' }}>
                            No votes
                          </span>
                        )}
                      </div>
                    </div>
                    <button className={`btn ${mine ? 'sky' : ''} sm`} onClick={() => vote(opt.id)}>
                      {mine ? <>{Icon.check(11)} Voted</> : 'Vote'}
                    </button>
                  </div>
                );
              })}
              <button className="btn ghost block sm" onClick={() => setShowVenuePropose(true)}
                      style={{ borderTop: '1.5px solid var(--ink)', borderRadius: 0, padding: '12px 10px' }}>
                {Icon.plus(13)} Propose a location
              </button>
            </div>
          </>
        )}

        {/* Score prediction */}
        {watching && !finalMatch && !isTbd && (
          <>
            <SectionHeader label={locked ? 'Your prediction' : 'Predict the score'} color="var(--ink)" />
            {locked || myPrediction?.locked ? (
              <div className="card stamp-in" style={{
                padding: 18, marginBottom: 16,
                background: 'var(--parchment)',
                position: 'relative', overflow: 'hidden',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div className="mono allcaps" style={{ fontSize: 9, color: 'var(--slate)', letterSpacing: '0.18em', marginBottom: 4 }}>
                      RILEY · LOCKED
                    </div>
                    <div className="display" style={{ fontSize: 36, color: 'var(--ink)', lineHeight: 1 }}>
                      {myPrediction?.h ?? predHome} – {myPrediction?.a ?? predAway}
                    </div>
                  </div>
                  <div style={{
                    transform: 'rotate(-12deg)',
                    border: '2.5px solid var(--red-card)',
                    color: 'var(--red-card)',
                    padding: '6px 12px 4px',
                    borderRadius: 4,
                    fontFamily: 'var(--font-display)',
                    fontSize: 22,
                    letterSpacing: '0.06em',
                  }}>
                    LOCKED
                  </div>
                </div>
              </div>
            ) : (
              <div className="card" style={{ padding: 18, marginBottom: 16 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 10, alignItems: 'center' }}>
                  <div style={{ textAlign: 'center' }}>
                    <Flag team={home} />
                    <div className="display" style={{ fontSize: 14, marginTop: 6, color: 'var(--ink)' }}>{home?.short}</div>
                    <div style={{ marginTop: 8 }}>
                      <NumberStepper value={predHome} onChange={setPredHome} />
                    </div>
                  </div>
                  <div className="display" style={{ fontSize: 28, color: 'var(--slate)' }}>—</div>
                  <div style={{ textAlign: 'center' }}>
                    <Flag team={away} />
                    <div className="display" style={{ fontSize: 14, marginTop: 6, color: 'var(--ink)' }}>{away?.short}</div>
                    <div style={{ marginTop: 8 }}>
                      <NumberStepper value={predAway} onChange={setPredAway} />
                    </div>
                  </div>
                </div>
                <button className="btn primary block lg" style={{ marginTop: 16 }}
                        onClick={() => setPrediction(match.id, predHome, predAway)}>
                  Lock in {predHome}–{predAway}
                </button>
                <div style={{ fontSize: 10, color: 'var(--slate)', textAlign: 'center', marginTop: 8, letterSpacing: '0.05em' }}>
                  Locks at kickoff. No edits after.
                </div>
              </div>
            )}
          </>
        )}

        {/* Pod activity */}
        <SectionHeader label="Who's in" color="var(--ink)" />
        <div className="card" style={{ padding: 6, marginBottom: 16 }}>
          {watchingMembers.length === 0 && (
            <div style={{ padding: 14, fontSize: 13, color: 'var(--slate)', textAlign: 'center' }}>
              No one in the pod is watching this yet.
            </div>
          )}
          {watchingMembers.map((uid, i) => {
            const m = POD_MEMBER_BY_ID[uid];
            const pred = PREDICTIONS[`${activePodId}:${match.id}:${uid}`];
            const pts = finalMatch && pred ? calcPoints(pred, match.result) : null;
            return (
              <div key={uid} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 10px',
                borderBottom: i < watchingMembers.length - 1 ? '1px dashed rgba(28,28,26,0.2)' : 'none',
              }}>
                <Avatar member={m} />
                <div style={{ flex: 1 }}>
                  <div className="display" style={{ fontSize: 15, color: 'var(--ink)', lineHeight: 1 }}>
                    {m.name.toUpperCase()}{m.isMe && <span style={{ color: 'var(--slate)', fontSize: 11 }}> · you</span>}
                  </div>
                  {pred ? (
                    <div className="mono" style={{ fontSize: 11, color: 'var(--slate)', marginTop: 3, letterSpacing: '0.04em' }}>
                      Predicted {pred.h}–{pred.a}
                    </div>
                  ) : (
                    <div className="mono" style={{ fontSize: 11, color: 'var(--slate)', marginTop: 3, letterSpacing: '0.04em', fontStyle: 'italic' }}>
                      No prediction yet
                    </div>
                  )}
                </div>
                {pts !== null && (
                  <span className="badge" style={{
                    background: pts === 3 ? 'var(--gold)' : pts === 1 ? 'var(--sky)' : 'var(--parchment-dark)',
                    fontSize: 10,
                  }}>+{pts} {pts === 1 ? 'PT' : 'PTS'}</span>
                )}
              </div>
            );
          })}
        </div>

        {!watching && (
          <div className="paper card" style={{ padding: 16, marginBottom: 16, background: 'var(--parchment-dark)' }}>
            <div className="editorial" style={{ fontStyle: 'italic', fontSize: 15, color: 'var(--ink)', marginBottom: 10 }}>
              Add this match to vote on where you'll watch and lock in a score prediction.
            </div>
            <button className="btn primary block sm" onClick={() => onToggleWatch(match.id)}>
              {Icon.plus(13)} Add to dashboard
            </button>
          </div>
        )}

      </div>

      {/* Calendar sheet */}
      {showCalSheet && (
        <>
          <div className="sheet-backdrop" onClick={() => setShowCalSheet(false)} />
          <div className="sheet">
            <div className="display" style={{ fontSize: 22, color: 'var(--ink)', marginBottom: 4 }}>
              ADD TO CALENDAR
            </div>
            <div style={{ fontSize: 12, color: 'var(--slate)', marginBottom: 14 }}>
              {home?.name || 'TBD'} vs {away?.name || 'TBD'} — {day}
            </div>
            {[
              { label: 'Google Calendar', sub: 'Sign in once, syncs to your calendar' },
              { label: 'Apple Calendar',  sub: 'Downloads .ics file' },
              { label: 'Outlook',         sub: 'Downloads .ics file' },
            ].map(o => (
              <button key={o.label} className="btn block" style={{
                marginBottom: 8, justifyContent: 'space-between', textAlign: 'left',
              }}>
                <span>{o.label}</span>
                {Icon.chevronRight(14)}
              </button>
            ))}
            <button className="btn ghost block" onClick={() => setShowCalSheet(false)} style={{ marginTop: 6 }}>
              Cancel
            </button>
          </div>
        </>
      )}

      {/* Propose venue sheet */}
      {showVenuePropose && (
        <>
          <div className="sheet-backdrop" onClick={() => setShowVenuePropose(false)} />
          <div className="sheet">
            <div className="display" style={{ fontSize: 22, color: 'var(--ink)', marginBottom: 4 }}>
              PROPOSE A LOCATION
            </div>
            <div style={{ fontSize: 12, color: 'var(--slate)', marginBottom: 14 }}>
              Pod members will see this and can vote for it.
            </div>
            <label className="mono allcaps" style={{ fontSize: 10, color: 'var(--ink)', display: 'block', marginBottom: 6 }}>
              Place
            </label>
            <input className="input" placeholder="e.g. The Stag's Head" />
            <div style={{ marginTop: 8, display: 'flex', gap: 6, alignItems: 'center' }}>
              {Icon.search(13)}
              <div style={{ fontSize: 11, color: 'var(--slate)', letterSpacing: '0.04em' }}>
                Powered by Google Places — pick from autocomplete
              </div>
            </div>
            <button className="btn primary block lg" style={{ marginTop: 16 }} onClick={() => setShowVenuePropose(false)}>
              Add option
            </button>
            <button className="btn ghost block" onClick={() => setShowVenuePropose(false)} style={{ marginTop: 4 }}>
              Cancel
            </button>
          </div>
        </>
      )}
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// SCHEDULE  (Schedule list + My Calendar toggle)
// ═══════════════════════════════════════════════════════════════════════

function ScheduleScreen({ activePodId, watched, onToggleWatch, openMatch, onPredict }) {
  const [schedView, setSchedView] = useStateApp('schedule'); // 'schedule' | 'calendar'
  const [filter, setFilter]       = useStateApp('all');
  const [team, setTeam]           = useStateApp(null);
  const [showTeamPicker, setShowTeamPicker] = useStateApp(false);

  const userTz    = 'America/New_York';
  const watchedIds = watched[activePodId] || [];

  // ── schedule list ──
  let list = MATCHES.slice().sort((a, b) => new Date(a.kickoff_utc) - new Date(b.kickoff_utc));
  if (filter === 'today') {
    list = list.filter(m => relativeDay(m.kickoff_utc, userTz) === 'Today');
  } else if (filter === 'week') {
    const wk = 7 * 24 * 3600 * 1000;
    list = list.filter(m => Math.abs(new Date(m.kickoff_utc) - NOW) < wk);
  }
  if (team) list = list.filter(m => m.home === team || m.away === team);

  const grouped = [];
  for (const m of list) {
    const key = new Date(m.kickoff_utc).toLocaleDateString('en-US', {
      timeZone: userTz, weekday: 'long', month: 'short', day: 'numeric',
    });
    const last = grouped[grouped.length - 1];
    if (last && last.key === key) last.matches.push(m);
    else grouped.push({ key, matches: [m] });
  }

  return (
    <>
      {/* ── Fixed header ── */}
      <div style={{ padding: '54px 18px 12px', color: 'var(--chalk)', flexShrink: 0 }}>
        <div className="mono allcaps" style={{ fontSize: 10, color: 'rgba(247,242,232,0.6)', marginBottom: 10 }}>
          THE PROGRAMME
        </div>

        {/* View toggle */}
        <div className="tab-toggle" style={{ width: '100%', marginBottom: 14 }}>
          <button
            className={schedView === 'schedule' ? 'active' : ''}
            onClick={() => setSchedView('schedule')}
            style={{ flex: 1 }}>
            Schedule
          </button>
          <button
            className={schedView === 'calendar' ? 'active' : ''}
            onClick={() => setSchedView('calendar')}
            style={{ flex: 1 }}>
            My Calendar
          </button>
        </div>

        {/* Schedule-only filters */}
        {schedView === 'schedule' && (
          <>
            <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4, marginInline: -18, paddingInline: 18 }}>
              {[
                { id: 'all',   l: 'All' },
                { id: 'today', l: 'Today' },
                { id: 'week',  l: 'This week' },
              ].map(f => (
                <button key={f.id} onClick={() => setFilter(f.id)} style={{
                  padding: '7px 12px',
                  fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600,
                  textTransform: 'uppercase', letterSpacing: '0.1em',
                  background: filter === f.id ? 'var(--gold)' : 'transparent',
                  color:      filter === f.id ? 'var(--ink)' : 'rgba(247,242,232,0.75)',
                  border: '1.5px solid ' + (filter === f.id ? 'var(--ink)' : 'rgba(247,242,232,0.3)'),
                  borderRadius: 4, whiteSpace: 'nowrap',
                  boxShadow: filter === f.id ? 'var(--shadow-button)' : 'none',
                }}>
                  {f.l}
                </button>
              ))}
            </div>
            <button onClick={() => setShowTeamPicker(true)} style={{
              marginTop: 10, display: 'flex', alignItems: 'center', gap: 8,
              padding: '8px 12px',
              background: 'rgba(247,242,232,0.08)',
              border: '1px dashed rgba(247,242,232,0.3)',
              borderRadius: 4, color: 'var(--chalk)', fontSize: 12, width: '100%',
            }}>
              {Icon.search(13)}
              {team ? (
                <>
                  <Flag team={TEAM_BY_ID[team]} size="sm" />
                  <span>{TEAM_BY_ID[team].name}</span>
                  <span onClick={(e) => { e.stopPropagation(); setTeam(null); }}
                        style={{ marginLeft: 'auto', opacity: 0.7 }}>{Icon.close(14)}</span>
                </>
              ) : (
                <span style={{ color: 'rgba(247,242,232,0.55)' }}>Filter by team…</span>
              )}
            </button>
          </>
        )}
      </div>

      {/* ── Body: schedule list OR calendar ── */}
      {schedView === 'calendar' ? (
        <CalendarView watchedIds={watchedIds} activePodId={activePodId} openMatch={openMatch} />
      ) : (
        <div className="scroll-area" style={{ flex: 1, padding: '12px 16px 110px' }}>
          {grouped.length === 0 && (
            <div className="paper card" style={{ padding: 20, textAlign: 'center' }}>
              <div style={{ fontSize: 13, color: 'var(--slate)' }}>No matches match these filters.</div>
            </div>
          )}
          {grouped.map(g => (
            <div key={g.key} style={{ marginBottom: 4 }}>
              <SectionHeader label={g.key} color="rgba(247,242,232,0.7)" />
              {g.matches.map(m => (
                <MatchCard key={m.id} match={m}
                  podId={activePodId}
                  watching={watchedIds.includes(m.id)}
                  onClick={() => openMatch(m.id)}
                  onToggleWatch={() => onToggleWatch(m.id)}
                  onPredict={() => onPredict(m.id)}
                />
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Team picker sheet */}
      {showTeamPicker && (
        <>
          <div className="sheet-backdrop" onClick={() => setShowTeamPicker(false)} />
          <div className="sheet" style={{ maxHeight: '70%', overflowY: 'auto' }}>
            <div className="display" style={{ fontSize: 22, color: 'var(--ink)', marginBottom: 10 }}>
              FILTER BY TEAM
            </div>
            {TEAMS.map(t => (
              <button key={t.id} onClick={() => { setTeam(t.id); setShowTeamPicker(false); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  width: '100%', padding: '10px 6px',
                  borderBottom: '1px dashed rgba(28,28,26,0.15)', textAlign: 'left',
                }}>
                <Flag team={t} />
                <div className="display" style={{ fontSize: 16, color: 'var(--ink)' }}>
                  {t.name.toUpperCase()}
                </div>
                <span className="mono" style={{ marginLeft: 'auto', fontSize: 10, color: 'var(--slate)' }}>
                  GROUP {t.group}
                </span>
              </button>
            ))}
          </div>
        </>
      )}
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// CALENDAR — helpers + components
// ═══════════════════════════════════════════════════════════════════════

function getCalWeekStart(offset) {
  const now = new Date(NOW);
  const day = now.getDay(); // 0=Sun … 6=Sat
  const daysToMon = day === 0 ? -6 : 1 - day;
  const monday = new Date(now);
  monday.setDate(monday.getDate() + daysToMon + offset * 7);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

// ET = UTC-4 (EDT, valid for Jun–Jul 2026)
function getMatchTopPx(kickoffUtc, startHour, pxPerHour) {
  const d = new Date(kickoffUtc);
  let etH = d.getUTCHours() - 4;
  if (etH < 0) etH += 24;
  const etM = d.getUTCMinutes();
  return (etH + etM / 60 - startHour) * pxPerHour;
}

function fmtHourLabel(h) {
  if (h === 0 || h === 24) return '12am';
  if (h === 12) return '12pm';
  return h < 12 ? `${h}am` : `${h - 12}pm`;
}

// ── (MatchChip / DayColumn removed — replaced by inline timeline chips) ──
function _MatchChip_UNUSED({ match, onClick }) {
  const live        = isLive(match);
  const finalMatch  = isFinal(match);
  const isTbd       = match.home === 'TBD';
  const home        = isTbd ? null : TEAM_BY_ID[match.home];
  const away        = isTbd ? null : TEAM_BY_ID[match.away];
  // Short chip time: "7pm", "3:30pm" — strip :00 for round hours
  const chipTime    = new Date(match.kickoff_utc)
    .toLocaleTimeString('en-US', { timeZone: 'America/New_York', hour: 'numeric', minute: '2-digit' })
    .toLowerCase().replace(' ', '').replace(':00', '');

  return (
    <div
      onClick={(e) => { e.stopPropagation(); onClick(match.id); }}
      style={{
        padding: '4px 3px 3px',
        borderRadius: 3,
        background: live ? 'var(--red-card)' : finalMatch ? 'var(--parchment-dark)' : 'var(--parchment)',
        border: `1.5px solid ${live ? '#8a2a20' : 'var(--ink)'}`,
        marginBottom: 3,
        cursor: 'pointer',
        boxShadow: live ? 'none' : '1px 1px 0 var(--ink)',
        animation: live ? 'calLivePulse 1.6s ease-in-out infinite' : 'none',
        overflow: 'hidden',
      }}
    >
      {/* Flag pair */}
      {isTbd ? (
        <div style={{
          height: 11, marginBottom: 2, borderRadius: 1,
          background: 'repeating-linear-gradient(45deg,#cdc0a0 0,#cdc0a0 2px,#e0d4b8 2px,#e0d4b8 4px)',
        }} />
      ) : (
        <div style={{ display: 'flex', gap: 1, marginBottom: 2 }}>
          <div style={{ width: 18, height: 12, flexShrink: 0, borderRadius: 1, overflow: 'hidden', border: '1px solid rgba(0,0,0,0.15)' }}>
            <FlagSvg type={home.flag.type} colors={home.flag.colors} />
          </div>
          <div style={{ width: 18, height: 12, flexShrink: 0, borderRadius: 1, overflow: 'hidden', border: '1px solid rgba(0,0,0,0.15)' }}>
            <FlagSvg type={away.flag.type} colors={away.flag.colors} />
          </div>
        </div>
      )}
      {/* Time / status */}
      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: 9, lineHeight: 1,
        color: live ? 'rgba(247,242,232,0.9)' : 'var(--slate)',
        whiteSpace: 'nowrap', overflow: 'hidden', letterSpacing: '0.01em',
      }}>
        {live ? '● LIVE' : finalMatch ? 'FT' : chipTime}
      </div>
    </div>
  );
}

function _DayColumn_UNUSED({ day, matches, onTapDay, onTapMatch, isToday }) {
  const DAY_ABBR = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const dayNum   = day.getDate();
  const MAX      = 3;
  const overflow = Math.max(0, matches.length - MAX);
  const visible  = matches.slice(0, MAX);

  return (
    <div>
      {/* Day header */}
      <button
        onClick={() => matches.length > 0 && onTapDay()}
        style={{
          width: '100%', textAlign: 'center',
          padding: '5px 1px 7px', marginBottom: 5,
          borderBottom: `2px solid ${isToday ? 'var(--sienna)' : 'rgba(247,242,232,0.15)'}`,
          cursor: matches.length > 0 ? 'pointer' : 'default',
        }}
      >
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 7, textTransform: 'uppercase',
          letterSpacing: '0.1em', marginBottom: 2,
          color: isToday ? 'var(--gold)' : 'rgba(247,242,232,0.42)',
        }}>
          {DAY_ABBR[day.getDay()]}
        </div>
        <div style={{
          fontFamily: 'var(--font-display)', fontSize: 19, lineHeight: 1,
          color: isToday ? 'var(--gold)'
               : matches.length > 0 ? 'var(--chalk)'
               : 'rgba(247,242,232,0.25)',
        }}>
          {dayNum}
        </div>
      </button>

      {/* Match chips */}
      <div style={{ paddingInline: 1 }}>
        {visible.map(m => (
          <MatchChip key={m.id} match={m} onClick={onTapMatch} />
        ))}
        {overflow > 0 && (
          <button onClick={onTapDay} style={{
            width: '100%', padding: '2px 0 3px',
            fontFamily: 'var(--font-mono)', fontSize: 8,
            color: 'var(--gold)', letterSpacing: '0.06em', textAlign: 'center',
          }}>
            +{overflow}
          </button>
        )}
      </div>
    </div>
  );
}

// ── Day detail: full-width list of one day's matches ──
function DayDetailView({ day, matches, activePodId, watchedIds, openMatch, onBack }) {
  const FULL = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const dateLabel = day.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <>
      <div style={{ padding: '12px 16px 14px', borderBottom: '1px solid rgba(247,242,232,0.1)', flexShrink: 0 }}>
        <button onClick={onBack} style={{
          color: 'rgba(247,242,232,0.6)', display: 'flex', alignItems: 'center', gap: 4,
          fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12,
        }}>
          {Icon.back(14)} Week view
        </button>
        <div className="mono allcaps" style={{ fontSize: 9, color: 'rgba(247,242,232,0.45)', letterSpacing: '0.18em', marginBottom: 2 }}>
          {FULL[day.getDay()]}
        </div>
        <div className="display" style={{ fontSize: 26, color: 'var(--chalk)', lineHeight: 1 }}>
          {dateLabel.toUpperCase()}
        </div>
        <div className="mono" style={{ fontSize: 9, color: 'rgba(247,242,232,0.4)', marginTop: 4, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          {matches.length} {matches.length === 1 ? 'match' : 'matches'} · My Calendar
        </div>
      </div>

      <div className="scroll-area" style={{ flex: 1, padding: '14px 14px 110px' }}>
        {matches.length === 0 ? (
          <div style={{ padding: 24, textAlign: 'center' }}>
            <div className="editorial" style={{ fontStyle: 'italic', fontSize: 15, color: 'rgba(247,242,232,0.4)' }}>
              No matches on this day.
            </div>
          </div>
        ) : matches.map(m => (
          <MatchCard
            key={m.id} match={m}
            podId={activePodId}
            watching={watchedIds.includes(m.id)}
            onClick={() => openMatch(m.id)}
          />
        ))}
      </div>
    </>
  );
}

// ── CalendarView: true timeline week view ──
function CalendarView({ watchedIds, activePodId, openMatch }) {
  const PX_PER_HOUR = 64;
  const START_HOUR  = 11; // 11 am ET
  const END_HOUR    = 24; // midnight ET
  const TIME_W      = 34; // width of the time-label column (px)
  const CHIP_H      = 54; // chip height (px) — roughly ~50 min visual slot

  const [weekOffset,     setWeekOffset]     = useStateApp(0);
  const [selectedDayIdx, setSelectedDayIdx] = useStateApp(null);
  const touchStartX = useRefApp(null);
  const userTz = 'America/New_York';

  const weekStart = getCalWeekStart(weekOffset);
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    return d;
  });

  const todayStr = new Date(NOW).toLocaleDateString('en-US', { timeZone: userTz });

  const matchesByDay = days.map(day => {
    const dayStr = day.toLocaleDateString('en-US', { timeZone: userTz });
    return MATCHES
      .filter(m => {
        if (!watchedIds.includes(m.id)) return false;
        return new Date(m.kickoff_utc).toLocaleDateString('en-US', { timeZone: userTz }) === dayStr;
      })
      .sort((a, b) => new Date(a.kickoff_utc) - new Date(b.kickoff_utc));
  });

  const hasAnyMatch = matchesByDay.some(d => d.length > 0);
  const totalH      = (END_HOUR - START_HOUR) * PX_PER_HOUR;

  const weekLabel = (() => {
    const s = weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const e = days[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return `${s} – ${e}`;
  })();

  const onTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd   = (e) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 44) setWeekOffset(w => dx < 0 ? w + 1 : w - 1);
    touchStartX.current = null;
  };

  const hours = Array.from({ length: END_HOUR - START_HOUR }, (_, i) => START_HOUR + i);
  const DAY_ABBR = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

  // ── Day detail ──
  if (selectedDayIdx !== null) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <DayDetailView
          day={days[selectedDayIdx]}
          matches={matchesByDay[selectedDayIdx]}
          activePodId={activePodId}
          watchedIds={watchedIds}
          openMatch={openMatch}
          onBack={() => setSelectedDayIdx(null)}
        />
      </div>
    );
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      {/* ── Week navigator ── */}
      <div style={{
        display: 'flex', alignItems: 'center', padding: '8px 4px',
        borderBottom: '1px solid rgba(247,242,232,0.1)', flexShrink: 0,
      }}>
        <button onClick={() => setWeekOffset(w => w - 1)} style={{ color: 'var(--chalk)', padding: '6px 10px' }}>
          {Icon.back(18)}
        </button>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div className="mono" style={{ fontSize: 8, color: 'rgba(247,242,232,0.36)', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 2 }}>
            My Calendar
          </div>
          <div className="display" style={{ fontSize: 15, color: 'var(--chalk)', lineHeight: 1 }}>
            {weekLabel.toUpperCase()}
          </div>
        </div>
        <button onClick={() => setWeekOffset(w => w + 1)} style={{ color: 'var(--chalk)', padding: '6px 10px' }}>
          {Icon.chevronRight(18)}
        </button>
      </div>

      {/* ── Sticky day-header row ── */}
      <div style={{
        display: 'flex', flexShrink: 0,
        borderBottom: '1.5px solid rgba(247,242,232,0.14)',
      }}>
        {/* spacer aligns with time-label column */}
        <div style={{ width: TIME_W, flexShrink: 0 }} />
        {days.map((day, i) => {
          const isToday = day.toLocaleDateString('en-US', { timeZone: userTz }) === todayStr;
          const hasM    = matchesByDay[i].length > 0;
          return (
            <button key={i}
              onClick={() => hasM && setSelectedDayIdx(i)}
              style={{ flex: 1, textAlign: 'center', padding: '6px 1px 7px', cursor: hasM ? 'pointer' : 'default' }}
            >
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: 7, textTransform: 'uppercase',
                letterSpacing: '0.1em', marginBottom: 2,
                color: isToday ? 'var(--gold)' : 'rgba(247,242,232,0.38)',
              }}>
                {DAY_ABBR[day.getDay()]}
              </div>
              <div style={{
                fontFamily: 'var(--font-display)', fontSize: 18, lineHeight: 1,
                color: isToday ? 'var(--gold)' : hasM ? 'var(--chalk)' : 'rgba(247,242,232,0.22)',
              }}>
                {day.getDate()}
              </div>
            </button>
          );
        })}
      </div>

      {/* ── Scrollable timeline body ── */}
      <div
        style={{ flex: 1, overflowY: 'auto', paddingBottom: 90 }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* Empty state */}
        {!hasAnyMatch && (
          <div style={{ marginTop: 40, padding: '20px', textAlign: 'center' }}>
            <div className="display" style={{ fontSize: 20, color: 'rgba(247,242,232,0.28)', lineHeight: 1, marginBottom: 12 }}>
              NOTHING THIS WEEK
            </div>
            <div className="editorial" style={{ fontStyle: 'italic', fontSize: 13, color: 'rgba(247,242,232,0.45)', lineHeight: 1.6 }}>
              No matches this week —<br />browse the schedule to add some!
            </div>
          </div>
        )}

        {hasAnyMatch && (
          <div style={{ position: 'relative', height: totalH, display: 'flex' }}>

            {/* ── Time labels column ── */}
            <div style={{ width: TIME_W, flexShrink: 0, position: 'relative' }}>
              {hours.map(h => (
                <div key={h} style={{
                  position: 'absolute',
                  top: (h - START_HOUR) * PX_PER_HOUR - 6,
                  right: 5, left: 0,
                  textAlign: 'right',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 8,
                  color: 'rgba(247,242,232,0.35)',
                  lineHeight: 1,
                  whiteSpace: 'nowrap',
                }}>
                  {fmtHourLabel(h)}
                </div>
              ))}
            </div>

            {/* ── Grid area: hour lines + 7 day columns ── */}
            <div style={{ flex: 1, position: 'relative' }}>

              {/* Horizontal hour lines */}
              {hours.map(h => (
                <div key={h} style={{
                  position: 'absolute',
                  top: (h - START_HOUR) * PX_PER_HOUR,
                  left: 0, right: 0, height: 1,
                  background: 'rgba(247,242,232,0.07)',
                  pointerEvents: 'none',
                }} />
              ))}

              {/* 7 day columns absolutely laid out */}
              <div style={{ position: 'absolute', inset: 0, display: 'flex' }}>
                {days.map((day, colIdx) => {
                  const dayMatches = matchesByDay[colIdx];

                  // Group matches by exact kickoff_utc to detect simultaneous games
                  const byTime = {};
                  dayMatches.forEach(m => {
                    const k = m.kickoff_utc;
                    if (!byTime[k]) byTime[k] = [];
                    byTime[k].push(m);
                  });

                  return (
                    <div key={colIdx} style={{
                      flex: 1, position: 'relative',
                      borderLeft: '1px solid rgba(247,242,232,0.06)',
                    }}>
                      {Object.entries(byTime).map(([kickoff, group]) => {
                        const topPx = getMatchTopPx(kickoff, START_HOUR, PX_PER_HOUR);
                        const isSimul = group.length > 1; // simultaneous matches

                        return group.map((m, slotIdx) => {
                          const isTbd = m.home === 'TBD';
                          const home  = isTbd ? null : TEAM_BY_ID[m.home];
                          const away  = isTbd ? null : TEAM_BY_ID[m.away];
                          const live  = isLive(m);
                          const fin   = isFinal(m);

                          // Simultaneous: split column 50/50 side-by-side at same Y
                          const chipLeft  = isSimul ? (slotIdx === 0 ? 1     : '50%' ) : 1;
                          const chipRight = isSimul ? (slotIdx === 0 ? '50%' : 1     ) : 1;

                          return (
                            <div key={m.id}
                              onClick={() => openMatch(m.id)}
                              style={{
                                position: 'absolute',
                                top: topPx + 1,
                                left:  chipLeft,
                                right: chipRight,
                                height: CHIP_H,
                                background: live ? 'var(--red-card)' : fin ? 'var(--parchment-dark)' : 'var(--parchment)',
                                border: `1.5px solid ${live ? '#8a2a20' : 'var(--ink)'}`,
                                borderRadius: 3,
                                padding: '4px 3px 3px',
                                cursor: 'pointer',
                                boxShadow: live ? 'none' : '1px 1px 0 var(--ink)',
                                overflow: 'hidden',
                                animation: live ? 'calLivePulse 1.6s ease-in-out infinite' : 'none',
                                zIndex: live ? 2 : 1,
                              }}
                            >
                              {/* Flags — both when full-width, home-only when half */}
                              {!isTbd && (
                                <div style={{ display: 'flex', gap: 1, marginBottom: 3 }}>
                                  <div style={{ width: 16, height: 11, borderRadius: 1, overflow: 'hidden', border: '1px solid rgba(0,0,0,0.12)', flexShrink: 0 }}>
                                    <FlagSvg type={home.flag.type} colors={home.flag.colors} />
                                  </div>
                                  {!isSimul && (
                                    <div style={{ width: 16, height: 11, borderRadius: 1, overflow: 'hidden', border: '1px solid rgba(0,0,0,0.12)', flexShrink: 0 }}>
                                      <FlagSvg type={away.flag.type} colors={away.flag.colors} />
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* Country abbreviations */}
                              <div style={{ fontFamily: 'var(--font-mono)', overflow: 'hidden', lineHeight: 1.3 }}>
                                {live && (
                                  <div style={{ fontSize: 7, color: 'rgba(247,242,232,0.85)', letterSpacing: '0.04em', marginBottom: 1 }}>
                                    ● LIVE
                                  </div>
                                )}
                                {!isTbd ? (
                                  <>
                                    <div style={{ fontSize: 8, fontWeight: 600, color: live ? 'var(--chalk)' : 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', letterSpacing: '0.02em' }}>
                                      {home.short}
                                    </div>
                                    <div style={{ fontSize: 7.5, color: live ? 'rgba(247,242,232,0.7)' : 'var(--slate)', whiteSpace: 'nowrap', overflow: 'hidden', letterSpacing: '0.02em' }}>
                                      {away.short}
                                    </div>
                                  </>
                                ) : (
                                  <div style={{ fontSize: 7, color: 'var(--slate)' }}>TBD</div>
                                )}
                                {fin && (
                                  <div style={{ fontSize: 7, color: 'var(--sienna)', marginTop: 2, letterSpacing: '0.02em' }}>
                                    {m.result.h}–{m.result.a}
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        });
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// PODS
// ═══════════════════════════════════════════════════════════════════════
function PodsScreen({ activePodId, onSwitchPod, openPodSettings }) {
  return (
    <>
      <div style={{ padding: '54px 18px 14px', color: 'var(--chalk)' }}>
        <div className="mono allcaps" style={{ fontSize: 10, color: 'rgba(247,242,232,0.6)', marginBottom: 4 }}>
          YOUR
        </div>
        <div className="display" style={{ fontSize: 30, lineHeight: 1 }}>PODS</div>
      </div>
      <div className="scroll-area" style={{ flex: 1, padding: '16px 16px 110px' }}>
        {PODS.map(p => {
          const isActive = p.id === activePodId;
          const isAdmin = p.adminId === 'me';
          return (
            <div key={p.id} className="paper card" style={{
              padding: 14, marginBottom: 14,
              background: isActive ? 'var(--gold)' : 'var(--parchment)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                {isActive && <Badge variant="dark">ACTIVE</Badge>}
                {isAdmin && <Badge>ADMIN</Badge>}
              </div>
              <div className="display" style={{ fontSize: 22, color: 'var(--ink)', lineHeight: 1 }}>
                {p.name.toUpperCase()}
              </div>
              <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
                <AvatarStack memberIds={p.members} max={5} size="sm" />
                <span className="mono" style={{ fontSize: 11, color: 'var(--slate)', letterSpacing: '0.06em' }}>
                  {p.members.length} members
                </span>
              </div>
              <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                {!isActive && (
                  <button className="btn primary sm" onClick={() => onSwitchPod(p.id)}>
                    Switch to
                  </button>
                )}
                <button className="btn sm" onClick={() => openPodSettings(p.id)}>
                  Manage
                </button>
              </div>
            </div>
          );
        })}

        <div className="card" style={{
          padding: 16, marginTop: 6,
          background: 'transparent', borderStyle: 'dashed', boxShadow: 'none',
          color: 'var(--chalk)', borderColor: 'rgba(247,242,232,0.4)',
        }}>
          <div className="display" style={{ fontSize: 18, marginBottom: 10 }}>NEW POD?</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn primary sm" style={{ flex: 1 }}>{Icon.plus(13)} Create</button>
            <button className="btn sm" style={{ flex: 1 }}>Join code</button>
          </div>
        </div>
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// POD SETTINGS
// ═══════════════════════════════════════════════════════════════════════
function PodSettingsScreen({ podId, onBack }) {
  const pod = PODS.find(p => p.id === podId);
  const isAdmin = pod.adminId === 'me';
  const [allowInvite, setAllowInvite] = useStateApp(true);

  return (
    <>
      <div className="pitch-bg" style={{ padding: '52px 18px 22px' }}>
        <button onClick={onBack} style={{ color: 'var(--chalk)', display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          {Icon.back(16)} Back
        </button>
        <div className="display" style={{ fontSize: 28, color: 'var(--chalk)', marginTop: 14 }}>
          {pod.name.toUpperCase()}
        </div>
        <div className="mono allcaps" style={{ fontSize: 10, color: 'rgba(247,242,232,0.6)', letterSpacing: '0.12em', marginTop: 4 }}>
          POD SETTINGS
        </div>
      </div>

      <div className="scroll-area" style={{ flex: 1, padding: '18px 16px 110px', background: 'var(--pitch)' }}>
        <SectionHeader label="Members" color="var(--chalk)" />
        <div className="card paper" style={{ padding: 6, marginBottom: 18 }}>
          {pod.members.map((uid, i) => {
            const m = POD_MEMBER_BY_ID[uid];
            const isPodAdmin = pod.adminId === uid;
            return (
              <div key={uid} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 10px',
                borderBottom: i < pod.members.length - 1 ? '1px dashed rgba(28,28,26,0.2)' : 'none',
              }}>
                <Avatar member={m} />
                <div style={{ flex: 1 }}>
                  <div className="display" style={{ fontSize: 16, color: 'var(--ink)', lineHeight: 1 }}>
                    {m.name.toUpperCase()}{m.isMe && <span style={{ color: 'var(--slate)', fontSize: 11 }}> · you</span>}
                  </div>
                  <div style={{ marginTop: 3 }}>
                    {isPodAdmin && <Badge variant="gold">ADMIN</Badge>}
                  </div>
                </div>
                {isAdmin && !m.isMe && (
                  <button className="btn ghost sm" style={{ color: 'var(--slate)' }}>•••</button>
                )}
              </div>
            );
          })}
        </div>

        <SectionHeader label="Invite" color="var(--chalk)" />
        <div className="card paper" style={{ padding: 14, marginBottom: 18 }}>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--ink)',
            padding: 10, background: 'var(--parchment-dark)', borderRadius: 4,
            wordBreak: 'break-all', marginBottom: 10, border: '1px dashed var(--ink)',
          }}>
            matchday.app/join/k3p–9q42
          </div>
          <button className="btn primary block sm">{Icon.share(13)} Copy invite link</button>

          {isAdmin && (
            <div style={{
              marginTop: 14, paddingTop: 14, borderTop: '1px dashed rgba(28,28,26,0.2)',
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <div style={{ flex: 1 }}>
                <div className="display" style={{ fontSize: 15, color: 'var(--ink)', lineHeight: 1 }}>
                  ANYONE CAN INVITE
                </div>
                <div style={{ fontSize: 11, color: 'var(--slate)', marginTop: 4 }}>
                  When off, only admins can share the link.
                </div>
              </div>
              <button onClick={() => setAllowInvite(!allowInvite)} style={{
                width: 48, height: 28, borderRadius: 14,
                background: allowInvite ? 'var(--sky)' : 'var(--parchment-dark)',
                border: '1.5px solid var(--ink)',
                position: 'relative', flexShrink: 0,
              }}>
                <div style={{
                  position: 'absolute', top: 2, left: allowInvite ? 22 : 2,
                  width: 20, height: 20, borderRadius: '50%',
                  background: 'var(--parchment)',
                  border: '1.5px solid var(--ink)',
                  transition: 'left 150ms',
                }} />
              </button>
            </div>
          )}
        </div>

        {isAdmin ? (
          <button className="btn danger block">Delete pod</button>
        ) : (
          <button className="btn block">Leave pod</button>
        )}
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// PROFILE
// ═══════════════════════════════════════════════════════════════════════
function ProfileScreen({ onResetTour }) {
  const [name, setName] = useStateApp('Riley');
  const [tz, setTz] = useStateApp('America/New_York');

  return (
    <>
      <div style={{ padding: '54px 18px 14px', color: 'var(--chalk)' }}>
        <div className="mono allcaps" style={{ fontSize: 10, color: 'rgba(247,242,232,0.6)', marginBottom: 4 }}>
          YOUR
        </div>
        <div className="display" style={{ fontSize: 30, lineHeight: 1 }}>PROFILE</div>
      </div>
      <div className="scroll-area" style={{ flex: 1, padding: '16px 16px 110px' }}>

        {/* Hero */}
        <div className="paper card" style={{ padding: 18, marginBottom: 18, display: 'flex', alignItems: 'center', gap: 14 }}>
          <Avatar member={POD_MEMBER_BY_ID.me} size="xl" />
          <div style={{ flex: 1 }}>
            <div className="display" style={{ fontSize: 24, color: 'var(--ink)', lineHeight: 1 }}>
              {name.toUpperCase()}
            </div>
            <div className="mono" style={{ fontSize: 11, color: 'var(--slate)', marginTop: 4, letterSpacing: '0.05em' }}>
              +1 (555) ··· 4710
            </div>
          </div>
        </div>

        <SectionHeader label="Settings" color="var(--chalk)" />
        <div className="paper card" style={{ padding: 14, marginBottom: 18 }}>
          <div style={{ marginBottom: 14 }}>
            <label className="mono allcaps" style={{ fontSize: 10, color: 'var(--slate)', display: 'block', marginBottom: 6 }}>
              DISPLAY NAME
            </label>
            <input className="input" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label className="mono allcaps" style={{ fontSize: 10, color: 'var(--slate)', display: 'block', marginBottom: 6 }}>
              TIMEZONE
            </label>
            <select className="input" value={tz} onChange={e => setTz(e.target.value)} style={{ appearance: 'none' }}>
              <option value="America/New_York">Eastern Time — New York</option>
              <option value="America/Chicago">Central Time — Chicago</option>
              <option value="America/Los_Angeles">Pacific Time — Los Angeles</option>
              <option value="Europe/London">London</option>
            </select>
            <div style={{ fontSize: 10, color: 'var(--slate)', marginTop: 4, letterSpacing: '0.04em' }}>
              All kickoff times shown in this timezone.
            </div>
          </div>
        </div>

        <SectionHeader label="Calendar" color="var(--chalk)" />
        <div className="paper card" style={{ padding: 14, marginBottom: 18 }}>
          <div className="display" style={{ fontSize: 16, color: 'var(--ink)', lineHeight: 1, marginBottom: 4 }}>
            EXPORT YOUR FIXTURES
          </div>
          <div style={{ fontSize: 12, color: 'var(--slate)', marginBottom: 12 }}>
            Drop every match you're watching into your calendar.
          </div>
          <button className="btn primary block sm">{Icon.calendar(13)} Add all my matches</button>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn block" onClick={onResetTour}>Replay onboarding</button>
        </div>
        <button className="btn ghost block" style={{ marginTop: 14, color: 'rgba(247,242,232,0.6)' }}>
          Sign out
        </button>

        <div className="editorial" style={{ fontStyle: 'italic', fontSize: 12, color: 'rgba(247,242,232,0.5)', marginTop: 22, textAlign: 'center', lineHeight: 1.5 }}>
          v1.0 · "Sienna"<br />
          Made for the love of the group chat.
        </div>
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// POD SWITCHER DRAWER
// ═══════════════════════════════════════════════════════════════════════
function PodSwitcherDrawer({ activePodId, onSwitch, onClose }) {
  return (
    <>
      <div className="sheet-backdrop" onClick={onClose} />
      <div className="drawer">
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 14 }}>
          <div className="mono allcaps" style={{ fontSize: 10, color: 'var(--slate)' }}>
            SWITCH POD
          </div>
          <button onClick={onClose} style={{ marginLeft: 'auto' }}>{Icon.close(18)}</button>
        </div>
        {PODS.map(p => {
          const isActive = p.id === activePodId;
          return (
            <button key={p.id} onClick={() => { onSwitch(p.id); onClose(); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                width: '100%', padding: '12px 6px',
                borderBottom: '1px dashed rgba(28,28,26,0.15)',
                textAlign: 'left',
                background: isActive ? 'var(--parchment-dark)' : 'transparent',
                marginInline: -6, paddingInline: 12,
              }}>
              <div style={{
                width: 8, height: 8, borderRadius: '50%',
                background: isActive ? 'var(--sienna)' : 'transparent',
                border: '1.5px solid var(--ink)',
                flexShrink: 0,
              }} />
              <div style={{ flex: 1 }}>
                <div className="display" style={{ fontSize: 18, color: 'var(--ink)', lineHeight: 1 }}>
                  {p.name.toUpperCase()}
                </div>
                <div className="mono" style={{ fontSize: 10, color: 'var(--slate)', marginTop: 4, letterSpacing: '0.05em' }}>
                  {p.members.length} members
                </div>
              </div>
              <AvatarStack memberIds={p.members.slice(0, 4)} max={3} size="sm" />
            </button>
          );
        })}
        <button className="btn primary block" style={{ marginTop: 14 }}>
          {Icon.plus(13)} Create new pod
        </button>
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// LEADERBOARD DETAIL (member prediction history)
// ═══════════════════════════════════════════════════════════════════════
function LeaderboardDetailSheet({ podId, userId, onClose }) {
  const member = POD_MEMBER_BY_ID[userId];
  const entries = MATCHES
    .filter(m => isFinal(m))
    .map(m => ({ match: m, pred: PREDICTIONS[`${podId}:${m.id}:${userId}`] }))
    .filter(e => e.pred);

  const totalPts = entries.reduce((s, e) => s + (calcPoints(e.pred, e.match.result) || 0), 0);

  return (
    <>
      <div className="sheet-backdrop" onClick={onClose} />
      <div className="sheet" style={{ maxHeight: '78%', overflowY: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
          <Avatar member={member} size="lg" />
          <div style={{ flex: 1 }}>
            <div className="display" style={{ fontSize: 22, color: 'var(--ink)', lineHeight: 1 }}>
              {member.name.toUpperCase()}
            </div>
            <div className="mono" style={{ fontSize: 10, color: 'var(--slate)', marginTop: 4, letterSpacing: '0.05em' }}>
              {totalPts} POINTS · {entries.length} PREDICTIONS
            </div>
          </div>
          <button onClick={onClose}>{Icon.close(20)}</button>
        </div>

        {entries.length === 0 && (
          <div className="editorial" style={{ fontStyle: 'italic', fontSize: 14, color: 'var(--slate)', textAlign: 'center', padding: 14 }}>
            No predictions logged yet.
          </div>
        )}

        {entries.map(({ match, pred }) => {
          const pts = calcPoints(pred, match.result);
          const home = TEAM_BY_ID[match.home];
          const away = TEAM_BY_ID[match.away];
          return (
            <div key={match.id} style={{
              display: 'grid', gridTemplateColumns: '1fr auto', gap: 10, alignItems: 'center',
              padding: '12px 4px',
              borderBottom: '1px dashed rgba(28,28,26,0.15)',
            }}>
              <div>
                <div className="mono allcaps" style={{ fontSize: 9, color: 'var(--slate)', letterSpacing: '0.12em' }}>
                  GROUP {match.group} · FINAL {match.result.h}–{match.result.a}
                </div>
                <div className="display" style={{ fontSize: 15, color: 'var(--ink)', lineHeight: 1.1, marginTop: 3 }}>
                  {home.short} VS {away.short}
                </div>
                <div className="mono" style={{ fontSize: 11, color: 'var(--ink)', marginTop: 3 }}>
                  Predicted {pred.h}–{pred.a}
                </div>
              </div>
              <span className="badge" style={{
                background: pts === 3 ? 'var(--gold)' : pts === 1 ? 'var(--sky)' : 'var(--parchment-dark)',
              }}>+{pts} {pts === 1 ? 'PT' : 'PTS'}</span>
            </div>
          );
        })}
      </div>
    </>
  );
}

Object.assign(window, {
  DashboardScreen, MatchDetailScreen, ScheduleScreen, PodsScreen,
  PodSettingsScreen, ProfileScreen, PodSwitcherDrawer, LeaderboardDetailSheet,
  LeaderboardTab,
});
