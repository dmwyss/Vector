let svgDrawing = null;

svgImpl = {
    init: function() {
        svgDrawing = document.getElementById('svgDrawing');
        this.synchSvgToDrawingData();

        // Event-Listener für den Klick auf das SVG registrieren
        svgDrawing.addEventListener('click', (event) => {
            if (uiState.isTool("pen")) {
                // 1. Erstelle einen SVG-Punkt
                const point = svgDrawing.createSVGPoint();
                // 2. Setze die Client-Koordinaten des Klicks (Mausposition im Browser-Sichtfeld)
                point.x = event.clientX;
                point.y = event.clientY;
                // 3. Transformiere die Client-Koordinaten in das lokale Koordinatensystem des SVGs
                // getScreenCTM() liefert die aktuelle Transformationsmatrix des SVG-Elements
                const svgCoords = point.matrixTransform(svgDrawing.getScreenCTM().inverse());
                // 4. Werte runden (optional)
                let iX = Math.round(svgCoords.x);
                let iY = Math.round(svgCoords.y) - 4; // Always looks like it is too low.
                if (this.snapData !== null) {
debugger;
                    iX = this.snapData.x;
                    iY = this.snapData.y;
                    this.snapData = null;
                }
                // Ausgabe im Dokument
                //coordsDisplay.textContent = `X: ${iX}, Y: ${iY}`;
                console.log(`Klick bei SVG-Koordinaten -> X: ${iX}, Y: ${iY}`);
                let isMakeNew = false;
                if (oDrawing.oElemFocus === null) {
                    isMakeNew = true;
                } else {
                    let isAllow = utilJson.el(oDrawing.oElemFocus, "isAllowNewPoints", true);
                    if (!isAllow) {
                        utilSvg.elemFocusDeselect();
                        isMakeNew = true;
                    }
                }
                if (isMakeNew) {
                    let oElemNew = utilSvg.newObjPath();
                    oDrawing.oElemFocus = oElemNew;
                    oDrawing.oDict[oElemNew.id] = oElemNew;
                    oDrawing.elements.push(oElemNew);
                }
                // Update the data.
                if (!isMakeNew && event.shiftKey) {
                    // User has the shift key down, so need to restrain to 45deg increments.
                    let aiPreviousPoint = oDrawing.oElemFocus.attr.path.at(-1);
                    let oPreviousPoint = utilGeometry.toPoint(aiPreviousPoint);
                    let oThisPoint = utilGeometry.toPoint(iX, iY);
                    let oPointDiff = utilGeometry.getPointDelta(oPreviousPoint, oThisPoint);
                    iX = oPointDiff.p2Constrained.x;
                    iY = oPointDiff.p2Constrained.y;
                }
                utilSvg.addPathPoint(oDrawing.oElemFocus, iX, iY);
                utilSvg.redrawElem(oDrawing.oElemFocus);
            } else {

            }
        });
        document.addEventListener('keydown', function(event) {
            if ((event.key === 'Delete') || (event.key === 'Backspace')) {
                // Your code here
                console.log('The Delete key was pressed.');
                svgImpl.deleteElemFocus();
            }
        });
        return this;
    },
    synchSvgToDrawingData: function() {
        let oCanvDims = oDrawing.canv.dimensions;
        utilDom.setAttr(svgDrawing, "viewBox", "0 0 " + oCanvDims.w + " " + oCanvDims.h);
        utilDom.setAttr(svgDrawing, "width", "" + oCanvDims.w);
        utilDom.setAttr(svgDrawing, "height", "" + oCanvDims.h);
    },
    snap: function(pt) {
        // Set to {x:N, y:N}
        this.snapData = pt;
        // In case user does not use the snap.
        // This should get used instantly.
        setTimeout(() => { svgImpl.snapData = null }, 500);
    },
    snapData: null,
    deleteElemFocus: function() {
debugger;
        // Needs a test to make sure it is a way when other elems are added.
        let oMicro = utilJson.el(oDrawing.oElemFocus, "oMicroFocus");
        if (oMicro != null) {
            let oParentData = svgDrawing.querySelector("#" + oDrawing.oElemFocus.oMicroFocus.sParentId).oData;
            let ixPointToRemove = parseInt(oMicro.sId.split("_").at(-1));
            let apNew = [];
            for (let ixP = 0; ixP < oParentData.attr.path.length; ixP++) {
                if (ixPointToRemove === ixP) {
                    continue;
                }
                apNew.push(oParentData.attr.path[ixP]);
            }
            oParentData.attr.path = apNew;
            utilSvg.redrawElem(oParentData);
        } else {
        }
    }
}
