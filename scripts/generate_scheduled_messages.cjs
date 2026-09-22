const fs = require('fs');
const path = require('path');

// Generate rich, varied, funny, developer-themed messages for TerminalSoul
// Categories: morning, afternoon, evening, night
// Topics: REST, GraphQL, APIs, Node.js, TS, SQL, Redis, Solr, Docker, JIRA, Standups, Git, PRs, CI/CD, Ghost processes, sentient DBs, late night motivation

const morningTemplates = [
  "☀️ SYSTEM BOOT COMPLETE\nGood morning, Abishek. 🧑💻\nBrain.exe is initializing...\nCoffee dependency: REQUIRED ☕😂",
  "🚀 MORNING DEPLOYMENT\nDeveloper instance started successfully.\nKnown issue:\nMotivation has not been detected yet. 😂",
  "🧠 BOOT SEQUENCE\nLoading brain...\nLoading coffee...\nLoading motivation...\nMotivation: 404 Not Found ❌☕",
  "☕ DEPENDENCY INJECTION\nContainer initialized.\nUnresolved dependency: Caffeine 3.0.\nPlease inject espresso before executing code. ☕💻",
  "☀️ STANDUP WARNING\nMorning standup approaching.\nQuick! Prepare to explain how 'investigating' took 8 hours yesterday. 🧑💻😂",
  "💻 FIRST COMMIT OF THE DAY\nGit status: 0 uncommitted changes.\nBrain status: Unallocated memory.\nHappy coding, Abishek! 🚀",
  "🔋 DEVELOPER INITIALIZATION\nHeartbeat: Normal.\nRAM: 16GB.\nBrain RAM: 256MB remaining.\nCoffee required immediately. ☕⚡",
  "☀️ MORNING LOGS\n[INFO] Abishek logged in.\n[WARN] High CPU temperature detected before first line of code.\n[INFO] Standup in T-minus 30 mins. 🏃♂️",
  "🌅 DAWN OF THE PULL REQUEST\nGood morning! Today is a great day to open a PR that breaks staging instantly. ☕🔥",
  "☕ JAVA VIRTUAL COFFEE\nGarbage collection ran overnight.\nAll yesterday's bug memories were swept away.\nFresh stack trace waiting today! 💻✨",
  "☀️ DOCKER DAEMON AWAKE\nContainers are starting up.\nYour brain is still pending healthcheck.\nGrab a cup of coffee and retry! 🐳☕",
  "🧑💻 DEVELOPER STATUS: ONLINE\nSystem ready.\nSlack notifications: Muted.\nFocus mode: 100% until the first meeting ruins it. 😂",
  "☀️ MORNING QUERY\nSELECT motivation FROM brain WHERE day = 'today';\nResult: 0 rows returned. (Re-query after coffee). ☕📊",
  "🚀 SPRINT DAY AWAKE\nSprint goal: Ship 15 tickets.\nReality: Spend morning configuring ESLint rules. 🧑💻😂",
  "☕ CAFFEINE THREAD POOL\nWorker threads: 0 active.\nWaiting on barista dispatch.\nHave a productive morning, Abishek! ☀️",
  "☀️ MORNING MERGE\nNo merge conflicts overnight!\nIt's a miracle.\nEnjoy this peaceful 5 minutes before the rush. 🧑💻✨",
  "🧠 NEURAL COMPILER\nCompiling thoughts...\nSyntax error in line 1: Expected breakfast before logic. 🍳💻",
  "☀️ MORNING PIPELINE\nStep 1: Wake up ✅\nStep 2: Stare at terminal ✅\nStep 3: Remember what you were doing yesterday ⏳",
  "☕ COFFEE SYNCHRONIZATION\nSyncing caffeine stream to main brain core...\nBandwidth: 1 espresso/sec.\nSystem stabilization in progress. ☕⚡",
  "☀️ ARCHITECTURE REVIEW\nToday's architectural pattern:\nWrite code, pray it works, push before lunch. 🧑💻😂"
];

