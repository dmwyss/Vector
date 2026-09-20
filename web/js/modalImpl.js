
const modalImpl = {
    fileSettings: {
        fldW: null,
        fldH: null,
        show: function() {
            // This is also the init function.
            // replace content if necessary.
            // Get the data object.
            let oCanvDims = oDrawing.canv.dimensions;
            // Set fields from data.
            this.fldW = utilModal.overlay.querySelector("#canvDimensionsW");
            this.fldW.value = oCanvDims.w;
            this.fldH = utilModal.overlay.querySelector("#canvDimensionsH");
            this.fldH.value = oCanvDims.h;
            // Re-write save button with this save function.
            let uiBtnSave = utilModal.overlay.querySelector("#saveBtn");
            uiBtnSave.setAttribute("onclick", "modalImpl.fileSettings.save();");
            // Show panel.
            utilModal.show();
        },
        save: function() {
            let oCanvDims = oDrawing.canv.dimensions;
            oCanvDims.w = this.fldW.value;
            oCanvDims.h = this.fldH.value;
            svgImpl.synchSvgToDrawingData();
            utilModal.hide();
        }
    }
}