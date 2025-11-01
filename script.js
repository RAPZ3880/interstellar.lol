let currentGameUrl = '';
let currentGameTitle = '';
const PROXY_URL = '';

// --- SETTINGS THEME-DEPENDENT COLORS LOGIC ---
// ... (unchanged: setSettingsColors, shadeColor, etc.)

function setSettingsColors(themeObj) {
    document.documentElement.style.setProperty('--settings-bg', themeObj.bg || '#111');
    document.documentElement.style.setProperty('--settings-text', themeObj.text || '#fff');
    document.documentElement.style.setProperty('--settings-fieldset-bg', themeObj.bg ? shadeColor(themeObj.bg, 12) : '#191929');
    document.documentElement.style.setProperty('--settings-border', themeObj.neon || '#ff69b4');
    document.querySelectorAll('#settingsScreen input[type="color"]').forEach(c=>{
        c.style.background = themeObj.bg || '#111';
    });
}
function shadeColor(color, percent) {
    if (!color || color.length !== 7) return color;
    let R = parseInt(color.substring(1,3),16);
    let G = parseInt(color.substring(3,5),16);
    let B = parseInt(color.substring(5,7),16);
    R = Math.floor(R * (100 + percent) / 100);
    G = Math.floor(G * (100 + percent) / 100);
    B = Math.floor(B * (100 + percent) / 100);
    R = (R<255)?R:255; G = (G<255)?G:255; B = (B<255)?B:255;
    const RR = (R.toString(16).length==1) ? "0"+R.toString(16) : R.toString(16);
    const GG = (G.toString(16).length==1) ? "0"+G.toString(16) : G.toString(16);
    const BB = (B.toString(16).length==1) ? "0"+B.toString(16) : B.toString(16);
    return "#"+RR+GG+BB;
}

// --- Time & Settings / Typewriter for Title and Tab ---
const timeDisplay=document.getElementById('time'); 
let isVisible=false; // default: off

function updateTime(){ timeDisplay.textContent=new Date().toLocaleTimeString(); }
setInterval(updateTime,1000); updateTime();
function toggleTime(){ 
    isVisible=!isVisible; 
    timeDisplay.style.display=isVisible?'block':'none'; 
    document.getElementById('toggleButton').textContent=isVisible?'Hide Time':'Show Time'; 
}

// --- Typewriter effect for main title and tab title ---
const mainTitleElement = document.querySelector('.title-row h1');
const tabTitleElement = document.querySelector('title');
const typewriterText = "interstellar!";
let typewriterIndex = 0;
let typewriterDirection = 1;
let typewriterDelay = 120;
let clearingDelay = 900;
let pauseDelay = 1400;

function typeWriterTitle() {
    // Typing out
    if (typewriterDirection === 1) {
        if (typewriterIndex <= typewriterText.length) {
            const str = typewriterText.slice(0, typewriterIndex);
            mainTitleElement.textContent = str + (typewriterIndex % 2 === 0 ? "▋" : "");
            tabTitleElement.textContent = str || " ";
            typewriterIndex++;
            setTimeout(typeWriterTitle, typewriterDelay);
        } else {
            // Pause at end, then start deleting
            mainTitleElement.textContent = typewriterText;
            tabTitleElement.textContent = typewriterText;
            setTimeout(() => {
                typewriterDirection = -1;
                setTimeout(typeWriterTitle, clearingDelay);
            }, pauseDelay);
        }
    }
    // Deleting out
    else if (typewriterDirection === -1) {
        if (typewriterIndex >= 0) {
            const str = typewriterText.slice(0, typewriterIndex);
            mainTitleElement.textContent = str + (typewriterIndex % 2 === 0 ? "▋" : "");
            tabTitleElement.textContent = str || " ";
            typewriterIndex--;
            setTimeout(typeWriterTitle, typewriterDelay);
        } else {
            // Pause at blank, then type again
            mainTitleElement.textContent = "";
            tabTitleElement.textContent = "";
            setTimeout(() => {
                typewriterDirection = 1;
                typewriterIndex = 0;
                setTimeout(typeWriterTitle, clearingDelay);
            }, pauseDelay);
        }
    }
}
document.addEventListener('DOMContentLoaded', () => {
    // Start with time hidden
    timeDisplay.style.display='none';
    document.getElementById('toggleButton').textContent='Show Time';
    typeWriterTitle();
});

