//TO-DO: Have list of websites visited and websites that set cookies printed out
//TO-DO: Get rid of rest of print statements
//TO-DO: CLI Options?


let { Cc, Ci } = require('chrome');
var i = 0;
var oldurl = '';
cookie_dictionary = [];

var httpRequestObserver =
{
observe: function(subject, topic, data)
    {
        if (topic == "http-on-modify-request") {
            var httpChannel = subject.QueryInterface(Ci.nsIHttpChannel);
      //      httpChannel.setRequestHeader("X-Hello", "World", false);
      //      console.log("here1");
      //      console.log(data);
      //      console.log(topic);
            i += 1;
            //console.log(i);
        }
        
        else if (topic == "http-on-examine-response") {
            var httpChannel = subject.QueryInterface(Ci.nsIHttpChannel);
            subject.QueryInterface(Ci.nsIHttpChannel);
            //get the cookie
            var cookie=subject.getRequestHeader("Cookie");
            //console.log("****WHOLE COOKIE", cookie);
            //get the url of the current page
            var url = httpChannel.referrer.spec;
            //console.log(url);
            var site = window.location.href;
            //console.log(site);
            var str =cookie + "";
            str = str.split( ';' );
            console.log(str, "str");
            for(i=0; i<str.length; i++){
             //   console.log(i,str.length);
                var one_cookie = str[i] + "";
            //    console.log("CURRENT COOKIE",one_cookie);
             //   one_cookie = one_cookie.split( "=",1);
                var cookie_name = one_cookie.split( '=')[0];
                var cookie_value= one_cookie.substring(one_cookie.indexOf('=')+1);

          //      console.log("***COOKIE NAME", cookie_name);
           //     console.log("***COOKIE VALUE",cookie_value);

                var in_dict = false;
                var j = 0
                while(j<cookie_dictionary.length){
                    if (cookie_dictionary[j][0]== cookie_name){
                        in_dict = true;
                        if(cookie_dictionary[j][1] != cookie_value){
                            console.log("***/nCOOKIE VALUE CHANGED");
                        }
                    break;
                    } else
                        j++;
                        }
                if(in_dict == false){
                    console.log("***NEW COOKIE SET", cookie_name, cookie_value, " BY: ", url);
                    cookie_dictionary.push([cookie_name,cookie_value, url, site]);}
            }
            //console.log("*******DICTIONARY", cookie_dictionary);
            for(i=0;i<cookie_dictionary.length;i++){
                console.log("\nName: ", cookie_dictionary[i][0], "\nValue: ", cookie_dictionary[i][1], "\nSet by: ", cookie_dictionary[i][2], "\nWhile Browsing: ", cookie_dictionary[i][3]);
            }

        }
 
    
    //   old url = url;
         //   var cookieNames = [];
          //  console.log(value);
            // There can be more than one Set-Cookie header, cannot use getResponseHeader
//            subject.visitResponseHeaders(function(header, value)
//                                         {
//                                         if (header.toLowerCase() == "set-cookie")
//                                         {
//                                         var match = /^([^\s=]+)=/.exec(value);
//                                         if (match)
//                                         cookieNames.push(match[1]);
//                                       //  console.log(match);
//                                         }
//                                         });
            
          //  if (cookieNames.length)
          //  {
          //      var url = channel.URI.spec;
             //   console.log(cookieNames,url);
                // Remember that this url set the cookies or just clear the header
         //   if (!isAllowedToSetCookies(url, cookieNames))
         //           channel.setResponseHeader("Set-Cookie", "", false);
           // }
            
       //    httpChannel.setRequestHeader("X-Hello", "World", false);
       //     console.log("here2");
       //     console.log(data);
       //     console.log(topic);
       //     }
        else if (topic == "cookie-changed") {
            var observerService = Components.classes["@mozilla.org/observer-service;1"].getService(Components.interfaces.nsIObserverService)
//            observerService.setRequestHeader("X-Hello", "World", false);
//            console.log("here3");
//            console.log(data);
            var cookie = subject.QueryInterface(Components.interfaces.nsICookie2);
       //     console.log(cookie.name, cookie.host);
         //   console.log(topic);
         //   console.log(data);
        }
        
        else if  (topic == "browser-lastwindow-close-requested") {
            console.log("Last Window Closed");
            console.log(cookie_dictionary);
            console.log("Number of cookies set: ", cookie_dictionary.length);
//            for(i=0;i<cookie_dictionary.length;i++){
//                console.log("\nName: ", cookie_dictionary[i][0], "\nValue: ", cookie_dictionary[i][1], "\nSet by: ", cookie_dictionary[i][2]);
//            }
            };
        
    },
    
    get observerService() {
        return Cc["@mozilla.org/observer-service;1"]
        .getService(Ci.nsIObserverService);
    },
    
register: function()
    {
        this.observerService.addObserver(this, "http-on-examine-response", false);
        this.observerService.addObserver(this, "http-on-modify-request", false);
        this.observerService.addObserver(this, "cookie-changed", false);
        this.observerService.addObserver(this, "browser-lastwindow-close-requested", false);

    },
    
unregister: function()
    {
        this.observerService.removeObserver(this, "http-on-examine-response");
        this.observerService.removeObserver(this, "http-on-modify-request");
        this.observerService.removeObserver(this, "cookie-changed");
        this.observerService.addObserver(this, "browser-lastwindow-close-requested");
    }
};
httpRequestObserver.register("*");
