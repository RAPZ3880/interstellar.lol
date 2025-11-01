// Global variables
let currentGameUrl = '';
let currentGameTitle = '';
// Google Translate is used as a common proxy method
const PROXY_URL = 'https://translate.google.com/translate?sl=auto&tl=en&u=';

// --- Calculator Logic ---
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
// --- END Calculator Logic ---

// --- Dev Tools Logic ---
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
// --- END Dev Tools Logic ---

// Time & Settings Logic
const timeDisplay=document.getElementById('time'); let isVisible=true;
function updateTime(){ timeDisplay.textContent=new Date().toLocaleTimeString(); }
setInterval(updateTime,1000); updateTime();
function toggleTime(){ isVisible=!isVisible; timeDisplay.style.display=isVisible?'block':'none'; document.getElementById('toggleButton').textContent=isVisible?'Hide Time':'Show Time'; }

function openSettings(){ 
    document.getElementById('mainScreen').style.display='none'; 
    document.getElementById('settingsScreen').style.display='flex'; 
}

// --- Settings Persistence ---
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
        toggleIframes: document.getElementById('toggleIframes').checked
    };
    try {
        localStorage.setItem('toxins_settings', JSON.stringify(settings));
        console.log("Settings saved.");
    } catch (e) {
        console.error("Failed to save settings to Local Storage.", e);
    }
}

function loadSettings() {
    try {
        const storedSettings = localStorage.getItem('toxins_settings');
        if (!storedSettings) return;

        const settings = JSON.parse(storedSettings);
        
        // Apply colors to inputs
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
        
        // Apply checkboxes
        document.getElementById('toggleFPS').checked = settings.toggleFPS;
        document.getElementById('toggleIframes').checked = settings.toggleIframes;
        
        // Apply all settings
        updateColors(false); // Do not save again immediately on load
        
        // Execute side-effect functions
        if (settings.toggleFPS) toggleFPS(); 
        if (settings.toggleIframes) toggleIframeHighlight(); 

        console.log("Settings loaded.");
    } catch (e) {
        console.error("Failed to load settings from Local Storage.", e);
        // Fallback: Just update with defaults if loading failed
        updateColors(false); 
    }
}

/**
 * Updates all colors and saves settings automatically, unless specified otherwise.
 * @param {boolean} [shouldSave=true] - Whether to save the settings to Local Storage.
 */
function updateColors(shouldSave = true){
  const neon=document.getElementById('neonColor').value;
  const timeNeon=document.getElementById('timeNeonColor').value;
  const buttonTextColor = document.getElementById('buttonTextColor').value;
  const buttonHoverColor = document.getElementById('buttonHoverColor').value;
  const textColor = document.getElementById('textColor').value;
  const bgColor = document.getElementById('bgColor').value;
  const frameBorderColor = document.getElementById('frameBorderColor').value;
  const frameShadowColor = document.getElementById('frameShadowColor').value;

  // Set CSS Variables for Theming
  document.documentElement.style.setProperty('--text-color', textColor);
  document.documentElement.style.setProperty('--button-hover-color', buttonHoverColor);
  document.documentElement.style.setProperty('--button-text-color', buttonTextColor);
  document.documentElement.style.setProperty('--neon-color', neon);
  document.documentElement.style.setProperty('--frame-border-color', frameBorderColor);
  document.documentElement.style.setProperty('--frame-shadow-color', frameShadowColor);
  
  // 1. General Styles
  document.body.style.backgroundColor=bgColor;
  document.body.style.color=textColor;
  
  // 2. Title Neon Glow
  document.querySelectorAll('h1').forEach(h=>{ if(h!==timeDisplay) h.style.textShadow=`0 0 5px ${neon},0 0 10px ${neon},0 0 20px ${neon},0 0 40px ${neon}`; });
  
  // 3. Time Display 
  timeDisplay.style.color=document.getElementById('timeColor').value;
  timeDisplay.style.textShadow=`0 0 5px ${timeNeon},0 0 10px ${timeNeon},0 0 20px ${timeNeon},0 0 40px ${timeNeon}`;
  
  // 4. Buttons 
  document.querySelectorAll('button:not(.calc-buttons button)').forEach(b=>{ 
      b.style.backgroundColor=document.getElementById('buttonColor').value; 
      b.style.color=buttonTextColor; 
  });
  
  // 5. Apply button hover color via dynamic CSS
  let style=document.createElement('style'); 
  style.innerHTML=`
      button:not(.calc-buttons button):hover{background-color:${buttonHoverColor} !important;}
  `; 
  
  const oldStyle = document.getElementById('dynamic-styles');
  if (oldStyle) { oldStyle.remove(); }
  style.id = 'dynamic-styles';
  document.head.appendChild(style);
  
  // 6. Snowflakes
  document.querySelectorAll('.snowflake').forEach(s=>s.style.backgroundColor=document.getElementById('snowColor').value);
  
  // 7. Update Iframe Border
  if (!document.getElementById('toggleIframes').checked) {
      document.documentElement.style.setProperty('--iframe-border-color', frameBorderColor);
  } else {
      document.documentElement.style.setProperty('--iframe-border-color', 'red');
  }

  if (shouldSave) {
      saveSettings();
  }
}

