// app.jsx — Root orchestrator and routing

const { useState: useStateRoot, useEffect: useEffectRoot, useMemo: useMemoRoot } = React;

// ─── Tweak defaults ───
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "startScreen": "dashboard",
  "accent": "#c4622d",
  "grain": "medium",
  "matchCardVariant": "default"
}/*EDITMODE-END*/;

function App() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // Apply accent via CSS var
  useEffectRoot(() => {
    const root = document.documentElement;
    // Map hex → lighter variant for hover states
    const lightMap = {
      '#c4622d': '#e07a45',
      '#d4a843': '#e0c46c',
      '#3d87b3': '#6baed6',
      '#b03a2e': '#c45a4e',
    };
    root.style.setProperty('--sienna', tweaks.accent);
    root.style.setProperty('--sienna-light', lightMap[tweaks.accent] || tweaks.accent);
    // grain
    const gmap = { off: 0, low: 0.03, medium: 0.06, high: 0.10 };
    root.style.setProperty('--grain-opacity', gmap[tweaks.grain] ?? 0.06);
  }, [tweaks.accent, tweaks.grain]);

  // ─── Routing state ───
  const [screen, setScreen] = useStateRoot(() => {
    // Allow tweak to skip ahead
    if (tweaks.startScreen === 'welcome') return { name: 'welcome' };
    if (tweaks.startScreen === 'onboarding') return { name: 'onboarding-teams' };
    return { name: 'dashboard' };
  });
  const [tab, setTab] = useStateRoot('dashboard'); // bottom nav tab
  const [dashTab, setDashTab] = useStateRoot('matches'); // matches | leaderboard
  const [activePodId, setActivePodId] = useStateRoot('p1');
  const [showPodDrawer, setShowPodDrawer] = useStateRoot(false);
  const [leaderboardDetailFor, setLeaderboardDetailFor] = useStateRoot(null);
  const [toast, setToast] = useStateRoot(null);

  // ─── Mutable watched matches (start from defaults, modify in-session) ───
  const [watched, setWatched] = useStateRoot(() => JSON.parse(JSON.stringify(WATCHED)));
  // ─── Mutable predictions ───
  const [predictions, setPredictions] = useStateRoot(() => JSON.parse(JSON.stringify(PREDICTIONS)));

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  };

  const onToggleWatch = (matchId) => {
    setWatched(prev => {
      const list = prev[activePodId] || [];
      const has = list.includes(matchId);
      const next = { ...prev };
      next[activePodId] = has ? list.filter(id => id !== matchId) : [...list, matchId];
      showToast(has ? 'Removed from dashboard' : 'Added to dashboard');
      return next;
    });
  };

  const onSetPrediction = (matchId, h, a) => {
    const key = `${activePodId}:${matchId}:me`;
    setPredictions(prev => ({ ...prev, [key]: { h, a, locked: false } }));
    showToast(`Locked in ${h}–${a}`);
  };

  const openMatch = (matchId) => setScreen({ name: 'match', matchId });
  const goTab = (id) => {
    setTab(id);
    setScreen({ name: id });
  };

  // Render main app shell (with bottom nav) or full-screen flow
  const mainScreens = new Set(['dashboard', 'schedule', 'pods', 'profile']);
  const showNav = mainScreens.has(screen.name);
  const dark = !mainScreens.has(screen.name) || screen.name === 'dashboard' || screen.name === 'schedule' || screen.name === 'pods' || screen.name === 'profile';

  return (
    <IOSDevice width={402} height={874} dark>
      <div className="app-shell pitch-bg">

        {screen.name === 'welcome' && (
          <WelcomeScreen onSubmit={() => setScreen({ name: 'onboarding-teams' })} />
        )}
        {screen.name === 'onboarding-teams' && (
          <OnboardingTeamsScreen onNext={() => setScreen({ name: 'onboarding-profile' })} />
        )}
        {screen.name === 'onboarding-profile' && (
          <OnboardingProfileScreen onNext={() => setScreen({ name: 'pod-creation' })} />
        )}
        {screen.name === 'pod-creation' && (
          <PodCreationScreen
            onDone={() => { setScreen({ name: 'dashboard' }); setTab('dashboard'); }}
            onSkip={() => { setScreen({ name: 'dashboard' }); setTab('dashboard'); }}
          />
        )}

        {screen.name === 'dashboard' && (
          <DashboardScreen
            activePodId={activePodId}
            onSwitchPod={() => setShowPodDrawer(true)}
            openMatch={openMatch}
            watched={watched}
            onToggleWatch={onToggleWatch}
            onPredict={(id) => openMatch(id)}
            tab={dashTab}
            setTab={setDashTab}
            onOpenLeaderboardDetail={(uid) => setLeaderboardDetailFor(uid)}
          />
        )}
        {screen.name === 'schedule' && (
          <ScheduleScreen
            activePodId={activePodId}
            watched={watched}
            onToggleWatch={onToggleWatch}
            openMatch={openMatch}
            onPredict={(id) => openMatch(id)}
          />
        )}
        {screen.name === 'pods' && (
          <PodsScreen
            activePodId={activePodId}
            onSwitchPod={(id) => { setActivePodId(id); showToast('Active pod switched'); }}
            openPodSettings={(id) => setScreen({ name: 'pod-settings', podId: id })}
          />
        )}
        {screen.name === 'profile' && (
          <ProfileScreen onResetTour={() => setScreen({ name: 'welcome' })} />
        )}

        {screen.name === 'match' && (
          <MatchDetailScreen
            matchId={screen.matchId}
            activePodId={activePodId}
            onBack={() => setScreen({ name: tab })}
            watched={watched}
            onToggleWatch={onToggleWatch}
            predictions={predictions}
            setPrediction={onSetPrediction}
          />
        )}
        {screen.name === 'pod-settings' && (
          <PodSettingsScreen podId={screen.podId} onBack={() => setScreen({ name: 'pods' })} />
        )}

        {/* Bottom nav (only on main screens) */}
        {showNav && (
          <BottomNav active={tab} onChange={goTab} />
        )}

        {/* Pod switcher drawer */}
        {showPodDrawer && (
          <PodSwitcherDrawer
            activePodId={activePodId}
            onSwitch={(id) => { setActivePodId(id); showToast('Active pod switched'); }}
            onClose={() => setShowPodDrawer(false)}
          />
        )}

        {/* Leaderboard detail */}
        {leaderboardDetailFor && (
          <LeaderboardDetailSheet
            podId={activePodId}
            userId={leaderboardDetailFor}
            onClose={() => setLeaderboardDetailFor(null)}
          />
        )}

        {/* Toast */}
        {toast && <div className="toast">{toast}</div>}

        {/* Tweaks panel */}
        <MatchdayTweaks tweaks={tweaks} setTweak={setTweak} />
      </div>
    </IOSDevice>
  );
}

// ─── Tweaks panel ───
function MatchdayTweaks({ tweaks, setTweak }) {
  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Accent">
        <TweakColor
          label="Color"
          value={tweaks.accent}
          options={['#c4622d', '#d4a843', '#3d87b3', '#b03a2e']}
          onChange={(v) => setTweak('accent', v)}
        />
      </TweakSection>
      <TweakSection label="Paper grain">
        <TweakRadio
          label="Intensity"
          value={tweaks.grain}
          options={['off', 'low', 'medium', 'high']}
          onChange={(v) => setTweak('grain', v)}
        />
      </TweakSection>
      <TweakSection label="Jump to">
        <TweakButton label="Restart at welcome" onClick={() => setTweak('startScreen', 'welcome')} />
        <TweakButton label="Open onboarding" onClick={() => setTweak('startScreen', 'onboarding')} />
        <TweakButton label="Open dashboard" onClick={() => setTweak('startScreen', 'dashboard')} />
      </TweakSection>
    </TweaksPanel>
  );
}

Object.assign(window, { App });

// Bootstrap
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