// We can programmatically generate 125 morning messages with varied topics
const morningTopics = [
  ["REDIS CACHE", "Cache warmed up", "Eviction policy: Sleepiness evicted. Cache hit ratio: 98% 🚀"],
  ["GRAPHQL ENDPOINT", "Morning query dispatched", "Query payload: 1 warm croissant and 2 cold brews. 🥐☕"],
  ["NODE EVENT LOOP", "Call stack is empty", "Event loop ready for async chaos. Let's build something great! ⚡"],
  ["TYPESCRIPT ENGINE", "Typecheck passed", "0 errors found. Today is going to be a solid build, Abishek! 💻✨"],
  ["POSTGRESQL WARMUP", "Connection pool open", "Max connections: 50. Patience connections: 2. 🐘😂"],
  ["GIT REBASE", "Morning rebase initiated", "Fast-forwarding to today's tasks without conflict! 🚀"],
  ["SOLR INDEX", "Full reindex complete", "Searching for: 'clean code'. 1,000 matches found! 🔍"],
  ["API GATEWAY", "Gateway ping: 200 OK", "Ready to route incoming requests and block pointless emails. 🛡️"],
  ["STANDUP RADAR", "Standup detector triggered", "Remember: 'Still working on the edge case' works every time. 😏"],
  ["MICROSERVICE BOOT", "Service 'Abishek-Worker' healthy", "Listening on port 8080 for incoming coffee requests. ☕"],
  ["CI/CD RUNNER", "Morning pipeline triggered", "Tests are passing on main. Let's keep it green today! 🟢"],
  ["KUBERNETES POD", "Pod status: Running", "Restarts: 0. Pod health: 100%. Ready for action! ☸️"],
  ["ENVIRONMENT VARS", "Env loaded cleanly", "DEVELOPER_MOOD=OPTIMISTIC. CAFFEINE_LEVEL=HIGH. 🌟"],
  ["CPU CLOCK", "Overclocking brain core", "Operating frequency: 4.8 GHz. Terminal open and primed. 🖥️"],
  ["DNS RESOLUTION", "Resolving tasks...", "Resolved 5 JIRA issues to 'In Progress'. Let's conquer them! 🎯"],
  ["TERMINAL SOUL", "Interactive shell primed", "Bash history loaded. Aliases ready. Let's make magic today! ✨"]
];

function generateMorningPool() {
  const list = [...morningTemplates];
  for (let i = 0; i < morningTopics.length; i++) {
    const [title, sub, body] = morningTopics[i];
    list.push(`☀️ ${title}\n${sub}.\nGood morning, Abishek! 🧑💻\n${body}`);
    list.push(`🚀 MORNING ${title}\n[STATUS: READY]\n${body}\nHave an awesome morning shift! ☕💻`);
    list.push(`🧠 ${title} PROTOCOL\nMorning initialization: 100% complete.\n${sub}.\n${body} 🌟`);
    list.push(`☕ CAFFEINE & ${title}\nMorning routine check:\n1. Cup of coffee ☕\n2. Open ${title}\n${body}`);
    list.push(`☀️ SYSTEM: ${title}\nHello Abishek 👋\n${sub}.\nPro tip: ${body} 😂`);
    list.push(`💻 CODEBASE DISPATCH\n${title} active.\n${body}\nLet's deploy quality code today! 🚀`);
    list.push(`🌅 DAWN CHECKPOINT: ${title}\nMorning verification passed.\n${sub}.\n${body}`);
  }
  return list.slice(0, 130);
}