// --- Settings Persistence (unchanged) ---
function saveSettings() {
    const settings = {
        bgColor: document.getElementById('bgColor').value,
        textColor: document.getElementById('textColor').value,
        neonColor: document.getElementById('neonColor').value,
        timeColor: document.getElementById('timeColor').value,
        timeNeonColor: document.getElementById('timeNeonColor').value,
        buttonColor: document.getElementById('buttonColor').value,
        buttonTextColor: document.getElementById('buttonTextColor').value,
        buttonHoverColor: document.getElementById('buttonHoverColor').value,
        snowColor: document.getElementById('snowColor').value,
        frameBorderColor: document.getElementById('frameBorderColor').value,
        frameShadowColor: document.getElementById('frameShadowColor').value,
        toggleFPS: document.getElementById('toggleFPS').checked,
        toggleIframes: document.getElementById('toggleIframes').checked,
        notepadText: document.getElementById('notepadText')?.value || ""
    };
    try {
        localStorage.setItem('toxins_settings', JSON.stringify(settings));
    } catch (e) {}
}
function loadSettings() {
    try {
        const storedSettings = localStorage.getItem('toxins_settings');
        if (!storedSettings) return;
        const settings = JSON.parse(storedSettings);
        document.getElementById('bgColor').value = settings.bgColor;
        document.getElementById('textColor').value = settings.textColor;
        document.getElementById('neonColor').value = settings.neonColor;
        document.getElementById('timeColor').value = settings.timeColor;
        document.getElementById('timeNeonColor').value = settings.timeNeonColor;
        document.getElementById('buttonColor').value = settings.buttonColor;
        document.getElementById('buttonTextColor').value = settings.buttonTextColor;
        document.getElementById('buttonHoverColor').value = settings.buttonHoverColor;
        document.getElementById('snowColor').value = settings.snowColor;
        document.getElementById('frameBorderColor').value = settings.frameBorderColor;
        document.getElementById('frameShadowColor').value = settings.frameShadowColor;
        document.getElementById('toggleFPS').checked = settings.toggleFPS;
        document.getElementById('toggleIframes').checked = settings.toggleIframes;
        updateColors(false); 
        if (settings.toggleFPS) toggleFPS(); 
        if (settings.toggleIframes) toggleIframeHighlight(); 
        if (settings.notepadText !== undefined && document.getElementById('notepadText')) {
            document.getElementById('notepadText').value = settings.notepadText;
        }
    } catch (e) {
        updateColors(false); 
    }
}
function updateColors(shouldSave = true){
  const neon=document.getElementById('neonColor').value;
  const timeNeon=document.getElementById('timeNeonColor').value;
  const buttonTextColor = document.getElementById('buttonTextColor').value;
  const buttonHoverColor = document.getElementById('buttonHoverColor').value;
  const textColor = document.getElementById('textColor').value;
  const bgColor = document.getElementById('bgColor').value;
  const frameBorderColor = document.getElementById('frameBorderColor').value;
  const frameShadowColor = document.getElementById('frameShadowColor').value;
  document.documentElement.style.setProperty('--text-color', textColor);
  document.documentElement.style.setProperty('--button-hover-color', buttonHoverColor);
  document.documentElement.style.setProperty('--button-text-color', buttonTextColor);
  document.documentElement.style.setProperty('--neon-color', neon);
  document.documentElement.style.setProperty('--frame-border-color', frameBorderColor);
  document.documentElement.style.setProperty('--frame-shadow-color', frameShadowColor);
  setSettingsColors({ bg: bgColor, text: textColor, neon: neon });
  document.body.style.backgroundColor=bgColor;
  document.body.style.color=textColor;
  document.querySelectorAll('h1').forEach(h=>{ if(h!==timeDisplay) h.style.textShadow=`0 0 5px ${neon},0 0 10px ${neon},0 0 20px ${neon},0 0 40px ${neon}`; });
  timeDisplay.style.color=document.getElementById('timeColor').value;
  timeDisplay.style.textShadow=`0 0 5px ${timeNeon},0 0 10px ${timeNeon},0 0 20px ${timeNeon},0 0 40px ${timeNeon}`;
  document.querySelectorAll('button:not(.calc-buttons button)').forEach(b=>{ 
      b.style.backgroundColor=document.getElementById('buttonColor').value; 
      b.style.color=buttonTextColor; 
  });
  let style=document.createElement('style'); 
  style.innerHTML=`
      button:not(.calc-buttons button):hover{background-color:${buttonHoverColor} !important;}
  `; 
  const oldStyle = document.getElementById('dynamic-styles');
  if (oldStyle) { oldStyle.remove(); }
  style.id = 'dynamic-styles';
  document.head.appendChild(style);
  document.querySelectorAll('.snowflake').forEach(s=>s.style.backgroundColor=document.getElementById('snowColor').value);
  if (!document.getElementById('toggleIframes').checked) {
      document.documentElement.style.setProperty('--iframe-border-color', frameBorderColor);
  } else {
      document.documentElement.style.setProperty('--iframe-border-color', 'red');
  }
  if (shouldSave) saveSettings();
}

