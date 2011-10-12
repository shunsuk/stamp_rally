/*
 * Copyright 2010 Nicholas C. Zakas. All rights reserved. BSD Licensed.
 */

/*
 * shunsuk
 * Server-less Stamp Rally System
 * スシが食べたい。
 * http://d.hatena.ne.jp/shunsuk/20111012/1318420264
 */

var RallyServer = function(option) {

    var whitelist = [];

    if (option && option.whitelist) {
        whitelist = option.whitelist;
    }

    if (option && option.pages) {
        this.pages = option.pages;
        var keys = {};
        $.each(this.pages, function(key, value) {
            keys[key] = value.toLowerCase().replace(/\?.+$/, '').replace(/#.+$/, '').replace(/http(s)?:/, '').replace(/[^a-zA-Z0-9]/g, '');
        });
        this.keys = keys;
    } else {
        this.pages = {};
    }

    var verifyOrigin = function(origin) {
        var domain = origin.replace(/^https?:\/\/|:\d{1,4}$/g, "").toLowerCase(),
        i = 0,
        len = whitelist.length;

        while(i < len){
            if (whitelist[i] == domain){
                return true;
            }
            i++;
        }

        return false;
    };

    var handleRequest = function(event) {
        if (verifyOrigin(event.origin)){
            var data = JSON.parse(event.data);
            var value = data.value;

            if (value === undefined) {
                value = localStorage.getItem(data.key);
            } else {
                localStorage.setItem(data.key, value);
            }

            event.source.postMessage(JSON.stringify({id: data.id, key:data.key, value: value}), event.origin);
        }
    };

    var handle_storage = function(e) {
        if (!e) { e = window.event; }
    };

    if(window.addEventListener){
        window.addEventListener("message", handleRequest, false);
        window.addEventListener("storage", handle_storage, false);
    } else if (window.attachEvent){
        window.attachEvent("onmessage", handleRequest);
        window.attachEvent("onstorage", handle_storage);
    }
};

RallyServer.prototype = {
    urlForPage: function(key) {
        return this.pages[key];
    },

    visited: function(key) {
        return (localStorage.getItem(this.keys[key]) != null);
    },

    completed: function() {
        result = true;

        $.each(this.keys, function(key, value) {
            if (localStorage.getItem(value) == null) {
                result = false;
            }
        });

        return result;
    },

    clearAll: function() {
        localStorage.clear();
    },
};
