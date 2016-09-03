var playList = [];
var videoCnt = 0;
var nowVideo = 0;
var i = 0;
var player;

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

    if (videoCnt == 1) {
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
        nowVideo = (nowVideo + 1) % videoCnt;
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
    $(`#${now}`).css('color', '#1976d2');
}

function restoreColor(now) {
    $(`#${now}`).css('color', 'black');
}

$(document).ready(() => {
    $('.modal-trigger').leanModal();
    $("form").submit((e) => {
        addVideo($('#video').val());
        $('#video').val('');
        $('#box').append(`<p class="flow-text" id="${i}">${$('#name').val()}</p>`);
        $('#name').val('');

        $(`#${i++}`).on('click', (e) => {
            console.log(e.target.id);

            //지금 내가 보는 영상이랑 지울 영상이랑 id가 일치할때
            if (Number(e.target.id) == nowVideo) {
                nowVideo++;
            }

            //지운 영상 뒤에 있는 영상들의 id값을 전부 1씩 감소시킴
            for (j = Number(e.target.id) + 1; j < i; j++) {
                $(`#${j}`).attr('id', `${j - 1}`);
                console.log($(`#${j}`).attr('id'));
            }

            //지울 영상을 배열에서 삭제
            playList.splice(Number(e.target.id), 1);
            i--;
            videoCnt--;

            $(e.target).remove();
        });
        e.preventDefault();
    });
});
