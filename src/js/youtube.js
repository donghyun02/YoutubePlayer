var playList = [];
var videoCnt = 0;
var nowVideo = 0;
var i = 0;
var player;
var videoId = [];
var cnt = 0;
var isFirst = true;

function onYouTubeIframeAPIReady() {
    player = new YT.Player('p', {
        events: {
            'onReady': onPlayerReady, // 플레이어 로드가 완료되고 API 호출을 받을 준비가 될 때마다 실행
            'onStateChange': onPlayerStateChange // 플레이어의 상태가 변경될 때마다 실행
        }
    });
}

function onPlayerReady(event) {
    event.target.playVideo();

    if (isFirst) {
        isFirst = false;
        changeColor(0);
    }
}

function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.ENDED) {
        nextVideo();
    }
}

function addVideo(video) {

    if (video != '') {
        playList.push('https://www.youtube.com/embed/' + video + '?rel=0&enablejsapi=1');
        videoCnt++;

        if ($('#p').attr('src') == '') {
            document.getElementById('p').src = playList[0];
        }

    }

}

function nextVideo() {
    if (videoCnt) {
        restoreColor(nowVideo);
        nowVideo++;

        if(nowVideo == videoCnt)
            nowVideo = 0;

        document.getElementById('p').src = playList[nowVideo];
        player = new YT.Player('p', {
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange
            }
        });
        changeColor(nowVideo);
    }
}

function prevVideo() {
    if (videoCnt) {
        restoreColor(nowVideo);

        if (!nowVideo) {
            nowVideo = videoCnt - 1;
        } else {
            nowVideo--;
        }

        player = new YT.Player('p', {
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange
            }
        });

        document.getElementById('p').src = playList[nowVideo];
        changeColor(nowVideo);
    }
}

function changeColor(now) {
    $(`#list${now}`).css('color', '#1976d2');
}

function restoreColor(now) {
    $(`#list${now}`).css('color', 'black');
}

$(document).ready(() => {
    $('#button-collapse').sideNav({
            menuWidth: 800, // Default is 240
        }
    );
    $("#search-video").submit((e) => {
        e.preventDefault();
        search();
    });
});
