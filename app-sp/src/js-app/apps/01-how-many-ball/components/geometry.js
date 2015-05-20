var Vector2 = require('ks-vector').Vector2;
var Contact = require('./contact.js');

var Geometry = {
  type : {
    'vertexAFaceB' : 0,
    'vertexBFaceA' : 1
  },

  /**
  * @param {Vector2} p
  * @param {Vector2} e0
  * @param {Vector2} e1
  */
  projectPointOntoEdge : function(p, e0, e1){
    var v = p.copy().subtract(e0);
    var e = e1.copy().subtract(e0);

    var t = e.dotProduct(v) / e.getSquareLength();

    t = Math.max(Math.min(1, t), 0);

    return e0.copy().addMultipledVector(t, e);
  },

  /**
  * @param {Number} dist
  * @param {Number} centerDist
  * @param {Number} edge
  * @param {Number} supportV
  * @param {Number} fpc
  * @param {Object} mostSeparated
  * @param {Object} mostPenetrating
  * @param {Vector2} e0
  * @param {Vector2} e1
  */
  featurePairJudgement : function( dist, centerDist, edge, supportV, fpc, most, e0, e1 ) {

    var mostSeparated = most.mostSeparated;
    var mostPenetrating = most.mostPenetrating;

    if(dist > 0){
        var p = this.projectPointOntoEdge(new Vector2(), e0, e1);
        dist = p.getLength();
        //console.log(dist);

        if(dist < mostSeparated.dist){
          mostSeparated = { dist: dist, vertex: supportV, face: edge, fp: fpc, centerDist: centerDist}
        }else if(dist == mostSeparated.dist && fpc == mostSeparated.fp){
            if(centerDist < mostSeparated.centerDist){
              mostSeparated = {dist: dist, vertex: supportV, face: edge, fp: fpc, centerDist: centerDist}
            }
        }
    }else{
      //
      if(dist > mostPenetrating.dist){
        mostPenetrating =  { dist: dist, vertex: supportV, face: edge, fp: fpc, centerDist: centerDist}
      }else if(dist == mostPenetrating.dist && fpc == mostPenetrating.fp){
        // got to the pick the right one - pick one closest to center of A
        if(centerDist < mostPenetrating.centerDist){
          mostPenetrating =  { dist: dist, vertex: supportV, face: edge, fp: fpc, centerDist: centerDist}
        }
      }
    }

    return {'mostSeparated' : mostSeparated, 'mostPenetrating' : mostPenetrating};;
  },

  /**
  * @param {Rectangle} rectangleA
  * @param {Rectangle} rectangleB
  */
  rectRectClosestPoints : function( rectangleA, rectangleB ) {
    var contacts = [];

    var mostSeparated = {
      dist   : 99999,
      vertex : -1,
      face   : -1,
      fp     : null,
      centerDist : 99999
    };

    var mostPenetrating = {
      dist   : -99999,
      vertex : -1,
      face   : -1,
      fp     : null,
      centerDist : 99999
    }

    for (var ii = 0; ii < rectangleA.localSpacePoints.length; ii++) {
      ///rectangleA.localSpacePoints[ii]
      var wsN  = rectangleA.getWorldSpaceNormal(ii);
      var wsV0 = rectangleA.getWorldSpacePoint(ii);
      var wsV1 = rectangleA.getWorldSpacePoint((ii + 1) % rectangleA.localSpacePoints.length);
      /*
      if(ii == 0){
        console.log(wsV0);
        console.log(wsV1);
      } */

      //console.log(wsV1)

      // get supporting vertices of B
      var s = rectangleB.getSupportVertices(wsN.copy().multiply(-1));

      // console.log(s[0]);

      for(var jj = 0; jj < s.length; jj++){
        //var m
        var mfp0 = s[jj].mV.copy().subtract(wsV0);
        var mfp1 = s[jj].mV.copy().subtract(wsV1);
        //if(ii == 0)console.log(wsN);

        // distance from the origin of the face
        var dist = mfp0.dotProduct(wsN);
        //if(ii == 2) console.log('dist: ' + dist);

        // distance to the center of A
        var centerDist = s[jj].mV.copy().subtract(rectangleA.pos).getSquareLength();

        //console.log(s[jj].mV.copy().subtract(rectangleA.pos));
        //console.log(dist);
        //console.log(centerDist);
        //console.log(mfp1);

        if(ii == 0) window.distA  = dist;

        var most = this.featurePairJudgement(dist, centerDist, ii, s[jj].mI,this.type.vertexBFaceA, { 'mostSeparated' : mostSeparated, 'mostPenetrating' : mostPenetrating}, mfp0, mfp1);
        //console.log(most.mostSeparated);
        mostSeparated = most.mostSeparated;
        mostPenetrating = most.mostPenetrating;
        //console.log(mostPenetrating);
        //console.log('\n');
      }
    }

    //console.log('\n');
    //console.log(mostSeparated);

    for(var ii = 0; ii < rectangleB.localSpacePoints.length; ii++){

      var wsN  = rectangleB.getWorldSpaceNormal(ii);
      var wsV0 = rectangleB.getWorldSpacePoint(ii);
      var wsV1 = rectangleB.getWorldSpacePoint((ii + 1)%rectangleB.localSpacePoints.length);

      var s = rectangleA.getSupportVertices(wsN.copy().multiply(-1));

      for(var jj = 0; jj < s.length; jj++){
        var mfp0 = s[jj].mV.copy().subtract(wsV0);
        var mfp1 = s[jj].mV.copy().subtract(wsV1);

        // distance from the origin of the face
        var dist = mfp0.dotProduct(wsN);

        // distance to the center of A
        var centerDist = s[jj].mV.copy().subtract(rectangleB.pos).getSquareLength();
        //window.distB = dist;
        //console.log(this.type.vertexBFaceA);

        var most = this.featurePairJudgement(dist, centerDist, ii, s[jj].mI,this.type.vertexAFaceB, { 'mostSeparated' : mostSeparated, 'mostPenetrating' : mostPenetrating}, mfp0, mfp1);
        mostSeparated = most.mostSeparated;
        mostPenetrating = most.mostPenetrating;
      }
    }


    var featureToUse;
    var vertexRect, faceRect;
    if(mostSeparated.dist > 0 && mostSeparated.fp != null){
      featureToUse = mostSeparated;
    }else if(mostPenetrating.dist <= 0){
      featureToUse = mostPenetrating;
    }else{
      console.error('RectRectClosestPoints(): Impossible condition!');
    }

    if(featureToUse.fp == this.type.vertexAFaceB){
      vertexRect = rectangleA;
      faceRect   = rectangleB;
    }else{
      //console.log('type.vertexBFaceA');
      vertexRect = rectangleB;
      faceRect   = rectangleA;
    }

    // console.log('vertexRect');
    // console.log(vertexRect);
    // console.log('\n');
    // console.log('faceRect');
    // console.log(faceRect);
    // console.log('\n');

    var worldN = faceRect.getWorldSpaceNormal(featureToUse.face);

    // console.log('worldN');
    // console.log(worldN);
    // console.log('\n');


    // other vertex adjcent which makes most parallel normal with the collision normal
    var worldV = vertexRect.getSecondSupport( featureToUse.vertex, worldN);
    //console.log(worldV);

    // world space edge
    var worldEdge0 = faceRect.getWorldSpacePoint( featureToUse.face );
    window.faceRect = faceRect
    //console.log(faceRect);
    var worldEdge1 = faceRect.getWorldSpacePoint( (featureToUse.face+1)%faceRect.localSpacePoints.length );

    window.worldEdge0 = worldEdge0;
    window.worldEdge1 = worldEdge1;


    // console.log('\n');
    // console.log( (featureToUse.face+1)%faceRect.localSpacePoints.length);
    // console.log(worldEdge0);
    // console.log(worldEdge1);
    // console.log('\n');

    // console.log('worldEdge0: ');
    // console.log(worldEdge0);
    // console.log('\n');
    // console.log('worldEdge1: ');
    // console.log(worldEdge1);
    // console.log('\n');

    var pointsOnRectangleA = [];
    var pointsOnRectangleB = [];

    //console.log(worldN);
    if(featureToUse.fp == this.type.vertexAFaceB){
      pointsOnRectangleA[0] = this.projectPointOntoEdge( worldEdge0, worldV[0], worldV[1]);
      pointsOnRectangleA[1] = this.projectPointOntoEdge( worldEdge1, worldV[0], worldV[1]);

      pointsOnRectangleB[0] = this.projectPointOntoEdge( worldV[1], worldEdge0, worldEdge1);
      pointsOnRectangleB[1] = this.projectPointOntoEdge( worldV[0], worldEdge0, worldEdge1);

      worldN.multiply(-1);
    }else{
      pointsOnRectangleB[0] = this.projectPointOntoEdge( worldEdge0, worldV[0], worldV[1]);
      pointsOnRectangleB[1] = this.projectPointOntoEdge( worldEdge1, worldV[0], worldV[1]);

      pointsOnRectangleA[0] = this.projectPointOntoEdge( worldV[1], worldEdge0, worldEdge1);
      pointsOnRectangleA[1] = this.projectPointOntoEdge( worldV[0], worldEdge0, worldEdge1);
    }


    window.pointA = pointsOnRectangleA;
    window.pointB = pointsOnRectangleB

    /**
    console.log(worldV);
    console.log(worldEdge0);
    console.log(worldEdge1);
    console.log('\n');
    console.log(pointsOnRectangleA[0]);
    console.log(pointsOnRectangleB[0]);
    console.log('\n');
    console.log(pointsOnRectangleA[0]);
    console.log(pointsOnRectangleB[0]);
    console.log('\n\n');
    */

    var d0 = pointsOnRectangleB[0].copy().subtract(pointsOnRectangleA[0]).dotProduct(worldN);
    var d1 = pointsOnRectangleB[1].copy().subtract(pointsOnRectangleA[1]).dotProduct(worldN);

    //console.log(d0);
    //console.log(d1);
    //console.log(d0);

    var contacts = [];
    contacts.push(new Contact(rectangleA, rectangleB, pointsOnRectangleA[0], pointsOnRectangleB[0], worldN, d0 ));
    contacts.push(new Contact(rectangleA, rectangleB, pointsOnRectangleA[1], pointsOnRectangleB[1], worldN, d1 ));

    //window.contacts = contacts;
    //console.log(contacts[0].Dist);
    //console.log('\n');



    return contacts;

  }

};

module.exports = Geometry;
