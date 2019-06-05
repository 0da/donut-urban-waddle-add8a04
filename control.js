let dscv = document.getElementById("donutSizeControlValue");

function dsControl(value) {
    dscv.innerHTML = value;
    coefficients.donut_size = value / 100;
    update();
}

function dpControl(value) {
    coefficients.draw_path = value;
    console.log(value);
    update();
}