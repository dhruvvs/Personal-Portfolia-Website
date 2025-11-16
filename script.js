document.addEventListener('DOMContentLoaded', () => {
    // ---- Nav toggler ----
    const navToggler = document.querySelector('.nav-toggler');
    const aside = document.querySelector('.aside');

    if (navToggler && aside) {
        navToggler.addEventListener('click', () => {
            aside.classList.toggle('open');
        });
    }

    // ---- Canvas setup ----
    const canvas = document.getElementById('snow-canvas');
    if (!canvas) return; // safety check

    const ctx = canvas.getContext('2d');

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

        // ---- Open to Roles dropdown ----
    const openRolesWrapper = document.querySelector('.open-roles-wrapper');
    const openRolesToggle = document.querySelector('.open-roles-toggle');

    if (openRolesWrapper && openRolesToggle) {
        openRolesToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            openRolesWrapper.classList.toggle('open');
        });

        document.addEventListener('click', (e) => {
            if (!openRolesWrapper.contains(e.target)) {
                openRolesWrapper.classList.remove('open');
            }
        });
    }
    // ---- Click project cards to open GitHub ----
    const projectCards = document.querySelectorAll('.portfolio-item-inner[data-url]');

    projectCards.forEach(card => {
        card.addEventListener('click', () => {
            const url = card.dataset.url;
            if (url) {
                window.open(url, '_blank', 'noopener,noreferrer');
            }
        });
    });

        // ---- Contact form send + LinkedIn hint ----
    const contactForm = document.getElementById('contact-form');
    const contactStatus = document.getElementById('contact-status');

    if (contactForm && contactStatus) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault(); // don't reload page

            // clear fields
            contactForm.reset();

            // show message + LinkedIn link
            contactStatus.innerHTML = `
                ✅ Mail sent (demo). For faster response, 
                <a href="https://www.linkedin.com/in/dhruv-patel-541271151/" 
                   target="_blank" rel="noopener noreferrer">
                   connect with me on LinkedIn
                </a>.
            `;
            contactStatus.classList.add('success');
        });
    }



    // ---------------- SNOW CONFIG ----------------
    const SNOWFLAKE_COUNT = 220;

    // Snow colors: dark blue, yellow, orange, red, pink, purple
    const SNOW_COLORS = [
        { r: 10,  g: 40,  b: 120 },  // dark blue
        { r: 255, g: 223, b: 0   },  // yellow
        { r: 255, g: 140, b: 0   },  // orange
        { r: 220, g: 20,  b: 60  },  // red
        { r: 255, g: 105, b: 180 },  // pink
        { r: 138, g: 43,  b: 226 }   // purple
    ];

    const snowflakes = [];

    function randomSnowColor() {
        return SNOW_COLORS[Math.floor(Math.random() * SNOW_COLORS.length)];
    }

    function createSnowflake() {
        return {
            x: Math.random() * width,
            y: Math.random() * -height,          // start above screen
            radius: 1.5 + Math.random() * 3.5,   // 1.5–5px
            speedY: 1 + Math.random() * 2,       // 1–3 px/frame
            speedX: -0.7 + Math.random() * 1.4,  // side drift
            opacity: 0.3 + Math.random() * 0.7,
            color: randomSnowColor()
        };
    }

    for (let i = 0; i < SNOWFLAKE_COUNT; i++) {
        snowflakes.push(createSnowflake());
    }

    function updateSnow() {
        for (let flake of snowflakes) {
            flake.y += flake.speedY;
            flake.x += flake.speedX;

            // reset when reaching bottom
            if (flake.y > height) {
                flake.y = Math.random() * -50;
                flake.x = Math.random() * width;
                flake.color = randomSnowColor();
            }
            if (flake.x > width + 50) flake.x = -50;
            if (flake.x < -50) flake.x = width + 50;

            ctx.beginPath();
            ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${flake.color.r}, ${flake.color.g}, ${flake.color.b}, ${flake.opacity})`;
            ctx.fill();
        }
    }

    // ---------------- FIREWORKS CONFIG ----------------
    const fireworks = [];
    let lastFireworkTime = 0;
    const FIREWORK_INTERVAL = 1200; // ms between auto bursts
    const GRAVITY = 0.03;

    // Vibrant firework colors (designed to pop on your pastel background)
    const FIREWORK_COLORS = [
        'rgb(56, 110, 255)',   // vivid royal blue
        'rgb(0, 210, 255)',    // bright cyan
        'rgb(255, 215, 0)',    // rich gold
        'rgb(255, 120, 0)',    // bright orange
        'rgb(255, 64, 129)',   // hot pink
        'rgb(186, 85, 211)',   // purple
        'rgb(124, 77, 255)'    // electric violet
    ];

    function spawnFireworkAt(x, y) {
        const particleCount = 40 + Math.floor(Math.random() * 30); // 40–70 particles
        const color = FIREWORK_COLORS[Math.floor(Math.random() * FIREWORK_COLORS.length)];

        for (let i = 0; i < particleCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 1.5 + Math.random() * 3.5; // burst speed

            fireworks.push({
                x,
                y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 60 + Math.floor(Math.random() * 20), // frames
                age: 0,
                color,
                radius: 2 + Math.random() * 2.5,
            });
        }
    }

    // random firework only in TOP region
    function spawnRandomFirework() {
        const x = width * 0.1 + Math.random() * width * 0.8;
        const yTop = height * 0.05;
        const y = yTop + Math.random() * (height * 0.2); // only top ~25% of screen
        spawnFireworkAt(x, y);
    }

    function updateFireworks() {
        for (let fw of fireworks) {
            fw.age++;
            fw.x += fw.vx;
            fw.y += fw.vy;
            fw.vy += GRAVITY; // gravity pulls particles down
        }

        // remove old particles
        for (let i = fireworks.length - 1; i >= 0; i--) {
            if (fireworks[i].age > fireworks[i].life) {
                fireworks.splice(i, 1);
            }
        }

        // draw particles
        for (let fw of fireworks) {
            const alpha = 1 - fw.age / fw.life; // fade out
            ctx.beginPath();
            ctx.arc(fw.x, fw.y, fw.radius, 0, Math.PI * 2);
            ctx.fillStyle = fw.color
                .replace('rgb', 'rgba')
                .replace(')', `, ${alpha})`);
            ctx.fill();
        }
    }

    // ---------------- MAIN ANIMATION LOOP ----------------
    function animate(timestamp) {
        // schedule random fireworks at top
        if (!lastFireworkTime) lastFireworkTime = timestamp;
        if (timestamp - lastFireworkTime > FIREWORK_INTERVAL) {
            spawnRandomFirework();
            lastFireworkTime = timestamp;
        }

        // clear frame
        ctx.clearRect(0, 0, width, height);

        // draw in order: snow first, fireworks on top
        updateSnow();
        updateFireworks();

        requestAnimationFrame(animate);
    }

    // ---------------- RESIZE HANDLER ----------------
    window.addEventListener('resize', () => {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    });

        // ---- "Click me for something interesting" music button ----
    const funMusic = document.getElementById('fun-music');
    const interestingBtn = document.querySelector('.interesting-btn');
    let funMusicPlaying = false;

    if (funMusic && interestingBtn) {
        interestingBtn.addEventListener('click', async () => {
            try {
                if (!funMusicPlaying) {
                    await funMusic.play();
                    funMusicPlaying = true;
                    interestingBtn.textContent = 'Click me to stop the magic';
                } else {
                    funMusic.pause();
                    funMusic.currentTime = 0; // reset to start
                    funMusicPlaying = false;
                    interestingBtn.textContent = 'Click me for something interesting';
                }
            } catch (err) {
                console.error('Error playing music:', err);
            }
        });
    }


    // ---------------- CLICK FIREWORKS (TOP ONLY) ----------------
    window.addEventListener('click', (e) => {
        const x = e.clientX;
        // clamp y so fireworks stay in the top ~35% of the screen
        const maxTopRegion = height * 0.35;
        const y = Math.min(e.clientY, maxTopRegion);
        spawnFireworkAt(x, y);
    });

    requestAnimationFrame(animate);
});
