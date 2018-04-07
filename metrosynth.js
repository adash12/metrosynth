// joint.js setup
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
        attrs: { '.marker-target': { d: 'M 10 0 L 0 5 L 10 10 z' }, 
                '.connection': {stroke: '#e00000', 'stroke-width': 4}
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
// first cell corresponds to oscillator 1
cells[0] = new joint.shapes.devs.Model({
  type: 'devs.Model',
  position: {x: 20, y: 20},
  size: { width: 90, height: 90 },
  inPorts: ['in1'],
  outPorts: ['out1'],
  ports: {
        groups: {
            'in': {
                attrs: {
                    '.port-body': {
                        fill: '#16A085'
                    }
                }
            },
            'out': {
                attrs: {
                    '.port-body': {
                        fill: '#E74C3C'
                    }
                }
            }
        }
    },
    attrs: {
        '.label': { text: 'Osc1', 'ref-x': .5, 'ref-y': .2 },
        rect: { fill: '#2ECC71' }
    }
});
// place, annotate cells
var i = 0;
cells[i++].translate(40, 30); // move cell 0 a little bit
// osc 2
cells[i] = cells[i-1].clone();
cells[i].translate(200, 100);
cells[i++].attr('.label/text', 'Osc2');
graph.addCells(cells);
// effect 1
cells[i] = cells[i-1].clone();
cells[i].translate(200, 100);
cells[i++].attr('.label/text', 'Tremolo');
graph.addCells(cells);
// effect 2
cells[i] = cells[i-1].clone();
cells[i].translate(200, 100);
cells[i++].attr('.label/text', 'Delay');
graph.addCells(cells);
// output
cells[i] = cells[i-1].clone();
cells[i].translate(200, 100);
cells[i++].attr('.label/text', 'Output');
graph.addCells(cells);
// tone.js setup
// create dictionary of toneJS objects
var idDict = {};
i = 0;
idDict[cells[i++].id] = new Tone.Synth();

idDict[cells[i++].id] = new Tone.FMSynth();

idDict[cells[i++].id] = new Tone.Tremolo(10, 0.5).start();

idDict[cells[i].id] = new Tone.FeedbackDelay("4n", 0.6);
idDict[cells[i++].id].wet = 0.2;

idDict[cells[i++].id] = Tone.Master; 
delete i;
// array for each "line"/osc of element IDs
// var redLine = [];
// var blueLine = [];
var redLine = [cells[0].id];
var blueLine = [cells[1].id];
var oscArr = [cells[0].id, cells[1].id];

// set loop for 4 whole notes (?)
var t = Tone.Time("1n"); //encodes a whole note
t.mult(4); // multiply that value by 4
t.toNotation();
var loop = new Tone.Loop(function(time){
    //triggered every four whole notes. 
    console.log(time);
    // redLine
    idDict[oscArr[0]].triggerAttackRelease('C3', '1n');
    idDict[oscArr[0]].triggerAttackRelease('F3', '1n', '+1n+1n');
    // blueLine
    idDict[oscArr[1]].triggerAttackRelease('G4', '4n');
    idDict[oscArr[1]].triggerAttackRelease('E4', '4n', '+4n');
    idDict[oscArr[1]].triggerAttackRelease('G4', '4n', '+2n');
    idDict[oscArr[1]].triggerAttackRelease('C4', '4n', '+2n+16n');
    idDict[oscArr[1]].triggerAttackRelease('B4', '4n', '+3n');
}, t).start(0);
// set BPM
Tone.Transport.bpm.value = 120;
Tone.Transport.start();


// --- event handlers ---------------------------------------------------------

// called when a link changes source or target
// fixme: dragging from one node to another does not work... 
//      then there is an extra redLine element
//      need to make sure that link is changed from one source to another,
//      then the appropriate redLine element is removed
graph.on('change:source change:target', function(link) {
    var sourcePort = link.get('source').port;
    var sourceId = link.get('source').id;
    var sourceLabel = link.get('source').label;

    var targetPort = link.get('target').port;
    var targetId = link.get('target').id;
    var targetLabel = link.get('target').label;

    var m = [
        'The port ' + sourcePort,
        // ' of element with label ' + sourceLabel,
        // ' is connected to port ' + targetPort,
        // ' of element with label ' + targetLabel,
        ' of element with ID ' + idDict[sourceId],
        ' is connected to port ' + targetPort,
        ' of element with ID ' + idDict[targetId],
    ].join('');
    
    
    if (sourceId && targetId) {
        // do not allow non-contiguous links to be added
        if (redLine.indexOf(sourceId) < 0 && blueLine.indexOf(sourceId) < 0) {
            link.disconnect(); // works better than link.remove() ??
            return;
        };
        // determine which line is being changed
        var inboundLinks = [link];
        var myElement;
        while(inboundLinks.length > 0){
            myElement = inboundLinks[0].get('source');
            inboundLinks = graph.getConnectedLinks(myElement, { inbound: true });
        }
        // out(myElement);
        // out('redLine ' + redLine);
        // out('blueLine ' + blueLine);
        // add to line
        var line;
        if (redLine.indexOf(myElement.id) >= 0){           
            line = redLine;
            out('redLine');
        }
        else if (blueLine.indexOf(myElement.id) >= 0){           
            line = blueLine;
            out('blueLine');
        }
        line.length = 0;
        line.push(myElement.id);
        var outboundLinks = graph.getConnectedLinks(myElement, { outbound: true });
        while(outboundLinks.length > 0) {
            out(outboundLinks);
            myElement = outboundLinks[0].get('target');
            line.push(myElement.id);
            connectAudioNode(line, idDict);
            outboundLinks = graph.getConnectedLinks(myElement, { outbound: true });
        };
        out(line);
    };

    out(m);
});

// called when a link is removed
graph.on('remove', function(cell, collection, opt) {
    if (cell.isLink()) {
        // a link was removed  (cell.id contains the ID of the removed link)
        out("link " + cell.id + " was removed");
        var sourceId = cell.get('source').id;
        var targetId = cell.get('target').id;
        if( !sourceId || !targetId){ 
            // link needs both source and target to remove from redLine
            return;
        }
        // remove from redLine
        // var index = redLine.indexOf(targetId);
        // redLine.splice(index, 1);
        out("node removed (" + redLine.length + "): " + 
            lineToString(redLine, idDict));  
        // should call "removeAudioNode" but I'm not sure exactly 
        // what should go there
        idDict[sourceId].disconnect();
    }
})

// --- tonejs functions -------------------------------------------------------
// used to remove tone.js audio nodes when link is removed
function removeAudioNode(line, idDict){
    // ?? 
}

// used to add tone.js audio nodes when link is connected
function connectAudioNode(line, idDict) {
    // go through each element, get the corresponding tone.js element
    // then connect current tone.js element to the next one
    // todo: clear elements when links are removed
    for (var i = 0; i < line.length-1; i++) {
        idDict[line[i]].connect(idDict[line[i+1]]);
    };
    idDict[line[0]].triggerAttackRelease('C4', '1n');
    
};

// --- other functions --------------------------------------------------------
function out(m) {
    console.log(m);
}

function lineToString(line, idDict){
    var string;
    for (var i = 0; i < line.length; i++) {
        string = string + idDict[line[i]];
        string = string + " ";
    };
    return string;
}