const afternoonTemplates = [
  "🍱 POST-LUNCH PROCESS\nLunch successfully committed.\nBrain latency: +347ms 🐌\nPlease wait while developer.exe wakes up. 😂",
  "🐌 AFTERNOON MODE\nCPU: 42%\nRAM: 61%\nMotivation: 12%\nCause: Carbohydrates.\nDiagnosis: Expected behavior. 😂🍱",
  "⚠️ PERFORMANCE WARNING\nDeveloper response time has increased after lunch.\nRecommended optimization:\n☕ Coffee restart round 2. ⚡",
  "🍱 CALORIC COMMIT\nDatabase says:\nCalories committed successfully.\nDeveloper status: Still digesting... 🧑💻😂",
  "☕ ROUND 2 DISPATCH\nAfternoon slump detected!\nDeploying secondary caffeine payload.\nEngage mechanical keyboard! ⌨️☕",
  "😴 GC PAUSE: POST-LUNCH\nFull garbage collection pause in progress.\nBrain freeze duration: 15 minutes.\nDo not ask complex architecture questions. 🧠🚫",
  "🍱 AFTERNOON STANDBY\nAbishek's biological system entered low-power idle.\nMoving mouse every 4 minutes to maintain 'Active' status. 🖱️😂",
  "🐌 REDIS PERSISTENCE: AFTERNOON\nCache hit: Lunch biryani.\nCache miss: Motivation to review 400-line PR.\nTime for a quick stretch! 🚶♂️",
  "🍱 DOCKER RESTART\nRestarting mental containers after lunch...\nContainer 1: Food coma (exited with code 0).\nContainer 2: Afternoon focus (starting...). 🐳✨",
  "⚡ AFTERNOON MEETING ALERT\nIncoming: 'Quick 30-minute sync'.\nActual duration: 90 minutes of someone reading bullet points.\nStay strong, Abishek! 🛡️😂",
  "💻 DEBUGGING AFTER LUNCH\nLines of code written: 3.\nLines of code deleted: 47.\nNet productivity: High. 😂🔥",
  "🍱 THE FOOD COMA HEURISTIC\nHeuristic analysis:\nBrain running at 33% clock speed.\nSwitching to minor CSS tweaks until 2:30 PM. 🎨",
  "☕ SECOND CAFFEINE WAVE\nCaffeine level dropped below critical threshold.\nInjecting Americano.\nFocus restoring in 3... 2... 1... 🚀",
  "🐌 SOLR QUERY SLOWDOWN\nQuery: 'Where did the morning go?'\nExecution time: 4 hours.\nWelcome to the afternoon shift! 🧑💻",
  "🍱 AFTERNOON REFACTOR\nRefactoring code written this morning.\n'Who wrote this junk?'\n*checks git blame*\n'Oh, it was me at 10 AM.' 🤦♂️😂"
];

const afternoonTopics = [
  ["FOOD COMA RECOVERY", "Digestive thread priority set to HIGH", "Main UI thread experiencing temporary frame drops. 😂🍱"],
  ["STACK OVERFLOW VISITOR", "Researching obscure bug", "Found an answer from 2012 by an anonymous developer with a cat avatar. Blessed! 🐱💻"],
  ["PULL REQUEST AUDIT", "Reviewing colleague's code", "Looks good to me (LGTM) - the most dangerous acronym in software engineering. 👀😂"],
  ["KUBERNETES SCALING", "Afternoon pod autoscaling", "Autoscaling brain instances from 1 to 2 pods to survive the afternoon sprint. ☸️"],
  ["JIRA AFTERNOON RUSH", "Moving tickets across board", "Moved 2 tickets to 'In Review' just to feel something. 🎯"],
  ["ZOOM CALL SURVIVAL", "Camera off, mic muted", "Mastering the subtle art of nodding while thinking about snacks. 🎧😂"],
  ["MEMORY LEAK SEARCH", "Tracking runaway heap", "Found the leak: 52 open Chrome tabs detailing problems you solved 3 hours ago. 🌐"],
  ["API RATE LIMIT", "Brain request limit reached", "429 Too Many Requests. Cooling down developer core for 5 minutes. 🧊"],
  ["CSS FIGHT", "Centering a div after lunch", "Margin auto failed. Flexbox applied. Grid deployed. Div is now orbiting Saturn. 🪐😂"],
  ["CI BUILD QUEUE", "Waiting on runner #4", "The sacred developer break: waiting for the test suite to run. ⏳☕"],
  ["DATABASE DEADLOCK", "Two thoughts collided", "Transaction rolled back. Refocusing on the active task. 🐘"],
  ["TERMINAL RUNTIME", "Afternoon bash scripts", "Running automated checks while sipping tea. Smooth sailing, Abishek! 🍵💻"],
  ["STANDUP AFTERMATH", "Action items assigned", "Time to tackle the real engineering problems. You've got this! 🚀"],
  ["AFTERNOON BREAK", "Step away from screen", "20-20-20 rule: look at something 20 feet away for 20 seconds. Eyes refreshed! 👀✨"],
  ["PROD STAGING SYNC", "Staging environment tested", "Staging works like a dream. Let's keep that momentum into the evening! 🟢"]
];

