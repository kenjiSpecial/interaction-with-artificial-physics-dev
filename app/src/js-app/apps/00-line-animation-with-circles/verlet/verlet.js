var Vec2 = require('ks-vector').Vector2;
var TIME_STEP = require('./constants.js').TIME_STEP;


class Verlet {
	/**
	* @param {Number} width
	* @param {NUmber} height
	* @param {2dContext} ctx
	*/

	constructor( width, height, ctx ) {
		this.width = width;
		this.height = height;
		this.ctx = ctx;

		this.gravity = new Vec2(0, 100);
		this.friction = .99;
		this.groundFriction = 0.8;

		this.bounds = function (particle) {
			if (particle.pos.y > this.height-1)
				particle.pos.y = this.height-1;

			if (particle.pos.x < 0)
				particle.pos.x = 0;

			if (particle.pos.x > this.width-1)
				particle.pos.x = this.width-1;
		};

		this.composites = [];
		this.balls = [];
		this.alphaArr = [];

	}

	frame() {
	  var i, j, c;

		for(var cc in this.composites){
			if(this.composites[cc]){
				for(var ii in this.composites[cc].particles ){

					var particles = this.composites[cc].particles;

					var velocity = particles[ii].pos.copy().subtract( particles[ii].lastPos ).multiply(this.friction);

					// ground friction
					if(particles[ii].pos.y >= this.height-1 && velocity.getLength() > 0.0000001){
						var m = velocity.getLength();
						velocity.divide(m);

						velocity.multiply(m*this.groundFriction);
					}

					// save last good state
					particles[ii].lastPos = particles[ii].pos.copy();

					// gravity
					particles[ii].pos.addMultipledVector( TIME_STEP * TIME_STEP, this.gravity );
					// console.log(particles[ii].pos);



					// interia
					particles[ii].pos.add(velocity);

				}
			}

		}

		// relax
		var frame = 60;
		var stepCoef = 1 / frame;
		for(var cc in this.composites){
			if(this.composites[cc]){
				var constraints = this.composites[cc].constraints;
				for(var ii = 0; ii < frame; ii++){
					for(var jj in constraints){
						constraints[jj].relax(stepCoef);
					}
				}
			}

		}

		// bounds checking
		// for(var cc in this.composites){
		// 	var particles = this.composites[cc].particles;
		// 	for(var ii in particles){
		// 		this.bounds(particles[ii]);
		// 	}
		// }

		for(var cc in this.composites){
			if(this.composites[cc]){
				var particles = this.composites[cc].particles;

				for(var ii in particles){

					this.setCircleBounds(particles[ii]);
				}
			}
		}

		// ball bounds checking
		for(var cc in this.composites){
			if(this.composites[cc]){
				var particles = this.composites[cc].particles;
				//console.log(cc);
				var isUnderGround = true;
				for(var ii in particles){
					var particlePos = particles[ii].pos;
					//this.bounds(particles[ii]);
					//this.setCircleBounds(particles[ii]);
					if(particlePos.y < window.innerHeight){
						isUnderGround = false;
					}
				}

				if(isUnderGround){
					this.composites[cc] = null;
				}
			}
		}
	}

	draw(){
		var ii, cc;
		// this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

		for(cc in this.composites){
			if(this.composites[cc]){

				var particleArr = this.composites[cc].particles;
				this.ctx.beginPath();
				for(var ii = 0; ii < particleArr.length - 1; ii++){
					var midX = (particleArr[ii].pos.x + particleArr[ii + 1].pos.x)/2;
					var midY = (particleArr[ii].pos.y + particleArr[ii + 1].pos.y)/2;


					if(ii == 0){
						this.ctx.moveTo(midX, midY);
					}else{
						this.ctx.quadraticCurveTo(particleArr[ii].pos.x, particleArr[ii].pos.y, midX, midY);
					}


				}

				this.ctx.strokeStyle = "rgba(0, 0, 200, "+this.alphaArr[cc] +")"
				this.ctx.stroke();
			}
		}


	}

	addComposites( composite ){
		this.composites.push(composite);
		var alpha =  0.02;
		this.alphaArr.push(alpha);
	}

	addBalls(ball){
		this.balls.push(ball);
	}

	setCircleBounds(particle){
		for(var jj = 0; jj < this.balls.length; jj++){
			var ball = this.balls[jj];
			var rad = ball.rad;

			var subtractVec = particle.pos.copy().subtract(ball.pos)
			var length = subtractVec.getLength();

			if(rad > length){
				// console.log('hit');
				// var theta =
				//console.log(subtractVec);
				var theta = Math.atan2(subtractVec.y, subtractVec.x);
				var updatedPosX = rad * Math.cos(theta) + ball.pos.x;
				var updatedPosY = rad * Math.sin(theta) + ball.pos.y;

				particle.pos.x = updatedPosX;
				particle.pos.y = updatedPosY;
			}

		}

	}

}

module.exports = Verlet;
