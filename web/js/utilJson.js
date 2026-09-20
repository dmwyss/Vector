
const utilJson = {
    el: function(oData, sPath, vDefault=null) {
        //if ((oData === null) || (typeof oData === "undefined") || (typeof sPath === "undefined")) {
        if (this.isEmpty(oData)) {
            return vDefault;
        }
        let asPath = sPath.split(".");
        let oCursor = oData;
        for (let iDepth = 0; iDepth < asPath.length; iDepth++) {
            if (!oCursor.hasOwnProperty(asPath[iDepth])) {
                return vDefault;
            }
            oCursor = oCursor[asPath[iDepth]];
            if (this.isEmpty(oCursor)) {
                return vDefault;
            }
            if (iDepth === asPath.length - 1) {
                return oCursor;
            }
        }
        return vDefault;
    },
    isEmpty: function(vToTest) {
        return (typeof vToTest === "undefined") || (vToTest === null);
    },
    removeFromArray: function(av, vToRemove) {
        const ixFound = av.indexOf(vToRemove);
        if (ixFound !== -1) {
            av.splice(ixFound, 1); // Entfernt 1 Element am gefundenen Index
        }
        return av;
    }
}