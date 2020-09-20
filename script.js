var simulateClick = function(elem){
	// Create our event (with options)
	var evt = new MouseEvent('click', {
		bubbles: true,
		cancelable: true,
		view: window
	});
	// If cancelled, don't dispatch our event
	var canceled = !elem.dispatchEvent(evt);
};

// Blobby!
var c = document.getElementById('wave'),
	ctx = c.getContext('2d'),
	cw = c.width,
	ch = c.height,
	points = [],
	tick = 0,
	opt = {
		count: 10,
		range: {
			x: 10,
			y: 20
		},
		duration: {
			min: 40,
			max: 180
		},
		thickness: 0,
		strokeColor: '#191b21',
		level: .1,
		curved: true
	},
		
	rand = function(min, max){
		return Math.floor( (Math.random() * (max - min + 1) ) + min);
	},
		
	ease = function (t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t + b;
		return -c/2 * ((--t)*(t-2) - 1) + b;
	};

	ctx.lineJoin = 'round';
	ctx.lineWidth = opt.thickness;
	ctx.strokeStyle = opt.strokeColor;
	ctx.imageSmoothingEnabled;

	var Point = function(config){
		this.anchorX = config.x;
		this.anchorY = config.y;
		this.x = config.x;
		this.y = config.y;
		this.setTarget();	
	};

	Point.prototype.setTarget = function(){
		this.initialX = this.x;
		this.initialY = this.y;
		this.targetX = this.anchorX + rand(0, opt.range.x * 2) - opt.range.x;
		this.targetY = this.anchorY + rand(0, opt.range.y * 2) - opt.range.y;
		this.tick = 0;
		this.duration = rand(opt.duration.min, opt.duration.max);
	}
	
	Point.prototype.update = function(){
		var dx = this.targetX - this.x;
		var dy = this.targetY - this.y;
		var dist = Math.sqrt(dx * dx + dy * dy);
		
		if(Math.abs(dist) <= 0){
			this.setTarget();
		} else {			 
			var t = this.tick;
			var b = this.initialY;
			var c = this.targetY - this.initialY;
			var d = this.duration;
			this.y = ease(t, b, c, d);
			
			b = this.initialX;
			c = this.targetX - this.initialX;
			d = this.duration;
			this.x = ease(t, b, c, d);
			
			this.tick++;
		}
	};
	
	Point.prototype.render = function(){
		ctx.beginPath();
		ctx.arc(this.x, this.y, 3, 0, Math.PI * 2, false);
		ctx.fillStyle = '#191b21';
		ctx.fill();
	};

	var updatePoints = function(){
		var i = points.length;

		while(i--){
			points[i].update();
		}
	};

	var renderPoints = function(){
		var i = points.length;
		while(i--){
			points[i].render();
		}
	};

	var renderShape = function(){
		ctx.beginPath();
		var pointCount = points.length;
		ctx.moveTo(points[0].x, points[0].y);		

		var i;
		for (i = 0; i < pointCount - 1; i++) {
			var c = (points[i].x + points[i + 1].x) / 2;
			var d = (points[i].y + points[i + 1].y) / 2;
			ctx.quadraticCurveTo(points[i].x, points[i].y, c, d);
		}

		ctx.lineTo(-opt.range.x - opt.thickness, ch + opt.thickness);
		ctx.lineTo(cw + opt.range.x + opt.thickness, ch + opt.thickness);
		ctx.closePath();	 
		ctx.fillStyle = '#191b21';
		ctx.fill();	
		ctx.stroke();
	};

	var clear = function(){
		ctx.clearRect(0, 0, cw, ch);
	};

	var loop = function(){
		window.requestAnimFrame(loop, c);
		tick++;
		clear();
		updatePoints();
		renderShape();
	};

	var i = opt.count + 2;
	var spacing = (cw + (opt.range.x * 2)) / (opt.count-1);

	while(i--){
		points.push(new Point({
		x: (spacing * (i - 1)) - opt.range.x,
		y: ch - (ch * opt.level)
		}));
	}

	window.requestAnimFrame=function(){return window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(a){window.setTimeout(a, 1000)}}();

	loop();

// Looker At-er
var container = document.querySelector('#container'),
		profile = document.querySelector('#profile'),
		sections = document.querySelector('#section-container'),
		clappy = document.querySelector('.applause-container'),
		profilePhoto   = document.querySelector('#profile-photo');

var range = { x:3, y:6 }, // Maxmimum degrees of deflection
		width = window.innerWidth,
		height = window.innerHeight,
		center = { x: width/2, y: height/2 },
		dX, dY, rY, rX; // For use later

document.body.onmousemove = function(e){
	var x = event.clientX,
			y = event.clientY;
	
	dX = (x > center.x) ? x - center.x : (center.x - x) * -1;
	dY = (y > center.y) ? (y - center.y) * -1 : center.y - y;
	
	rY = (dX / center.x) * range.x;
	rX = (dY / center.y) * range.y;
	
	container.style.transform = 'rotateY('+ rY +'deg) ' +
							              	'rotateX('+ rX +'deg) ';

	profile.style.transform = 'translateX('+ rY / 1.1 +'%) ' +
							              'translateY('+ rX / 1.1 * -1 +'%) ';

	sections.style.transform = 'translateX('+ rY / 2.5 +'%) ' +
							               'translateY('+ rX / 2.5 * -1 +'%) ';

	clappy.style.transform = 'translateX('+ rY / .7 +'%) ' +
							             'translateY('+ rX / .7 * -1 +'%) ';
	
	profilePhoto.style.backgroundPosition = ' '+ rY / 2 + 4 +'px ' +
							             ' '+ rX / 3 * -1 +'px ';
};

