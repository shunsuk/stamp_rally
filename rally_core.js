/*
 * shunsuk
 * Server-less Stamp Rally System
 * スシが食べたい。
 */

$(function() {
    var serverDomain = "http://shunsuk.net";
    var serverPath = "/rally/rally_server.html";
    var serverUrl = serverDomain + serverPath;

    var keyForUrl = location.href.toLowerCase().replace(/\?.+$/, '').replace(/#.+$/, '').replace(/http(s)?:/, '').replace(/[^a-zA-Z0-9]/g, '');

    var remoteStorage = new CrossDomainStorage(serverDomain, serverPath);

    var main = $('<div>')
        .css({
            'position': 'absolute',
            'z-index': '100',
            'top': '40px',
            'left': '40px',
            'width': '140px',
            'height': '140px',
            'background-color': '#FBF9EA',
            'border': '1px solid #E2E1D5',
            'text-align': 'center',
        });

    var stamp = $('<div>')
        .css({
            'margin-top': '8px',
            'margin-bottom': '8px',
            'margin-left': 'auto',
            'margin-right': 'auto',
            'width': '100px',
            'height': '100px',
            'line-height': '100px',
        })
        .text('click!')
        .click(function(e) {
            remoteStorage.setValue(keyForUrl, location.href, function(key, value){
                console.log('set - ' + key + ': ' + value);
            });

            stamp.text('★')
                .css({
                    'font-size': '100px',
                    'color': 'red',
                    'opacity': 0,
                })
                .animate({
                    'opacity': 1,
                }, 6 * 1000)
                .unbind(e);
        });

    var link = $('<a>')
        .attr({
            'href': serverUrl,
            'target': '_blank',
        })
        .text('スタンプラリー');

    main.append(stamp);
    main.append(link);
    $('body').append(main);

    remoteStorage.requestValue(keyForUrl, function(key, value){
        console.log(key + ': ' + value);

        if (value != null) {
            stamp.click();
        }
    });
});
