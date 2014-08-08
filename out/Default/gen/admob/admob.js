var g_next_async_call_id = 0;
var g_async_calls = {};

function AsyncCall(resolve, reject) {
  this.resolve = resolve;
  this.reject = reject;
}

function createPromise(msg) {
  var promise = new Promise(function(resolve, reject) {
    g_async_calls[g_next_async_call_id] = new AsyncCall(resolve, reject);
  });
  msg.asyncCallId = g_next_async_call_id;
  extension.postMessage(JSON.stringify(msg));
  ++g_next_async_call_id;
  return promise;
}

extension.setMessageListener(function(json) {
  var msg = JSON.parse(json);
  switch (msg.cmd) {
    case 'createBannerView':
        g_async_calls[msg.asyncCallId].resolve(msg.parameter);
        delete _promises[msg.asyncCallId];
      break;
    default:
      break;
  }
});

//function Advertising() {}

//Advertising.prototype.type = 'advertising';

exports.createBannerView = function (requestOptions) {    
    var msg = {
        cmd : "createBannerView",
        parameter: {
            'publisherId' : undefined,
            'adSize' : undefined,
            'bannerAtTop' : false,
            'overlap':false
        }
    }
    var keys = ['publisherId', 'adSize'];
    for (var key in msg.parameter) {
        if (typeof requestOptions[key] !== 'undefined') {
            msg.parameter[key] = requestOptions[key];
        }
    }
    keys.forEach(function(key) {
        if (typeof requestOptions[key] === 'undefined') {
            throw new Error("no enough info to request Ads!");
        } 
        msg.parameter[key] = requestOptions[key];
    });  
    console.log("begin to pass msg!!!");
    //post message to java code  
    return createPromise(msg);
    /*
    return new Promise(function (resolve, reject) {
        try {
            keys.forEach(function(key) {
                if (typeof requestOptions[key] === 'undefined') {
                    throw new Error("no enough info to request Ads!");
                }
                msg.parameter[key] = requestOptions[key];
            });  
            //post message to java code  
            extension.postMessage(msg);             
        }
        catch (e) {
            reject(e);
        }
    }); 
    */
};

//var admob = new Advertising();
//admob = admob;
