document.addEventListener('DOMContentLoaded', () => {
    // Apply stored theme on load
    const currentStoredTheme = localStorage.getItem('theme') || 'light';
    if (currentStoredTheme === 'dark') {
        document.body.classList.add('dark-mode');
    }

    const userInput = document.getElementById('user-input');
    const outputSection = document.getElementById('output-section');
    const loader = document.getElementById('loader');

    // Command Hub
    const generateBtn = document.getElementById('generate-btn');
    const fixBtn = document.getElementById('fix-btn');
    const explainBtn = document.getElementById('explain-btn');
    const clearBtn = document.getElementById('clear-btn');

    // Auth Modal Elements
    const authModalOverlay = document.getElementById('auth-modal-overlay');
    const modalSignupBtn = document.getElementById('modal-signup-btn');
    const modalCloseBtn = document.getElementById('modal-close-btn');

    // Theme Toggle Elements
    const themeToggleFloat = document.getElementById('theme-toggle-float');

    // Mobile Menu Elements
    const moreBtn = document.getElementById('more-btn');
    const dropdownMenu = document.getElementById('dropdown-menu');
    let isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    let isProcessing = false;

    // --- Dynamic Auth Sync Hub ---
    if (typeof firebase !== 'undefined' && firebase.auth) {
        firebase.auth().onAuthStateChanged((user) => {
            isLoggedIn = !!user;
            if (user) {
                localStorage.setItem("isLoggedIn", "true");
            } else {
                localStorage.setItem("isLoggedIn", "false");
                // --- Data Privacy: Clear history on logout ---
                localStorage.removeItem('secretSessions');
                localStorage.removeItem('secretActiveSession');
                // Redirect unauthenticated hub arrivals back to home
                if (window.location.pathname.includes('Secret')) {
                    window.location.href = '../web.html';
                }
            }
        });
    }

    // --- AI Logic (Secure Backend Integration) ---
    // Change this to your Render URL after you deploy the backend!
    const BACKEND_URL = "https://dg-backend-e2tu.onrender.com/"; 

    async function getAIResponse(prompt, type, history) {
        try {
            const response = await fetch(BACKEND_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ prompt, type, history })
            });

            if (!response.ok) {
                const errorData = await response.json();
                return `AI Error: ${errorData.details || 'Connection failed'}`;
            }

            const data = await response.json();
            return data.message;

        } catch (error) {
            console.error("Backend connection error:", error);
            return "Connection Failed. Ensure your backend is running or check the URL.";
        }
    }

    // --- Action Handler ---
    async function handleAction(type) {
        if (!isLoggedIn) {
            document.getElementById('auth-modal-overlay').style.display = 'flex';
            return;
        }

        const input = userInput.value.trim();
        if (!input || isProcessing) return;

        isProcessing = true;
        loader.style.display = 'flex';

        // Add user bubble and get current history
        addBubble(input, 'user');
        const sessions = getSessions();
        const currentSession = sessions.find(s => s.id === activeSessionId) || { messages: [] };
        
        // Pass past messages (excluding the one we just added) to the backend
        const history = currentSession.messages.slice(0, -1);

        userInput.value = '';

        const response = await getAIResponse(input, type, history);

        loader.style.display = 'none';
        isProcessing = false;
        addBubble(response, 'ai');
    }

    // --- Advanced Session History System ---
    let activeSessionId = localStorage.getItem('secretActiveSession') || Date.now().toString();

    function getSessions() {
        return JSON.parse(localStorage.getItem('secretSessions')) || [];
    }

    function saveSession(messages) {
        let sessions = getSessions();
        let sessionIndex = sessions.findIndex(s => s.id === activeSessionId);

        // Auto-generate title from first user prompt
        let title = "New Conversation";
        const firstUserMessage = messages.find(m => m.sender === 'user');
        if (firstUserMessage) {
            title = firstUserMessage.content.substring(0, 30) + (firstUserMessage.content.length > 30 ? "..." : "");
        }

        if (sessionIndex >= 0) {
            sessions[sessionIndex].messages = messages;
            sessions[sessionIndex].title = title;
        } else {
            sessions.unshift({ id: activeSessionId, title: title, messages: messages });
        }

        // Keep only last 10 chat sessions
        if (sessions.length > 10) {
            sessions = sessions.slice(0, 10);
        }

        localStorage.setItem('secretSessions', JSON.stringify(sessions));
    }

    // --- Helpers ---
    function addBubble(content, sender = 'ai', save = true) {
        const bubble = document.createElement('div');
        bubble.className = `chat-bubble ${sender}-bubble`;
        bubble.innerHTML = `<p>${content.replace(/\n/g, '<br>')}</p>`;
        outputSection.appendChild(bubble);
        outputSection.scrollTop = outputSection.scrollHeight;

        if (save) {
            let sessions = getSessions();
            let currentSession = sessions.find(s => s.id === activeSessionId) || { messages: [] };

            currentSession.messages.push({ content, sender });
            saveSession(currentSession.messages);
        }
    }

    // Load History automatically
    function loadHistory() {
        let sessions = getSessions();
        let currentSession = sessions.find(s => s.id === activeSessionId);

        if (currentSession && currentSession.messages.length > 0) {
            outputSection.innerHTML = ''; // clear default greeting
            currentSession.messages.forEach(msg => {
                addBubble(msg.content, msg.sender, false);
            });
        } else {
            outputSection.innerHTML = '';
            addBubble("Hey! I'm <span class=\"futuristic-name\"><span class=\"dg-part\">DG</span> ALEPHUSTA</span>. Paste your code and let's solve some problems together.", 'ai', false);
        }
    }
    loadHistory();

    // Event Listeners
    generateBtn.addEventListener('click', () => handleAction('generate'));
    fixBtn.addEventListener('click', () => handleAction('fix'));
    explainBtn.addEventListener('click', () => handleAction('explain'));

    // New Chat Setup
    function startNewChat() {
        activeSessionId = Date.now().toString();
        localStorage.setItem('secretActiveSession', activeSessionId);
        outputSection.innerHTML = '';
        addBubble("Hey! I'm <span class=\"futuristic-name\"><span class=\"dg-part\">DG</span> ALEPHUSTA</span>. Paste your code and let's solve some problems together.", 'ai', false);
    }
    clearBtn.addEventListener('click', startNewChat);
    const clearBtnM = document.getElementById('clear-btn-m');
    if (clearBtnM) clearBtnM.addEventListener('click', startNewChat);
    const sidebarNewChat = document.getElementById('sidebar-newchat-btn');
    if (sidebarNewChat) sidebarNewChat.addEventListener('click', startNewChat);

    // --- History Modal UI ---
    const historyModalOverlay = document.getElementById('history-modal-overlay');
    const historyBtn = document.getElementById('history-btn');
    const historyBtnM = document.getElementById('history-btn-m');
    const historyCloseBtn = document.getElementById('history-close-btn');
    const historyList = document.getElementById('history-list');

    function renderHistoryList() {
        historyList.innerHTML = '';
        let sessions = getSessions();

        if (sessions.length === 0) {
            historyList.innerHTML = '<p style="color: gray; text-align: center;">No chat history yet.</p>';
            return;
        }

        sessions.forEach((session, index) => {
            const itemContainer = document.createElement('div');
            itemContainer.className = 'history-item-container';
            itemContainer.style.display = 'flex';
            itemContainer.style.gap = '10px';
            itemContainer.style.marginBottom = '10px';

            const btn = document.createElement('button');
            btn.className = 'btn';
            btn.style.flex = '1';
            btn.style.textAlign = 'left';
            btn.style.justifyContent = 'flex-start';
            btn.style.background = session.id === activeSessionId ? 'var(--primary)' : 'rgba(255,255,255,0.05)';
            btn.style.color = session.id === activeSessionId ? '#fff' : 'var(--text-primary)';

            btn.innerHTML = `<i class="fa-solid fa-message" style="margin-right: 10px;"></i> ${session.title}`;
            btn.addEventListener('click', () => {
                activeSessionId = session.id;
                localStorage.setItem('secretActiveSession', activeSessionId);
                loadHistory();
                historyModalOverlay.style.display = 'none';
            });

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'btn delete-session-btn';
            deleteBtn.style.padding = '0.7rem';
            deleteBtn.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;
            deleteBtn.title = "Delete Session";
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (confirm("Delete this conversation?")) {
                    sessions.splice(index, 1);
                    localStorage.setItem('secretSessions', JSON.stringify(sessions));
                    if (activeSessionId === session.id) {
                        startNewChat();
                    }
                    renderHistoryList();
                }
            });

            itemContainer.appendChild(btn);
            itemContainer.appendChild(deleteBtn);
            historyList.appendChild(itemContainer);
        });
    }

    if (historyBtn) historyBtn.addEventListener('click', () => { renderHistoryList(); historyModalOverlay.style.display = 'flex'; });
    if (historyBtnM) historyBtnM.addEventListener('click', () => { renderHistoryList(); historyModalOverlay.style.display = 'flex'; });
    const sidebarHistoryBtn = document.getElementById('sidebar-history-btn');
    if (sidebarHistoryBtn) sidebarHistoryBtn.addEventListener('click', () => { renderHistoryList(); historyModalOverlay.style.display = 'flex'; });
    if (historyCloseBtn) historyCloseBtn.addEventListener('click', () => historyModalOverlay.style.display = 'none');

    if (modalSignupBtn) {
        modalSignupBtn.addEventListener('click', () => {
            window.location.href = '../signin/SIGN IN.html';
        });
    }

    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', () => {
            if (authModalOverlay) authModalOverlay.style.display = 'none';
        });
    }

    if (authModalOverlay) {
        authModalOverlay.addEventListener('click', (event) => {
            if (event.target === authModalOverlay) {
                authModalOverlay.style.display = 'none';
            }
        });
    }

    // Theme Toggle Logic
    if (themeToggleFloat) {
        themeToggleFloat.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });
    }

    // Mobile Menu Toggle Logic - Handled by global web.js
});
