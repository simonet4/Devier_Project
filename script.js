/* =========================================
   CONFIGURATION & GLOBALS
   ========================================= */
const colors = { bg: '#22223B', main: '#B58AFF', flash: '#8AFF5B', text: '#EADEDA', shadow: '#410554' };
const config = { 
    count: 140,             
    mouseThreshold: 220,    
    drag: 0.95,             
    baseSpeed: 0.5          
};

const canvas = document.getElementById('interactive-bg');
const ctx = canvas.getContext('2d');
const muteBtn = document.getElementById('mute-btn');
const volSlider = document.getElementById('volume-slider');
const captureBtn = document.getElementById('capture-btn');
const audioEl = document.getElementById('audio-player');

let width, height, particles = [], mouse = { x: -1000, y: -1000 }, isMouseDown = false;
let audioContext, analyser, source, gainNode, dataArray;
let audioIntensity = 0, bassIntensity = 0, isAudioInit = false;
let lastVolume = 0.5; 
let isCapturing = false;
let streamSource = null;

/* =========================================
   1. INITIALISATION
   ========================================= */
window.onload = () => {
    initParticles(); animate();
    initAudioEngine();
    
    // Tentative lecture (Mute)
    let p = audioEl.play();
    if (p !== undefined) {
        p.catch(() => {
            ['mousemove', 'click'].forEach(evt => 
                document.body.addEventListener(evt, unlockAudio, { once: true })
            );
        });
    }
};

function unlockAudio() {
    if (audioContext && audioContext.state === 'suspended') audioContext.resume();
    if (audioEl.paused && !isCapturing) audioEl.play();
}

/* =========================================
   2. MOTEUR AUDIO (ROUTAGE)
   ========================================= */
function initAudioEngine() {
    if(isAudioInit) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    audioContext = new AC();
    
    audioContext.onstatechange = () => {
        if (audioContext.state === 'suspended') audioContext.resume();
    };

    analyser = audioContext.createAnalyser();
    analyser.fftSize = 512; 
    analyser.smoothingTimeConstant = 0.8;
    
    gainNode = audioContext.createGain();
    gainNode.gain.value = 0; // Mute par défaut
    
    connectToGraph(audioEl, true);
    
    dataArray = new Uint8Array(analyser.frequencyBinCount);
    isAudioInit = true;
}

function connectToGraph(inputSource, enableOutput) {
    if (source) { source.disconnect(); }

    if (inputSource instanceof HTMLMediaElement) {
        if (!inputSource._sourceNode) {
            inputSource._sourceNode = audioContext.createMediaElementSource(inputSource);
        }
        source = inputSource._sourceNode;
    } else {
        source = audioContext.createMediaStreamSource(inputSource);
    }

    // 1. Source -> Volume 
    source.connect(gainNode);
    // 2. Volume -> Analyseur 
    gainNode.connect(analyser);

    // 3. Sortie Enceintes
    try { analyser.disconnect(audioContext.destination); } catch(e) {}
    
    if (enableOutput) {
        analyser.connect(audioContext.destination);
    }
}

/* =========================================
   3. BOUTONS (PC & VOLUME)
   ========================================= */
captureBtn.addEventListener('click', async () => {
    if (!isAudioInit) initAudioEngine();
    if (audioContext.state === 'suspended') audioContext.resume();

    if (isCapturing) { stopCapture(); return; }

    audioEl.pause(); 

    try {
        const stream = await navigator.mediaDevices.getDisplayMedia({ audio: true, video: true });
        if (stream.getAudioTracks().length === 0) { 
            alert("⚠️ Audio non partagé !"); 
            stream.getTracks().forEach(t => t.stop());
            audioEl.play(); return; 
        }
        streamSource = stream;
        connectToGraph(stream, false); // Mode PC: Pas de sortie

        isCapturing = true;
        captureBtn.textContent = "ARRÊTER"; 
        captureBtn.classList.add('capture-active');

        stream.getVideoTracks()[0].onended = () => stopCapture();
        stream.getAudioTracks()[0].onended = () => stopCapture();

    } catch(e) { console.error(e); audioEl.play(); }
});

function stopCapture() {
    if (!isCapturing) return;
    if (streamSource) { streamSource.getTracks().forEach(track => track.stop()); streamSource = null; }
    isCapturing = false;
    captureBtn.textContent = "📡 Mode Audio PC"; 
    captureBtn.classList.remove('capture-active');
    connectToGraph(audioEl, true);
    audioEl.play(); 
}

volSlider.addEventListener('input', (e) => {
    if(!gainNode) return;
    const val = parseFloat(e.target.value);
    gainNode.gain.value = val;
    if(val > 0) lastVolume = val;
    updateMuteIcon(val);
});

muteBtn.addEventListener('click', () => {
    if(!gainNode) return;
    if(gainNode.gain.value > 0) { 
        lastVolume = gainNode.gain.value; gainNode.gain.value = 0; volSlider.value = 0; 
    } else { 
        const target = lastVolume > 0.05 ? lastVolume : 0.5;
        gainNode.gain.value = target; volSlider.value = target; 
    }
    updateMuteIcon(gainNode.gain.value);
});
function updateMuteIcon(val) { muteBtn.textContent = val == 0 ? "🔇" : (val < 0.5 ? "🔉" : "🔊"); }

