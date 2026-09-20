
const utilDom = {
    init: function() {
        return this;
    },
    setAttr: function(ui, sAttrName, sAttrValue) {
        ui.setAttribute(sAttrName, sAttrValue);
    },
    el: function(uiParent, sId) {
        return uiParent.querySelector(sId);
    },
    remove: function(uiParent, sId) {
        let el = this.el(uiParent, sId);
        if (el) {
            el.remove();
        }
    }
}