joint.shapes.devs.Model = joint.shapes.devs.Model.extend({
	markup: '<g class="element-node">'+
             '<rect class="body" stroke-width="0"></rect>'+
            '<text  transform="rotate(-45)" class="label" y="0.8em" xml:space="preserve" font-size="14" text-anchor="middle" font-family="Helvetica" font-weight="bold">'+
              '<tspan id="v-18" dy="0em" x="0" class="v-line"></tspan>'+
            '</text>'+
          '<g class="inPorts"/>' +
          '<g class="outPorts"/>' +
        '</g>',
	portMarkup: '<g class="port port<%= id %>"><circle class="port-body"/></g>'
    });
  
var canvas = $('#canvas');
var filter = $('#filter');
var addColor = $('#addColor');
var cells = [];
var message = $('#message');
var graph = new joint.dia.Graph();

var paper = new joint.dia.Paper({
	el: canvas,
	width: canvas.outerWidth(),
	height: canvas.outerHeight(),
	model: graph,
	gridSize: 10,
	drawGrid: true,
	defaultRouter: { name: 'metro' },
	clickThreshold: 1,
	linkPinning: false
    });

cells[0] = new joint.shapes.devs.Model({
	type: 'devs.Model',
	position: {x: 0, y: 0},
	attrs: {
	    '.body': {
		width: '230',
		height: '0'
	    },
	    '.label': {
		text: 'Shady Grove',
	    }
	},
	inPorts: ['center']
    });
cells[0].translate(0, 0);
cells[1] = cells[0].clone();
cells[1].translate(40, 40);
cells[1].attr('.label/text', 'Rockville');
cells[2] = cells[0].clone();
cells[2].translate(80, 80);
cells[2].attr('.label/text', 'Twinbrook');
cells[3] = cells[0].clone();
cells[3].translate(120, 120);
cells[3].attr('.label/text', 'White Flint');
cells[4] = cells[0].clone();
cells[4].translate(160, 160);
cells[4].attr('.label/text', 'Grosvenor');
cells[5] = cells[0].clone();
cells[5].translate(200, 200);
cells[5].attr('.label/text', '');
cells[6] = cells[0].clone();
cells[6].translate(240, 240);
cells[6].attr('.label/text', 'Bethesda');
cells[7] = cells[0].clone();
cells[7].translate(280, 280);
cells[7].attr('.label/text', '');
cells[8] = cells[0].clone();
cells[8].translate(320, 320);
cells[8].attr('.label/text', '');
cells[9] = cells[0].clone();
cells[9].translate(370, 320);
cells[9].attr('.label/text', 'UDC');
cells[10] = cells[0].clone();
cells[10].translate(410, 360);
cells[10].attr('.label/text', 'Cleveland Park');
cells[11] = cells[0].clone();
cells[11].translate(450, 400);
cells[11].attr('.label/text', 'Woodley Park');
cells[12] = cells[0].clone();
cells[12].translate(490, 440);
cells[12].attr('.label/text', 'Dupont Circle');
cells[13] = cells[0].clone();
cells[13].translate(530, 480);
cells[13].attr('.label/text', 'Farragut North');
cells[13] = cells[0].clone();
cells[13].translate(530, 480);
cells[13].attr('.label/text', 'Farragut North');
graph.addCells(cells);

var link = new joint.dia.Link({
	source: {
	    id: cells[0].id,
	    port: 'center'
	},
	target: {
	    id: cells[1].id,
	    port: 'center'
	}
    });

link.on('change:source', function(){
	console.log("test");
	//create a synth and connect it to the master output (your speakers)
	var synth = new Tone.Synth().toMaster();

	//play a middle 'C' for the duration of an 8th note
	synth.triggerAttackRelease('C4', '8n');
    });

graph.addCells([link]);

function addCell(){
    //var color = addColor.val();
    var number = cells.length;
    cells[number] = cells[0].clone();
    cells[number].translate(-140, -100);
    //cells[number].attr('.element-node/data-color', color);
    cells[number].attr('.label/text', 'Output '+cells.length);
    graph.addCells(cells);
}

$('#addCell').on('click', addCell);

$(filter).on('change', function(e){
	canvas.attr('data-filter', e.target.value);
    });

var svgZoom = svgPanZoom('#canvas svg', {
	center: false,
	zoomEnabled: true,
	panEnabled: true,
	controlIconsEnabled: true,
	fit: false,
	minZoom: 0.5,
	maxZoom:2,
	zoomScaleSensitivity: 0.5
    });

(function(){
    paper.on('cell:pointerdown', function(){
	    svgZoom.disablePan();
	});
    paper.on('cell:pointerup', function(){
	    svgZoom.enablePan();
	});
  
  
  
    paper.on('cell:pointerclick', function(e){
	    message.addClass('visible');
	    message.html(e.el.textContent+' clicked');
	    setTimeout(function(){  message.removeClass('visible');
		}, 1000);
	});
})();