document.body.addEventListener( 'mouseleave', function(e){
	//document.body.classList.add('no-look');
	//container.removeAttribute('style');
	//sections.removeAttribute('style');
	//profile.removeAttribute('style');
});

document.body.addEventListener( 'mouseenter', function(e){
	setTimeout(function(){
		document.body.classList.remove('no-look');
	},350);
});


// Applause
var audiotypes = {
	"mp3": "audio/mpeg",
	"mp4": "audio/mp4",
	"ogg": "audio/ogg",
	"wav": "audio/wav"
}

function ss_soundbits(sound){
	var audio_element = document.createElement('audio')
	if (audio_element.canPlayType){
			for (var i=0; i<arguments.length; i++){
					var source_element = document.createElement('source')
					source_element.setAttribute('src', arguments[i])
					if (arguments[i].match(/\.(\w+)$/i))
							source_element.setAttribute('type', audiotypes[RegExp.$1])
					audio_element.appendChild(source_element)
			}
			audio_element.load()
			audio_element.playclip=function(){
					audio_element.pause()
					audio_element.currentTime=0
					audio_element.play()
			}
			return audio_element
	}
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function generateParticles(el, min, max, timeout, sizing) {
	min = min ? min : 12;
	max = max ? max : 24;
	sizing = sizing ? sizing : 6;
	timeout = timeout ? timeout : 0;

	var number = randomInt(min, max);
	var colors = ["#0095ee", "#ee3d69", "#0350b9", "#DDCA60"];
	var particle;

	for (var i = 0; i < number; i++) {
		particle = document.createElement("span");
		particle.classList.add("particle");
		el.insertBefore(particle, el.firstChild);
	}

	var particles = el.querySelectorAll('.particle');
	particles.forEach(function(particle){
		var size = Math.floor(Math.random() * sizing) + sizing / 2;
		var color = colors[Math.floor(Math.random() * colors.length)];
		var x = randomInt(200, 550) * randomInt(-1, 1);
		var y = randomInt(200, 550) * randomInt(-1, 1);
		var xform = randomInt(2, 4);
		var opacity = xform - 0.25;
		var top = randomInt(0, el.offsetHeight) / 2;
		var left = randomInt(0, el.offsetWidth) / 2;

		var t = randomInt(0,1) ? '+' : '-';
		var l = randomInt(0,1) ? '+' : '-';

		particle.style.top = 'calc(50% '+t+' '+ top +'px)';
		particle.style.left = 'calc(50% '+l+' '+ left +'px)';

		particle.style.width = size + "px";
		particle.style.height = size + "px";
		particle.style.background = color;

		particle.style.transition = "transform "+xform+"s cubic-bezier(0,1,.4,1), opacity " + opacity + "s ease-in-out";
		particle.style.opacity = 0;
		particle.style.transform = "translate(" + x + "%, " + y + "%) scale(0)";
		
		setTimeout(function(){
			particle.remove();
		},1000);
	});
}

var clickUpsound   = ss_soundbits('https://facebook.design/public/sounds/Button 4.mp3');
var clickDownsound = ss_soundbits('https://facebook.design/public/sounds/Button 6.mp3');
var awardSound     = ss_soundbits('https://facebook.design/public/sounds/Success 2.mp3');
var alertSound     = ss_soundbits('https://facebook.design/public/sounds/Alert 3.mp3');

var clapTimer;                  // Timer identifier
var doneClappingInterval = 750; // Time in ms

function applaud(el,e){
	if( e.button == null || e.button == 1 )
		return false;

	var dir = 1;
	dir = (e.button == 0) ? 1 : -1;

	var claps = parseInt( el.getAttribute('data-claps') );
	var totalClaps = el.querySelector('.total-claps');

	if( claps <= 0 && dir == -1 )
		return false;
		
	if( claps >= 10 && dir == 1 )
		return false;
	
	var newTotal = parseInt(totalClaps.innerText.replace(/,/g,'')) + dir;
	totalClaps.innerText = Intl.NumberFormat('en-US').format(newTotal);
	
	if( claps == 9 && dir == 1 ){
		//generateParticles(el, 12, 24, 0, 18);
		generateParticles(el, 48, 64, 0, 22);
		awardSound.playclip();
	} else if( claps == 10 && dir == -1 ){
		alertSound.playclip();
	} else {
		if( dir == 1 ){
			generateParticles(el, 6, 12, 0, 18);
			clickUpsound.playclip();
		} else {
			clickDownsound.playclip();
		}
	}

	el.setAttribute( 'data-claps', parseInt(claps) + dir );

	if( typeof clapTimer !== 'undefined' )
		clearTimeout(clapTimer);

	clapTimer = setTimeout(function(){
		console.log( 'You clapped '+newTotal+' times' );
	}, doneClappingInterval );
}

	var menu  = document.querySelector('nav');
	var pages = document.querySelectorAll('#section-container > section');

	if( menu != null ){
		var menuItems = menu.querySelectorAll('nav > a');
		if( menuItems.length > 0 ){
			menuItems.forEach(function(menuItem){
				menuItem.onclick = function(e){
					// Reset the menu and pages
					for( i = 0, n = menuItems.length; i < n; i++ ){
						menuItems[i].classList.remove('active');
					}
					for( i = 0, n = pages.length; i < n; i++ ){
						pages[i].classList.add('invisible');
					}

					this.classList.add('active');
					var activePage = this.innerText.toLowerCase();
					var page = document.querySelector('#'+activePage);

					if( page != null ){
						page.classList.remove('invisible');
					}
				};
			});
		}
	}