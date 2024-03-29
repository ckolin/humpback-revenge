class Vec {
    static add(a, b) {
        return {x: a.x + b.x, y: a.y + b.y};
    }

    static subtract(a, b) {
        return {x: a.x - b.x, y: a.y - b.y};
    }

    static multiply(a, b) {
        return {x: a.x * b.x, y: a.y * b.y};
    }

    static dot(a, b) {
        return a.x * b.x + a.y * b.y;
    }

    static cross(a, b) {
        return a.x * b.y - a.y * b.x;
    }

    static scale(vec, fac) {
        return {x: vec.x * fac, y: vec.y * fac};
    }

    static rotate(vec, rad) {
        return {
            x: Math.cos(rad) * vec.x - Math.sin(rad) * vec.y,
            y: Math.sin(rad) * vec.x + Math.cos(rad) * vec.y
        };
    }

    static angle(vec) {
        return Math.atan(vec.y / vec.x);
    }

    static length(vec) {
        return Math.hypot(vec.x, vec.y);
    }

    static length2(vec) {
        return vec.x ** 2 + vec.y ** 2;
    }

    static normalize(vec) {
        const length = Math.hypot(vec.x, vec.y);
        if (length === 0) return vec;
        return Vec.scale(vec, 1 / length);
    }

    static floor(vec) {
        return {x: Math.floor(vec.x), y: Math.floor(vec.y)};
    }

    static flip(vec) {
        return {x: vec.y, y: vec.x};
    }

    static distance2(a, b) {
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        return dx ** 2 + dy ** 2;
    }
}