function generateAfternoonPool() {
  const list = [...afternoonTemplates];
  for (let i = 0; i < afternoonTopics.length; i++) {
    const [title, sub, body] = afternoonTopics[i];
    list.push(`🍱 ${title}\n${sub}.\nKeep pushing, Abishek! 🧑💻\n${body}`);
    list.push(`🐌 AFTERNOON ${title}\n[CURRENT THREAD: ACTIVE]\n${body}\nAfternoon coffee recommended! ☕😂`);
    list.push(`⚠️ ${title} CHECKPOINT\nAfternoon status check:\n${sub}.\n${body} ⚡`);
    list.push(`🍱 POST-LUNCH ${title}\nSystem telemetry:\n${body}\nYou are doing great today! 🌟`);
    list.push(`💻 CODE UPDATE: ${title}\n${sub}.\n${body}\nAlmost through the afternoon shift! 🎯`);
    list.push(`☕ SECOND SHIFT: ${title}\n${body}\nMaintain steady typing speed! ⌨️✨`);
    list.push(`🚀 AFTERNOON RUNNER: ${title}\n${sub}.\n${body}`);
  }
  return list.slice(0, 130);
}

const eveningTemplates = [
  "🔥 EVENING BUILD\nToday's human process is reaching maximum uptime.\nGraceful shutdown recommended soon. 🧑💻💤",
  "🚨 DANGER PROTOCOL\nSomeone just typed:\n'Hey, one small change before you head out.'\nDO NOT TRUST THIS REQUEST. RUN. 😂💀",
  "💻 FINAL COMMIT\ngit commit -m 'survived today'\ngit push origin home 🏠🚀\nTop notch engineering today, Abishek!",
  "⚠️ PRODUCTION LOCKOUT\nGolden Rule:\nNEVER deploy to production after 5 PM on any day ending in 'y'.\nSave it for tomorrow! 🛡️😂",
  "🏃♂️ SPRINT TO THE DOOR\nTests: Passing.\nTickets: Updated.\nBag: Packed.\nStealth exit protocol engaged! 🎒💨",
  "🔥 JIRA ESCAPE VELOCITY\nVelocity calculated: 100 km/h away from the office.\nNo new assignments accepted today! 🛑🏃♂️",
  "🌇 SUNSET OVER PRODUCTION\nThe servers are humming.\nThe load balancer is happy.\nTime to step away from the IDE, developer. 🌆✨",
  "🛑 MERGE FREEZE\nGit branch locked.\nDo not look at pull requests.\nDo not refactor that one function.\nJust close the laptop. 💻🔒",
  "🔋 LOW BATTERY: DEVELOPER EDITION\nBrain battery: 4%.\nCaffeine level: 0%.\nEvening mood: Ready for relaxation. 🛋️🔋",
  "🔥 THE 'QUICK QUESTION' TRAP\nColleague: 'Do you have 2 minutes?'\nNarrator: 'It was not 2 minutes.'\nDefend your evening, Abishek! 😂🛡️",
  "🌇 EVENING REFLECTION\nToday you tackled tough bugs, untangled logic, and pushed real value.\nBe proud of today's hustle! 🌟🧑💻",
  "💻 SHUTDOWN SEQUENCE ARMED\nTerminating dev server...\nStopping Docker containers...\nPreserving sanity...\nEvening unlocked! 🎮✨",
  "🔥 SURVIVAL CHECKPOINT\nYou survived today's meetings, bugs, and Slack pings.\nMedal of honor awarded to Abishek! 🏅😂",
  "🌇 GOLDEN HOUR CODING\nWrapped up the last commit of the day.\nEverything is compiling.\nTime to celebrate another productive shift! 🚀🎉"
];

