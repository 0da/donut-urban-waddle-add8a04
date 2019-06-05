const divIsCircle = document.getElementById('isCircle');
const canvas = document.getElementById('canvas');

const context = canvas.getContext('2d');

canvas.width = canvasTop.clientWidth;
// noinspection JSSuspiciousNameCombination
canvas.height = canvas.width;

function draw_path() {
    if (points.length > 1) {
        context.strokeStyle = '#a9a9a9';
        context.beginPath();
        context.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
            context.lineTo(points[i].x, points[i].y);
            if (i === points.length - 1 && points.length > 2) {
                context.stroke();
                context.beginPath();
                context.setLineDash([5, 3]);
                context.moveTo(points[i].x, points[i].y);
                context.lineTo(points[0].x, points[0].y)
            }
        }
        context.stroke();
        context.setLineDash([]);
    }
}


function draw_epicenter() {
    context.fillStyle = '#5f6fd5';

    context.beginPath();
    context.arc(epicenter.x, epicenter.y, 2, 0, 2 * Math.PI);
    context.closePath();
    context.fill();
}

function draw_epicenter_stroke() {
    context.strokeStyle = '#9bc0ff';

    context.setLineDash([2, 2]);
    points.forEach(v => {
        context.beginPath();
        context.moveTo(v.x, v.y);
        context.lineTo(epicenter.x, epicenter.y);
        context.stroke();
    });
    context.setLineDash([]);
}

function draw_origin_radius() {
    context.strokeStyle = '#008000';
    context.setLineDash([5, 5]);

    context.beginPath();
    context.moveTo(points[0].x, points[0].y);
    context.lineTo(epicenter.x, epicenter.y);
    context.stroke();
    context.setLineDash([]);

}

function draw_min_radius() {
    context.strokeStyle = '#00ff00';

    context.beginPath();
    context.moveTo(close_point.x, close_point.y);
    context.lineTo(epicenter.x, epicenter.y);
    context.stroke();
}

function draw_max_radius() {
    context.strokeStyle = '#003300';

    context.beginPath();
    context.moveTo(far_point.x, far_point.y);
    context.lineTo(epicenter.x, epicenter.y);
    context.stroke();
}

function draw_points() {
    context.fillStyle = '#232323';
    points.forEach(value => {
        context.beginPath();
        context.arc(value.x, value.y, 1, 0, 2 * Math.PI);
        context.closePath();
        context.fill();
    });
}

function draw_donut() {
    context.strokeStyle = '#dfa72a';
    context.beginPath();
    context.arc(epicenter.x, epicenter.y, donut_min, 0, 2 * Math.PI);
    context.closePath();
    context.stroke();

    context.beginPath();
    context.arc(epicenter.x, epicenter.y, donut_max, 0, 2 * Math.PI);
    context.closePath();
    context.stroke();

}

function highlight_bad_points() {
    context.strokeStyle = '#e22c2c';
    points.forEach(value => {
        let dst = dist(epicenter, value);
        if (dst < donut_min || dst > donut_max) {

            context.beginPath();
            context.arc(value.x, value.y, 2, 0, 2 * Math.PI);
            context.closePath();
            context.stroke();
        }
    });
}

function draw_intersections() {
    context.strokeStyle = '#e225cc';
    intersected_segments.forEach(v => {
        if (v.special) context.setLineDash([5, 3]);
        context.beginPath();
        context.moveTo(v.a.x, v.a.y);
        context.lineTo(v.b.x, v.b.y);
        context.stroke();
        context.setLineDash([]);

    })
}

function clear() {
    context.clearRect(0, 0, canvas.width, canvas.height);
}