// --- Theme List (unchanged) ---
const themes={
  "toxinlol": {bg:"#000000", text:"#ffffff", neon:"#6600ff", time:"#ffffff", timeNeon:"#6600ff", button:"#000000", buttonText:"#ffffff", buttonHover:"#3700ff", snow:"#9b00ff", frameBorder:"#2b003d", frameShadow:"#7a00ab"},
  // ... rest unchanged, see previous messages ...
  "theme1": {bg:"#1a1a1a", text:"#f2f2f2", neon:"#ff0055", time:"#ffffff", timeNeon:"#ff0055", button:"#222222", buttonText:"#ffffff", buttonHover:"#ff3399", snow:"#ff66aa", frameBorder:"#4d001a", frameShadow:"#ff4d88"},
  "theme2": {bg:"#0b0b30", text:"#e0e0ff", neon:"#00ffff", time:"#ffffff", timeNeon:"#00ffff", button:"#111144", buttonText:"#ffffff", buttonHover:"#00cccc", snow:"#33ffff", frameBorder:"#001a1a", frameShadow:"#00e6e6"},
  "theme3": {bg:"#100000", text:"#ffdddd", neon:"#ff2200", time:"#ffffff", timeNeon:"#ff2200", button:"#330000", buttonText:"#ffffff", buttonHover:"#ff5500", snow:"#ff3300", frameBorder:"#330000", frameShadow:"#ff5500"},
  "theme4": {bg:"#001100", text:"#ddffdd", neon:"#00ff33", time:"#ffffff", timeNeon:"#00ff33", button:"#003300", buttonText:"#ffffff", buttonHover:"#00cc33", snow:"#00ff66", frameBorder:"#002200", frameShadow:"#00cc00"},
  "theme5": {bg:"#111111", text:"#ffffaa", neon:"#ffff00", time:"#ffffff", timeNeon:"#ffff00", button:"#222222", buttonText:"#000000", buttonHover:"#ffff55", snow:"#ffff88", frameBorder:"#333300", frameShadow:"#ffff00"},
  "theme6": {bg:"#222222", text:"#aaffff", neon:"#00aaff", time:"#ffffff", timeNeon:"#00aaff", button:"#333333", buttonText:"#ffffff", buttonHover:"#33ccff", snow:"#66ddff", frameBorder:"#002233", frameShadow:"#0099ff"},
  "theme7": {bg:"#0a0a1a", text:"#ffaaff", neon:"#ff00cc", time:"#ffffff", timeNeon:"#ff00cc", button:"#1a001a", buttonText:"#ffffff", buttonHover:"#ff55ff", snow:"#ff66ff", frameBorder:"#330033", frameShadow:"#ff00ff"},
  "theme8": {bg:"#101010", text:"#ffccaa", neon:"#ffaa00", time:"#ffffff", timeNeon:"#ffaa00", button:"#222211", buttonText:"#000000", buttonHover:"#ffdd33", snow:"#ffaa33", frameBorder:"#332200", frameShadow:"#ffaa00"},
  "theme9": {bg:"#000022", text:"#aaccff", neon:"#4466ff", time:"#ffffff", timeNeon:"#4466ff", button:"#000044", buttonText:"#ffffff", buttonHover:"#6688ff", snow:"#99bbff", frameBorder:"#000033", frameShadow:"#6666ff"},
  "theme10": {bg:"#220000", text:"#ffaaaa", neon:"#ff2222", time:"#ffffff", timeNeon:"#ff2222", button:"#440000", buttonText:"#ffffff", buttonHover:"#ff5555", snow:"#ff8888", frameBorder:"#440000", frameShadow:"#ff3333"},
  "theme11": {bg:"#001122", text:"#aaffff", neon:"#22ccff", time:"#ffffff", timeNeon:"#22ccff", button:"#002244", buttonText:"#ffffff", buttonHover:"#44eeff", snow:"#66ffff", frameBorder:"#002244", frameShadow:"#33ccff"},
  "theme12": {bg:"#112211", text:"#ddffaa", neon:"#66ff33", time:"#ffffff", timeNeon:"#66ff33", button:"#223322", buttonText:"#ffffff", buttonHover:"#99ff66", snow:"#aaff77", frameBorder:"#223322", frameShadow:"#33ff00"},
  "theme13": {bg:"#222211", text:"#ffffcc", neon:"#ffff33", time:"#ffffff", timeNeon:"#ffff33", button:"#333322", buttonText:"#000000", buttonHover:"#ffff66", snow:"#ffff88", frameBorder:"#444400", frameShadow:"#ffff66"},
  "theme14": {bg:"#110022", text:"#ddccff", neon:"#aa00ff", time:"#ffffff", timeNeon:"#aa00ff", button:"#220044", buttonText:"#ffffff", buttonHover:"#cc33ff", snow:"#bb66ff", frameBorder:"#220044", frameShadow:"#cc00ff"},
  "theme15": {bg:"#001111", text:"#aaffff", neon:"#00ffcc", time:"#ffffff", timeNeon:"#00ffcc", button:"#002222", buttonText:"#ffffff", buttonHover:"#33ffee", snow:"#66ffff", frameBorder:"#002222", frameShadow:"#00ff99"},
  "theme16": {bg:"#111100", text:"#ffffaa", neon:"#ffff66", time:"#ffffff", timeNeon:"#ffff66", button:"#222200", buttonText:"#000000", buttonHover:"#ffff88", snow:"#ffff99", frameBorder:"#333300", frameShadow:"#ffff99"}
};

