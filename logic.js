const canvasTop = document.getElementById('canvasTop');

let points = [];
let epicenter = {x: 0, y: 0};
let max_radius = Number.NEGATIVE_INFINITY;
let min_radius = Number.POSITIVE_INFINITY;

let far_point = {x: 0, y: 0};
let close_point = {x: 0, y: 0};

let origin_radius = 0;

let min_amount_of_points = 6;

let donut_coefficient = 0.5;
let donut_min = 0;
let donut_max = 0;
let is_circle = false;

let intersected_segments = [];

canvas.onclick = ev => {
    points.push(getMousePos(ev));
    calculate();
    clear();
    draw_path();
    draw_intersections();
    // draw_max_radius();
    // draw_min_radius();
    // draw_origin_radius();
    // draw_epicenter_stroke();
    draw_epicenter();
    draw_donut();
    draw_points();
    // highlight_bad_points()
};

function dist(a, b) {
    return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2))
}

function calculate() {
    epicenter = {x: 0, y: 0};

    points.forEach(v => {
        epicenter.x += v.x;
        epicenter.y += v.y;
    });
    epicenter.x /= points.length;
    epicenter.y /= points.length;


    origin_radius = dist(epicenter, points[0]);
    max_radius = Number.NEGATIVE_INFINITY;
    min_radius = Number.POSITIVE_INFINITY;
    points.forEach(v => {
        let dst = dist(epicenter, v);
        if (dst > max_radius) {
            max_radius = dst;
            far_point = v;
        }
        if (dst < min_radius) {
            min_radius = dst;
            close_point = v;
        }
    });

    donut_min = origin_radius * donut_coefficient;
    donut_max = origin_radius + donut_min;

    intersected_segments = [];
    find_intersects();

    is_circle = donut_min <= min_radius &&
        donut_max >= max_radius &&
        intersected_segments.length === 0 &&
        min_amount_of_points <= points.length;
    let value = "This is the " + is_circle + " circle!<br>";
    if (donut_min > min_radius) value += "there point in donate hole<br>";
    if (donut_max < max_radius) value += "there point outside donate<br>";
    if (intersected_segments.length !== 0) value += "there intersection between some segments<br>";
    if (min_amount_of_points > points.length) value += "there not enough points";

    divIsCircle.innerHTML = value;
}

function find_intersects() {
    if (points.length > 1) {
        let segments = [];
        for (let i = 0; i < points.length - 1; i++) {
            segments.push({a: points[i], b: points[i + 1]});
        }
        segments.push({a: points[0], b: points[points.length - 1], special: true});

        for (let i = 0; i < segments.length; i++) {
            for (let j = i + 1; j < segments.length; j++) {
                if (isIntersect(segments[i], segments[j])) intersected_segments.push(segments[i], segments[j])
            }
        }
        intersected_segments = [...new Set(intersected_segments)]
    }
}

function isIntersect(a, b) {
    // https://stackoverflow.com/questions/563198/how-do-you-detect-where-two-line-segments-intersect
    let s1 = {x: a.b.x - a.a.x, y: a.b.y - a.a.y};
    let s2 = {x: b.b.x - b.a.x, y: b.b.y - b.a.y};

    let s, t;
    s = (-s1.y * (a.a.x - b.a.x) + s1.x * (a.a.y - b.a.y)) / (-s2.x * s1.y + s1.x * s2.y);
    t = (s2.x * (a.a.y - b.a.y) - s2.y * (a.a.x - b.a.x)) / (-s2.x * s1.y + s1.x * s2.y);

    // let i = {x: a.a.x + (t * s1.x), y: a.a.y + (t * s1.y)}; // point of intersection if intersected
    // return s >= 0 && s <= 1 && t >= 0 && t <= 1;
    return s > 0 && s < 1 && t > 0 && t < 1;
}

function getMousePos(ev) {
    let rect = canvas.getBoundingClientRect();
    return {
        x: ev.clientX - rect.left,
        y: ev.clientY - rect.top
    };
}

