let PrologueClient = {

    init: function (params) {
        $prologueClientAppData = false;
        $prologueClientUserData = {
            'id': 0,
            'isAuth': 0,
            'authToken': ''
        };
        $prologueClientConfig = params;
        return this;
    },

    queryToServer: function (path, data, callback) {

        data = handleData(data);

        send(path, data, callback);

        function send(path, data, callback) {

            let apiUrl = PrologueClient.getApiUrl(path);

            fetch(apiUrl, {
                method: 'POST',
                body: JSON.stringify(data)
            }).then(function (response) {

                response.json().then(function (data) {

                    callback(
                        PrologueClient.handleResponse(
                            data
                        )
                    );

                });

            }).catch(function () {
                netWorkError();
                setTimeout(function () {
                    send(path, data, callback);
                }, 7000);
            });


        }

        function handleData(data) {

            data.authorization = {
                'session' : PrologueClient.loader.getSessionData(),
                'userToken': PrologueClient.passport.getUserToken()
            };

            data.device = PrologueClient.device.getClientEnvironment();

            return data;

        }

        function netWorkError() {
            document.body.innerHTML += '<div id="PrologueClientNetWorkError" style="text-align: center; font-size: 16px; padding: 10px; background: #555; z-index: 9999999; bottom: 0; left: 0; right: 0; color: #fff; position: fixed; width: 100%;">Network connection error!<br>Reconnect...</div>';
            setTimeout(function () {
                document.getElementById('PrologueClientNetWorkError').remove();
            }, 7000);
        }

    },

    getApiUrl: function (path) {

        path = path.replace(':', '/?action=');

        let server = this.getServer() + '!';

        server = server.replace('/!', '');
        server = server.replace('!', '');

        return server + '/' + path;
    },

    getServer: function () {

        let config = PrologueClient.getConfig();

        if (config.mode === 'demo') {
            return config.server.demo;
        }
        else if (config.mode === 'work') {
            return config.server.work;
        }

    },

    getConfig: function () {

        if ($prologueClientConfig === undefined) {
            alert('PrologueClientConfig undefined!');
            return false;
        }

        return {
            'server': {
                'demo': $prologueClientConfig.servers.demo,
                'work': $prologueClientConfig.servers.work
            },
            'mode': $prologueClientConfig.mode,
            'appRoutes': $prologueClientConfig.appRoutes
        }
    },

    handleResponse: function (serverData) {

        serverData = handleMessage(serverData);

        return serverData;

        function handleMessage(serverData) {

            if (serverData.message === false || !serverData.message) {
                return serverData;
            }

            if (serverData.message.btn === undefined || serverData.message.btn.text === undefined || !serverData.message.btn.text) {
                serverData.message.btn = {
                    'text': 'Ok'
                };
            }

            PrologueClient.messages.displayMessage({
                type: serverData.message.type,
                message: serverData.message.text,
                styles: {
                    notifyClass: '',
                    isAnimate: 1,
                    showArrow: 1
                },
                lang: {
                    buttonText: serverData.message.btn.text,
                }
            });

            return serverData;

        }

    },

    md5: function (string) {

        function RotateLeft(lValue, iShiftBits) {
            return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
        }

        function AddUnsigned(lX, lY) {
            var lX4, lY4, lX8, lY8, lResult;
            lX8 = (lX & 0x80000000);
            lY8 = (lY & 0x80000000);
            lX4 = (lX & 0x40000000);
            lY4 = (lY & 0x40000000);
            lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
            if (lX4 & lY4) {
                return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
            }
            if (lX4 | lY4) {
                if (lResult & 0x40000000) {
                    return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
                } else {
                    return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
                }
            } else {
                return (lResult ^ lX8 ^ lY8);
            }
        }

        function F(x, y, z) {
            return (x & y) | ((~x) & z);
        }

        function G(x, y, z) {
            return (x & z) | (y & (~z));
        }

        function H(x, y, z) {
            return (x ^ y ^ z);
        }

        function I(x, y, z) {
            return (y ^ (x | (~z)));
        }

        function FF(a, b, c, d, x, s, ac) {
            a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
            return AddUnsigned(RotateLeft(a, s), b);
        };

        function GG(a, b, c, d, x, s, ac) {
            a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
            return AddUnsigned(RotateLeft(a, s), b);
        };

        function HH(a, b, c, d, x, s, ac) {
            a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
            return AddUnsigned(RotateLeft(a, s), b);
        };

        function II(a, b, c, d, x, s, ac) {
            a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
            return AddUnsigned(RotateLeft(a, s), b);
        };

        function ConvertToWordArray(string) {
            var lWordCount;
            var lMessageLength = string.length;
            var lNumberOfWords_temp1 = lMessageLength + 8;
            var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
            var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
            var lWordArray = Array(lNumberOfWords - 1);
            var lBytePosition = 0;
            var lByteCount = 0;
            while (lByteCount < lMessageLength) {
                lWordCount = (lByteCount - (lByteCount % 4)) / 4;
                lBytePosition = (lByteCount % 4) * 8;
                lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition));
                lByteCount++;
            }
            lWordCount = (lByteCount - (lByteCount % 4)) / 4;
            lBytePosition = (lByteCount % 4) * 8;
            lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
            lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
            lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
            return lWordArray;
        };

        function WordToHex(lValue) {
            var WordToHexValue = "", WordToHexValue_temp = "", lByte, lCount;
            for (lCount = 0; lCount <= 3; lCount++) {
                lByte = (lValue >>> (lCount * 8)) & 255;
                WordToHexValue_temp = "0" + lByte.toString(16);
                WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);
            }
            return WordToHexValue;
        };

        function Utf8Encode(string) {
            string = string.replace(/\r\n/g, "\n");
            var utftext = "";

            for (var n = 0; n < string.length; n++) {

                var c = string.charCodeAt(n);

                if (c < 128) {
                    utftext += String.fromCharCode(c);
                }
                else if ((c > 127) && (c < 2048)) {
                    utftext += String.fromCharCode((c >> 6) | 192);
                    utftext += String.fromCharCode((c & 63) | 128);
                }
                else {
                    utftext += String.fromCharCode((c >> 12) | 224);
                    utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                    utftext += String.fromCharCode((c & 63) | 128);
                }

            }

            return utftext;
        };

        var x = Array();
        var k, AA, BB, CC, DD, a, b, c, d;
        var S11 = 7, S12 = 12, S13 = 17, S14 = 22;
        var S21 = 5, S22 = 9, S23 = 14, S24 = 20;
        var S31 = 4, S32 = 11, S33 = 16, S34 = 23;
        var S41 = 6, S42 = 10, S43 = 15, S44 = 21;

        string = Utf8Encode(string);

        x = ConvertToWordArray(string);

        a = 0x67452301;
        b = 0xEFCDAB89;
        c = 0x98BADCFE;
        d = 0x10325476;

        for (k = 0; k < x.length; k += 16) {
            AA = a;
            BB = b;
            CC = c;
            DD = d;
            a = FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
            d = FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
            c = FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
            b = FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
            a = FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
            d = FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
            c = FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
            b = FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
            a = FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
            d = FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
            c = FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
            b = FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
            a = FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
            d = FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
            c = FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
            b = FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
            a = GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
            d = GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
            c = GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
            b = GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
            a = GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
            d = GG(d, a, b, c, x[k + 10], S22, 0x2441453);
            c = GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
            b = GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
            a = GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
            d = GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
            c = GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
            b = GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
            a = GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
            d = GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
            c = GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
            b = GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
            a = HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
            d = HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
            c = HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
            b = HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
            a = HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
            d = HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
            c = HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
            b = HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
            a = HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
            d = HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
            c = HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
            b = HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
            a = HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
            d = HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
            c = HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
            b = HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
            a = II(a, b, c, d, x[k + 0], S41, 0xF4292244);
            d = II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
            c = II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
            b = II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
            a = II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
            d = II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
            c = II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
            b = II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
            a = II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
            d = II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
            c = II(c, d, a, b, x[k + 6], S43, 0xA3014314);
            b = II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
            a = II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
            d = II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
            c = II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
            b = II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
            a = AddUnsigned(a, AA);
            b = AddUnsigned(b, BB);
            c = AddUnsigned(c, CC);
            d = AddUnsigned(d, DD);
        }

        var temp = WordToHex(a) + WordToHex(b) + WordToHex(c) + WordToHex(d);

        return temp.toLowerCase();
    },

    messages: {

        displayMessage: function (params) {

            this.closeMessage();

            if (!params.type) {
                params.type = 'info';
                console.log('params.type undefined!');
            }

            if (!params.message) {
                params.message = 'Message undefined!';
                console.log('params.message undefined!');
            }

            let notifyClass = (params.styles && params.styles.notifyClass) ? params.styles.notifyClass : 'RestConnectorNotify';
            let isAnimate = (params.styles && params.styles.isAnimate) ? params.styles.isAnimate : '';
            let showArrow = (params.styles && params.styles.showArrow) ? params.styles.showArrow : '';

            let bgColor = '#fff';
            if (params.type == 'error') {
                bgColor = '#C52438';
            }
            else if (params.type == 'success') {
                bgColor = '#75B069';
            }

            let textColor = (params.type == 'info') ? '#000' : '#fff';
            let btnColor = (params.type == 'info') ? '#DA641C' : '#fff';

            let html = '<div class="' + notifyClass + '" style="background: ' + bgColor + ';-webkit-box-orient: horizontal;-webkit-box-direction: normal;-ms-flex-direction: row;flex-direction: row;-webkit-box-align: center;-ms-flex-align: center;align-items: center;-webkit-box-sizing: border-box;box-sizing: border-box;padding: 20px 16px;position: relative;-webkit-box-shadow: 0px 0px 30px rgba(209, 217, 230, 0.4), 25px 24px 54px rgba(209, 217, 230, 0.4);box-shadow: 0px 0px 30px rgba(209, 217, 230, 0.4), 25px 24px 54px rgba(209, 217, 230, 0.4);min-width: 200px;border-radius: 16px">' +
                '<div class="' + notifyClass + '__message" style="font-family: Helvetica,Arial,sans-serif;white-space: nowrap;color: ' + textColor + ';font-size: .875rem;text-align: center;">' + params.message + '</div>' +
                '<button class="' + notifyClass + '__btn" type="button" style="font-family: Helvetica,Arial,sans-serif;margin: 0 auto;display: block;-webkit-transition: all .25s ease-in-out;transition: all .25s ease-in-out;-webkit-backface-visibility: hidden;backface-visibility: hidden;margin-top: 10px;background: transparent;border: none; color: ' + btnColor + '; cursor: pointer;" onclick="PrologueClient.messages.closeMessage()">' + params.lang.buttonText + '</button>';

            if (showArrow) {
                html += '<div class="' + notifyClass + '__arrow" style="position: absolute;bottom: -7px;left: 50%;-webkit-transform: translateX(-50%) rotate(180deg);transform: translateX(-50%) rotate(180deg);width: 24px;height: 8px;background: ' + bgColor + ';-webkit-clip-path: polygon(50% 0,0 100%,100% 100%);clip-path: polygon(50% 0,0 100%,100% 100%);"></div>';
            }

            html += '</div>';

            let message = document.createElement('div');
            message.className = notifyClass + '__wr restConnectorMessage';
            message.style.cssText = 'position: absolute;left: 50%;-webkit-transform: translateX(-50%);transform: translateX(-50%);bottom: 15px;z-index: 100;';

            if (isAnimate) {
                message.style.cssText += '-webkit-transition: all .25s ease-in-out;transition: all .25s ease-in-out;';
            }

            message.innerHTML = html;
            document.body.append(message);

            message.style.opacity = '0';
            setTimeout(() => {
                message.style.opacity = '1';
            }, 100);
        },

        closeMessage: function () {
            let message = document.getElementsByClassName('restConnectorMessage')[0];

            if (!message) {
                return false;
            }

            message.style.opacity = '0';
            setTimeout(() => {
                message.parentNode.removeChild(message);
            }, 250);
        },

    },

    device: {

        getClientEnvironment: function () {

            function getBrowser() {
                let nAgt = navigator.userAgent,
                    browserName = navigator.appName,
                    fullVersion = '' + parseFloat(navigator.appVersion),
                    nameOffset, verOffset, ix;

                if ((verOffset = nAgt.indexOf("OPR")) != -1) {
                    browserName = "Opera";
                    fullVersion = nAgt.substring(verOffset + 4);
                }

                else if ((verOffset = nAgt.indexOf("YaBrowser")) != -1) {
                    browserName = "Yandex";
                    fullVersion = nAgt.substring(verOffset + 10, verOffset + 21);
                }

                else if ((verOffset = nAgt.indexOf("MSIE")) != -1) {
                    browserName = "Microsoft Internet Explorer";
                    fullVersion = nAgt.substring(verOffset + 5);
                }

                else if ((verOffset = nAgt.indexOf("Chrome")) != -1) {
                    browserName = "Chrome";
                    fullVersion = nAgt.substring(verOffset + 7);
                }

                else if ((verOffset = nAgt.indexOf("Safari")) != -1) {
                    browserName = "Safari";
                    fullVersion = nAgt.substring(verOffset + 7);
                    if ((verOffset = nAgt.indexOf("Version")) != -1)
                        fullVersion = nAgt.substring(verOffset + 8);
                }

                else if ((verOffset = nAgt.indexOf("Firefox")) != -1) {
                    browserName = "Firefox";
                    fullVersion = nAgt.substring(verOffset + 8);
                }

                // In most other browsers, "name/version" is at the end of userAgent

                else if ((nameOffset = nAgt.lastIndexOf(' ') + 1) <
                    (verOffset = nAgt.lastIndexOf('/'))) {
                    browserName = nAgt.substring(nameOffset, verOffset);
                    fullVersion = nAgt.substring(verOffset + 1);
                    if (browserName.toLowerCase() == browserName.toUpperCase()) {
                        browserName = navigator.appName;
                    }
                }

                // trim the fullVersion string at semicolon/space if present

                if ((ix = fullVersion.indexOf(";")) != -1)
                    fullVersion = fullVersion.substring(0, ix);
                if ((ix = fullVersion.indexOf(" ")) != -1)
                    fullVersion = fullVersion.substring(0, ix);

                return {
                    name: browserName,
                    version: fullVersion
                };
            }

            function getOS() {
                let nAgt = navigator.userAgent || navigator.vendor || window.opera,
                    os = '-',
                    osVersion = '-',
                    clientStrings = [{
                        s: 'Windows 10',
                        r: /(Windows 10.0|Windows NT 10.0)/
                    }, {
                        s: 'Windows 8.1',
                        r: /(Windows 8.1|Windows NT 6.3)/
                    }, {
                        s: 'Windows 8',
                        r: /(Windows 8|Windows NT 6.2)/
                    }, {
                        s: 'Windows 7',
                        r: /(Windows 7|Windows NT 6.1)/
                    }, {
                        s: 'Windows Vista',
                        r: /Windows NT 6.0/
                    }, {
                        s: 'Windows Server 2003',
                        r: /Windows NT 5.2/
                    }, {
                        s: 'Windows XP',
                        r: /(Windows NT 5.1|Windows XP)/
                    }, {
                        s: 'Windows 2000',
                        r: /(Windows NT 5.0|Windows 2000)/
                    }, {
                        s: 'Windows ME',
                        r: /(Win 9x 4.90|Windows ME)/
                    }, {
                        s: 'Windows 98',
                        r: /(Windows 98|Win98)/
                    }, {
                        s: 'Windows 95',
                        r: /(Windows 95|Win95|Windows_95)/
                    }, {
                        s: 'Windows NT 4.0',
                        r: /(Windows NT 4.0|WinNT4.0|WinNT|Windows NT)/
                    }, {
                        s: 'Windows CE',
                        r: /Windows CE/
                    }, {
                        s: 'Windows 3.11',
                        r: /Win16/
                    }, {
                        s: 'Android',
                        r: /Android/
                    }, {
                        s: 'Open BSD',
                        r: /OpenBSD/
                    }, {
                        s: 'Sun OS',
                        r: /SunOS/
                    }, {
                        s: 'Linux',
                        r: /(Linux|X11)/
                    }, {
                        s: 'iOS',
                        r: /(iPhone|iPad|iPod)/
                    }, {
                        s: 'Mac OS X',
                        r: /Mac OS X/
                    }, {
                        s: 'Mac OS',
                        r: /(MacPPC|MacIntel|Mac_PowerPC|Macintosh)/
                    }, {
                        s: 'QNX',
                        r: /QNX/
                    }, {
                        s: 'UNIX',
                        r: /UNIX/
                    }, {
                        s: 'BeOS',
                        r: /BeOS/
                    }, {
                        s: 'OS/2',
                        r: /OS\/2/
                    }, {
                        s: 'Search Bot',
                        r: /(nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask Jeeves\/Teoma|ia_archiver)/
                    }];

                for (let id in clientStrings) {
                    let cs = clientStrings[id];
                    if (cs.r.test(nAgt)) {
                        os = cs.s;
                        break;
                    }
                }

                if (/Windows/.test(os)) {
                    osVersion = /Windows (.*)/.exec(os)[1];
                    os = 'Windows';
                }

                switch (os) {
                    case 'Mac OS X':
                        osVersion = /Mac OS X (10[\.\_\d]+)/.exec(nAgt)[1];
                        break;

                    case 'Android':
                        osVersion = /Android ([\.\_\d]+)/.exec(nAgt)[1];
                        break;

                    case 'iOS':
                        osVersion = /OS (\d+)_(\d+)_?(\d+)?/.exec(nAgt);
                        osVersion = osVersion[1] + '.' + osVersion[2] + '.' + (osVersion[3] | 0);
                        break;
                }

                return {
                    name: os,
                    version: osVersion
                }
            }

            function getPlatform() {
                if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                    return 'mobile';
                } else {
                    return 'desktop';
                }
            }

            function getLanguage() {
                return window.navigator.language;
            }

            function getTimeZone() {
                let offset = new Date().getTimezoneOffset(),
                    o = Math.abs(offset);

                return (offset < 0 ? "+" : "-") + ("00" + Math.floor(o / 60)).slice(-2) + ":" + ("00" + (o % 60)).slice(-2);
            }

            function getTime() {
                let date = new Date(),
                    hours = (date.getHours() < 10) ? '0' + date.getHours() : date.getHours(),
                    minutes = (date.getMinutes() < 10) ? '0' + date.getMinutes() : date.getMinutes(),
                    seconds = (date.getSeconds() < 10) ? '0' + date.getSeconds() : date.getSeconds();

                return hours + ':' + minutes + ':' + seconds;
            }

            function getDomain() {
                return window.location.host;
            }

            function getUrl() {
                return window.location.pathname + window.location.search;
            }

            function getId() {
                return getPlatform() + getBrowser().name + getBrowser().version + getOS().name + getOS().version + getLanguage() + getTimeZone();
            }

            function getDeviceName() {

                let type = 'Desktop';

                if (getPlatform() === 'mobile') {
                    type = 'Mobile';
                }

                return type + ' ' + getOS().name + ' ' + getBrowser().name;

            }

            return {
                'device': {
                    'id': PrologueClient.md5(getId()),
                    'name': getDeviceName(),
                    'type': getPlatform(),
                },
                'browser': {
                    'name': getBrowser().name,
                    'version': getBrowser().version
                },
                'os': {
                    'name': getOS().name,
                    'version': getOS().version
                },
                'locale': {
                    'browserLanguage': getLanguage(),
                    'appLanguage': 'ru',
                    'timeZone': getTimeZone(),
                    'time': getTime()
                },
                'http': {
                    'domain': getDomain(),
                    'url': getUrl()
                }

            };

        }

    },

    passport: {

        getUserToken: function () {
            return '';
        },

        login: function () {

        },

        getUserData: function () {
            return $prologueClientUserData;
        },

        setUserData: function (params) {
            $prologueClientUserData = params;
            $prologueClientAppData.userData = params;
        }

    },

    middleware: {

        isUserAuth: function () {

            setInterval(() => {
                implement();
            }, 100);

            function implement() {

                if (PrologueClient.loader.getApp()) {

                    let userData = PrologueClient.passport.getUserData();

                    let isAut = userData.isAuth;

                    if (isAut === 0) {

                        window.location.href = PrologueClient.getConfig().appRoutes.authorizationPage;

                    }

                }
            }

        },

        isUserNoAuth: function () {

            setInterval(() => {
                implement();
            }, 100);

            function implement() {

                if (PrologueClient.loader.getApp()) {

                    let userData = PrologueClient.passport.getUserData();

                    let isAut = userData.isAuth;

                    if (isAut === 1) {

                        window.location.href = PrologueClient.getConfig().appRoutes.userPersonalPage;

                    }

                }
            }

        }

    },

    loader: {

        loadApp: function (params) {

            if (!params.route) {
                params.route = 'MainModule:loadApp';
            }

            if (!params.timeOut) {
                params.timeOut = 1000;
            }

            generateSessionCode();

            setTimeout(() => {

                PrologueClient.queryToServer(params.route, {'requestType': 'loadApp'}, (serverData) => {

                    if (serverData.app) {
                        $prologueClientAppData = serverData.app;

                        PrologueClient.passport.setUserData(
                            serverData.app.userData
                        );
                    }

                });

            }, params.timeOut);

            function generateSessionCode() {

                if (PrologueClient.loader.getSessionData()) {
                    return false;
                }

                localStorage.setItem('__session', getCode());

                function getCode() {
                    return PrologueClient.md5(
                        Math.random().toString(36).substring(7) + '_' + Math.random()
                    );
                }
            }


        },

        getSessionData: function () {

            let data = localStorage.__session;

            if (!data) {
                return false;
            }

            return data;
        },

        ping: function (params) {

            if (!params.route) {
                params.route = 'MainModule:ping';
            }

            if (!params.timeInterval) {
                params.timeInterval = 30000;
            }

            setInterval(() => {

                PrologueClient.queryToServer(params.route, {'requestType': 'ping'}, (serverData) => {

                    PrologueClient.passport.setUserData(
                        serverData.state.userData
                    );

                });

            }, params.timeInterval);

        },

        loadPage: function (params, callback) {

            params.params.requestType = 'loadPage';

            PrologueClient.queryToServer(params.route, params.params, (serverData) => {

                setMetaData(serverData);

                callback(serverData);

            });

            function setMetaData(serverData) {
                document.title = serverData.metaData.title;
                document.querySelector('meta[name="description"]').setAttribute("content", serverData.metaData.description);
                document.getElementsByTagName('h1')[0].innerHTML = serverData.metaData.h1;
            }


        },

        getApp: function () {
            return $prologueClientAppData;
        }


    }

};

