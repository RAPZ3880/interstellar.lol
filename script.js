let currentGameUrl = '';
let currentGameTitle = '';
const PROXY_URL = 'https://translate.google.com/translate?sl=auto&tl=en&u=';

// --- SETTINGS THEME-DEPENDENT COLORS LOGIC ---
function setSettingsColors(themeObj) {
    // Settings panel background and text
    document.documentElement.style.setProperty('--settings-bg', themeObj.bg || '#111');
    document.documentElement.style.setProperty('--settings-text', themeObj.text || '#fff');
    document.documentElement.style.setProperty('--settings-fieldset-bg', themeObj.bg ? shadeColor(themeObj.bg, 12) : '#191929');
    document.documentElement.style.setProperty('--settings-border', themeObj.neon || '#ff69b4');
    // Color input border (handled via CSS :focus)
    // Set color input background for better visibility
    document.querySelectorAll('#settingsScreen input[type="color"]').forEach(c=>{
        c.style.background = themeObj.bg || '#111';
    });
}

// Helper: shade a color for fieldset background
function shadeColor(color, percent) {
    // Only supports hex colors: #rrggbb
    if (!color || color.length !== 7) return color;
    let R = parseInt(color.substring(1,3),16);
    let G = parseInt(color.substring(3,5),16);
    let B = parseInt(color.substring(5,7),16);

    R = Math.floor(R * (100 + percent) / 100);
    G = Math.floor(G * (100 + percent) / 100);
    B = Math.floor(B * (100 + percent) / 100);

    R = (R<255)?R:255;
    G = (G<255)?G:255;
    B = (B<255)?B:255;

    const RR = (R.toString(16).length==1) ? "0"+R.toString(16) : R.toString(16);
    const GG = (G.toString(16).length==1) ? "0"+G.toString(16) : G.toString(16);
    const BB = (B.toString(16).length==1) ? "0"+B.toString(16) : B.toString(16);

    return "#"+RR+GG+BB;
}

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
        // No console.log for production
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

  // Synchronize settings panel color
  setSettingsColors({
      bg: bgColor,
      text: textColor,
      neon: neon
  });

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
  "theme14": {bg:"#110022", text:"#ddccff", neon:"#aa00ff", time:"#ffffff", timeNeon:"#aa00ff", button:"#220044", buttonText:"#ffffff", buttonHover:"#cc33ff", snow:"#bb66ff", frameBorder:"#220044", frameShadow:"#cc00ff"},
  "theme15": {bg:"#001111", text:"#aaffff", neon:"#00ffcc", time:"#ffffff", timeNeon:"#00ffcc", button:"#002222", buttonText:"#ffffff", buttonHover:"#33ffee", snow:"#66ffff", frameBorder:"#002222", frameShadow:"#00ff99"},
  "theme16": {bg:"#111100", text:"#ffffaa", neon:"#ffff66", time:"#ffffff", timeNeon:"#ffff66", button:"#222200", buttonText:"#000000", buttonHover:"#ffff88", snow:"#ffff99", frameBorder:"#333300", frameShadow:"#ffff99"}
};
function applyTheme(name){ 
    if(!themes[name]) return; 
    const t=themes[name]; 
    document.getElementById('bgColor').value=t.bg; 
    document.getElementById('textColor').value=t.text; 
    document.getElementById('neonColor').value=t.neon; 
    document.getElementById('timeColor').value=t.time; 
    document.getElementById('timeNeonColor').value=t.timeNeon; 
    document.getElementById('buttonColor').value=t.button; 
    document.getElementById('buttonTextColor').value=t.buttonText; 
    document.getElementById('buttonHoverColor').value=t.buttonHover; 
    document.getElementById('snowColor').value=t.snow; 
    document.getElementById('frameBorderColor').value=t.frameBorder; 
    document.getElementById('frameShadowColor').value=t.frameShadow; 
    updateColors();
    setSettingsColors(t);
}

