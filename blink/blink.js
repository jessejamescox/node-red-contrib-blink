
module.exports = function(RED) {
    "use strict";

    function blink(n) {
	RED.nodes.createNode(this,n);
       	var node = this;
       	var blinkRate = n.rate;
       	var nodeTopic = n.topic;
	var context = this.context();

       this.on('input', function(msg) {
          var state = msg.payload;
          var msg1 = {};
          var msg2 = {};
          var startTime = context.get('startTime')||0;
          var now = Date.now();
          var millis = now - startTime; // Elapsed time in ms
          //var blinkRate = context.get('blinkRate')||1000;

          switch(state) {
          case 0:
            msg2.payload = 0;
            break;
          case 1:
            msg2.payload = 1;   
            break;
          case 2:
            if(millis<=(blinkRate/2)) { 
              msg2.payload = 0;
            }
            else    {
              msg2.payload = 1;
              if(millis>blinkRate){
                msg2.payload = 0;
                context.set('startTime',now);
              }
            }
            break;
            default:
            msg2.payload = 0;
          }

          if(msg2.payload===0)  {
            node.status({fill:"green",shape:"ring",text:"Lamp Off"});
          }
          else  {
            node.status({fill:"green",shape:"dot",text:"Lamp On"});
          }
        
          if(msg.topic=='blinkRate'){
            context.set('blinkRate',msg.payload);  // Blink rate
            msg1.payload = msg.payload;
          }
          else  {
            msg1.payload = millis;
          }
          node.send([msg1,msg2]);        
        });
    }
    RED.nodes.registerType("blink",blink);
};
