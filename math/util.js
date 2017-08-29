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