const themes={
  "toxinlol": {bg:"#000000", text:"#ffffff", neon:"#6600ff", time:"#ffffff", timeNeon:"#6600ff", button:"#000000", buttonText:"#ffffff", buttonHover:"#3700ff", snow:"#9b00ff", frameBorder:"#2b003d", frameShadow:"#7a00ab"},
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
  "theme14": {bg:"#110022", text:"#ddccff", neon:"#aa00ff", time:"#ffffff", timeNeon:"#aa00ff", button:"#220044", buttonText:"#ffffff", buttonHover:"#cc33ff", snow:"#bb66
};

function applyTheme(themeName) {
  const theme = themes[themeName];
  if (!theme) return;
  
  // Set color picker values
  document.getElementById('bgColor').value = theme.bg;
  document.getElementById('textColor').value = theme.text;
  document.getElementById('neonColor').value = theme.neon;
  document.getElementById('timeColor').value = theme.time;
  document.getElementById('timeNeonColor').value = theme.timeNeon;
  document.getElementById('buttonColor').value = theme.button;
  document.getElementById('buttonTextColor').value = theme.buttonText;
  document.getElementById('buttonHoverColor').value = theme.buttonHover;
  document.getElementById('snowColor').value = theme.snow;
  document.getElementById('frameBorderColor').value = theme.frameBorder;
  document.getElementById('frameShadowColor').value = theme.frameShadow;

  // Apply colors and save settings
  updateColors();
}

// --- Screen/Loader Management ---
const screens = {
    'main': document.getElementById('mainScreen'),
    'settings': document.getElementById('settingsScreen'),
    'notepad': document.getElementById('notepadScreen'),
    'real': document.getElementById('realLoader'),
    'games': document.getElementById('gamesLoader'),
    'browser': document.getElementById('browserLoader'),
    'gameWindow': document.getElementById('gameWindow'),
    'credits': document.getElementById('creditsScreen')
};

function hideAllScreens() {
    Object.values(screens).forEach(screen => {
        if (screen) screen.style.display = 'none';
    });
}

function openLoader(screenName) {
    hideAllScreens();
    const screen = screens[screenName];
    if (screen) {
        screen.style.display = 'flex';
    }
}

function closeLoader() {
    hideAllScreens();
    document.getElementById('mainScreen').style.display = 'flex';
    currentGameUrl = '';
    currentGameTitle = '';
    // Clear inputs and content when closing loaders
    if (screens.real) {
        document.getElementById('urlInput').value = '';
        document.getElementById('websiteFrame').src = 'about:blank';
    }
    if (screens.browser) {
        document.getElementById('browserInput').value = '';
        document.getElementById('browserFrame').src = 'about:blank';
    }
}

function openCredits() {
    hideAllScreens();
    document.getElementById('creditsScreen').style.display = 'flex';
}

// --- Browser/Website Logic ---
function sanitizeUrl(input) {
    let url = input.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
    }
    return url;
}

function loadWebsite() {
    const input = document.getElementById('urlInput').value;
    if (!input) return;

    let urlToLoad;
    if (input.includes('.') && !input.includes(' ')) {
        // Looks like a URL
        urlToLoad = sanitizeUrl(input);
    } else {
        // Looks like a search term
        const searchUrl = 'https://www.google.com/search?q=' + encodeURIComponent(input);
        urlToLoad = searchUrl;
    }

    // Use the proxy for the final URL
    const finalUrl = PROXY_URL + encodeURIComponent(urlToLoad);
    document.getElementById('websiteFrame').src = finalUrl;
}

