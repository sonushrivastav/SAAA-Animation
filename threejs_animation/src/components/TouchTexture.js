import * as THREE from 'three';

// Utility for creating the smooth trail
const easeOutSine = (t, b, c, d) => {
    return c * Math.sin((t / d) * (Math.PI / 2)) + b;
};

export class TouchTexture {
    constructor(size = 64) {
        this.size = size;
        this.maxAge = 120; // How long the trail lasts (in frames)
        this.trail = [];
        this.radius = 0.15; // The size of the "brush"

        // Setup canvas and texture
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.canvas.height = this.size;
        this.ctx = this.canvas.getContext('2d');
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, this.size, this.size);

        this.texture = new THREE.Texture(this.canvas);
        this.texture.minFilter = THREE.LinearFilter;
        this.texture.wrapS = this.texture.wrapT = THREE.ClampToEdgeWrapping;
    }

    update(point) {
        this.clear();

        // 1. Age the existing trail points and remove old ones
        this.trail.forEach((t, i) => {
            t.age++;
            if (t.age > this.maxAge) {
                this.trail.splice(i, 1);
            }
        });

        // 2. Add the new mouse point to the trail
        if (point) {
            this.addTouch(point);
        }

        // 3. Draw the trail points onto the canvas (texture)
        this.trail.forEach(t => this.drawTouch(t));

        this.texture.needsUpdate = true;
    }

    clear() {
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, this.size, this.size);
    }

    addTouch(point) {
        // Calculate force based on mouse movement distance (optional, but adds flair)
        let force = 0;
        const last = this.trail[this.trail.length - 1];
        if (last) {
            const dx = last.x - point.x;
            const dy = last.y - point.y;
            force = Math.min(dx * dx + dy * dy * 10000, 1);
        }

        // Store point in trail
        this.trail.push({ x: point.x, y: point.y, age: 0, force });
    }

    drawTouch(point) {
        const size = this.size * this.radius;
        const pos = {
            x: point.x * this.size,
            y: (1 - point.y) * this.size, // Flip Y for canvas coords
        };

        // Determine brightness/intensity based on age (the fade-out)
        let intensity = 1;
        if (point.age < this.maxAge * 0.3) {
            // Fade in quickly
            intensity = easeOutSine(point.age / (this.maxAge * 0.3), 0, 1, 1);
        } else {
            // Fade out smoothly
            intensity = easeOutSine(
                1 - (point.age - this.maxAge * 0.3) / (this.maxAge * 0.7),
                0,
                1,
                1
            );
        }

        // Draw the point
        this.ctx.globalAlpha = intensity;
        this.ctx.fillStyle = 'white';
        this.ctx.beginPath();
        this.ctx.arc(pos.x, pos.y, size * intensity, 0, Math.PI * 2);
        this.ctx.fill();
    }
}
