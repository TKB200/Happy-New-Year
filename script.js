document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const loader = document.getElementById('loader');
    const homeView = document.getElementById('home-view');
    const createView = document.getElementById('create-view');
    const cardView = document.getElementById('card-view');
    const envelope = document.getElementById('envelope');
    const cardControls = document.getElementById('card-controls');
    const clickInstruction = document.getElementById('click-instruction');
    const fireworksCanvas = document.getElementById('fireworksCanvas');

    // Buttons
    const startBtn = document.getElementById('start-btn');
    const previewBtn = document.getElementById('preview-btn');
    const backHomeBtn = document.getElementById('back-home-btn');
    const shareBtn = document.getElementById('share-btn');
    const createNewBtn = document.getElementById('create-new-btn');

    // Form inputs
    const senderNameInput = document.getElementById('sender-name');
    const recipientNameInput = document.getElementById('recipient-name');
    const wishMessageInput = document.getElementById('wish-message');

    // Display elements
    const displaySender = document.getElementById('display-sender');
    const displayRecipient = document.getElementById('display-recipient');
    const displayMessage = document.getElementById('display-message');

    // Hide loader after a short delay
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => loader.style.display = 'none', 500);
    }, 1500);

    // Navigation
    startBtn.addEventListener('click', () => {
        switchView(homeView, createView);
    });

    backHomeBtn.addEventListener('click', () => {
        switchView(createView, homeView);
    });

    createNewBtn.addEventListener('click', () => {
        resetCard();
        switchView(cardView, homeView);
        stopFireworks();
    });

    previewBtn.addEventListener('click', () => {
        const sender = senderNameInput.value.trim() || 'Alex';
        const recipient = recipientNameInput.value.trim() || 'Friend';
        const message = wishMessageInput.value.trim() || 'May your new year be filled with success, health, and happiness!';

        displaySender.textContent = sender;
        displayRecipient.textContent = `To My Dear ${recipient},`;
        displayMessage.textContent = message;

        switchView(createView, cardView);
    });

    // Envelope Logic
    envelope.addEventListener('click', () => {
        if (!envelope.classList.contains('open')) {
            envelope.classList.add('open');
            clickInstruction.style.display = 'none';
            
            // Show controls and start fireworks after animation
            setTimeout(() => {
                cardControls.style.display = 'flex';
                startFireworks();
            }, 1200);
        }
    });

    // Helper functions
    function switchView(from, to) {
        from.classList.remove('active');
        to.classList.add('active');
    }

    function resetCard() {
        envelope.classList.remove('open');
        cardControls.style.display = 'none';
        clickInstruction.style.display = 'block';
    }

    // Sharing Logic
    shareBtn.addEventListener('click', () => {
        const text = `Hey! I created a special New Year card for you. Check it out!`;
        if (navigator.share) {
            navigator.share({
                title: 'New Year Wish Card',
                text: text,
                url: window.location.href
            }).catch(console.error);
        } else {
            // Fallback: Copy to clipboard
            navigator.clipboard.writeText(window.location.href).then(() => {
                const originalText = shareBtn.textContent;
                shareBtn.textContent = 'Link Copied!';
                shareBtn.style.background = '#2ecc71';
                setTimeout(() => {
                    shareBtn.textContent = originalText;
                    shareBtn.style.background = '';
                }, 2000);
            });
        }
    });

    // Fireworks Canvas Implementation
    const ctx = fireworksCanvas.getContext('2d');
    let animationId;
    let particles = [];

    function resize() {
        fireworksCanvas.width = window.innerWidth;
        fireworksCanvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor(x, y, color) {
            this.x = x;
            this.y = y;
            this.color = color;
            this.velocity = {
                x: (Math.random() - 0.5) * 8,
                y: (Math.random() - 0.5) * 8
            };
            this.alpha = 1;
            this.friction = 0.95;
            this.gravity = 0.05;
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = this.alpha;
            ctx.beginPath();
            ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.restore();
        }

        update() {
            this.velocity.x *= this.friction;
            this.velocity.y *= this.friction;
            this.velocity.y += this.gravity;
            this.x += this.velocity.x;
            this.y += this.velocity.y;
            this.alpha -= 0.01;
        }
    }

    function createFirework(x, y) {
        const colors = ['#ffd700', '#ffffff', '#ff4d4d', '#4dff4d', '#4db8ff'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        for (let i = 0; i < 40; i++) {
            particles.push(new Particle(x, y, color));
        }
    }

    function animate() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);

        particles.forEach((particle, index) => {
            if (particle.alpha > 0) {
                particle.update();
                particle.draw();
            } else {
                particles.splice(index, 1);
            }
        });

        if (Math.random() < 0.05) {
            createFirework(
                Math.random() * fireworksCanvas.width,
                Math.random() * fireworksCanvas.height * 0.5
            );
        }

        animationId = requestAnimationFrame(animate);
    }

    function startFireworks() {
        fireworksCanvas.classList.add('active');
        animate();
    }

    function stopFireworks() {
        fireworksCanvas.classList.remove('active');
        cancelAnimationFrame(animationId);
        particles = [];
        ctx.clearRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);
    }
});
