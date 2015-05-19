var numInteraction = 10;
var kFriction = 1;
var solveType;

var CONSTANTS = require('./constants.js');

var solver = function(contacts) {
    for (var jj = 0; jj < numInteraction; jj++) {
        for (var ii = 0; ii < contacts.length; ii++) {
            var con = contacts[ii];
            var n = con.normal;
            var dv = con.getVelPb().subtract(con.getVelPa());

            var relNv = dv.dotProduct(n);

            var tangent = n.copy().perp();

            var tanV = dv.dotProduct(tangent);


            SpeculativeSequential(con, n, relNv, tanV, tangent);

        }
    }
}

function speculativeSolver(con, n, relNv) {
    var remove = relNv +   con.Dist / CONSTANTS.timeStep;

    if (remove < 0) {
        var mag = remove *  con.invDenom;
        var imp = n.copy().multiply(mag );

        con.applyImpulses(imp);
    }
}

function SpeculativeSequential ( con, n, relNv, tanV, tangent) {
  var remove = relNv +   con.Dist / CONSTANTS.timeStep;

  var mag = remove *  con.invDenom;

  var newImpulse = Math.min(mag + con.Impulse, 0);
  var change = newImpulse - con.Impulse;

  var imp = con.normal.copy().multiply(change);

  con.applyImpulses(imp);
  con.Impulse = newImpulse;

  var absMag = Math.abs(con.Impulse) * kFriction;
  mag = tanV * con.invDenomTan;

  newImpulse = Math.min( Math.max(mag + con.ImpulseT, -absMag), absMag);
  change = newImpulse - con.ImpulseT;
  imp = tangent.copy().multiply(change);

  con.applyImpulses(imp);
  con.ImpulseT = newImpulse;
}

/**
*/
function discreteSolver ( con, n, relNv ) {
  var remove = relNv + .4 * (con.Dist + 1) / CONSTANTS.timeStep;

  if(con.mDist < 0 && remove < 0){

    var mag = remove / (con.A.invMass + con.B.invMass);
    var imp = con.normal.copy().multiply(mag);

    con.applyImpulses(imp);
  }
}

function discreteSequential(con, n, relNv){
  if(con.mDist < 0){
    var remove = relNv + .4 * (con.mDist + 1) / CONSTANTS.timeStep;

    var mag = remove / (con.mA.invMass + con.mB.invMass);
    var newImpulse = Math.min(mag + con.mImpulse, 0)
    var change = newImpulse - con.mImpulse;

    var imp = con.normal.copy().multiply(change);

    con.applyImpulses(imp);

    con.mImpulse = newImpulse;

  }
}


module.exports = solver;