// Loaders & Navigation
function closeLoader(){ 
    document.getElementById('realLoader').style.display='none'; 
    document.getElementById('gamesLoader').style.display='none'; 
    document.getElementById('browserLoader').style.display='none'; 
    document.getElementById('creditsScreen').style.display='none'; 
    document.getElementById('settingsScreen').style.display='none'; 
    document.getElementById('gameWindow').style.display='none'; 
    document.getElementById('mainScreen').style.display='flex'; 
    document.getElementById('gameFrame').innerHTML='Game will appear here';
}

function openLoader(type){ 
    document.getElementById('mainScreen').style.display='none'; 
    document.getElementById('realLoader').style.display=type==='real'?'flex':'none'; 
    document.getElementById('gamesLoader').style.display=type==='games'?'flex':'none'; 
    document.getElementById('browserLoader').style.display=type==='browser'?'flex':'none'; 
}

function openCredits(){
  document.getElementById('mainScreen').style.display='none';
  document.getElementById('creditsScreen').style.display='flex';
}

// Games Logic
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
                    body { 
                        margin: 0; 
                        overflow: hidden; 
                        background: black;
                    }
                    iframe {
                        width: 100vw; 
                        height: 100vh; 
                        border: none; 
                        margin: 0; 
                        padding: 0; 
                        display: block;
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

// Website Loader and Browser logic
function normalizeAndProxyUrl(query) {
    let targetUrl;
    const cleanedQuery = query.trim();
    if (!cleanedQuery) {
        targetUrl = 'https://duckduckgo.com/';
    }
    else if (cleanedQuery.startsWith('http')) {
        targetUrl = cleanedQuery;
    } 
    else if (cleanedQuery.includes('.') && !cleanedQuery.includes(' ')) {
        targetUrl = 'https://' + cleanedQuery;
    } 
    else {
        targetUrl = 'https://duckduckgo.com/?q=' + encodeURIComponent(cleanedQuery);
    }
    return PROXY_URL + encodeURIComponent(targetUrl);
}

function loadWebsite(){ 
    const urlInput = document.getElementById('urlInput');
    const url = urlInput.value.trim(); 
    if(!url){
        alert('Enter a URL or search term.'); 
        return;
    } 
    const frame=document.getElementById('websiteFrame'); 
    frame.src = normalizeAndProxyUrl(url);
}

let historyStack=[]; 
let historyIndex=-1; 
const browserFrame=document.getElementById('browserFrame');

function goBrowser(){ 
    const query=document.getElementById('browserInput').value.trim(); 
    if(!query) return; 
    const newProxyUrl = normalizeAndProxyUrl(query);
    historyStack = historyStack.slice(0, historyIndex + 1); 
    historyStack.push(newProxyUrl); 
    historyIndex++; 
    browserFrame.src = newProxyUrl;
}

function browserBack(){ 
    if(historyIndex > 0){ 
        historyIndex--; 
        browserFrame.src = historyStack[historyIndex];
    }
}
function browserForward(){ 
    if(historyIndex < historyStack.length - 1){ 
        historyIndex++; 
        browserFrame.src = historyStack[historyIndex];
    }
}
function browserReload(){ 
    if(historyIndex >= 0) {
        browserFrame.src = historyStack[historyIndex];
    } else {
        goBrowser();
    }
}

// Snowflakes
let snowflakes=0;
function createSnowflake(){ if(snowflakes>100) return; snowflakes++; const s=document.createElement('div'); s.classList.add('snowflake'); s.style.left=Math.random()*100+'vw'; s.style.width=s.style.height=(Math.random()*2+2)+'px'; s.style.animationDuration=Math.random()*5+5+'s'; s.style.backgroundColor=document.getElementById('snowColor')?.value||'#ffffff'; document.body.appendChild(s); setTimeout(()=>{ s.remove(); snowflakes--; },10000); }
setInterval(createSnowflake,150);

document.addEventListener('DOMContentLoaded', loadSettings);