/* =========================================
   4. PHYSIQUE PARTICULES (VORTEX + JITTER)
   ========================================= */
class Particle {
    constructor() { this.reset(); }
    reset() {
        this.x = Math.random() * width; this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * config.baseSpeed;
        this.vy = (Math.random() - 0.5) * config.baseSpeed;
        this.baseSize = Math.random() * 8 + 4;
        this.currentSize = this.baseSize;
        const palette = [colors.main, colors.text, colors.text, colors.flash];
        this.color = palette[Math.floor(Math.random() * palette.length)];
    }
    
    update() {
        // --- A. DONNÉES VOLUME & SOURIS ---
        let volFactor = gainNode ? gainNode.gain.value : 0;
        const dx = mouse.x - this.x; 
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx*dx + dy*dy); 
        const angle = Math.atan2(dy, dx);

        // --- B. JITTER (LE RETOUR DU MOUVEMENT ALÉATOIRE) ---
        // On calcule une vibration basée sur la musique ET le volume
        // Plus le son est fort, plus ça vibre. Si Mute, ça ne vibre pas.
        let jitterAmount = (audioIntensity / 255) * 4 * volFactor; 
        
        if (jitterAmount > 0.01) {
            this.vx += (Math.random() - 0.5) * jitterAmount;
            this.vy += (Math.random() - 0.5) * jitterAmount;
        }

        // --- C. INTERACTION SOURIS (VORTEX) ---
        if(dist < config.mouseThreshold) {
            const force = (config.mouseThreshold - dist) / config.mouseThreshold;
            if(isMouseDown) { 
                // Répulsion
                this.vx -= Math.cos(angle) * force * 3; 
                this.vy -= Math.sin(angle) * force * 3; 
            } else { 
                // ORBITE FLUIDE (Le pattern que vous aimez)
                // Attraction légère
                this.vx += Math.cos(angle) * force * 0.20; 
                this.vy += Math.sin(angle) * force * 0.20;
                // Rotation
                this.vx += Math.cos(angle + Math.PI / 2) * force * 0.6;
                this.vy += Math.sin(angle + Math.PI / 2) * force * 0.6;
            }
        }

        // --- D. APPLICATION MOUVEMENT ---
        this.vx *= config.drag; 
        this.vy *= config.drag;

        // Si on est près de la souris, on bouge librement
        if (dist < config.mouseThreshold) {
            this.x += this.vx;
            this.y += this.vy;
        } 
        // Si on est loin, le mouvement dépend du volume
        else {
            // Mouvement principal atténué par le volume
            // Si Volume 0 -> Mouvement 0 (Immobile)
            // On ajoute un tout petit minimum (0.02) seulement si le volume n'est pas strictement 0
            let moveScale = volFactor > 0 ? (volFactor + 0.1) : 0;
            
            this.x += this.vx * moveScale;
            this.y += this.vy * moveScale;
        }

        // --- E. TAILLE (AUDIO KICK) ---
        let bassKick = (bassIntensity / 255);
        if(bassIntensity > 180) {
            this.currentSize = this.baseSize + (bassKick * 12); 
        } else {
            this.currentSize += (this.baseSize - this.currentSize) * 0.1;
        }

        // Wrap
        if(this.x < 0) this.x = width; if(this.x > width) this.x = 0;
        if(this.y < 0) this.y = height; if(this.y > height) this.y = 0;
    }

    draw() {
        ctx.beginPath();
        if(bassIntensity > 200 && Math.random() > 0.5) ctx.fillStyle = colors.flash;
        else ctx.fillStyle = this.color;
        let volumeScale = 1 + (audioIntensity / 255) * 0.8;
        let finalSize = this.currentSize * volumeScale;
        ctx.arc(this.x, this.y, finalSize, 0, Math.PI*2);
        ctx.fill();
    }
}

/* =========================================
   5. RENDU
   ========================================= */
function initParticles() {
    width = canvas.width = window.innerWidth; height = canvas.height = window.innerHeight;
    particles = []; for(let i=0; i<config.count; i++) particles.push(new Particle());
}
function animate() {
    requestAnimationFrame(animate);
    // Sécurité anti-coupure
    if (audioContext && audioContext.state === 'suspended') audioContext.resume();

    if(isAudioInit && analyser) {
        analyser.getByteFrequencyData(dataArray);
        let sum = 0, bassSum = 0;
        for(let i=0; i<dataArray.length; i++) { sum += dataArray[i]; if(i < 20) bassSum += dataArray[i]; }
        audioIntensity = sum / dataArray.length; bassIntensity = bassSum / 20;
    }
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => { p.update(); p.draw(); });
}

window.addEventListener('resize', initParticles);
window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
window.addEventListener('mousedown', () => isMouseDown = true);
window.addEventListener('mouseup', () => isMouseDown = false);
window.addEventListener('contextmenu', e => e.preventDefault());