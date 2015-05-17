module.exports = {
  /**
  *
  * @param {Contact[]} contacts
  */
  flipContacts : function(contacts) {
      for (var ii = 0; ii < contacts.length; ii++) {

        var tempB = contacts[ii].B
        contacts[ii].B = contacts[ii].A;
        contacts[ii].A = tempB;

        var tempPb = contacts[ii].Pb;
        contacts[ii].Pb = contacts[ii].Pa;
        contacts[ii].Pa = tempPb;

        var tempV = contacts[ii].rb;
        contacts[ii].rb = contacts[ii].ra;
        contacts[ii].ra = tempV;

        contacts[ii].normal.x *= -1;
        contacts[ii].normal.y *= -1;
      }
  }
};
