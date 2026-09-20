
const utilModal = {
    overlay: null,
    init: function() {
        this.overlay = document.getElementById("modalOverlay");
    },
    show: function() {
        this.overlay.style.display = 'block';
    },
    hide: function() {
        this.overlay.style.display = 'none';
    },
    save: function() {
        this.hide();
    }
}