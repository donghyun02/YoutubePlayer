function search() {
    var q = $('#query').val();
    var videoId = [];

    cnt = 0;
    videoId = [];
    $('.video-list').remove();
    $('.modal').remove();

    $('#slide-out').append(`
      <li id="preloader" class="center">
          <div class="preloader-wrapper big active">
            <div class="spinner-layer spinner-blue-only">
              <div class="circle-clipper left">
                <div class="circle"></div>
              </div><div class="gap-patch">
                <div class="circle"></div>
              </div><div class="circle-clipper right">
                <div class="circle"></div>
              </div>
            </div>
          </div>
      </li>
      `)

    $.ajax({
        url: `https://www.googleapis.com/youtube/v3/search?q=${q}&key=AIzaSyBG2XG-ACdIgQRBBf2wH4yjHyh6mIHvUqU&part=snippet&type=video&maxResults=15`,
        dataType: 'json',
        type: 'GET',
        success: (result) => {

            for(var i = 0; i < result.items.length; i++) {
                $.ajax({
                    url: `https://www.googleapis.com/youtube/v3/videos?id=${result.items[i].id.videoId}&key=AIzaSyBG2XG-ACdIgQRBBf2wH4yjHyh6mIHvUqU&part=snippet,contentDetails`,
                    dataType: 'json',
                    type: 'GET',
                    async: false,
                    success: (result2) => {
                        var h = m = s = 0;
                        var duration = result2.items[0].contentDetails.duration.split('PT')[1];

                        if(duration.indexOf('H') != -1) {
                            h = duration.split('H')[0];
                            duration = duration.split('H')[1];
                        }

                        if(duration.indexOf('M') != -1) {
                            m = duration.split('M')[0];
                            duration = duration.split('M')[1];
                        }

                        if(duration.indexOf('S') != -1) {
                            s = duration.split('S')[0];
                        }

                        videoId.push(result2.items[0].id);

                        $('#preloader').remove();
                        $('#slide-out').append(`
                            <li class="video-list card-panel">
                                <div id="">
                                    <div id="list">
                                        <div id="thumbnail">
                                            <img src="${result2.items[0].snippet.thumbnails.default.url}" />
                                        </div>
                                        <div id="info" style="margin-left: 10px;">
                                            <div id="title" class="title${cnt}">
                                                ${result2.items[0].snippet.title}
                                            </div>
                                            <div id="publisher" class="publisher${cnt}">
                                                재생시간 : ${h}:${m}:${s} / 게시자 : ${result2.items[0].snippet.channelTitle}
                                            </div>
                                        </div>
                                        <div id="music-info">
                                            <a id="modal-a" class="modal-trigger" href="#modal${cnt}"><img src="img/info.png" style="width: 30px; height: 30px; margin-top: 30px; cursor: pointer;" /></a>
                                        </div>
                                        <div id="take-music">
                                            <img class="take" id="${cnt}" src="img/basket.png" style="width: 30px; height: 30px; margin-top: 30px; cursor: pointer;" onclick="Materialize.toast('Added!', 1000)">
                                        </div>
                                    </div>
                                </div>
                            </li>
                            `);
                            $('body').append(`
                              <div id="modal${cnt}" class="modal">
                                <div class="modal-content">
                                  <h4>${result2.items[0].snippet.title}</h4>
                                  <p>재생시간 : ${h}:${m}:${s}</p>
                                  <p>게시자 : ${result2.items[0].snippet.channelTitle}</p>
                                  <p>설명 : ${result2.items[0].snippet.description}</p>
                                </div>
                                <div class="modal-footer">
                                    <a href="#!" class="modal-action modal-close waves-effect waves-blue btn-flat">확인</a>
                                </div>
                              </div>
                              `)
                            $('.modal-trigger').leanModal();

                            $(`#${cnt}`).on('click', (e) => {
                                $('#box').append(`
                                    <div id="box-list" class="box${videoCnt} card-panel">
                                        <div id="close">
                                            <img src="img/x.png" class="${videoCnt}" style="width: 10px; height: 10px; margin-top: -10px; margin-left: -10px; cursor: pointer;"/>
                                        </div>
                                        <div id="song-title">
                                            <span id="list${videoCnt}" style="cursor: pointer;">${result.items[Number(e.target.id)].snippet.title}</span>
                                        </div>
                                    </div>
                                `);

                                $(`#list${videoCnt}`).on('click', (e) => {
                                  restoreColor(nowVideo);
                                  nowVideo = e.target.id.split('list')[1];
                                  document.getElementById('p').src = playList[nowVideo];
                                  player = new YT.Player('p', {
                                      events: {
                                          'onReady': onPlayerReady,
                                          'onStateChange': onPlayerStateChange
                                      }
                                  });

                                  changeColor(nowVideo);
                                });

                                $(`.${videoCnt}`).on('click', (e2) => {
                                    //지울 영상을 배열에서 삭제
                                    playList.splice(Number($(e2.target).attr('class')), 1);

                                    $(`.box${$(e2.target).attr('class')}`).remove();

                                    //지운 영상 뒤에 있는 영상들의 id값을 전부 1씩 감소시킴
                                    for (j = Number($(e2.target).attr('class')) + 1; j < videoCnt; j++) {
                                        $(`.box${j}`).attr('class', `box${j - 1} card-panel`);
                                        $(`.${j}`).attr('class', `${j - 1}`);
                                        $(`#list${j}`).attr('id', `list${j - 1}`);
                                    }

                                    videoCnt--;

                                    if($(e2.target).attr('class') == nowVideo) {
                                        nowVideo--;
                                        nextVideo();

                                        if(!videoCnt) {
                                            document.getElementById('p').src = '';
                                        }
                                    }


                                    if(videoCnt == 0) {
                                        isFirst = true;
                                    }

                                });
                                addVideo(videoId[e.target.id]);
                            });

                            cnt++;

                    }
            });
        }

    }});
}