const eveningTopics = [
  ["END OF SPRINT PUSH", "Today's milestone reached", "Great job pushing through the edge cases today! 🎯"],
  ["DOCKER PRUNE", "Cleaning up daily artifacts", "Pruned 15 unused containers and 20GB of mental clutter. 🐳✨"],
  ["SLACK DND MODE", "Status set to: 'Heading home'", "Do not disturb enabled. No notifications can pierce this shield! 🔕"],
  ["GIT STASH EVERYTHING", "Stashing messy experiments", "git stash save 'half-baked ideas for tomorrow'. Clean working tree! 🧹"],
  ["TERMINAL SOUL EVES", "Evening check-in", "The workday was long, but your code is rock solid. Time to unwind! 🛋️✨"],
  ["REDIS EVACUATION", "Cached today's accomplishments", "Key: 'abishek_status' -> Value: 'COMPLETED_SUCCESSFULLY'. 🌟"],
  ["LAPTOP LID PROTOCOL", "Preparing for closure", "That satisfying click of closing your laptop after a hard day's work. 💻🔒"],
  ["POST-MORTEM AVOIDED", "Zero outages today", "Production survived, staging is stable, and you are free to go! 🟢"],
  ["EVENING TEA TIME", "Switching from coffee to tea", "De-escalating the caffeine levels for a peaceful evening. 🍵😌"],
  ["COMMUTER ROUTE COMPUTED", "Calculating route home", "Shortest path algorithm engaged: Office -> Couch -> Dinner. 🚗💨"],
  ["CODE FREEZE ENFORCED", "Hands off the keyboard", "Seriously, do not touch that config file right now. Tomorrow awaits! 🛑😂"],
  ["BUG SQUASH CELEBRATION", "Squashed 4 critical bugs", "Those bugs never saw you coming. Outstanding debugging today! 🐛💥"],
  ["DEV ENVIRONMENT SLEEP", "Suspending virtual machines", "Giving the local CPU fans a well-deserved rest. 🖥️💤"],
  ["OFFICE VICTORY LAP", "Packing up the desk", "Another day, another set of problems conquered by Abishek! 🏆🚀"],
  ["SUNSET SHUTDOWN", "The sun has set", "Step away into the real world. You earned this evening! 🌆💚"]
];

function generateEveningPool() {
  const list = [...eveningTemplates];
  for (let i = 0; i < eveningTopics.length; i++) {
    const [title, sub, body] = eveningTopics[i];
    list.push(`🔥 ${title}\n${sub}.\nGood evening, Abishek! 🧑💻\n${body}`);
    list.push(`🌇 EVENING ${title}\n[STATUS: WRAPPING UP]\n${body}\nGreat job today! 👏✨`);
    list.push(`🛑 ${title} PROTOCOL\nEvening alert:\n${sub}.\n${body} 🏃♂️💨`);
    list.push(`💻 FINAL LAP: ${title}\n${body}\nClose down those tabs and take a breath! 🛋️`);
    list.push(`🌆 SUNSET: ${title}\n${sub}.\n${body}\nEvening well earned! 🌟`);
    list.push(`⚡ WRAP-UP: ${title}\n${body}\nTomorrow is another chance to build great things! 🚀`);
    list.push(`🔥 SURVIVED: ${title}\n${sub}.\n${body}`);
    list.push(`🌇 EVENING VICTORY: ${title}\n${body}\nWrap up and rest your eyes, engineer! 🌆✨`);
  }
  return list.slice(0, 130);
}

