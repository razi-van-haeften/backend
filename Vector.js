export class Vec2 {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    add(v) {
        return new Vec2(this.x + v.x, this.y + v.y);
    }

    sub(v) {
        return new Vec2(this.x - v.x, this.y - v.y);
    }

    mul(s) {
        return new Vec2(this.x * s, this.y * s);
    }

    div(s) {
        return new Vec2(this.x / s, this.y / s);
    }

    length() {
        return Math.hypot(this.x, this.y);
    }

    lengthSq() {
        return this.x * this.x + this.y * this.y;
    }

    normalize() {
        const len = this.length();
        if (len === 0) return new Vec2(0, 0);
        return new Vec2(this.x / len, this.y / len);
    }

    // --- Dot & Distance ---
    dot(v) {
        return this.x * v.x + this.y * v.y;
    }

    distance(v) {
        return Math.hypot(this.x - v.x, this.y - v.y);
    }

    distanceSq(v) {
        const dx = this.x - v.x;
        const dy = this.y - v.y;
        return dx * dx + dy * dy;
    }

    rotate(angle) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        return new Vec2(
            this.x * cos - this.y * sin,
            this.x * sin + this.y * cos
        );
    }

    lerp(v, t) {
        return new Vec2(
            this.x + (v.x - this.x) * t,
            this.y + (v.y - this.y) * t
        );
    }

    clone() {
        return new Vec2(this.x, this.y);
    }

    equals(v) {
        return this.x === v.x && this.y === v.y;
    }

    toArray() {
        return [this.x, this.y];
    }

    toString() {
        return `Vec2(${this.x}, ${this.y})`;
    }
}
