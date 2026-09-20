const utilSvg = {
/*
    addPathPoint: function(svgDrawing, elemParent, iX, iY) {
    },
*/
    ixId: 0,
    sSvgNS: "http://www.w3.org/2000/svg",
    addPathPoint: function(oParent, iX, iY) {
        oParent.attr.path.push([iX, iY]);
    },
    newObjPath: function() {
        return {
            class: "path",
            id: "e" + this.ixId++,
            attr: {
                path: [],
                fill: "none",
                stoke: "orange"
            }
        }
    },
    newObjCircle: function() {
        return {
            class: "circle",
            id: "e" + this.ixId++,
            attr: {
                cx: 100,
                cy: 150,
                r: 50,
                fill: "orange",
                stoke: "none"
            }
        }
    },
    redrawElem: function(oElem) {
        utilDom.remove(svgDrawing, "#" + oElem.id);
        // Create the circle element
        if (oElem.class === "path") {
            utilDom.remove(svgDrawing, "#g_" + oElem.id);
            this.__redrawPath__(oElem);
        }
    },
    __redrawPath__: function(oElem) {

        let sPathD = "M";
        /*
        const uiG = document.createElementNS(this.sSvgNS, "g");
        uiG.setAttribute("id", sGId);
        */
        let sGId = "g_" + oElem.id;
        const uiG = this.createElem({
            tagType: "g",
            id: sGId,
            class: "on",
            role: "wayGroup"
        });
        uiG.oData = oElem;
        let iWayPointW = 8; // Height is same.
        for (let ixPoint = 0; ixPoint < oElem.attr.path.length; ixPoint++) {
            let aiPoint = oElem.attr.path[ixPoint];
            let sWayId = sGId + "_" + ixPoint;
            let isSelected = false;
            let aixPoints = utilJson.el(oDrawing, "oElemFocus.oMicroFocus.aixPoints");
            if (aixPoints != null) {
                isSelected = aixPoints.includes(ixPoint);
            }
            /*
            isSelected = uiG.oData.oMicroFocus.aixPoints.includes(ixPoint);
            utilJson.el(oDrawing, "oMicroFocus.aixPoints", []);
            */
            let oWayPoint = {
                tagType: "rect",
                id: sWayId,
                class: "way" + (isSelected ? " on" : ""),
                x: aiPoint[0] - (iWayPointW / 2),
                y: aiPoint[1] - (iWayPointW / 2),
                width: iWayPointW,
                height: iWayPointW,
                fill: "black",
                stroke: "red",
                draggable: "draggable",
                onclick: "utilSvg.clickOnPathPoint(this);"
            }
            uiWayPoint = this.createElem(oWayPoint, uiG);
            uiWayPoint.id = sWayId; // Looks wrong in debugger.
            uiWayPoint.isStartPoint = (ixPoint === 0);
            uiWayPoint.isEndPoint = (ixPoint === oElem.attr.path.length - 1);
            uiWayPoint.sRootId = oElem.id;
            uiWayPoint.iCX = aiPoint[0];
            uiWayPoint.iCY = aiPoint[1];
            sPathD += " " + aiPoint[0] + "," + aiPoint[1];
        }
        if (oElem.isClosed) {
            sPathD += " Z";
        }
        const oPath = {
            tagType: "path",
            id: oElem.id,
            d: sPathD,
            stroke: "white",
            fill: "none"
        }
        this.createElem(oPath, svgDrawing);
        svgDrawing.appendChild(uiG); // After path to bring forward.
    },
    createElem: function(oElem, uiParent=null) {
        const elemOut = document.createElementNS(this.sSvgNS, oElem.tagType);
        for (sKey in oElem) {
            if (sKey === "tagType"){ continue; }
            elemOut.setAttribute(sKey, oElem[sKey]);
        }
        if (uiParent !== null) {
            uiParent.appendChild(elemOut);
        }
        return elemOut;
    },
    clickOnPathPoint: function(uiTrg) {
        //circle.setAttribute("onclick", "console.log(\'" + sCircId + "\')");
        console.log("clicked on: " + uiTrg.getAttribute("id"));
        let sOwnerId = uiTrg.id.split("_")[1];
        let uiPathOwnerOfThisPoint = svgDrawing.querySelector("#" + sOwnerId);
        if (uiState.isTool("pen")) {
            if (this.getIsAllowNewPoints(oDrawing.oElemFocus)) {
                if (uiTrg.sRootId === oDrawing.oElemFocus.id) {
                    event.stopPropagation();
                    event.preventDefault();
                    // The point that was clicked on is part of the same line.
                    if (uiTrg.isStartPoint) {
                        // It is the first point. Close the line.
                        let sPathPoints = uiPathOwnerOfThisPoint.getAttribute("d");
                        uiPathOwnerOfThisPoint.setAttribute("d", sPathPoints + " Z");
                        this.setAllowNewPoints(uiPathOwnerOfThisPoint, false);
                        // Turn off start and end points. It is closed.
                        this.closePath(uiTrg);
                    } else if (uiTrg.isEndPoint) {
                        // It is the last point. Stop drawing this element.
                        this.setAllowNewPoints(uiPathOwnerOfThisPoint, false);
                    } else {
                        let ixPoint = parseInt(uiTrg.id.split("_").at(-1));
                        let aiPoint = oDrawing.oElemFocus.attr.path[ixPoint];
                        utilSvg.addPathPoint(oDrawing.oElemFocus, aiPoint[0], aiPoint[1]);
                        utilSvg.redrawElem(oDrawing.oElemFocus);
                    }
                    return true; // It was handled here. Send successful note.
                } else {
                    if (uiTrg.isStartPoint || uiTrg.isEndPoint) {
                        console.log("join the two lines\n\t" + uiTrg.sRootId + "\n\t" + oDrawing.oElemFocus.id);
                    } else {
                        console.log("ignore that an element was clicked on.");
                        svgImpl.snap({x: uiTrg.iCX, y: uiTrg.iCY});
                    }
                }
            } else {
                return false; // Not handled here. Needs further action.
            }
        } else if (uiState.isTool("selectWay")) {
            event.stopPropagation();
            event.preventDefault();
            // Are we working on current element...
            let vToDeselect = null;
            let vToSelect = uiTrg;
            let sWayGroupId = "g_" + oDrawing.oElemFocus.id;
            /*
            if (oDrawing.oElemFocus === null) {
                // Nothing selected, ready for new iteam to be selected.
                vToSelect = uiTrg;
            } else if (!uiTrg.id.startsWith(sWayGroupId)) {
                // It is not the current element. Deselect it.
                vToDeselect = oDrawing.oElemFocus;
                vToSelect = uiTrg;
            }
            */
            if (!uiTrg.id.startsWith(sWayGroupId)) {
                // It is not the current element. Deselect it.
                vToDeselect = oDrawing.oElemFocus;
            }
            if (vToDeselect != null) {
                this.elemFocusDeselect();
            }
            //if (vToSelect != null) {
                // Set the focussed element.
            this.elemFocusSelect(uiTrg, event.shiftKey);
            //}
            // Need to turn off any others.
            // Need to add more if alt key is down.
            let uiWayGroup = svgDrawing.querySelector("#" + sWayGroupId);
            let aui = uiWayGroup.querySelectorAll("rect");
            for (let ix = 0; ix < aui.length; ix++) {
                // Turn them all off.
                aui[ix].classList.remove("on");
            }
            let aixPointsOn = oDrawing.oElemFocus.oMicroFocus.aixPoints;
            for (let ixPO = 0; ixPO < aixPointsOn.length; ixPO++) {
                let uiChildOn = uiWayGroup.querySelector("#" + sWayGroupId + "_" + aixPointsOn[ixPO]);
                uiChildOn.classList.add("on");
            }
        }
    },
    closePath: function(uiTrg) {
        uiTrg.isStartPoint = false;
        // Get the endPoint (possible it is also startPoint).
        let uiParent = uiTrg.parentElement; // Parent.
        let anode = uiParent.querySelectorAll("rect"); // All kids.
        anode.item(anode.length - 1).isEndPoint = false; // Last one off.
        uiParent.oData.isClosed = true;
    },
    getIsAllowNewPoints: function(uiPathOwnerOfThisPoint) {
        //return uiPathOwnerOfThisPoint.isAllowNewPoints;
        return utilJson.el(oDrawing.oElemFocus, "isAllowNewPoints", true);
    },
    setAllowNewPoints: function(uiPathOwnerOfThisPoint, isAllow) {
        oDrawing.oElemFocus.isAllowNewPoints = isAllow;
        uiPathOwnerOfThisPoint.style.opacity = "0.2";
        setTimeout(() => {uiPathOwnerOfThisPoint.style.opacity = ""}, 100);
    },
    elemFocusSelect: function(uiWayClicked, isShiftKey) {
        /*
        This will need to go back in when different objects exist.
        if (uiWayClicked.getAttribute("class") === "way") {
        }
        */

        // We are looking at a child of the way point group.
        let sClickedId = uiWayClicked.id;
        // Get the parent.
        let sParentId = uiWayClicked.id.substring(0, uiWayClicked.id.lastIndexOf("_"));
        uiParent = svgDrawing.querySelector("#" + sParentId);
        uiWayClicked.classList.remove("off");
        uiWayClicked.classList.add("on");
        // Now get the actual path, and set that as the current item.
        let sPathId = sClickedId.split("_")[1];
        oDrawing.oElemFocus = oDrawing.oDict[sPathId];
        //
        //
        // TODO: Make sure all way objects have oData.ix
        // Then go searching for the split/parse etc of the id parts.
        //
        // vvvvvvv stop using this notation of splits etc vvvvvvvv
        let ixNew = parseInt(uiWayClicked.id.split("_").at(-1));
        aixPointsNew = [ixNew]
        if (isShiftKey) {
            let aixPointsOld = utilJson.el(oDrawing, "oElemFocus.oMicroFocus.aixPoints", []);
            if (aixPointsOld.includes(ixNew)) {
                // Already there. Remove it.
                aixPointsNew = utilJson.removeFromArray(aixPointsOld, ixNew);
            } else {
                // Add the new one.
                // aixPointsNew = [...aixPointsNew, ...aixPointsOld];
                aixPointsOld.push(ixNew);
                aixPointsNew = aixPointsOld;
            }
        }
       oDrawing.oElemFocus.oMicroFocus = {
            sId: uiWayClicked.id,
            aixPoints: aixPointsNew,
            sParentId: sParentId
        };
    },
    elemFocusDeselect: function() {
        let uiTrg = svgDrawing.querySelector("#g_" + oDrawing.oElemFocus.id);
        uiTrg.classList.remove("on");
        uiTrg.classList.add("off");
        let auiWays = uiTrg.querySelectorAll("rect")
        for (let ixW = 0; ixW < auiWays.length; ixW++) {
            auiWays[ixW].classList.remove("on");
        }
        oDrawing.oElemFocus = null;
    }
}
