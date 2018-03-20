// joint.js things
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
    // defaultLink: new joint.dia.Link({
    //     attrs: { '.marker-target': { d: 'M 10 0 L 0 5 L 10 10 z' } }
    // }),
	validateConnection: function(cellViewS, magnetS, cellViewT, magnetT, end, linkView) {
		// // Prevent linking from input ports.
		// if (magnetS && magnetS.getAttribute('port-group') === 'in') return false;
		// // Prevent linking from output ports to input ports within one element.
		// if (cellViewS === cellViewT) return false;
		// // Prevent linking to input ports.
		// return magnetT && magnetT.getAttribute('port-group') === 'in';

        // Prevent links that don't connect to anything 
        // (?) doesn't seem to work
        return cellViewS && cellViewT;

	},
	// validateMagnet: function(cellView, magnet) {
	// 	// Note that this is the default behaviour. Just showing it here for reference.
	// 	// Disable linking interaction for magnets marked as passive (see below `.inPorts circle`).
	// 	return magnet.getAttribute('magnet') !== 'passive';
	// }

    // Enable link snapping within 20px lookup radius
    // snapLinks: { radius: 20 }
});

// tone.js things

// var synth = new Tone.Synth();
var effect = new Tone.FeedbackDelay("4n", 1);
effect.wet = 0.5;

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
// setup cells
cells[0].translate(140, 100);
cells[1] = cells[0].clone();
cells[1].translate(300, 60);
cells[1].attr('.label/text', 'Effect');
graph.addCells(cells);
cells[2] = cells[1].clone();
cells[2].translate(300, 60);
cells[2].attr('.label/text', 'Output');
graph.addCells(cells);
var idDict = {};
// create dictionary
// this way uses labels of elements
for (var i = 0; i < cells.length; i++) {
    // var m = ['Cell ' + i + 'has id ' + cells[i].id ].join('');
    // out(m);
    idDict[cells[i].id] = cells[i].attr('.label/text');
};
// but we could just have the dictionary be toneJS objects
idDict[cells[0].id] = new Tone.Synth();
idDict[cells[1].id] = new Tone.FeedbackDelay("4n", 0.5);
idDict[cells[2].id] = Tone.Master; 
// array for each "line"/osc of element IDs
var oscArr = [cells[0].id];


// var svgZoom = svgPanZoom('#canvas svg', {
//   center: false,
//   zoomEnabled: true,
//   panEnabled: true,
//   controlIconsEnabled: true,
//   fit: false,
//   minZoom: 0.5,
//   maxZoom:2,
//   zoomScaleSensitivity: 0.5
// });

// (function(){
//   paper.on('cell:pointerdown', function(){
//     svgZoom.disablePan();
//   });
//   paper.on('cell:pointerup', function(){
//     svgZoom.enablePan();
//   });
  
//   paper.on('cell:pointerclick', function(e){
//     message.addClass('visible');
//     message.html(e.el.textContent+' clicked');
//   setTimeout(function(){  message.removeClass('visible');
//                        }, 1000);
//   });
// })();

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
    // if (idDict[sourceId] === 'Osc' && idDict[targetId] === 'Output') {
    // 	synth.triggerAttackRelease('C4', '8n');
        oscArr.push(targetId);
        out(oscArr.length);  
        connectSounds(oscArr, idDict);
    };

    out(m);
});

function connectSounds(oscArr, idDict) {
    // if(idDict[oscArr[0]] === 'Osc'){
    //     synth = new Tone.Synth();
    // }
    // else{ // this would be an error with oscArr
    //     return;
    // }
    // for (var i = 0; i < oscArr.length; i++) {
    //     if(idDict[oscArr[i]] === 'Output'){
    //         out('connect to master');
    //         synth.connect(Tone.Master);
    //     }
    //     if(idDict[oscArr[i]] === 'Effect'){
    //         out('connect to effect');
    //         synth = synth.connect(effect);
    //     }
    // };
    for (var i = 0; i < oscArr.length-1; i++) {
        idDict[oscArr[i]].connect(idDict[oscArr[i+1]]);
    };
    idDict[oscArr[0]].triggerAttackRelease('C4', '8n');
    
};

function out(m) {
    console.log(m);
}

// paper.on('link:connnect', function( linkView, evt, elementViewConnected, magnet, arrowhead){
// 	console.log("connect"+arguments)
    
// });

// paper.on('link:pointerup', function(linkView, evt, elementViewConnected, magnet, arrowhead){
//   console.log("pointerup"+arguments)
// });