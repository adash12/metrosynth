var canvas = $('#canvas');
var cells = [];
var graph = new joint.dia.Graph();
var paper = new joint.dia.Paper({ 
    el: $('#canvas'), 
    width: canvas.outerWidth(), 
    height: 650, 
    gridSize: 1, 
    model: graph,
    // add arrowheads on target side of link
    // how to have several kinds of links??
    defaultLink: new joint.dia.Link({
        attrs: { '.marker-target': { d: 'M 10 0 L 0 5 L 10 10 z', 'stroke-width': 0 }, 
                '.connection': {'stroke-width': 10}
                }
    }),

    defaultRouter: { name: 'metro' },
    validateConnection: function(cellViewS, magnetS, cellViewT, magnetT, end, linkView) {

        // Prevent links that don't connect to anything 
        // (?) doesn't seem to work
        //      always says cellViewS,T is connected to "object Object"
        // out("[mS, mT] = [" + magnetS + ", " + magnetT + "]");
        return cellViewS && cellViewT;

    },
    validateMagnet: function(cellView, magnet){
        // Prevent links from ports that already have a link
        var port = magnet.getAttribute('port');
        var links = graph.getConnectedLinks(cellView.model, { outbound: true });
        var portLinks = _.filter(links, function(o) {
            return o.get('source').port == port;
        });
        if(portLinks.length > 0) return false;
        return magnet.getAttribute('magnet') !== 'passive';
    }
});

// create cells
cells[0] = new joint.shapes.devs.Model({
  type: 'devs.Model',
  position: {x: 20, y: 20},
  size: { width: 0, height: 0 },
  inPorts: ['in1'],
    attrs: {
        '.label': { text: 'Osc' },
        rect: { 'stroke-width':1 }
    }
});

// place, annotate cells
var i = 0;

var createCell = function(x, y, label) {
    var newCell = cells[i-1].clone();
    newCell.translate(x,y);
    newCell.attr('.label/text', label);
    i++;
    return newCell;
}

// cells[i++].translate(140, 100);
cells[i++].translate(40, 30);

cells[i] = createCell(60,60,'Tremolo');
cells[i] = createCell(60,60,'Delay');
cells[i] = createCell(60,60,'Output');
graph.addCells(cells);
// tone.js setup
// create dictionary of toneJS objects
var idDict = {};
i = 0;
idDict[cells[i++].id] = new Tone.Synth();
idDict[cells[i++].id] = new Tone.Tremolo(10, 0.5).start();
idDict[cells[i].id] = new Tone.FeedbackDelay("4n", 0.5);
idDict[cells[i++].id].wet = 0.5;
idDict[cells[i++].id] = Tone.Master; 
delete i;