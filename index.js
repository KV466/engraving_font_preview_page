$(function(){
    // 폰트 지원 여부 검사 함수 (중복 제거)
    function checkFontSupport($fontBox, text) {
        let canShow = true;
        [...text].forEach(function(char) {
            const code = char.codePointAt(0);
            let isSupported = false;

            if ($fontBox.hasClass('ko') && ((code >= 0xAC00 && code <= 0xD7A3) || (code >= 0x3131 && code <= 0x318E))) isSupported = true;
            else if ($fontBox.hasClass('en') && ((code >= 0x41 && code <= 0x5A) || (code >= 0x61 && code <= 0x7A))) isSupported = true;
            else if ($fontBox.hasClass('han') && (code >= 0x4E00 && code <= 0x9FFF)) isSupported = true;
            else if ($fontBox.hasClass('jp') && ((code >= 0x3040 && code <= 0x309F) || (code >= 0x30A0 && code <= 0x30FF))) isSupported = true;
            else if ($fontBox.hasClass('num') && (code >= 0x30 && code <= 0x39)) isSupported = true;
            else if ($fontBox.hasClass('sp') && (code >= 0x20 && code <= 0x2F || code >= 0x3A && code <= 0x40 || code >= 0x5B && code <= 0x60 || code >= 0x7B && code <= 0x7E)) isSupported = true;

            if (code === 0x20) isSupported = true;
            if (!isSupported) canShow = false;
        });
        return canShow;
    }

    // 미리보기 텍스트 업데이트 함수
    function updatePreview() {
        var TextV = $('#FontPreview').val();
        $('.font_box').each(function() {
            var $this = $(this);
            if (checkFontSupport($this, TextV) && TextV.length > 0) {
                $this.find('h6').text(TextV);
            } else {
                $this.find('h6').text('');
            }
        });
    }

    // === 1. 입력 즉시 미리보기 (debounce) ===
    var debounceTimer = null;
    $('#FontPreview').on('input', function() {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(updatePreview, 200);
    });

    // 엔터로도 미리보기 (기존 기능 유지)
    $('form').on('submit', function(e) {
        e.preventDefault();
        e.stopPropagation();
        updatePreview();
        return false;
    });

    // === 2. 폰트 이름/번호 검색 ===
    // 폰트 이름 매핑 (검색용)
    var fontNames = {
        '101': '조선글씨체 ChosunGs',
        '102': '맑은고딕 malgun',
        '110': '안성탕면 Ansungtangmyun Bold',
        '111': '추사사랑 ChusaLove',
        '112': '피렌체 EF Firenze',
        '120': '학교안심마법사 HakgyoansimMabeopsaR',
        '121': '가비아납작블록 gabia napjakBlock',
        '122': '배찌 Bazzi',
        '123': '일기체 EF Diary',
        '124': '87밀상 MMILSANG Oblique',
        '125': '안창호 KCC Ahnchangho',
        '126': '쿨재즈 Cooljazz',
        '127': '솔뫼김대건',
        '128': '가비아청연 GabiaCheongyeon',
        '129': '전남교육유나체',
        '130': '나눔손글씨고딕아니고고딩',
        '131': '온글잎위씨리스트',
        '132': '나눔손글씨나무정원',
        '151': '영주선비 YEONGJUSeonbi',
        '152': '브래들리핸드 BradleyHand',
        '153': '모노타입코르시바 MonotypeCorsivaRegular',
        '154': '미스트랄 MISTRAL',
        '155': '컨티뉴어스 Continuous',
        '156': '블랙소드 Blacksword',
        '157': '댄싱스크립트 DancingScript',
        '158': '파리지엔느 Parisienne',
        '159': '알렉스브러쉬 AlexBrush',
        '160': '그레이트바이브스 GreatVibes',
        '161': '에드워디안스크립트 EdwardianScript',
        '162': '잉크버로우 inkburrow'
    };

    var searchDebounce = null;
    $('#FontSearch').on('input', function() {
        clearTimeout(searchDebounce);
        searchDebounce = setTimeout(function() {
            var query = $('#FontSearch').val().trim().toLowerCase();

            // 현재 보이는 탭의 li들만 대상
            $('#Preview_Box>ul').each(function() {
                var $ul = $(this);
                if ($ul.css('display') === 'none') return;

                $ul.children('li').each(function() {
                    var $li = $(this);
                    var $fontBox = $li.find('.font_box');
                    if ($fontBox.length === 0) return;

                    if (query === '') {
                        $li.show();
                        return;
                    }

                    // 폰트 번호 추출
                    var fontNum = '';
                    var classList = $fontBox.attr('class').split(/\s+/);
                    for (var i = 0; i < classList.length; i++) {
                        var match = classList[i].match(/^font_box(\d+)$/);
                        if (match) {
                            fontNum = match[1];
                            break;
                        }
                    }

                    // 번호 매칭 또는 이름 매칭
                    var nameStr = (fontNames[fontNum] || '').toLowerCase();
                    var h5Text = $fontBox.find('h5').text().toLowerCase();
                    if (fontNum.indexOf(query) !== -1 || nameStr.indexOf(query) !== -1 || h5Text.indexOf(query) !== -1) {
                        $li.show();
                    } else {
                        $li.hide();
                    }
                });
            });
        }, 200);
    });

    // === 3. 폰트 크기 조절 슬라이더 ===
    $('#FontSize').on('input', function() {
        var size = $(this).val();
        $('#FontSizeValue').text(size + 'px');
        $('.font_box>li:nth-child(2)>h6').css('font-size', size + 'px');
    });

    // === 4. 다크모드 토글 ===
    $('#DarkModeToggle').on('click', function() {
        $('body').toggleClass('dark-mode');
        if ($('body').hasClass('dark-mode')) {
            $(this).text('밝은 배경');
        } else {
            $(this).text('다크모드');
        }
    });

    // === 기존 기능: 서체 분류 버튼 ===
    $('#Button_Box>ul>li').click(function() {
        var index = $(this).index();

        $('#Button_Box>ul>li').css('background-color', '');
        $(this).css('background-color', 'orange');

        $('#Preview_Box>ul').hide();
        $('#Preview_Box>ul').eq(index).show();

        // 검색 필터 초기화
        $('#FontSearch').val('');
        $('#Preview_Box>ul').each(function() {
            $(this).children('li').show();
        });
    });

    // === 기존 기능: 서체 번호 복사 버튼 ===
    $('.font_box>li>h5>button').click(function(e) {
        e.stopPropagation();
        var H6num = $(this).closest('.font_box>li>h5')
                            .clone()
                            .children()
                            .remove()
                            .end()
                            .text()
                            .trim();
        var UserText = $('#FontPreview').val();

        navigator.clipboard.writeText(H6num + ') ' + UserText)
        .then(function() {
            alert('"' + H6num + ') ' + UserText + '"' + ' 복사되었습니다. 배송메세지에 첨부해 주세요.');
        });
    });
});
