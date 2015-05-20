function getMobileOperatingSystem() {
    var userAgent = navigator.userAgent || navigator.vendor || window.opera;

    if( userAgent.match( /iPad/i ) || userAgent.match( /iPhone/i ) || userAgent.match( /iPod/i ) )
    {
        return 'iOS';

    }
    else if( userAgent.match( /Android/i ) )
    {

        return 'Android';
    }
    else
    {
        return 'unknown';
    }
}

var mobile = getMobileOperatingSystem()
var isAndroid = false;
if(mobile == "Android") isAndroid = true;

module.exports = {
    "workGap" : 200,
    "workXPos" : 120,
    "workStartPos" : 60,
    "selectedWorkCameraXPos" : 50,
    "MIN_WIDTH" : 850,
    "MIN_HEIGHT": 540,
    "isAndroid" : isAndroid
}

