
const utilJson = {
    el: function(oParent, sId, vDefault=null) {
        if (!oParent.hasOwnProperty(sId)) {
            return vDefault;
        }
        return oParent[sId];
    }
}