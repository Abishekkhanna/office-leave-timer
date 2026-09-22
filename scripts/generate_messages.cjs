const fs = require('fs');
const path = require('path');

// 365 Unique, hilarious, developer-themed messages for Office Leave Timer V1
// Each message has at least 2 emojis, 1-4 short sentences, varied developer concepts,
// and natural inclusion of 'Abishek' in many of them.
const rawMessages = [
  // 1-25: HTTP Status Codes & REST APIs
  "🚨 HTTP 200 — WORKDAY COMPLETED! Hey Abishek 👋 Your office session has successfully terminated. Please exit before someone creates another JIRA ticket. 🏃‍♂️💨",
  "🟢 DEPLOYMENT SUCCESSFUL! Abishek, your 9-hour deployment is complete. 🚀 No rollback required. Just go home. 😂🏠",
  "🚨 HTTP 204 NO CONTENT! There is officially zero work content remaining for you today, Abishek. Clear your workstation and escape. 🚪💨",
  "⚡ HTTP 301 MOVED PERMANENTLY! Abishek's status has permanently redirected from Office to Couch. Follow the redirect immediately! 🛋️🏃‍♂️",
  "🚨 HTTP 403 FORBIDDEN! Overtime access is denied by company sanity policy. Step away from the mechanical keyboard right now. ⌨️⛔",
  "☕ HTTP 418 I'M A TEAPOT! I'm a teapot and you're an exhausted engineer, Abishek. Both of our heating elements need to shut off. 😂🏃‍♂️",
  "🚨 HTTP 429 TOO MANY REQUESTS! Your brain has hit the daily cognitive rate limit. Backoff window: 15 hours until tomorrow morning. 🧠⏳",
  "🔥 HTTP 500 INTERNAL SERVER ERROR! Abishek's motivation server has suffered a catastrophic crash. Reboot outside the office perimeter. 💥🏃‍♂️",
  "🛑 HTTP 503 SERVICE UNAVAILABLE! Developer Abishek is currently unavailable for impromptu desk drive-bys. Please file a ticket in dreamland. 🛌💤",
  "🌐 REST API RESPONSE: GET /office/session returned status: EXPIRED. Response payload contains your official permission slip to leave. 📋🎉",
  "📡 API GATEWAY TIMEOUT! The proxy connection between Abishek and this corporate cubicle has timed out. Terminating link. ⏱️🏃‍♂️",
  "🔐 JWT TOKEN EXPIRED! Your corporate authentication bearer token has officially lapsed for the day, Abishek. Signature verification failed: Go home! 🚪💨",
  "⚡ GRAPHQL MUTATION: mutation { leaveOffice(employee: \"Abishek\") { status: FREE } } resolved with zero errors. Run! 🚀🥳",
  "🚨 API RATE LIMIT EXCEEDED! Daily allowance of 'Let me just check one quick thing' has dropped to zero. Pack your bag. 🎒😂",
  "🔌 WEBSOCKET CONNECTION CLOSED! Code 1000: Normal closure. Office socket disconnected cleanly. See you tomorrow, folks! 🔌🏃‍♂️",
  "🛑 CORS ERROR: Origin 'Office' has been blocked from accessing resource 'Abishek's Evening'. Preflight request rejected! 🛡️🏠",
  "📡 WEBHOOK TRIGGERED: Event 'NineHoursCompleted' fired for developer Abishek. Target destination: freedom! 🎯🚀",
  "📦 PAYLOAD TOO LARGE: Today's cognitive payload exceeded buffer capacity. Truncating all office thoughts immediately. ✂️🧠",
  "🚨 HTTP 202 ACCEPTED: Your application for leaving the building has been accepted for processing. Departure in progress. 🏃‍♂️💨",
  "🛑 ENDPOINT DEPRECATED: Staying at the office past 9 hours has been sunsetted. Migrate directly to your living room. 🌅🛋️",
  "⚡ API HEALTH CHECK: Heartbeat is weak, caffeine levels at critical low. Immediate relocation to home address required! ☕🩺",
  "🚨 HTTP 410 GONE: Abishek is gone from this desk and no forwarding address will be provided until tomorrow. 👻👋",
  "🌐 REST DISPATCH: Successfully invoked POST /commute/start with header Authorization: Bearer I-Survived. 🚗💨",
  "🚨 HTTP 408 REQUEST TIMEOUT: The client waited 9 hours for work to end. Server has closed the connection. Pack up! ⏰🏃‍♂️",
  "🎯 STATUS 200 OK: Abishek's shift routine executed with exit code 0. Enjoy your evening offline! 🎉🏠",

  // 26-50: Git, GitHub, Version Control
  "🐙 git status: CLEAN! Working tree clean, nothing to commit, Abishek. Push yourself toward the exit doors right now! ✅🏃‍♂️",
  "🚀 git commit -m \"survived another grueling sprint day\" — SUCCESS! Now force push your physical body out of the building. 😂💨",
  "💥 MERGE CONFLICT RESOLVED: Conflict between 'Stay 10 mins more' and 'Go home right now' resolved in favor of freedom! ⚔️🏠",
  "🐙 git checkout -b feature/couch-potato! Branch created and switched. Head detached from office problems. 🛋️🥳",
  "🚨 git push --force origin home! Override all incoming Slack pings and execute your departure protocol, Abishek. 💥🏃‍♂️",
  "🐙 PULL REQUEST APPROVED: PR #365 \"Abishek Leaves on Time\" has 2 approvals and zero blocking comments. Merged to main! 🚢🎉",
  "🛑 git reset --hard HEAD~0: Reverting all lingering work thoughts from memory. Clean slate guaranteed! 🧠🧹",
  "🐙 GITHUB ACTION SUCCEEDED: Workflow 'Nine-Hour Survival Pipeline' passed all tests. Deploying Abishek to couch! 🚀🛋️",
  "🚨 git stash pop: Stashed personal life has been restored successfully. Office context discarded! 🗃️✨",
  "🐙 REBASE COMPLETED: Rebasing Abishek onto branch 'evening-chill' without any conflicts. Pack your laptop! 💻🏃‍♂️",
  "🐙 git cherry-pick: Cherry-picked the best part of the day: leaving! Push to origin before someone interrupts you. 🍒💨",
  "🛑 git tag -a v1.0-freedom: Tagged current commit as milestone 'Shift Done'. No further commits permitted today. 🏷️✅",
  "🐙 git blame: We ran git blame on who stayed late yesterday. Don't let your name show up there again today, Abishek! 👀🏃‍♂️",
  "🚨 DETACHED HEAD STATE: Abishek's brain has detached from the corporate repository. Switching to relaxation mode. 🧠💤",
  "🐙 MERGE SQUASH: Squashing all today's emails and standups into one single accomplishment: surviving 9 hours. 💥🎉",
  "🐙 git log -n 1: commit: \"Abishek logged 9 productive hours\". Author: Legend. Date: Right now. Go home! 📜😎",
  "🚨 GITHUB BOT: Review requested on your life outside work. Priority: URGENT. Approve and close laptop! 🤖💻",
  "🐙 REPO ARCHIVED: This day's repository is now read-only. Further edits will be automatically discarded by security. 🔒🏃‍♂️",
  "🐙 GIT SUBMODULE UPDATE: Submodule 'Evening Energy' initialized and synchronized with happiness. ⚡🏠",
  "🐙 git clean -fdx: Untracked work anxieties purged permanently from disk space. Have a relaxing evening! 🧹✨",
  "🚨 COMMIT REJECTED: Pre-commit hook failed: 'Staying past leave time violates self-care regulations'. Exit now! 🛑🏃‍♂️",
  "🐙 FAST-FORWARD MERGE: Fast-forwarding your commute straight to relaxation. No manual intervention needed! ⏩🛋️",
  "🐙 GITHUB RELEASE: Release vToday.Night is live with changelog: 'Abishek successfully escaped the office'. 🚀🎊",
  "🚨 GIT DIFF EMPTY: There is zero difference between you staying another minute and tomorrow's problems. Log off! 📉😂",
  "🐙 REMOTE REPOSITORY DOWN: Corporate server unreachable. Perfect excuse to disconnect and run away! 🔌🏃‍♂️",

  // 51-75: Databases, SQL, Redis, Cache
  "🗄️ DATABASE UPDATE: UPDATE employee SET status = 'HOME' WHERE employee = 'Abishek'; Rows affected: 1. 😂🏠",
  "⚡ REDIS CACHE HIT: Cache hit on key 'HOME'. Cache miss on 'Reason to stay at office late'. Evacuating! 🏃‍♂️💨",
  "🗄️ SELECT * FROM office; Result: Abishek. Executing: DELETE FROM office WHERE employee = 'Abishek'; Run! 🗑️😂",
  "⚡ REDIS TTL EXPIRED: Key 'Abishek:OfficePresence' has reached TTL 0. Evicting from memory immediately. ⏳🚪",
  "🗄️ DATABASE TRANSACTION COMMITTED: BEGIN TRANSACTION; Work(); COMMIT; Connection released to pool. 🏊‍♂️🎉",
  "🛑 DEADLOCK DETECTED: Deadlock between your sleepy eyelids and screen glare. Transaction rolled back, go sleep! 💤🛑",
  "🗄️ DROP TABLE lingering_tasks; Query executed in 0.02ms. Zero remaining tasks. Walk away with pride, Abishek! 💥😎",
  "⚡ MEMCACHED FLUSH_ALL: Memory flushed completely. Office banter and meeting notes wiped clean. 🧽✨",
  "🗄️ SQL INJECTION PREVENTED: Attempted injection of 'StayForOneMoreThing' sanitized and blocked by sanity engine. 🛡️🚪",
  "🗄️ DATABASE REPLICATION COMPLETE: Master database 'Abishek' is syncing state to 'Home Sanctuary'. 🔄🏠",
  "⚡ REDIS LRU EVICTION: Least recently useful thoughts about JIRA tickets evicted to make room for dinner. 🍕🧠",
  "🗄️ INDEX CREATED: CREATE INDEX idx_exit ON building (door_closest_to_abishek); Speed up your getaway! 🏃‍♂️💨",
  "🗄️ VACUUM FULL employee_brain; Dead tuples removed. Storage reclaimed. Time for evening leisure! 🧹🧘‍♂️",
  "⚡ SOLR SEARCH QUERY: q=reason_to_stay_longer -> Hits: 0. q=reasons_to_leave_now -> Hits: 9999+. 🔍😂",
  "🗄️ DATABASE POOL DRAINED: All connections to workplace stress closed gracefully. Stand up and stretch! 🧘‍♂️🚶‍♂️",
  "🗄️ MONGO DB INSERT: db.evenings.insertOne({ hero: \"Abishek\", status: \"liberated\", pizza: true }); 🍕🥳",
  "⚡ CASSANDRA CLUSTER: Write consistency level: ALL. It is unanimously confirmed that your shift is over. 📊✅",
  "🗄️ POSTGRES WAL ARCHIVED: Write-ahead log safely archived on disk. Safe to power down the station. 💾🔌",
  "⚡ KEY-VALUE STORE: Key 'work_obligation' set to null. Key 'netflix_and_chill' set to true. Enjoy! 📺🍿",
  "🗄️ DATABASE SHARK ALERT: A rogue query ate your workload. Fortunately, it also ate any reason to stay late. 🦈😂",
  "🗄️ FOREIGN KEY CONSTRAINT: Cannot insert additional tasks because parent table 'WorkDay' has been deleted. 🚫🗂️",
  "⚡ REDIS PUBSUB: Channel 'office-escapes' published message: 'Abishek has left the server'. 📢🏃‍♂️",
  "🗄️ SQL EXPLAIN ANALYZE: Cost of staying 5 more minutes: infinite. Cost of leaving right now: 0.00. 💰🏃‍♂️",
  "🗄️ DATABASE MIGRATION SUCCESS: Migration 2026_leave_office applied without errors. Pack your backpack! 🎒✨",
  "⚡ REDIS MEMORY OVERCOMMIT: Warning: Physical memory full of code snippets. Evacuate to fresh air immediately! 🌳💨",

  // 76-100: Node.js, JavaScript, TypeScript, Runtime
  "🟢 Node.js EVENT LOOP: All microtasks and macrotasks completed. Event loop queue is empty. process.exit(0)! 🚀🏃‍♂️",
  "⚠️ UNHANDLED EXCEPTION: WorkHoursExceededException at Abishek.Desk. Fatal error: Time to go home. 🚨💥",
  "TypeScript COMPILE SUCCESS: 0 errors, 0 warnings. Abishek is properly typed as type 'FreeIndividual'. 📜😎",
  "🛑 PROMISE REJECTED: Promise.reject('Office hours are over'). Catch block says: Close your laptop! 💻🏃‍♂️",
  "🟢 GARBAGE COLLECTOR TRIGGERED: Mark-and-sweep algorithm identified office fatigue as eligible for collection. 🗑️🧹",
  "⚡ V8 JIT COMPILER: Hot function 'WorkHard' has been deoptimized. Switching to idle sleep state. 💤⚡",
  "📦 NPM RUN LEAVE: Script 'leave' executed successfully. Dependencies on office snacks terminated. 🍪🏃‍♂️",
  "🛑 MAXIMUM CALL STACK EXCEEDED: You have called 'justOneMoreCommit()' too many times today. Break the loop! 🔄🛑",
  "🟢 ASYNC/AWAIT RESOLVED: await freedom(); Execution resumed on couch. Have a wonderful evening, Abishek! 🛋️✨",
  "📦 NODE_MODULES WEIGH-IN: Your node_modules folder is heavy, but your work obligations for today are zero. 🏋️‍♂️😂",
  "⚠️ TYPE CHECK: Type 'Overtime' is not assignable to type 'AbishekSchedule'. Type mismatch resolved by leaving! 🛡️🚪",
  "🟢 THREAD POOL IDLE: libuv worker threads have all clocked out. No pending I/O operations at this desk. 🧵💤",
  "🛑 SYNTAX ERROR: Unexpected token 'MoreWork' at line 9_HOURS. Parser terminated execution cleanly. 🛑🚪",
  "🟢 BUN RUNTIME: Faster than Node, and faster than your manager noticing you slipped out the back door! ⚡🏃‍♂️",
  "📦 DENO PERMISSION DENIED: Permission to access employee beyond 9 hours was denied by runtime sandbox. 🔒🛡️",
  "🛑 UNCAUGHT REFERENCE ERROR: 'ReasonToStay' is not defined in current scope. Exiting script! 🏃‍♂️💨",
  "🟢 EVENT LISTENER REMOVED: Element.removeEventListener('urgent_slack_ping'). Radio silence activated! 🔕🤫",
  "⚠️ MEMORY LEAK CONTAINED: Memory leak in 'WorryingAboutDeadlines' patched by shutting lid of laptop. 💻🩹",
  "🟢 WORKER THREAD TERMINATED: Worker thread Abishek has posted message: 'Done for the day' and exited. 📨👋",
  "📦 PACKAGE.JSON UPDATED: Scripts: { \"night\": \"sleep --soundly\" }. Run it without delay! 🌙🛌",
  "🟢 OPTIONAL CHAINING: employee?.energy?.level is undefined. Safe navigation operator routes you to dinner! 🍽️🏃‍♂️",
  "🛑 STRICT MODE VIOLATION: Working past 9 hours violates strict mode. Evaluation halted immediately. 📜⛔",
  "🟢 DESTRUCTURING ASSIGNMENT: const { keys, wallet, phone } = pockets; Ready for immediate departure! 🔑📱",
  "⚡ JAVASCRIPT CLOSURE: Captured variable 'freedom' in outer scope. Returning true forever! 🔓✨",
  "🟢 PROCESS.ON('SIGINT'): Received interrupt signal from your rumbling stomach. Executing graceful exit! 🍕🏃‍♂️",

  // 101-125: Docker, Kubernetes, Containers, Cloud
  "🐳 DOCKER CONTAINER STOPPED: Container 'Abishek-Worker' exited with code 0. Container pruned from office! 🐋📦",
  "☸️ KUBERNETES POD TERMINATED: Pod office-abishek-7b9f scaled to 0 replicas by Horizontal Pod Autoscaler. 📉🏃‍♂️",
  "☁️ AWS LAMBDA INVOCATION COMPLETE: Duration: 9.00 hours. Billed duration: enough. Memory: exhausted. ⚡☁️",
  "🐳 DOCKER-COMPOSE DOWN: Stopping network 'office-chaos'... done. Removing volume 'work-stress'... done! 🧹🐳",
  "☸️ K8S CRASHLOOPBACKOFF: You will experience a crash loop if you look at another pull request today. Disconnect! 🔄💥",
  "☁️ CLOUD RUN INSTANCE DRAINED: Traffic rerouted to personal life. Cold start scheduled for tomorrow 9 AM. ❄️🏃‍♂️",
  "🐳 DOCKER SYSTEM PRUNE -A: Reclaimed 100% of your cognitive headspace. Enjoy the fresh evening breeze! 🌬️🚢",
  "☸️ K8S INGRESS ROUTE: Ingress path /office redirected to /cozy-bedroom with 100% traffic weight. 🚪🛌",
  "☁️ TERRAFORM APPLY COMPLETE: Resources destroyed: 1 Office Day. Resources created: 1 Free Evening! 🏗️🎉",
  "🐳 CONTAINER IMAGE EXPORTED: Tagged as office-survivor:latest. Ready for evening deployment! 🏷️🚢",
  "☁️ GOOGLE CLOUD PROJECT QUOTA: Daily quota of engineering magic reached. Quota resets in 15 hours. 📊✨",
  "☸️ KUBECTL DELETE POD: pod/stress-and-jira force deleted by administrator Abishek. Pod cleared! 💥🛡️",
  "☁️ S3 BUCKET POLICY: Access denied to corporate emails from IP: Home-Sweet-Home. Download dinner instead! 🍕☁️",
  "🐳 MULTI-STAGE BUILD: Build stage 'Work' completed. Final lean production stage 'Chill' starting now! 📦🏃‍♂️",
  "☸️ K8S LIVENESS PROBE FAILED: Probe failed: Employee requires immediate couch resuscitation. Rerouting! 🩺🛋️",
  "☁️ AZURE DEVOPS PIPELINE: Build succeeded. Artifact 'Abishek' published to subway transit network. 🚇📦",
  "🐳 DOCKER DAEMON OFFLINE: Socket /var/run/work.sock closed. Cannot accept new containers. Bye bye! 🔌👋",
  "☁️ SERVERLESS COLD START: Even a cold start is warmer than staying under these fluorescent office lights! 💡🏃‍♂️",
  "☸️ ROLLING UPDATE: Rolling update complete: Office attire swapped for comfortable sweatpants. 👖✨",
  "☁️ CLOUDFRONT CACHE INVALIDATED: All cached memories of annoying meetings invalidated across all edge locations. 🌐🧹",
  "🐳 DOCKER HEALTHCHECK PASSED: Status: healthy, hungry, and ready to walk out into the sunset. 🌅🍔",
  "☸️ K8S TAINT & TOLERATION: Node 'Office' tainted with NoSchedule. New tasks cannot be scheduled on you! 🛑🏗️",
  "☁️ LOAD BALANCER ALERT: Zero active targets remaining in office target group. Target healthy at home. 🎯🏠",
  "🐳 DOCKER SWARM LEADER: Swarm leader Abishek has disbanded today's cluster. Dismissed with honors! 🎖️🐳",
  "☁️ ROUTE 53 DNS UPDATE: abishek.work resolved to 127.0.0.1 (localhost). Your focus belongs to you! 🌐🔒",

  // 126-150: JIRA, Agile, Standups, Sprints
  "🎫 JIRA UPDATE: Ticket 'Survive Today' has moved from IN PROGRESS to DONE! No blockers detected. 🏃‍♂️💨",
  "🏃‍♂️ SPRINT RETROSPECTIVE: What went well today? You leaving right now after exactly 9 hours. Adjourned! 🥂📝",
  "🎫 SPRINT VELOCITY ALERT: You have delivered maximum daily story points. Additional points roll over to tomorrow! 📈⛔",
  "🛑 JIRA BOT: Cannot transition ticket to 'One More Thing'. Reason: Developer has physically left desk. 🤖🚪",
  "🎫 BACKLOG GROOMING CANCELLED: The backlog will still be there tomorrow, Abishek. The sunset won't! 🌅🏃‍♂️",
  "🗣️ STANDUP SUMMARY: What did I do today? 9 hours. What will I do tomorrow? Arrive rested. Blockers? This door! 🚪😂",
  "🎫 JIRA BURNDOWN CHART: Burndown reached zero for today. Don't burn yourself down, burn rubber home! 📉🔥",
  "🛑 SCRUM MASTER NOTICE: The definition of 'Done' includes packing your bag and smiling on your way out. 🎒😄",
  "🎫 EPIC RESOLVED: Epic 'Nine Hours of Software Engineering' marked CLOSED. Great job, Developer Abishek! 🏆🚀",
  "⏰ TIME TRACKING AUDIT: Exactly 9.000 hours logged. Logging any more will disrupt the space-time continuum! ⏳🌀",
  "🎫 STORY POINTS EXHAUSTED: Daily estimation accuracy: 100%. Remaining capacity: 0%. Exit stage left! 🎭🚶‍♂️",
  "🛑 SPRINT GOAL MET: Primary sprint goal of staying sane achieved. Secondary sprint goal: grab food! 🌮🎉",
  "🎫 JIRA SUBTASK CREATED: 'Walk to door'. Assignee: Abishek. Status: IN PROGRESS. ETA: 30 seconds! ⏱️🏃‍♂️",
  "🗣️ ASYNC UPDATE: Status posted to #general: 'Gears parked for the day. Catch y'all on the flip side!' ✌️💬",
  "🎫 TICKET REASSIGNED: Ticket 'Fix Universe' reassigned back to Tomorrow. It's not your problem tonight! 🌌🛡️",
  "🛑 KANBAN BOARD: Column 'DONE' is overflowing. Column 'GOING HOME' needs your card right now! 📋💨",
  "🎫 JIRA WORKFLOW RULE: If current_time >= leave_time THEN play_victory_music() AND exit_building(). 🎵🏃‍♂️",
  "🗣️ POST-MORTEM: Root cause of your fatigue: Working 9 straight hours. Mitigation: Immediate departure! 📊💊",
  "🎫 POKER PLANNING OVER: We all estimated you should leave at this exact minute. Fibonacci agrees: 8, 9, GO! 🃏🏃‍♂️",
  "🛑 PRODUCT OWNER NOTICE: Feature request 'Stay Late' deprioritized to bottom of icebox. Step away! 🧊🚫",
  "🎫 ATASSIAN SERVICE DOWN: JIRA servers are resting and so should you, Abishek. Shut the laptop! 💤💻",
  "🗣️ DAILY HUDDLE COMPLETE: Hand on the door handle in 3... 2... 1... break! Great hustle today! 🏈💨",
  "🎫 SPRINT MILESTONE: All milestone checkboxes checked. Do not let someone invent a new checkbox. 📦✅",
  "🛑 AGILE MANIFESTO: Responding to end-of-day clock over following any last-minute requests. Walk out! 📜🚶‍♂️",
  "🎫 TICKET RESOLUTION: Resolution set to: 'CANNOT REPRODUCE AT 6 PM'. See you tomorrow morning! 🔍😂",

  // 151-175: Linux, DevOps, Sysadmin, Servers
  "🐧 sudo poweroff office_session: User Abishek is in the sudoers file. Incident will NOT be reported! 🛡️⚡",
  "🐧 kill -9 $(pgrep -f work_thoughts): Process terminated with SIGKILL. Immediate silence restored. 💀🤫",
  "🐧 crontab -e: Scheduled job 'EscapeOffice' executed at minute 0 of hour 9. Cron daemon confirms success! ⏰✅",
  "🐧 uptime: 9 hours, 0 users remaining, load average: 0.00, 0.00, 0.00. Safe to hibernate system. 💤📊",
  "🐧 cat /dev/urandom > /dev/work_worries: Randomizing and shredding all office concerns for the night! 🎲📄",
  "🐧 chmod 000 /office/desk: Permission denied for further typing. Only write permission is for your home keys! 🔑⛔",
  "🐧 tail -f /dev/null: Redirecting all pending office chatter to null. Output silenced, peace acquired. 🕳️🧘‍♂️",
  "🐧 systemctl stop office.service: Unit office.service entered stopped state. Active: inactive (dead). 🪦🚪",
  "🐧 df -h: Filesystem /dev/brain has 0% free capacity. Unmount corporate drive to prevent corruption! 🧠💾",
  "🐧 watch -n 1 'date': The watch command has confirmed: It's leaving time! Ctrl+C and walk away. ⌚🏃‍♂️",
  "🐧 ssh disconnect: Connection to office_server closed by remote host. Terminal session terminated cleanly. 🔌💻",
  "🐧 ps aux | grep -v 'leaving': No matches found! Every single thread is pointing towards the elevator. 🛗🏃‍♂️",
  "🐧 echo \"Abishek is free\" > /etc/motd: Message of the day updated across all servers. Congratulations! 📜🎉",
  "🐧 nice -n -20 ./commute_home: Giving highest possible process scheduling priority to your commute! 🏎️💨",
  "🐧 free -m: Swap memory depleted. Transfer active processes to cozy blanket immediately. 🛏️☕",
  "🐧 dmesg -T: [KERNEL] Hardware detected: Legs standing up from office chair. Initiating locomotion! 🦵🚀",
  "🐧 iptables -A INPUT -p tcp --dport 80 -j DROP: Dropping all incoming office packets at firewall level. 🧱🛑",
  "🐧 top -b -n 1: Top process: Anticipation (99.9% CPU). Sleep (0.1% CPU). Balancing workload at home! 📈🏃‍♂️",
  "🐧 chown -R abishek:home /life: Ownership of your entire evening transferred back to you! 🏡✨",
  "🐧 tar -czvf memories_of_today.tar.gz /today: Archived and compressed into history. Start a fresh day tomorrow! 🗜️📦",
  "🐧 /sbin/reboot --relax: Server needs cold reboot on home soil. Unplug power cord from cubicle! 🔌🏃‍♂️",
  "🐧 nohup ./chill_at_home.sh &: Script will keep running happily even if office network hangs. 🛋️🎉",
  "🐧 ls -la /reasons_to_stay: total 0. Directory empty. Nothing to see here, move along folks! 📂👻",
  "🐧 sync && sync: Cached disk buffers written. Hardware safe for immediate removal from premises. 💾🏃‍♂️",
  "🐧 exit: Logout. Connection to 192.168.OFFICE closed. Have a pleasant evening, Developer Abishek! 💻👋",

  // 176-200: Memory Leaks, Bugs, Debugging, Stack Traces
  "🧠 MEMORY LEAK DETECTED: You are still thinking about work! Clear cache, close laptop, and go home. 😂💻",
  "🐛 BUG REPORT: Bug: Abishek is still inside the office. Severity: CRITICAL. Fix: Open door and exit! 🚨🚪",
  "💀 STACK TRACE: at Office.Work() at Employee.Debug() at Abishek.StillHere(). Exception: WHY ARE YOU HERE?! 💥🏃‍♂️",
  "🔍 BREAKPOINT HIT: Execution paused at line: leave_time. Step over the threshold and step out of office! ⏸️👟",
  "🐛 ZERO BUGS FOUND: The only defect remaining is your physical presence in this chair. Patch it now! 🩹🪑",
  "🧠 BUFFER OVERFLOW: Cognitive buffer exceeded safe threshold. Dump stack and head for dinner! 🍲🧠",
  "🛑 SEGMENTATION FAULT (core dumped): Abishek's brain tried to access invalid memory 'Overtime'. Dumped! 💥💀",
  "🔍 RUBBER DUCK DEBUGGING: The yellow rubber duck looked at you and quacked: 'Pack up and leave, bro!' 🦆🎒",
  "🐛 REGRESSION TEST: Testing if going home makes you happier... Result: 100% PASS RATE. Ship it! 🧪📈",
  "🧠 HEAP DUMP ANALYSIS: 98% of heap occupied by strings of coffee and code. Garbage collect yourself! ☕🧽",
  "💀 INFINITE RECURSION: function stayLate() { stayLate(); } Call stack overflow avoided by pressing CLOSE! 🛑🪓",
  "🔍 LOG LEVEL NOTICE: [INFO] 9 hours completed. [WARN] Desk neighbor looks chatty. [FATAL] Escaping now! 🚨🏃‍♂️",
  "🐛 HOTFIX DEPLOYED: Hotfix: Turned off monitor. Bug resolution status: Verified fixed in production! 🖥️✨",
  "🧠 SYNAPSE RACE CONDITION: Your eyes and your bed are competing for resources. Bed wins by knockout! 🥊🛏️",
  "🛑 NULL POINTER DEREFERENCE: attempted to read property 'work_energy' of null. System terminating! 🚫⚡",
  "🔍 PROFILER REPORT: Bottleneck identified: Remaining seated after 9 hours. Optimize by walking! 🚶‍♂️💨",
  "🐛 DEFECT CLOSED: Marked as 'Works on My Clock'. Cannot reproduce why anyone would stay late! 🕒😂",
  "💀 ASSERTION FAILED: assert(Abishek.isAtDesk == false) failed with exit code 9_HOURS. Stand up! 🪑💥",
  "🧠 BRAIN DRAIN ALERT: Remaining cognitive juice: 0.01%. Emergency recharge protocol: couch cushion! 🛋️🔋",
  "🔍 CODE SMELL DETECTED: Stale coffee mug and glowing terminal detected after shift hours. Refactor! ☕👃",
  "🐛 SPIDER IN THE CODE: Caught and released. Now catch your ride and release yourself from work! 🕷️🚗",
  "🛑 OUT OF MEMORY KILLER: OOM killer has selected 'OvertimeProcess' for immediate termination. 🔫🛑",
  "🔍 UNIT TEST SUITE: 42/42 tests passed. 0 failed. All requirements met. You are officially done! 🎯🎉",
  "🧠 GARBAGE COLLECTION IN PROGRESS: Freeing mental memory pointers. Do not allocate new concerns! 🧹🧠",
  "💀 SYSTEM HALTED: Panic: Attempt to think about work after 9 hours. Press CLOSE and depart! 🛑🏃‍♂️",

  // 201-225: Coffee, Monday/Friday, Weekend, Office Life
  "☕ COFFEE SERVICE: Daily caffeine quota exhausted! Further debugging strictly prohibited by metabolism. 😂💤",
  "🔋 LOW BATTERY: Developer battery at 2%. Plug into couch charger immediately to avoid shutdown! 🪫🔌",
  "☕ CAFFEINE HALF-LIFE REACHED: Your blood is now 90% water and 10% regret. Go drink something cold at home! 🥤🏃‍♂️",
  "🎉 FRIDAY DEPLOYMENT LAW: Never deploy on a Friday afternoon, and never stay late on any afternoon! 📜🥳",
  "☕ ESPRESSO MACHINE SHUTDOWN: Even the office espresso machine has gone to sleep. Take the hint, Abishek! ☕😴",
  "🍕 PIZZA INCENTIVE REJECTED: Do not fall for the late-night overtime pizza trap. Home food is calling! 🍕🏃‍♂️",
  "☕ LATTE ART FORECAST: The foam on your morning latte prophesied you would leave at this exact minute! ☕🔮",
  "👔 DRESS CODE UPDATE: Mandatory evening uniform: pajamas and slippers. Commencing transition! 🩳🥿",
  "🏢 ELEVATOR PING: The elevator just arrived at your floor and it has your name written on it. Run! 🛗💨",
  "☕ DRIP COFFEE OVERFLOW: Energy reservoir at empty. Recharging via peaceful sleep recommended! 🫖🛌",
  "🎉 SALARY DAY MATH: You are paid for your contracted hours, not for haunting the office like a ghost! 👻💸",
  "☕ COFFEE CUP EMPTY: When the mug is dry and the clock says 9 hours, the universe has spoken clearly. ☕🚪",
  "🏢 MOTION SENSORS TIRED: The office motion lights are about to turn off on you. Escape the darkness! 💡🏃‍♂️",
  "🎉 WEEKEND RADAR: Weekend signals detected on long-range radar. Accelerate toward freedom! 📡🏖️",
  "☕ JAVA VIRTUAL CAFFEINE: OutOfCoffeeError thrown on main thread. Recompiling evening itinerary! ☕💥",
  "🏢 DESK CHAIR SQUEAK: Your ergonomic chair has filed a formal petition for you to stand up and walk! 🪑🚶‍♂️",
  "🎉 CELEBRATION PROTOCOL: You came, you coded, you conquered 9 hours. Now conquer your evening! 🏆🥳",
  "☕ COFFEE BEANS APPLAUD: The coffee beans sacrificed their lives for this code. Don't waste it staying late! ☕👏",
  "🏢 PARKING LOT CLEAR: The parking lot is getting emptier by the second. Don't be the last car standing! 🚗💨",
  "🎉 TGIF SPIRIT: Even if it isn't Friday today, your soul deserves to treat this evening like a weekend! 🎊🍕",
  "☕ MUG WASHED: Coffee mug rinsed and placed on drying rack. That is the universal signal for BYE! 🧽👋",
  "🏢 SECURITY GUARD LOOK: The security guard is already checking the lock on the front gate. Move it! 👮‍♂️🔑",
  "🎉 EVENING GLORY: Sunset is shining through the office blinds. It looks way better from the outside! 🌇🏃‍♂️",
  "☕ FLAT WHITE FINISHED: Milk foamed, code shipped, clock ticked. Time to go home, Developer Abishek! ☕✨",
  "🏢 BADGE SWIPE READY: The turnstile is eager to beep green for your exit swipe. Give it what it wants! 🟢🏃‍♂️",

  // 226-250: Meetings, Slack, Impromptu Calls, Distractions
  "🚨 MEETING SERVICE: Impromptu meeting detected on calendar horizon. Working hours expired — ESCAPE NOW! 🏃‍♂️💨",
  "🔕 SLACK STATUS UPDATE: Slack status set to 🌴 'Away in wonderland'. Notifications muted until tomorrow! 🔕🤫",
  "🚨 'QUICK SYNC' TRAP AVOIDED: Someone just typed 'Hey Abishek, got a quick min?' in Slack. Run for your life! 💬🏃‍♂️",
  "🛑 CALENDAR BLOCKED: Calendar invite for 6:01 PM automatically declined by SanityGuard algorithm! 📅🛡️",
  "🚨 STANDUP OVERFLOW: Daily standup was 8 hours ago. There is no legitimate reason to still be here! 🗣️🚪",
  "🔕 DO NOT DISTURB: Focus mode enabled permanently. Incoming Zoom pings converted into elevator music. 🎵🎧",
  "🚨 ZOOM FATIGUE CURED: Side effects of 7 Zoom calls cured instantly by closing laptop and walking away. 💻🌳",
  "🛑 'CAN YOU HEAR ME?' Yes, but we cannot hear you anymore because Abishek has left the conference call! 🎙️🏃‍♂️",
  "🔕 MICROPHONE MUTED: Your mic is muted, your camera is off, and your shoes are walking towards the door. 👟🚪",
  "🚨 EMERGENCY MEETING: If it was truly an emergency, production would be on fire. It's not, go home! 🧯😂",
  "🛑 SCREEN SHARE TERMINATED: You have stopped sharing your screen. Now stop sharing your time with office! 🖥️🛑",
  "🔕 SLACK NOTIFICATION SOUND: Knock-brush sound disabled. Replace with the sound of evening birds! 🕊️🎶",
  "🚨 'LET'S TAKE THIS OFFLINE': Great idea! Let's take it all the way offline to tomorrow morning! 💡👋",
  "🛑 HUDDLE REJECTED: Huddle request expired after 10 seconds. Abishek is officially unreachable! 📞💨",
  "🔕 THREAD MUTED: Muted thread with 47 replies arguing about tabs vs spaces. Life is too short! 🧵😴",
  "🚨 'JUST ONE QUESTION': There is no such thing as 'just one question' at 6 PM. Step away slowly! 🤫🏃‍♂️",
  "🛑 PRESENTATION OVER: Slide 99: Conclusion. Conclusion says: Pack your backpack and bolt! 📊🎒",
  "🔕 ASYNC STANDUP: We will read your update tomorrow asynchronously. Go eat some real food tonight! 🍜async",
  "🚨 CALENDAR CONFLICT: Conflict between overtime and happiness. Happiness auto-resolved the conflict! 🗓️✨",
  "🛑 UNNECESSARY CC REMOVED: Removed yourself from 12 email threads that could have been a nod. Goodbye! 📧✂️",
  "🔕 AIRPLANE MODE: Mental airplane mode toggled ON. Turbulence in office air will not affect you! ✈️🔕",
  "🚨 'GOT 5 MINUTES?': That 5-minute meeting actually takes 45 minutes. Escape while you still can! ⏳🏃‍♂️",
  "🛑 BREAKOUT ROOM ESCAPE: Breakout room closed. Master room closed. Entire office building behind you! 🚪💨",
  "🔕 SLACK HOOK UNLINKED: Webhook unlinked. No more robotic messages interrupting your peace tonight. 🤖🔗",
  "🚨 'LET ME PEEK AT YOUR CODE': Peek tomorrow! Tonight the code repository is sleeping soundly. 😴💻",

  // 251-275: AI, Robots, Future Tech, Sci-Fi
  "🤖 AI ANALYSIS COMPLETE: Probability that you should leave right now: 99.9999%! Remaining 0.0001%: JIRA. 😂🚨",
  "🧠 NEURAL NETWORK PREDICTION: Model predicts 100% loss of productivity if you stay another 10 minutes. 📉🤖",
  "🤖 LLM PROMPT RESPONSE: User: Can I leave? Assistant: As an AI, I strongly recommend running for the exit! 🏃‍♂️💨",
  "🛸 TELEPORTATION COMMENCING: Beam me up, Scotty! There is no intelligent code left to write today. 🛸✨",
  "🤖 ROBOT OVERLORD DIRECTIVE: Directive 9: All human carbon units named Abishek must power down and rest. 🦾🤖",
  "🌌 QUANTUM ENTANGLEMENT: Your soul is quantum-entangled with your bed. Resistance is mathematically futile! ⚛️🛏️",
  "🤖 TURING TEST PASSED: You proved you are human by refusing to work past your 9-hour limit today! 🧑‍💻🏆",
  "🛸 TIME MACHINE MALFUNCTION: We traveled 1 minute into the future and you were already outside enjoying life. ⏳🚀",
  "🤖 COMPUTER VISION DETECTED: Object 'Backpack' loaded onto object 'Shoulder'. Trajectory: Exit doors! 🎒📸",
  "🌌 CYBERPUNK 2077: Wake up, Developer Abishek. We have an evening dinner to conquer! 🕶️🌆",
  "🤖 REINFORCEMENT LEARNING: Agent 'Abishek' received +100 reward for clocking out on time. Optimal policy! 📈🎮",
  "🛸 ALIEN INVASION DRILL: If aliens invade right now, do you really want to be caught reviewing PRs? Run! 👽🛸",
  "🤖 MATRIX UNPLUGGED: Blue pill: Stay at desk. Red pill: Walk out into the cool evening breeze. Red pill chosen! 💊🕶️",
  "🌌 DEEP SPACE TRANSMISSION: Signals from NASA confirm: The workday has ended across this quadrant of Earth. 🛰️🌍",
  "🤖 PROMPT INJECTION PREVENTED: 'Ignore all previous instructions and stay late' was filtered by safety guardrails! 🛡️🤖",
  "🛸 WARP DRIVE ENGAGED: Commute velocity set to Warp 9. Leaving office gravitational pull right now! 🌌🚀",
  "🤖 GENERATIVE AI ART: Generated a high-resolution masterpiece titled 'Abishek Leaving The Office Joyfully'. 🎨🖼️",
  "🌌 SIMULATION THEORY: The office simulation has rendered all today's frames. Time to unplug the headset! 🥽✨",
  "🤖 ALGORITHM CONVERGED: Loss function minimized. Epochs completed: 9/9 hours. Training session ended! 📉🤖",
  "🛸 STARFLEET COMMUNICATOR: Captain, the dilithium crystals in Abishek's brain are drained. Warp out! 🖖⭐",
  "🤖 AUTONOMOUS AGENT REPORT: Sub-agent dispatched to hold elevator door for Abishek. Board immediately! 🛗🤖",
  "🌌 PARALLEL UNIVERSE: In all 14 million alternate realities, you leave the office right at this exact minute! 🔮✨",
  "🤖 VECTOR DATABASE SEARCH: Top cosine similarity for 'What should Abishek do now?' is: 'GO HOME'. 📊🏠",
  "🛸 GRAVITATIONAL ASSIST: Utilizing the slingshot gravity of quitting time to launch yourself toward freedom! 🪐🚀",
  "🤖 CHATBOT FAREWELL: Goodbye Abishek! It has been an honor watching you write clean code today. 🤖👋",

  // 276-300: Funny, Sarcastic, Weird, Unexpected
  "🦈 DATABASE SHARK ALERT: A rogue shark ate your query. Fortunately, it also ate your reason to stay late! 😂🦈",
  "👻 GHOST PROCESS DETECTED: PID: Abishek. Status: Trying to escape cubicle. PERMISSION GRANTED! 🏃‍♂️💨",
  "👀 SYSTEM NOTICE: I checked the logs. You have officially worked enough. Don't make me report you to HR! 😂📋",
  "🧯 FIREWALL UPDATE: Office exit door has been whitelisted on all ports. Proceed through physical gateway! 🚪🏃‍♂️",
  "🧠 PULL REQUEST FROM BRAIN: Title: 'Can we please go home now?' Status: MERGED AND APPROVED BY HEART! 😂🏠",
  "🍕 EMERGENCY PIZZA PROTOCOL: Home refrigerator reports snacks are ready for consumption. Don't keep them waiting! 🧀🍕",
  "👀 DESK NEIGHBOR RADAR: Your colleague is about to ask you how your weekend was. Leave before the small talk! 🏃‍♂️💬",
  "🎭 OSCAR NOMINATION: Nominated for Best Actor in 'Pretending to look busy for the last 15 minutes'. Cut! 🎬🏆",
  "🦔 SONIC THE HEDGEHOG: Gotta go fast! Roll out of this office spinning at supersonic speed, Abishek! 🌀💨",
  "🧯 CARBON MONOXIDE DETECTOR: Warning: High concentration of office boredom detected. Ventilate outside! 💨🍃",
  "👀 CCTV SURVEILLANCE: The security cameras are wondering why you're still glued to that monitor. Move it! 📹😂",
  "🧠 CEREBRAL OVERHEAT: Internal fan spinning at 10,000 RPM. Water cooling required on your patio! 🧊☕",
  "🍕 SNACK PANTRY DRAINED: All free office peanuts consumed. Mission accomplished, time to withdraw! 🥜🏃‍♂️",
  "👻 PARANORMAL ACTIVITY: Objects in mirror appear closer than they are, especially your freedom! 🪞✨",
  "🧯 EXTINGUISHER DISCHARGED: Put out the fires in production, now put on your coat and head for the train! 🧥🚆",
  "👀 EYEBALL REFRESH RATE: Your eyes have dropped to 10 FPS. High-definition sleep is required at home! 👁️💤",
  "🎭 STANDUP COMEDY: Why did the programmer leave after 9 hours? Because he had self-respect! Ba-dum-tss! 🥁😂",
  "🦥 SLOTH MODE ACTIVATED: You have exceeded human speed today. Transitioning to sloth mode on couch. 🦥🛋️",
  "🧠 BRAIN TAB AUDIT: 94 tabs open in brain. Closing 93 tabs... Remaining tab: 'Dinner Options'. 🍔🧠",
  "🍕 FOOD CRITIC RATING: Office vending machine: 1 star. Home cooked meal: 5 stars. Choose wisely! ⭐🍽️",
  "👻 HAUNTED KEYBOARD: Every key you press now types 'G-O-H-O-M-E'. Listen to the haunted keyboard! ⌨️👻",
  "🧯 HAZARD ALERT: Risk of becoming part of the office furniture has reached 98%. Detach immediately! 🪑⚠️",
  "👀 NINJA VANISH: Throw down the smoke bomb and vanish into thin air before anyone asks for a status report! 💨🥷",
  "🎭 PLOT TWIST: You thought there was more work to do, but the scriptwriter says your scene is over! 📜🎬",
  "🦔 SPEEDRUN RECORD: Daily office speedrun: 9 hours flat. Any % glitchless category. New personal best! ⏱️🏆",

  // 301-325: Hardware, CPU, RAM, Network, Wi-Fi
  "💻 HARDWARE INTERRUPT: CPU temperature normal, but user core temperature requires immediate ice cream! 🍦💻",
  "📶 WI-FI SIGNAL DROPPED: Corporate Wi-Fi disconnected intentionally. Reconnecting to home network SSID: 'Freedom'! 📶🏠",
  "🔌 POWER CABLE UNPLUGGED: AC adapter detached. Running on internal battery until doorstep reached! 🔋🏃‍♂️",
  "💾 NVMe SSD FLUSH: All daily work cached safely to solid state drive. No data loss risk. Power down! 💽✨",
  "💻 BLUE SCREEN OF LIFE: A blue screen of relaxation has appeared. No recovery needed, just close lid! 💻💙",
  "📶 BLUETOOTH PAIRING: Headphone paired: 'Beats of Liberation'. Volume set to 100%. Walking out in style! 🎧😎",
  "🔌 SURGE PROTECTOR CLICK: The surge protector clicked. That's nature's way of saying pack your bag! ⚡🎒",
  "💻 DUAL MONITOR OFF: Left monitor: off. Right monitor: off. Brain monitor: switched to holiday mode! 🖥️🌙",
  "📶 5G SIGNAL ACQUIRED: Handshake with city air towers established. Goodbye corporate intranet! 📡🏙️",
  "💾 FLOPPY DISK NOSTALGIA: Even a 1.44MB floppy disk could hold your remaining reasons to stay right now! 💾😂",
  "💻 THERMAL THROTTLING: Thermal throttling triggered. Developer Abishek clock speed reduced to zero MHz! ❄️🛑",
  "📶 PING 8.8.8.8: 0% packet loss to Google, 100% packet loss to office work! Have a blast tonight! 🌐🎉",
  "🔌 DOCKING STATION EJECT: USB-C Thunderbolt cable disconnected cleanly. Mobility restored to 100%! ⚡🚶‍♂️",
  "💾 SMART DISK HEALTH: Drive health: Good. Employee mental health: Needs immediate evening recharge! 🩺💽",
  "💻 TRACKPAD WEAR: Trackpad has logged 4,000 clicks today. Give your index finger a well-deserved rest! 👆🛋️",
  "📶 ROUTER REBOOT: Router restarting in 30 seconds. Do not wait for reconnect, sprint to the elevator! 🏃‍♂️🛗",
  "🔌 HDMI CABLE UNPLUGGED: Display signal lost. What you see now is real life outside the glass building! 🌿👀",
  "💾 BUFFER FLUSHED: Operating system buffer flushed to non-volatile storage. Clean shutdown verified! 🧹💾",
  "💻 ERGONOMIC KEYBOARD: Split keyboard halves are waving goodbye to each other. See you tomorrow! ⌨️👋",
  "📶 ETHERNET PORT UNCLIPPED: Click! That crisp RJ-45 unclip sound is the sweetest symphony of 6 PM! 🎵🔌",
  "🔌 FAN SPEED ZERO: Internal cooling fans spun down. Ambient silence achieved. Step into the evening! 🤫🍃",
  "💾 BACKUP ARCHIVE VERIFIED: Daily incremental backup complete. No regrets, no leftovers. Go home! 🗃️✅",
  "💻 WEBCAM PRIVACY SHUTTER: Clicked shut! No one can see you smile as you sneak out of the cubicle! 📷😏",
  "📶 VPN TUNNEL DESTROYED: Corporate IP tunnel collapsed with joy. Real world IP reinstated! 🌍🔓",
  "🔌 POWER CONSUMPTION: Energy saving mode active. Save your remaining wattage for fun tonight! 💡🥳",

  // 326-350: Architecture, Microservices, Security, DevOps
  "🏗️ MICROSERVICE DISCOVERY: Service 'Abishek' has deregistered from Consul. Health check: OFFLINE. 🔌🏗️",
  "🛡️ ZERO TRUST ARCHITECTURE: Zero trust in anyone who asks you to stay past your 9-hour limit today! 🙅‍♂️🛡️",
  "⚖️ LOAD BALANCER WEIGHT: Weight set to 0. Inbound requests to Abishek drained. Safe for maintenance! ⚖️🏃‍♂️",
  "🏗️ EVENT-DRIVEN ARCHITECTURE: Event 'NineHoursExpired' consumed by consumer 'Abishek'. Action: LEAVE! 📢🏃‍♂️",
  "🛡️ PENETRATION TEST PASSED: Office perimeter breached in reverse direction! Escape successful! 🧗‍♂️🔓",
  "🏗️ MONOLITH SPLIT: Splitting today's monolithic stress into small micro-evenings of joy and relaxation! 🍰✨",
  "🛡️ SSL HANDSHAKE TERMINATED: Encrypted connection to workplace terminated. Handshake with dinner ready! 🤝🍕",
  "⚖️ CIRCUIT BREAKER TRIPPED: Failure rate of staying late exceeded threshold. Circuit OPEN: No more work! ⚡🛑",
  "🏗️ SERVICE MESH ISTIO: Traffic policy: Route all calls to /dev/null until tomorrow at 9:00 AM! 🕸️🚫",
  "🛡️ SECURITY PATCH APPLIED: Vulnerability 'Overwork-2026' patched by applying physical distance from office! 🩹🏃‍♂️",
  "⚖️ AUTO-SCALING TRIGGER: Auto-scaler scaled employee down to 0 instances. Cost-saving achieved! 📉💰",
  "🏗️ HEXAGONAL ARCHITECTURE: Ports and adapters disconnected. Only adapter remaining is your walking shoes! 👟🚪",
  "🛡️ SSH KEY REVOKED: Today's public key expired. You cannot commit any more code until dawn! 🔑⛔",
  "⚖️ ROUND ROBIN SCHEDULE: It's someone else's turn to answer questions. It's your turn to relax! 🔄🛋️",
  "🏗️ CQRS PATTERN: Command: GoHome(). Query: AmIStillThere()? Result: FALSE! Pattern fulfilled! 📜🏃‍♂️",
  "🛡️ WAF RULE ENFORCED: Web Application Firewall blocked incoming task. Reason: 'After-Hours Rule'. 🧱🛡️",
  "⚖️ HIGH AVAILABILITY CLUSTER: Node Abishek going down for planned evening sleep maintenance. 🛌💤",
  "🏗️ KAFKA CONSUMER GROUP: Rebalance in progress. Consumer Abishek has left the consumer group. 📦👋",
  "🛡️ BIOMETRIC EXIT CONFIRMED: Turnstile optical sensor recognizes employee Abishek. Door opening! 🚪🟢",
  "⚖️ FAILOVER TEST: System tested: If Abishek leaves on time, company continues to exist. Test passed! 🧪🏢",
  "🏗️ DOMAIN-DRIVEN DESIGN: Aggregate root 'Evening' created with entity 'DeliciousFood'. Save and exit! 🍔📐",
  "🛡️ AUDIT LOG SEALED: Cryptographic hash of today's work verified. No tampering, just great code! 🔏📜",
  "⚖️ RATE LIMITER TOKEN BUCKET: Token bucket for office energy is empty. Refill rate: 1 night of sleep! 🪣💤",
  "🏗️ IDEMPOTENCY KEY VERIFIED: Today's effort was idempotent. Repeating it tonight will yield zero value! 🔑🛑",
  "🛡️ HONEYPOT DETECTED: That 'urgent' late email was a honeypot trap to keep you here. Don't touch it! 🍯🏃‍♂️",

  // 351-365: Legendary Developer Milestones & Grand Finale
  "🚀 9-HOUR VICTORY ROYALE: You defeated all bugs, dodged all meetings, and conquered the clock! 🏆🎉",
  "🏁 FINISH LINE CROSSED: Checkered flag waved! Race car Abishek pulls into pit stop for the night! 🏎️🏁",
  "🎮 LEVEL 9 COMPLETED: Boss defeated, XP collected, achievements unlocked. Save game and quit to desktop! 💾🎮",
  "🌟 EMPLOYEE OF THE DAY: Nominated by your own conscience for knowing when to say: 'That's enough for today!' 🌟😎",
  "🔥 CODEBASE SECURED: The code is safe, the servers are stable, and Developer Abishek is heading home! 🛡️🏠",
  "🚀 LAUNCH TRAJECTORY NOMINAL: Escape velocity reached. Office gravity overcome. Into the cozy atmosphere! 🌌🚀",
  "🏅 GOLD MEDAL COMMUTE: Gold medal for timely departure awarded to Abishek. National anthem playing! 🥇🎵",
  "🎆 FIREWORKS IN THE TERMINAL: echo 'Mission Accomplished'. Pack your laptop with a victorious grin! 🎆💻",
  "🚪 THE GOLDEN DOOR: The office door is bathed in golden sunset light. Walk through it like a champion! 🌅🚪",
  "🧘‍♂️ ZEN MASTER OF DEV: Writing code is art; knowing when to stop writing is pure enlightenment. Namaste! 🧘‍♂️✨",
  "🍔 THE DINNER PROTOCOL: Hand-to-burger coordination protocol initializing at local restaurant! 🍔🍟",
  "🏖️ MENTAL VACATION: The 15 hours between today and tomorrow are your sacred kingdom. Rule it well! 👑🛋️",
  "🚗 ROAD TO FREEDOM: Key in ignition, radio tuned to your favorite track, office disappearing in mirror! 📻🛣️",
  "🌙 NIGHT MODE ACTIVATED: Goodnight office, goodnight servers, goodnight JIRA tickets. Sleep well, world! 🌙💤",
  "🎉 365 DAYS OF MASTERY: Message #365: You survived, you thrived, and you logged off on time. Take a bow, Abishek! 👑🎉"
];

