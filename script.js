const calculatorButton = document.getElementById("calculateButton");
const viewButton = document.getElementById("viewButton");
const createButton = document.getElementById("createButton");

calculatorButton.addEventListener("click", () => {
    window.location.href = "calculator";
});

createButton.addEventListener("click", () => {
    window.location.href = "coming-soon";
});

viewButton.addEventListener("click", () => {
    window.location.href = "coming-soon";
});