// --- Notepad & Calculator Logic ---
const calcDisplay = document.getElementById('calcDisplay');
let currentInput = '0';
let currentOperator = null;
let firstOperand = null;
let waitingForSecondOperand = false;

function updateDisplay() { calcDisplay.value = currentInput; }
function operate(num1, num2, operator) {
    if (operator === '+') return num1 + num2;
    if (operator === '-') return num1 - num2;
    if (operator === '*') return num1 * num2;
    if (operator === '/') return num1 / num2;
    return num2;
}

function appendNumber(number) {
    if (waitingForSecondOperand) {
        currentInput = String(number);
        waitingForSecondOperand = false;
    } else {
        currentInput = currentInput === '0' ? String(number) : currentInput + number;
    }
    updateDisplay();
}

function appendOperator(nextOperator) {
    const inputValue = parseFloat(currentInput);

    if (nextOperator === '.') {
        if (!currentInput.includes('.')) { currentInput += '.'; }
        updateDisplay(); return;
    }
    
    if (nextOperator === '%') {
        currentInput = (inputValue / 100).toString();
        updateDisplay(); return;
    }

    if (currentOperator && waitingForSecondOperand) { currentOperator = nextOperator; return; }

    if (firstOperand === null) {
        firstOperand = inputValue;
    } else if (currentOperator) {
        const result = operate(firstOperand, inputValue, currentOperator);
        currentInput = String(result);
        firstOperand = result;
    }

    waitingForSecondOperand = true;
    currentOperator = nextOperator;
    updateDisplay();
}

