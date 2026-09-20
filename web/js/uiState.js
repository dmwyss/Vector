const tools = {
    selectGroup: "selectGroup",
    selectDirect: "selectWay",
    pen: "pen"
}
const uiState = {
    uiToolBar: null,
    uiToolCurr: null,
    sToolCurr: tools.selectDirect,
    init: function() {
        this.uiToolBar = document.querySelector("aside#toolBar");
        let uiTool = this.uiToolBar.querySelector("#" + tools.selectGroup)
        this.setToolCurr(uiTool);
        return this;
    },
    setToolCurr: function(uiSrc) {
        if (this.uiToolCurr !== null) {
            this.uiToolCurr.classList.remove("on");
        }
        this.sToolCurr = uiSrc.id;
        this.uiToolCurr = uiSrc;
        this.uiToolCurr.classList.add("on");
    },
    isTool: function(sTool) {
        return this.sToolCurr === sTool;
    }
}