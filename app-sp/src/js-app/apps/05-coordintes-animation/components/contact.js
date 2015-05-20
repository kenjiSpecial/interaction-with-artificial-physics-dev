var Vector2 = require('ks-vector').Vector2;

/**
*   @desc
*
*   @param {RigidBody} A
*   @param {RigidBody} B
*   @param {Vector2} pa
*   @param {Vector2} pb
*   @param {Vector2} n
*   @param {Number} dist
*/
var Contact = function(A, B, pa, pb, n, dist, k) {
  this.A  = A;
  this.B  = B;
  this.Pa = pa;
  this.Pb = pb;
  this.normal = n;
  this.Dist = dist;
  this.Impulse = this.ImpulseT = 0;
  this.k = k || 1;

  this.ra = pa.copy().subtract(A.pos).perp();
  this.rb = pb.copy().subtract(B.pos).perp();


  var aInvMass = A.invMass;
  var bInvMass = B.invMass;
  var ran = this.ra.dotProduct(n);
  var rbn = this.rb.dotProduct(n);

  var c = ran * ran * A.invI;
  var d = rbn * rbn * B.invI;

  this.invDenom = 1 / (aInvMass + bInvMass + c + d);

  var t = n.copy().perp();
  ran = this.ra.dotProduct(t);
  rbn = this.rb.dotProduct(t);
  c = ran * ran * A.invI;
  d = rbn * rbn * B.invI;

  this.invDenomTan = 1 / (aInvMass + bInvMass + c + d);

};

Contact.prototype = {
  /**
  * @param {Vector2} imp
  */
  applyImpulses : function(imp) {
    //console.log(imp);
    this.A.vel.addMultipledVector(this.A.invMass, imp);
    this.B.vel.subtractMultipledVector(this.B.invMass, imp);

    this.A.angularVel += imp.dotProduct(this.ra) * this.A.invI;
    this.B.angularVel -= imp.dotProduct(this.rb) * this.B.invI;
  },

  /**
  * @return {Vector2}
  */

  getVelPa : function() {
    return this.A.vel.copy().addMultipledVector(this.A.angularVel, this.ra);
  },

  /**
  * @return {Vector2}
  */

  getVelPb : function() {
    return this.B.vel.copy().addMultipledVector(this.B.angularVel, this.rb);
  },

  draw : function(ctx) {
    ctx.fillStyle = "#0000ff";

    ctx.beginPath();
    ctx.arc(this.A.pos.x, this.A.pos.y, 3, 0, 2 * Math.PI );
    ctx.fill();

    ctx.beginPath();
    ctx.arc(this.B.pos.x, this.B.pos.y, 3, 0, 2 * Math.PI );
    ctx.fill();

    ctx.fillStyle = "#009900";
    ctx.beginPath();
    ctx.arc(this.Pa.x, this.Pa.y, 2, 0, 2 * Math.PI );
    ctx.fill();

    ctx.beginPath();
    ctx.arc(this.Pb.x, this.Pb.y, 2, 0, 2 * Math.PI );
    ctx.fill();


    ctx.strokeStyle = "#0000ff";
    ctx.beginPath();
    ctx.moveTo(this.Pa.x, this.Pa.y);
    ctx.lineTo(this.Pa.x + this.ra.x, this.Pa.y + this.ra.y  );
    ctx.stroke();

    ctx.strokeStyle = "#0000ff";
    ctx.beginPath();
    ctx.moveTo(this.Pb.x, this.Pb.y);
    ctx.lineTo(this.Pb.x + this.rb.x, this.Pb.y + this.rb.y  );
    ctx.stroke();


    //ctx.moveTo(this.Pa.x, )

  }

};



module.exports = Contact;
