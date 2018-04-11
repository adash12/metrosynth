var canvas = $('#canvas');
var cells = [];
var graph = new joint.dia.Graph();
var paper = new joint.dia.Paper({ 
    el: $('#canvas'), 
    width: canvas.outerWidth(), 
    height: 900, 
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
  position: {x: 10, y: 10},
  size: { width: 0, height: 0 },
  inPorts: ['in1'],
    attrs: {
        '.label': { text: 'Osc' },
        circle: {r:6}

    }
});

// place, annotate cells
var i = 0;
var distance = 40;

var createCell = function(cell, x, y, label) {
    var newCell = cell.clone();
    newCell.translate(x*distance,y*distance);
    newCell.attr('.label/text', label);
    i++;
    return newCell;
}

cells[i++].translate(2*distance, distance);
cells[i] = createCell(cells[i-1],14,1,'Green');
//jump to bottom
cells[i] = createCell(cells[i-1],-3,13,'Green');
//right
cells[i] = createCell(cells[i-1],1,0,'Green');
//diagonal
cells[i] = createCell(cells[i-1],1,1,'Green');
cells[i] = createCell(cells[i-1],1,1,'Green');
//diagonal
cells[i] = createCell(cells[i-1],1,-1,'Green');
//diagonal
cells[i] = createCell(cells[i-1],1,1,'Green');

/*
//silver line
cells[i] = createCell(cells[i-1],-2,8,'Silver');
cells[i] = createCell(cells[i-1],1,1,'Silver');
cells[i] = createCell(cells[i-1],1,1,'Silver');
*/

/*
//yellow line
cells[i] = createCell(cells[i-1],14,1,'Osc');
cells[i] = createCell(cells[i-1],-1,1,'Delay');
cells[i] = createCell(cells[i-1],-1,1,'Delay');
//intersect with red
cells[i] = createCell(cells[i-1],-2,2,'Delay');
cells[i] = createCell(cells[i-1],-2,2,'Delay');
//diagonal
cells[i] = createCell(cells[i-1],1,1,'Delay');
//down
cells[i] = createCell(cells[i-1],0,1,'Delay');
cells[i] = createCell(cells[i-1],0,1,'Delay');
//intersect with red
cells[i] = createCell(cells[i-1],0,1,'Delay');
cells[i] = createCell(cells[i-1],0,1,'Delay');
cells[i] = createCell(cells[i-1],0,1,'Delay');
cells[i] = createCell(cells[i-1],0,1,'Delay');
//left
cells[i] = createCell(cells[i-1],-2,0,'Delay');
//diagonal
cells[i] = createCell(cells[i-1],-2,2,'Delay');
//down
cells[i] = createCell(cells[i-1],0,1,'Delay');
//right
cells[i] = createCell(cells[i-1],2,0,'Delay');
//down
cells[i] = createCell(cells[i-1],0,1,'Delay');
cells[i] = createCell(cells[i-1],0,1,'Delay');
cells[i] = createCell(cells[i-1],0,1,'Delay');
*/
/*
//orange line
cells[i] = createCell(cells[i-1],14,1,'Osc');
cells[i] = createCell(cells[i-1],1,0,'Distortion');
cells[i] = createCell(cells[i-1],1,0,'Distortion');
cells[i] = createCell(cells[i-1],1,0,'Distortion');
cells[i] = createCell(cells[i-1],1,0,'Distortion');
cells[i] = createCell(cells[i-1],1,0,'Distortion');
cells[i] = createCell(cells[i-1],1,0,'Distortion');
//up!
cells[i] = createCell(cells[i-1],0,-1,'Distortion');
//diagonal
cells[i] = createCell(cells[i-1],1,-1,'Distortion');
//right
cells[i] = createCell(cells[i-1],1,0,'Distortion');
cells[i] = createCell(cells[i-1],3,0,'Distortion');
//down
cells[i] = createCell(cells[i-1],0,2,'Distortion');
cells[i] = createCell(cells[i-1],0,1,'Distortion');
//right
cells[i] = createCell(cells[i-1],2,0,'Distortion');
cells[i] = createCell(cells[i-1],1,0,'Distortion');
cells[i] = createCell(cells[i-1],1,0,'Distortion');
//diagonal
cells[i] = createCell(cells[i-1],1,-1,'Distortion');
//right
cells[i] = createCell(cells[i-1],1,0,'Distortion');
cells[i] = createCell(cells[i-1],1,0,'Distortion');
//diagonal
cells[i] = createCell(cells[i-1],1,-1,'Distortion');
cells[i] = createCell(cells[i-1],1,-1,'Distortion');
cells[i] = createCell(cells[i-1],1,-1,'Distortion');*/

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