function calculate() {
    if (currentOperator === null || waitingForSecondOperand) { return; }

    const inputValue = parseFloat(currentInput);
    const result = operate(firstOperand, inputValue, currentOperator);

    currentInput = String(result);
    firstOperand = null;
    currentOperator = null;
    waitingForSecondOperand = false;
    updateDisplay();
}

function clearDisplay() {
    currentInput = '0';
    firstOperand = null;
    currentOperator = null;
    waitingForSecondOperand = false;
    updateDisplay();
}

function backspace() {
    if (waitingForSecondOperand) return;
    currentInput = currentInput.slice(0, -1);
    if (currentInput === '') { currentInput = '0'; }
    updateDisplay();
}

// Save notepad text on change
document.getElementById('notepadText').addEventListener('input', function() {
    saveSettings();
});

// --- Dev Tools Logic (unchanged) ---
const fpsDisplay = document.getElementById('fpsDisplay');
let lastFrameTime = performance.now();
let fpsInterval;

function toggleFPS() {
    const isChecked = document.getElementById('toggleFPS').checked;
    if (isChecked) {
        fpsDisplay.style.display = 'block';
        fpsInterval = requestAnimationFrame(updateFPS);
    } else {
        fpsDisplay.style.display = 'none';
        cancelAnimationFrame(fpsInterval);
    }
}
function updateFPS(now) {
    const delta = now - lastFrameTime;
    lastFrameTime = now;
    const fps = Math.round(1000 / delta);
    fpsDisplay.textContent = 'FPS: ' + fps;
    fpsInterval = requestAnimationFrame(updateFPS);
}
function toggleIframeHighlight() {
    const isChecked = document.getElementById('toggleIframes').checked;
    const root = document.documentElement;
    if (isChecked) {
        root.style.setProperty('--iframe-border-width', '5px');
        root.style.setProperty('--iframe-border-color', 'red');
    } else {
        root.style.setProperty('--iframe-border-width', '5px');
        root.style.setProperty('--iframe-border-color', document.getElementById('frameBorderColor').value);
    }
}

