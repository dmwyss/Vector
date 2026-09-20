function showAlert() {
    // Generiert eine zufällige Zahl zwischen 1 und 100
    const randomNumber = Math.floor(Math.random() * 100) + 1;
    alert("Zufallszahl: " + randomNumber);
}

function doOnLoad() {
    uiState.init();
    svgImpl.init();
    utilModal.init();
}