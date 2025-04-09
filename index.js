function do_test(config, status, log) {
    navigator.mediaCapabilities.decodingInfo(config).then((result) => {
        if (result.supported) {
            status.innerHTML = `SUPPORTED (${result.smooth ? "smooth" : "not smooth"}, ${result.powerEfficient ? "power efficient" : "not power efficient"})`;
            status.style.backgroundColor = "green"
        } else {
            status.innerHTML = "NOT SUPPORTED";
            status.style.backgroundColor = "red"
        }
    }).catch((error) => {
        status.innerHTML = "ERROR"
        log.innerHTML = error
        status.style.backgroundColor = "red"
    })
}

function check_4k(tr) {
    console.log("Checking 4K support");
    config = {
        type: "media-source",
        video: {
            contentType: "video/mp4; codecs=hev1.1.6.L93.B0",
            width: 3840,
            height: 2160,
            bitrate: 10000,
            framerate: 25.
        },
        keySystemConfiguration: {
            keySystem: "com.widevine.alpha",
            video: {
                robustness: "HW_SECURE_DECODE"
            }
        }
    };
    do_test(config, tr.childNodes[1], tr.childNodes[2]);
}

function check_hdcp(tr) {
    st = tr.childNodes[1];
    log =  tr.childNodes[2];
    minHdcpVersion = "2.1"
    console.log("Checking HDCP support");
    config = [{
        videoCapabilities: [{
            contentType: "video/mp4; codecs=hev1.1.6.L93.B0",
            robustness: 'HW_SECURE_DECODE'
        }]
    }];
    navigator.requestMediaKeySystemAccess('com.widevine.alpha', config)
        .then(mediaKeySystemAccess => mediaKeySystemAccess.createMediaKeys())
        .then(mediaKeys => {
            if (!('getStatusForPolicy' in mediaKeys)) {
                return Promise.reject('HDCP Policy Check API not available');
            }
            return mediaKeys.getStatusForPolicy({ minHdcpVersion });
        }).then(status => {
            if (status !== 'usable') {
                return Promise.reject(status);
            }

            st.innerHTML = `SUPPORTED`
            st.style.backgroundColor = "green"
        }).catch(error => {
            st.innerHTML = `NOT SUPPORTED`
            st.style.backgroundColor = "red"
            log.innerHTML = error
        })
}

function check_hdr(tr) {
    console.log("Checking HDR10 support");
    config = {
        type: "media-source",
        video: {
            contentType: "video/mp4; codecs=hev1.2.4.L153.B0",
            width: 3840,
            height: 2160,
            bitrate: 10000,
            framerate: '25',
            transferFunction: 'pq',
            colorGamut: 'rec2020',
            hdrMetadataType: 'smpteSt2086',
        },
        keySystemConfiguration: {
            keySystem: "com.widevine.alpha",
            video: {
                robustness: "HW_SECURE_DECODE"
            }
        }
    };
    do_test(config, tr.childNodes[1], tr.childNodes[2]);
}

function check_dolbyvision(tr) {
    console.log("Checking Dolby Vision support");
    config = {
        type: "media-source",
        video: {
            contentType: "video/mp4; codecs=dvhe.05.07",
            width: 3840,
            height: 2160,
            bitrate: 10000,
            framerate: 25,
            transferFunction: 'pq',
            colorGamut: 'rec2020',
            hdrMetadataType: 'smpteSt2094-10',
        },
        keySystemConfiguration: {
            keySystem: "com.widevine.alpha",
            video: {
                robustness: "HW_SECURE_DECODE"
            }
        }
    };
    do_test(config, tr.childNodes[1], tr.childNodes[2]);
}

function check_dolbydigital(tr) {
    console.log("Checking Dolby Digital+ support");
    config = {
        type: "media-source",
        audio: {
            contentType: "audio/mp4; codecs=ec-3",
        },
    };
    do_test(config, tr.childNodes[1], tr.childNodes[2]);
}

function check_dolbyatmos(tr) {
    console.log("Checking Dolby Atmos support");
    config = {
        type: "media-source",
        audio: {
            contentType: "audio/mp4; codecs=ec-3",
            spatialRendering: true
        },
    };
    do_test(config, tr.childNodes[1], tr.childNodes[2]);
}

window.onload = function () {
    check_4k(document.getElementById("test_4k"))
    check_hdcp(document.getElementById("test_hdcp"))
    check_hdr(document.getElementById("test_hdr"))
    check_dolbyvision(document.getElementById("test_dolbyvision"))
    check_dolbydigital(document.getElementById("test_dolbydigital"))
    check_dolbyatmos(document.getElementById("test_dolbyatmos"))
}