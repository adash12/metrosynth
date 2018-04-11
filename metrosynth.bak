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
        '.label': { text: 'Osc', 'ref-x': .5, 'ref-y': .2 },
        rect: { fill: '#2ECC71' }
    }
});
// place, annotate cells
var i = 0;
// cells[i++].translate(140, 100);
cells[i++].translate(40, 30);
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
idDict[cells[i++].id] = new Tone.Tremolo(10, 0.5).start();
idDict[cells[i].id] = new Tone.FeedbackDelay("4n", 0.5);
idDict[cells[i++].id].wet = 0.5;
idDict[cells[i++].id] = Tone.Master; 
delete i;
// array for each "line"/osc of element IDs
var oscArr = [cells[0].id];

// set loop for 4 whole notes (?)
var t = Tone.Time("1n"); //encodes a whole note
t.mult(4); // multiply that value by 4
t.toNotation(); //returns "1m"
var loop = new Tone.Loop(function(time){
    //triggered every four whole notes. 
    console.log(time);
    idDict[oscArr[0]].triggerAttackRelease('C4', '1n');
}, t).start(0);
// set BPM
Tone.Transport.bpm.value = 120;
Tone.Transport.start();


// --- event handlers ---------------------------------------------------------

// called when a link changes source or target
// fixme: dragging from one node to another does not work... 
//      then there is an extra oscArr element
//      need to make sure that link is changed from one source to another,
//      then the appropriate oscArr element is removed
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
        // how to know when to insert things into the middle of the array?

        // do not allow non-contiguous links to be added
        if (oscArr.indexOf(sourceId) < 0) {
            link.disconnect(); // works better than link.remove() ??
            return;
        };
        // add to oscArr
        // should oscArr.push be in connectAudioNode? I don't think so because
        // oscArr is an array of joint.js ID's, not really related to tone.js
        oscArr.push(targetId);
        out("node added (" + oscArr.length + "): " + 
            oscArrToString(oscArr, idDict));  
        connectAudioNode(oscArr, idDict);
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
            // link needs both source and target to remove from oscArr
            return;
        }
        // remove from oscArr
        var index = oscArr.indexOf(targetId);
        oscArr.splice(index, 1);
        out("node removed (" + oscArr.length + "): " + 
            oscArrToString(oscArr, idDict));  
        // should call "removeAudioNode" but I'm not sure exactly 
        // what should go there
        idDict[sourceId].disconnect();
    }
})

// --- tonejs functions -------------------------------------------------------
// used to remove tone.js audio nodes when link is removed
function removeAudioNode(oscArr, idDict){
    // ?? 
}

// used to add tone.js audio nodes when link is connected
function connectAudioNode(oscArr, idDict) {
    // go through each element, get the corresponding tone.js element
    // then connect current tone.js element to the next one
    // todo: clear elements when links are removed
    for (var i = 0; i < oscArr.length-1; i++) {
        idDict[oscArr[i]].connect(idDict[oscArr[i+1]]);
    };
    idDict[oscArr[0]].triggerAttackRelease('C4', '1n');
    
};

// --- other functions --------------------------------------------------------
function out(m) {
    console.log(m);
}

function oscArrToString(oscArr, idDict){
    var string;
    for (var i = 0; i < oscArr.length; i++) {
        string = string + idDict[oscArr[i]];
        string = string + " ";
    };
    return string;
}