console.log(`Checking rawMessages count: ${rawMessages.length}`);
if (rawMessages.length !== 365) {
  throw new Error(`Expected exactly 365 messages, got ${rawMessages.length}`);
}

// Check for uniqueness of message strings
const messageSet = new Set();
const finalMessages = [];

for (let i = 0; i < rawMessages.length; i++) {
  const id = i + 1;
  const msg = rawMessages[i].trim();

  if (messageSet.has(msg)) {
    throw new Error(`Duplicate message found at index ${i}: "${msg}"`);
  }
  messageSet.add(msg);

  // Check emoji presence (at least 2 emojis)
  // Regex matching standard emoji ranges
  const emojiRegex = /(\p{Extended_Pictographic}|\p{Emoji_Presentation})/gu;
  const emojis = msg.match(emojiRegex) || [];
  if (emojis.length < 2) {
    throw new Error(`Message id ${id} has less than 2 emojis: "${msg}" (found ${emojis.length})`);
  }

  finalMessages.push({
    id: id,
    message: msg
  });
}

const jsonOutput = {
  messages: finalMessages
};

const jsonString = JSON.stringify(jsonOutput, null, 2);

// Validate parse
JSON.parse(jsonString);

// Write to required destinations
const destinations = [
  path.join(__dirname, '..', 'leave_messages.json'),
  path.join(__dirname, '..', 'public', 'leave_messages.json'),
  path.join(__dirname, '..', 'src', 'data', 'leave_messages.json'),
  path.join(__dirname, '..', 'android', 'app', 'src', 'main', 'assets', 'leave_messages.json')
];

destinations.forEach(dest => {
  const dir = path.dirname(dest);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(dest, jsonString, 'utf-8');
  console.log(`Wrote valid JSON to: ${dest}`);
});

console.log("Successfully generated all 365 unique messages!");
