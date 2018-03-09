var canvas = $('#canvas');
var cells = [];
var graph = new joint.dia.Graph();

var synth = new Tone.Synth().toMaster()

var paper = new joint.dia.Paper({ 
	el: $('#canvas'), 
	width: canvas.outerWidth(), 
	height: 650, 
	gridSize: 1, 
	model: graph,
    defaultLink: new joint.dia.Link({
        attrs: { '.marker-target': { d: 'M 10 0 L 0 5 L 10 10 z' } }
    }),
	// validateConnection: function(cellViewS, magnetS, cellViewT, magnetT, end, linkView) {
	// 	// Prevent linking from input ports.
	// 	if (magnetS && magnetS.getAttribute('port-group') === 'in') return false;
	// 	// Prevent linking from output ports to input ports within one element.
	// 	if (cellViewS === cellViewT) return false;
	// 	// Prevent linking to input ports.
	// 	return magnetT && magnetT.getAttribute('port-group') === 'in';
	// },
	// validateMagnet: function(cellView, magnet) {
	// 	// Note that this is the default behaviour. Just showing it here for reference.
	// 	// Disable linking interaction for magnets marked as passive (see below `.inPorts circle`).
	// 	return magnet.getAttribute('magnet') !== 'passive';
	// }

    // Enable link snapping within 20px lookup radius
    // snapLinks: { radius: 20 }
});
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
        '.label': { text: 'Oscillator', 'ref-x': .5, 'ref-y': .2 },
        rect: { fill: '#2ECC71' }
    }
});
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
for (var i = 0; i < cells.length; i++) {
    // var m = ['Cell ' + i + 'has id ' + cells[i].id ].join('');
    // out(m);
    idDict[cells[i].id] = cells[i].attr('.label/text');
};

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
    	synth.triggerAttackRelease('C4', '8n');
    };

    out(m);
});

function out(m) {
    console.log(m);
}

// paper.on('link:connnect', function( linkView, evt, elementViewConnected, magnet, arrowhead){
// 	console.log("connect"+arguments)
    
// });

// paper.on('link:pointerup', function(linkView, evt, elementViewConnected, magnet, arrowhead){
//   console.log("pointerup"+arguments)
// });