// Browser Loader functions (using #browserFrame)
function goBrowser() {
    const input = document.getElementById('browserInput').value;
    if (!input) return;
    
    let urlToLoad;
    if (input.includes('.') && !input.includes(' ')) {
        urlToLoad = sanitizeUrl(input);
    } else {
        const searchUrl = 'https://www.google.com/search?q=' + encodeURIComponent(input);
        urlToLoad = searchUrl;
    }
    document.getElementById('browserFrame').src = PROXY_URL + encodeURIComponent(urlToLoad);
}

function browserBack() {
    const frame = document.getElementById('browserFrame');
    if (frame.contentWindow.history.length > 0) {
        frame.contentWindow.history.back();
    }
}

function browserForward() {
    const frame = document.getElementById('browserFrame');
    if (frame.contentWindow.history.length > 0) {
        frame.contentWindow.history.forward();
    }
}

function browserReload() {
    document.getElementById('browserFrame').contentWindow.location.reload();
}

// --- Game Logic ---
function getGameInfo(gameId) {
    const games = {
        'subway': { title: 'Subway Surfers', url: 'https://ubg100.github.io/Subway-Surfers/' },
        'geometrydash': { title: 'Geometry Dash', url: 'https://cdn.games-cdn.top/geometry-dash/index.html' },
        'speedstars': { title: 'Speed Stars', url: 'https://ubg98.github.io/g82/speed-stars/index.html' },
        'slope': { title: 'Slope', url: 'https://ubg100.github.io/Slope/' },
        'scratchgame': { title: 'Wheelie Life 2', url: 'https://scratch.mit.edu/projects/630635298/embed' },
        'motox3m': { title: 'Moto X3M', url: 'https://ubg100.github.io/Moto-X3M-Bike-Race/' },
        'ovo': { title: 'OvO', url: 'https://ubg98.github.io/g82/ovo/' },
        'driftboss': { title: 'Drift Boss', url: 'https://ubg100.github.io/Drift-Boss/' },
        'drivemad': { title: 'Drive Mad', url: 'https://ubg100.github.io/Drive-Mad/' },
        'retrobowl': { title: 'Retro Bowl', url: 'https://ubg100.github.io/Retro-Bowl/' },
        'basketbros': { title: 'Basket Bros', url: 'https://ubg100.github.io/Basket-Bros/' },
        'papasbr': { title: 'Papa\'s Burgeria', url: 'https://ubg100.github.io/Papas-Burgeria/' },
        'crossyroad': { title: 'Crossy Road', url: 'https://ubg100.github.io/Crossy-Road/' },
        'smashcarts': { title: 'Smash Karts', url: 'https://ubg100.github.io/Smash-Karts/' }
    };
    return games[gameId] || { title: 'Game Not Found', url: 'about:blank' };
}

function openGame(gameId) {
    const info = getGameInfo(gameId);
    currentGameUrl = info.url;
    currentGameTitle = info.title;

    hideAllScreens();
    document.getElementById('gameTitle').textContent = info.title;
    document.getElementById('gameWindow').style.display = 'flex';

    const gameFrame = document.getElementById('gameFrame');
    // Clear existing content and set up the iframe
    gameFrame.innerHTML = '';
    const iframe = document.createElement('iframe');
    iframe.src = info.url;
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    
    // Copy the themed border styles from the parent container
    iframe.className = 'gameFrame'; 
    
    gameFrame.appendChild(iframe);
}

function closeGame() {
    closeLoader(); // Reverts to main screen
}

function toggleFullscreen(url, title) {
    if (!url || url === 'about:blank') {
        alert("Please select a game first.");
        return;
    }

    // Use a blank page in a new window to open the game URL in an iframe
    const newWindow = window.open('about:blank', title, 'toolbar=no,scrollbars=yes,resizable=yes,top=0,left=0,width=' + screen.availWidth + ',height=' + screen.availHeight);
    
    if (newWindow) {
        const fullscreenHtml = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${title}</title>
                <style>
                    body { margin: 0; overflow: hidden; height: 100vh; width: 100vw; }
                    iframe { width: 100%; height: 100%; border: none; }
                </style>
            </head>
            <body>
                <iframe src="${url}" allowfullscreen></iframe>
            </body>
            </html>
        `;
        
        newWindow.document.write(fullscreenHtml);
        newWindow.document.close();
    } else {
        alert("Pop-up blocked! Please allow pop-ups for this site to launch fullscreen.");
    }
}

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    loadSettings();
});
