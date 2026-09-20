/*
{
    class: "circle",
    attr: {
        cx: 100,
        cy: 150,
        r: 50,
        fill: "orange"
    }
}

<line x1="0" y1="0" x2="300" y2="300" stroke="#FF0" stroke-width=".5" />
<line x1="0" y1="200" x2="200" y2="0" stroke="#FF0" stroke-width=".5" />

*/
let oDrawing = {
    canv: {
        dimensions: {
            w: 300,
            h: 300
        }
    },
    oElemFocus: null,
    oDict: {},
    elements: []
}

