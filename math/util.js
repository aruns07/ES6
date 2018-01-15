export const distanceXY = (x0, x1, y0, y1) => {
    let dx = x1 - x0;
    let dy = y1 - y0;
    return Math.sqrt(dx * dx + dy * dy);
};

export const distance = (circle0, circle1) => {
    return distanceXY(circle0.x, circle1.x, circle0.y, circle1.y);
};

export const circleCollision = (circle0, circle1) => {
    return distance(circle0, circle1) <= circle0.radius + circle1.radius;
};

export const circlePointCollision = (circle, x, y) => {
    return distanceXY(circle.x, x, circle.y, y) <= circle.radius;
};

export const rectPointCollision = (rect, x, y) => {
    return inRange(x, rect.x, rect.x + rect.width) &&
            inRange(y, rect.y, rect.y + rect.height);
};

export const rectCollision = (rect1, rect2) => {
    return rangeIntersect(rect1.x, rect1.x + rect1.width, rect2.x,  rect2.x + rect2.width) &&
            rangeIntersect(rect1.y, rect1.y + rect1.height, rect2.y,  rect2.y + rect2.height);
};

export const rangeIntersect = (min1, max1, min2, max2) => {
    return (max1 >= min2 && min1 <= max2);
};

export const inRange = (value, min, max) => {
    return value >= Math.min(min, max) && value <= Math.max(min, max);
};

export const randomRange = (min, max) => {
    return Math.random() * (max - min) + min;
};

export const quadraticBezier = (p1, p2, p3, t) => {
    let pFinal = {x:0, y:0};
    pFinal.x = (Math.pow(t, 2) * (p3.x - 2 * p2.x + p1.x))
                + (2 * t * (p2.x - p1.x))
                + p1.x;
    
    pFinal.y = (Math.pow(t, 2) * (p3.y - 2 * p2.y + p1.y))
                + (2 * t * (p2.y - p1.y))
                + p1.y;
    return pFinal;
};