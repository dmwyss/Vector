
const utilGeometry = {
    toPoint: function(vOne, vTwo=null) {
        if (Array.isArray(vOne)) {
            vTwo = vOne[1];
            vOne = vOne[0];
        }
        return {x: vOne, y: vTwo};
    },
    getPointDelta: function(p1, p2) {
        let iAngle = this.toAngle(p1, p2);
        console.log("angle::: " + iAngle);
        let iAngleOct = Math.round(iAngle / 45) * 45
        let iAngleDiff = iAngle - iAngleOct;

        let p2Rect = this.toPoint(p2.x, p2.y);
        let sAnglePolar = "none";
        iAngleDiff = iAngleOct - iAngle;
        p2Rect = this.rotatePoint(p1, p2Rect, iAngleDiff);

        // DO NOT DELETE
        let iPointer = 3 + Math.round(iAngleOct / 45);
        // DO NOT DELETE
        let sPointer = ["NW", "N", "NE", "E", "SE", "S", "SW", "W"][iPointer];
        console.log("iPointer --> " + sPointer + " --------------");

        return {
            p1: p1,
            p2: p2,
            p2Constrained: p2Rect,
            angle: iAngle,
            anglePolar: iAngleOct,
            angleDiff: iAngleDiff
        }
    },
    toAngle: function(p1, p2) {
        const dy = p2.y - p1.y;
        const dx = p2.x - p1.x;
        // Math.atan2 returns the angle in radians
        const radians = Math.atan2(dy, dx);
        // Convert radians to degrees
        return Math.round(radians * (180 / Math.PI));
    },
    rotatePoint: function(pAxis, pRotate, iAngle) {
        // Convert angle from degrees to radians
        const radians = iAngle * (Math.PI / 180);
        const cos = Math.cos(radians);
        const sin = Math.sin(radians);
        /*
        const cos = Math.cos(iAngle);
        const sin = Math.sin(iAngle);
        */
        // Translate pRotate to origin (relative to the pAxis)
        const dx = pRotate.x - pAxis.x;
        const dy = pRotate.y - pAxis.y;
        const pDiff = this.pointMaths(pRotate, "-", pAxis);

        //console.log("old/new values were: " + dx + "/" + pDiff.x + " -- " + dy + "/" + pDiff.y)
        if ((dx - pDiff.x !== 0) || (dy - pDiff.y !== 0)) {
            console.error("ERRRRRRRRRRR OOOOOOOO RRRRRRR old/new values were: "
                + this.round(dx, 2) + "/"
                + this.round(pDiff.x, 2) + " -- "
                + this.round(dy,2) + "/"
                + this.round(pDiff.y, 2)
            );
        }

        // Apply rotation matrix
        const rotatedX = dx * cos - dy * sin;
        const rotatedY = dx * sin + dy * cos;
        // Translate back to the pAxis position and return new coordinates
        return this.toPoint(
            this.round(pAxis.x + rotatedX, 1),
            this.round(pAxis.y + rotatedY, 1)
        );
    },
    pointMaths: function(pIn, sOperation, vFactor) {
        if (sOperation === "*") {
            return this.toPoint((pIn.x * vFactor), (pIn.y * vFactor));
        } else if (["+","-"].includes(sOperation)) {
            if (typeof vFactor === "number") {
                vFactor = this.toPoint(vFactor); // Turn it into a point.
            }
            let iPosNeg = (sOperation === "+") ? 1 : -1
            return this.toPoint(
                (pIn.x + (vFactor.x * iPosNeg)),
                (pIn.y + (vFactor.y * iPosNeg))
            );
        }
        return pIn;
    },
    round: function(fIn, iDigits=0) {
        if (iDigits === 0) {
            return Math.round(fIn);
        }
        return Math.round(fIn * (10 ** iDigits)) / (10 ** iDigits);
    }
    /*
    good but I don't think it is needed.
    getDistance: function(point1, point2) {
        // Math.hypot calculates sqrt(dx^2 + dy^2) automatically
        return Math.hypot(point2.x - point1.x, point2.y - point1.y);
    }
    */
}