// --- WEBSITE LOADER AND BROWSER LOGIC (WORKS!) ---
function tryLoadIframe(iframe, url) {
    iframe.src = url;
    setTimeout(() => {
        try {
            const doc = iframe.contentDocument || iframe.contentWindow.document;
            if (!doc || doc.body.innerHTML.length === 0) {
                throw new Error();
            }
        } catch (e) {
            iframe.src = "about:blank";
            setTimeout(() => {
                alert("This site cannot be loaded in the embedded browser due to security restrictions. It will open in a new tab.");
                window.open(url, "_blank");
            }, 100);
        }
    }, 1800);
}
function normalizeUrl(query) {
    const cleanedQuery = query.trim();
    if (!cleanedQuery) return 'https://example.com/';
    if (/^https?:\/\//i.test(cleanedQuery)) return cleanedQuery;
    if (cleanedQuery.includes('.') && !cleanedQuery.includes(' ')) return 'https://' + cleanedQuery;
    return 'https://duckduckgo.com/?q=' + encodeURIComponent(cleanedQuery);
}

// --- Website Loader ---
let lastWebsiteUrl = "";
function loadWebsite(){ 
    const urlInput = document.getElementById('urlInput');
    const url = normalizeUrl(urlInput.value); 
    const frame=document.getElementById('websiteFrame');
    tryLoadIframe(frame, url);
    lastWebsiteUrl = url;
}
function showWebsiteLoader() {
    document.getElementById('mainScreen').style.display='none'; 
    document.getElementById('realLoader').style.display='flex';
    const frame=document.getElementById('websiteFrame'); 
    if (lastWebsiteUrl) frame.src = lastWebsiteUrl;
}

// --- Browser Logic ---
let historyStack=[]; 
let historyIndex=-1; 
const browserFrame=document.getElementById('browserFrame');
let lastBrowserUrl = "";

function goBrowser(){ 
    const query=document.getElementById('browserInput').value.trim(); 
    if(!query) return; 
    const newUrl = normalizeUrl(query);
    historyStack = historyStack.slice(0, historyIndex + 1); 
    historyStack.push(newUrl); 
    historyIndex++; 
    tryLoadIframe(browserFrame, newUrl);
    lastBrowserUrl = newUrl;
}
function browserBack(){ 
    if(historyIndex > 0){ 
        historyIndex--; 
        tryLoadIframe(browserFrame, historyStack[historyIndex]);
        lastBrowserUrl = historyStack[historyIndex];
    }
}
function browserForward(){ 
    if(historyIndex < historyStack.length - 1){ 
        historyIndex++; 
        tryLoadIframe(browserFrame, historyStack[historyIndex]);
        lastBrowserUrl = historyStack[historyIndex];
    }
}
function browserReload(){ 
    if(historyIndex >= 0) {
        tryLoadIframe(browserFrame, historyStack[historyIndex]);
        lastBrowserUrl = historyStack[historyIndex];
    } else {
        goBrowser();
    }
}
function showBrowserLoader() {
    document.getElementById('mainScreen').style.display='none'; 
    document.getElementById('browserLoader').style.display='flex';
    if (lastBrowserUrl) browserFrame.src = lastBrowserUrl;
}

// --- Loader Routing Adjustments ---
function closeLoader(){ 
    document.getElementById('realLoader').style.display='none'; 
    document.getElementById('gamesLoader').style.display='none'; 
    document.getElementById('browserLoader').style.display='none'; 
    document.getElementById('creditsScreen').style.display='none'; 
    document.getElementById('settingsScreen').style.display='none'; 
    document.getElementById('gameWindow').style.display='none'; 
    document.getElementById('notepadScreen').style.display='none';
    document.getElementById('mainScreen').style.display='flex'; 
    document.getElementById('gameFrame').innerHTML='Game will appear here';
}

function openLoader(type){ 
    if(type==='real') {
        showWebsiteLoader();
        document.getElementById('gamesLoader').style.display='none'; 
        document.getElementById('browserLoader').style.display='none'; 
        document.getElementById('notepadScreen').style.display='none';
    } else if(type==='browser') {
        showBrowserLoader();
        document.getElementById('gamesLoader').style.display='none'; 
        document.getElementById('realLoader').style.display='none'; 
        document.getElementById('notepadScreen').style.display='none';
    } else if(type==='games') {
        document.getElementById('mainScreen').style.display='none'; 
        document.getElementById('gamesLoader').style.display='flex'; 
        document.getElementById('realLoader').style.display='none'; 
        document.getElementById('browserLoader').style.display='none'; 
        document.getElementById('notepadScreen').style.display='none';
    } else if(type==='notepad') {
        document.getElementById('mainScreen').style.display='none'; 
        document.getElementById('notepadScreen').style.display='flex';
        document.getElementById('realLoader').style.display='none'; 
        document.getElementById('browserLoader').style.display='none'; 
        document.getElementById('gamesLoader').style.display='none';
    }
}

function openCredits(){
  document.getElementById('mainScreen').style.display='none';
  document.getElementById('creditsScreen').style.display='flex';
}

// --- Games Logic (unchanged) ---
function getGameDetails(game) {
    let url = '';
    let title = '';
    if(game==='subway'){ url="https://ubg77.github.io/updatefaqs/subway-surfers-nyc/"; title='Subway Surfers';}
    if(game==='geometrydash'){ url="https://geometry-dash-lite.io/gdl/"; title='Geometry Dash';}
    if(game==='speedstars'){ url="https://speedstars2.io/game/speed-stars/"; title='Speed Stars';}
    if(game==='slope'){ url="https://azgames.io/game/slope/"; title='Slope';}
    if(game==='scratchgame'){ url="https://scratch.mit.edu/projects/1231016758/embed/"; title='Scratch Game';}
    if(game==='motox3m'){ url="https://play.famobi.com/moto-x3m"; title='Moto X3M';}
    if(game==='ovo'){ url="https://gamecollections.me/game/3kh0-assets-main/ovo/"; title='OvO';}
    if(game==='driftboss'){ url="https://gamecollections.me/game/3kh0-assets-main/drift-boss/"; title='Drift Boss';}
    if(game==='drivemad'){ url="https://gamecollections.me/game/3kh0-assets-main/drive-mad/"; title='Drive Mad';}
    if(game==='retrobowl'){ url="https://gamecollections.me/game/3kh0-assets-main/retro-bowl/"; title='Retro Bowl';}
    if(game==='basketbros'){ url="https://gamecollections.me/game/3kh0-assets-main/basketbros-io/"; title='Basket Bros';}
    if(game==='papasbr'){ url="https://gamecollections.me/game/3kh0-assets-main/papaspizzaria/"; title='Papas Burgeria';}
    if(game==='crossyroad'){ url="https://gamecollections.me/game/3kh0-assets-main/crossyroad/"; title='Crossy Road';}
	if(game==='smashcarts'){ url="https://gamecollections.me/game/3kh0-assets-main/smashkarts/"; title='Smash Karts';}
    return { url, title };
}
function openGame(game){ 
    document.getElementById('gamesLoader').style.display='none'; 
    document.getElementById('gameWindow').style.display='flex'; 
    const frame=document.getElementById('gameFrame'); 
    const titleElement=document.getElementById('gameTitle'); 
    const details = getGameDetails(game);
    currentGameUrl = details.url;
    currentGameTitle = details.title;
    titleElement.textContent = currentGameTitle; 
    frame.innerHTML=`<iframe src="${currentGameUrl}" style="width:100%; height:100%; border:none;" allowfullscreen></iframe>`;
}
function closeGame(){ 
    document.getElementById('gameWindow').style.display='none'; 
    document.getElementById('gameFrame').innerHTML='Game will appear here';
    document.getElementById('gamesLoader').style.display='flex'; 
    currentGameUrl = '';
    currentGameTitle = '';
}
function toggleFullscreen(url, title){
    if (!url) {
        alert("Please open a game first.");
        return;
    }
    const newWindow = window.open('about:blank', '_blank');
    if (newWindow) {
        const currentShadowColor = document.getElementById('frameShadowColor').value;
        const iframeHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>${title}</title>
                <style>
                    body { margin: 0; overflow: hidden; background: black;}
                    iframe {
                        width: 100vw; height: 100vh; border: none; margin: 0; padding: 0; display: block;
                        box-shadow: 0 0 10px ${currentShadowColor};
                    }
                </style>
            </head>
            <body>
                <iframe src="${url}" allowfullscreen></iframe>
            </body>
            </html>
        `;
        newWindow.document.write(iframeHtml);
        newWindow.document.close();
    } else {
        alert("Could not open new window. Check your browser's pop-up blocker settings.");
    }
}

// --- Snowflakes ---
let snowflakes=0;
function createSnowflake(){ if(snowflakes>100) return; snowflakes++; const s=document.createElement('div'); s.classList.add('snowflake'); s.style.left=Math.random()*100+'vw'; s.style.width=s.style.height=(Math.random()*2+2)+'px'; s.style.animationDuration=Math.random()*5+5+'s'; s.style.backgroundColor=document.getElementById('snowColor')?.value||'#ffffff'; document.body.appendChild(s); setTimeout(()=>{ s.remove(); snowflakes--; },10000); }
setInterval(createSnowflake,150);

document.addEventListener('DOMContentLoaded', loadSettings);