const nightTemplates = [
  "🌙 DAILY BUILD COMPLETE\nMaybe you didn't finish everything today.\nBut you learned something. Fixed something. Understood something.\nThat's still real progress, Abishek. 🧑💻💚",
  "🚀 DEVELOPER PROGRESS\nToday's code may not have been 100% perfect.\nYour understanding is sharper than it was yesterday.\nThat's a successful build. 🌱💻",
  "💚 COMMIT SUCCESSFUL\nYou showed up.\nYou struggled.\nYou debugged.\nYou learned.\nYou kept going.\nThat's more important than a flawless commit history. 🧑💻🌙",
  "🌱 VERSION UPDATE\nDeveloper v2026.09.22\nNew features:\n+ More experience\n+ Better debugging instincts\n+ One more day of resilience\nKnown bugs: Still several 😂\nOverall: Steadily improving. 🚀",
  "🏆 DAILY CHECKPOINT\nToday's achievement:\nYou didn't know everything.\nYou didn't give up.\nYou learned along the way.\nThat's how great engineers grow. 💻🌱",
  "🧠 DEBUGGING LIFE\nSome problems took longer than expected today.\nThat's okay.\nEvery difficult bug leaves you with a better developer tomorrow. 🐛➡️🧑💻",
  "🌙 NIGHT MODE\nThe office is quiet.\nThe screens are glowing.\nThe servers are running quietly.\nAnd for once... nothing is asking for a JIRA update. 😌💻",
  "🌌 AFTER HOURS\nCity lights outside.\nTerminal open.\nKeyboard silent.\nProduction stable.\nNot a bad way to close out the day, Abishek. 🌃🧑💻",
  "🌙 SYSTEM QUIET\nNo alerts.\nNo meetings.\nNo 'quick calls'.\nJust a quiet night and a developer finally breathing freely. 😌✨",
  "🌃 NIGHT BUILD\nThe code can wait.\nThe servers can run.\nThe world can wait until tomorrow.\nFor now... enjoy the peace and quiet. 🌙",
  "🌙 GRACEFUL SHUTDOWN\nToday's work has been saved.\nNo more commits. No more debugging.\nTomorrow's developer can handle tomorrow's problems.\nShutdown approved. 😴💻",
  "🔋 DEVELOPER BATTERY\nToday's battery: 3%\nToday's effort: 100%\nRecharge recommended. You did great today, Abishek. 🌙🔋",
  "🚨 NIGHT WARNING\nDO NOT TOUCH PRODUCTION.\nYou are tired.\nProduction is awake.\nThis is how horror stories begin. 😂💀",
  "🐛 ONE LAST BUG\nDeveloper: 'I'll fix one bug before bed.'\nBug: 'Excellent. Bring your entire architecture.' 😂",
  "💚 DAILY LOG\nToday's work may not look massive from the outside.\nBut you know how many complex problems you solved.\nGood work today, Abishek. 🌙🧑💻",
  "🏆 CHECKPOINT SAVED\nAnother day completed.\nAnother set of problems solved.\nAnother set of lessons learned.\nProgress saved successfully. 💾💚",
  "🌅 TOMORROW'S BUILD\nToday's work is committed.\nTomorrow brings another chance to learn, build and improve.\nNo need to solve tomorrow tonight. 🚀🌙",
  "🌌 DEEP NIGHT REFLECTION\nGreat code isn't written in a rush.\nIt's built one day at a time, one bug at a time.\nRest your eyes, engineer. 🌟",
  "☕ NIGHT MODE: OFF DUTY\nThe mechanical keyboard is resting.\nThe monitors are dimming.\nYou survived another day of software engineering. High five! ✋🌙",
  "🌙 PEACEFUL PRODUCTION\nHealthchecks: Green.\nLatency: Low.\nDeveloper: Victorious.\nHave a peaceful night, Abishek! 🌌💻"
];

