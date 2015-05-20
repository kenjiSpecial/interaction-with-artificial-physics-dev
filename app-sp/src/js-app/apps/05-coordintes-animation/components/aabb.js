var Vector2 = require('ks-vector').Vector2;

var AABB = function() {};

/**
 * @param {Vector2} mCenter
 * @param {Vector2} mHalfExtents
 */
AABB.prototype.setVector = function(mCenter, mHalfExtents) {
    this.mCenter = mCenter;
    this.mHalfExtents = mHalfExtents;
};

/**
 * @param {AABB} a
 * @param {AABB} b
 */
AABB.prototype.setAABB = function(a, b) {
    var minVectorA = a.mCenter.copy().subtract(a.mHalfExtents);
    var maxVectorA = a.mCenter.copy().add(a.mHalfExtents);

    var minVectorB = b.mCenter.copy().subtract(b.mHalfExtents);
    var maxVectorB = b.mCenter.copy().add(b.mHalfExtents);

    var minVector = minVectorA.copy().min(minVectorB);
    var maxVector = maxVectorA.copy().max(maxVectorB);

    this.mCenter = minVector.copy().add(maxVector).divide(2);
    this.mHalfExtents = maxVector.copy().subtract(minVector).divide(2);
}

/**
 * @param {AABB} a
 * @param {AABB} b
 * @return {bool}
 */

AABB.overlap = function(a, b) {

    var aMaxX = a.mCenter.x + a.mHalfExtents.x
    var aMinX = a.mCenter.x - a.mHalfExtents.x

    var aMaxY = a.mCenter.y + a.mHalfExtents.y
    var aMinY = a.mCenter.y - a.mHalfExtents.y

    //console.log('aMaxX: ' + aMaxX);

    // ----------------------------------------

    var bMaxX = b.mCenter.x + b.mHalfExtents.x
    var bMinX = b.mCenter.x - b.mHalfExtents.x

    //console.log('bMaxX: ' + bMaxX);

    var bMaxY = b.mCenter.y + b.mHalfExtents.y
    var bMinY = b.mCenter.y - b.mHalfExtents.y
    // console.log('aMinY: ' + aMinY);
    // console.log('aMaxY: ' + aMaxY);
    // console.log('bMaxY: ' + bMaxY);
    // console.log('bMinY: ' + bMinY);
    // console.log('\n\n');

    if(aMaxX < bMinX || aMinX > bMaxX) {
      return false;
    }
    if( (aMaxY < bMinY) || (aMinY > bMaxY)) {
      if(aMaxY < bMinY){
        // console.log('aMaxY < bMinY');
      }

      if(aMinY > bMaxY){
        // console.log('aMinY > bMaxY');
      }
      // console.log('dd');
      return false;
    }

    return true;
}

/**
 * @param {Vector2[]} points
 * @param {Matrix23}  m
 */
AABB.buildAABB = function(points, m) {


    var minVec = new Vector2(99999, 99999);
    var maxVec = new Vector2(-99999, -99999);

    for (var ii = 0; ii < points.length; ii++) {
        minVec = m.transformBy(points[ii]).min(minVec);
        maxVec = m.transformBy(points[ii]).max(maxVec);
    }


    var aabbCenter = minVec.copy().add(maxVec).divide(2);
    var aabbHalfExtents = maxVec.copy().subtract(minVec).divide(2);

    var aabb = new AABB();
    aabb.setVector(aabbCenter, aabbHalfExtents);

    return aabb;

};

/**
 * @param {Vector2[]} points
 * @param {Matrix23}  m
 */

AABB.buildAABBCircle = function( rad, pos) {
  var aabbCenter = pos.copy();
  var aabbHalfExtents = new Vector2(rad, rad);

  var aabb = new AABB();
  aabb.setVector( aabbCenter, aabbHalfExtents );

  return aabb;
}

/**
 * @param {Plane} plane
*/

AABB.buildAABBPlanes = function( plane, dt ){
  //console.log(plane.halfPluseExtent);
  var pt0 = plane.halfPluseExtent.copy().rotate(plane.angle).add(plane.pos);
  var pt1 = plane.halfMinusExtent.copy().rotate(plane.angle).add(plane.pos);
  //console.log(pt1);

  var minVec = pt0.copy().min(pt1);
  var maxVec = pt0.copy().max(pt1);

  var centerVec = minVec.copy().add(maxVec).divide(2);
  var mHalfExtents = maxVec.copy().subtract(minVec).divide(2);

  var aabbNow = new AABB();
  aabbNow.setVector( centerVec, mHalfExtents );

  // --------------------------------
  pt0.addMultipledVector(dt, plane.vel);
  pt1.addMultipledVector(dt, plane.vel);

  var minVec2 = pt0.copy().min(pt1);
  var maxVec2 = pt0.copy().max(pt1);

  var centerVec2 = minVec2.copy().add(maxVec2).divide(2);
  var mHalfExtents2 = maxVec2.copy().subtract(minVec2).divide(2);

  var aabbNext = new AABB();
  aabbNext.setVector( centerVec2, mHalfExtents2 );

  //console.log(aabbNow.mCenter);

  return { now: aabbNow, next: aabbNext };
};



module.exports = AABB;
