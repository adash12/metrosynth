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
    defaultRouter: { name: 'metro' },
	validateConnection: function(cellViewS, magnetS, cellViewT, magnetT, end, linkView) {

        // Prevent links that don't connect to anything 
        // (?) doesn't seem to work
        return cellViewS && cellViewT;

	},
});

// create cells
cells[0] = new joint.shapes.devs.Model({
  type: 'devs.Model',
  position: {x: 20, y: 20},
  size: { width: 90, height: 90 },
  inPorts: ['in1', 'in2'],
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
cells[0].translate(140, 100);
cells[1] = cells[0].clone();
cells[1].translate(300, 60);
cells[1].attr('.label/text', 'Effect');
graph.addCells(cells);
cells[2] = cells[1].clone();
cells[2].translate(300, 60);
cells[2].attr('.label/text', 'Output');
graph.addCells(cells);
// tone.js setup
// create dictionary of toneJS objects
var idDict = {};
idDict[cells[0].id] = new Tone.Synth();
idDict[cells[1].id] = new Tone.FeedbackDelay("4n", 0.5);
idDict[cells[1].id].wet = 0.5;
idDict[cells[2].id] = Tone.Master; 
// array for each "line"/osc of element IDs
var oscArr = [cells[0].id];


// --- event handlers ---------------------------------------------------------

// called when a link changes source or target
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
        // add to oscArr
        // should oscArr.push be in connectAudioNode? I don't think so because
        // oscArr is an array of joint.js ID's
        // how to know when to insert things into the middle of the array?
        oscArr.push(targetId);
        out("node added (" + oscArr.length + "): " + oscArr.toString());  
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
      // remove from oscArr
      var index = oscArr.indexOf(targetId);
      oscArr.splice(index, 1);
      out("node removed (" + oscArr.length + "): " + oscArr.toString());  
      // should call "removeAudioNode" but I'm not sure exactly 
      // what should go there
      idDict[sourceId].disconnect();
      // var targetId = cell.get('target').id;
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
    idDict[oscArr[0]].triggerAttackRelease('C4', '8n');
    
};

// --- other functions --------------------------------------------------------
function out(m) {
    console.log(m);
}