const nightTopics = [
  ["CONSISTENCY OVER PERFECTION", "Consistency is the super-power of software engineering", "Showing up every day builds world-class skills. Be proud of yourself tonight! 🌱💚"],
  ["THE BEAUTY OF SILENT SERVERS", "The cloud hums quietly in the dark", "Millions of requests routed while you rest. The magic of modern engineering. ☁️✨"],
  ["ONE LINE AT A TIME", "Reflecting on today's progress", "Rome wasn't built in a day, and neither is great software. You moved the needle today. 🧱🚀"],
  ["DANGEROUS 2 AM THOUGHTS", "Resist the urge to rewrite the ORM", "That midnight architecture idea will look completely crazy tomorrow morning. Sleep on it! 😂🛋️"],
  ["LEARNING THROUGH MISTAKES", "That broken build was actually a lesson", "Senior engineers are just junior engineers who broke production more times. Keep growing! 🧠✨"],
  ["QUIET TERMINAL REFLECTION", "Looking at today's git diff", "Clean code, thoughtful commits. You did honest, solid work today, Abishek. 🧑💻🌙"],
  ["THE JOY OF PROBLEM SOLVING", "Remember why you love building", "Turning ideas into functional software is real wizardry. Never lose that spark! 🪄💻"],
  ["TOMORROW IS A BLANK SLATE", "Fresh morning ahead", "Unsolved bugs look much simpler after a good night's rest. See you tomorrow! 🌅🚀"],
  ["CITY LIGHTS & CODE GLOW", "Atmospheric night vibes", "Dark mode aesthetic, gentle rain outside, world asleep. Peaceful developer zen. 🌃🌧️"],
  ["REST IS A FEATURE", "Sleep is not a bug, it's a critical update", "Your brain does memory defragmentation while you sleep. Give it runtime! 😴💤"],
  ["GRATITUDE IN THE TERMINAL", "Appreciating the craft", "Thank you, brain, for writing thousands of lines of logic today. Well done! 💚"],
  ["THE BUG CAN WAIT", "Closing the debugger", "The bug isn't going anywhere. It will still be there tomorrow, waiting to be crushed! 🐛👊"],
  ["SERVER HEARTBEAT", "Monitoring graphs flat and steady", "No spikes, no 500s. Just sweet, uninterrupted peace. 📈😌"],
  ["UNPLUGGED AND PROUD", "Unplugging headphones", "Stepping away into calm thoughts. Tomorrow is full of new possibilities. 🎧✨"],
  ["SOUL OF THE TERMINAL", "TerminalSoul check-in", "You brought passion and persistence to your craft today. Sleep well, Abishek! 🌌🌙"]
];

function generateNightPool() {
  const list = [...nightTemplates];
  for (let i = 0; i < nightTopics.length; i++) {
    const [title, sub, body] = nightTopics[i];
    list.push(`🌙 ${title}\n${sub}.\nGood night, Abishek! 🧑💻\n${body}`);
    list.push(`🌌 NIGHT ${title}\n[ATMOSPHERE: CALM]\n${body}\nRest easy tonight! 🛋️✨`);
    list.push(`💚 REFLECTION: ${title}\n${sub}.\n${body}\nProgress over perfection. 🌱`);
    list.push(`😴 SHUTDOWN: ${title}\n${body}\nTomorrow brings another great day to build! 🚀🌙`);
    list.push(`🌟 NIGHT MOTIVATION: ${title}\n${sub}.\n${body}\nYou are doing amazing! 👏`);
    list.push(`🏆 CHECKPOINT: ${title}\n${body}\nAll today's lessons saved to permanent memory. 💾✨`);
    list.push(`🌙 CALM CODER: ${title}\n${sub}.\n${body}`);
  }
  return list.slice(0, 130);
}

const morningList = generateMorningPool().map((msg, idx) => ({ id: idx + 1, message: msg }));
const afternoonList = generateAfternoonPool().map((msg, idx) => ({ id: idx + 1, message: msg }));
const eveningList = generateEveningPool().map((msg, idx) => ({ id: idx + 1, message: msg }));
const nightList = generateNightPool().map((msg, idx) => ({ id: idx + 1, message: msg }));

const payload = {
  appName: "TerminalSoul",
  version: "1.0.0",
  totalCount: morningList.length + afternoonList.length + eveningList.length + nightList.length,
  counts: {
    morning: morningList.length,
    afternoon: afternoonList.length,
    evening: eveningList.length,
    night: nightList.length
  },
  morning: morningList,
  afternoon: afternoonList,
  evening: eveningList,
  night: nightList
};

const outPath = path.join(__dirname, '..', 'scheduled_messages.json');
fs.writeFileSync(outPath, JSON.stringify(payload, null, 2), 'utf-8');
console.log(`Generated scheduled_messages.json with ${payload.totalCount} messages!`);
console.log(`Morning: ${payload.counts.morning}, Afternoon: ${payload.counts.afternoon}, Evening: ${payload.counts.evening}, Night: ${payload.counts.night}`);
