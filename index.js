$(function(){
    // 폰트 지원 여부 검사 함수
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

    // === 글자 수 제한 ===
    function getCharLimit(text) {
        return /[\uAC00-\uD7A3\u3131-\u318E\u4E00-\u9FFF\u3040-\u309F\u30A0-\u30FF]/.test(text) ? 10 : 15;
    }

    function updateCharCount(text) {
        var limit = getCharLimit(text);
        var len = text.length;
        var $counter = $('#CharCount');
        $counter.text(len + '/' + limit);
        if (limit - len <= 2 && len > 0) {
            $counter.addClass('warning');
        } else {
            $counter.removeClass('warning');
        }
    }

    function enforceCharLimit($input) {
        var text = $input.val();
        var limit = getCharLimit(text);
        if (text.length > limit) {
            $input.val(text.substring(0, limit));
        }
        updateCharCount($input.val());
    }

    // 미리보기 텍스트 업데이트 함수
    function updatePreview() {
        var TextV = $('#FontPreview').val();
        var isUserInput = TextV.length > 0;
        $('.font_box').each(function() {
            var $this = $(this);
            var $warning = $this.children('li').eq(2);
            if (isUserInput) {
                var supported = checkFontSupport($this, TextV);
                if (supported) {
                    $this.find('h6').text(TextV);
                    $warning.removeClass('unsupported');
                } else {
                    $this.find('h6').text('');
                    $warning.addClass('unsupported');
                }
            } else {
                var parts = [];
                if ($this.hasClass('ko')) parts.push('다람쥐 헌 쳇바퀴에 타고파');
                if ($this.hasClass('en')) parts.push('Sphinx of black quartz, judge my vow');
                if ($this.hasClass('han')) parts.push('花鳥風月');
                if ($this.hasClass('jp')) parts.push('いろはにほへと');
                $this.find('h6').html(parts.join('<br>'));
                $warning.removeClass('unsupported');
            }
        });
    }

    // === 1. 입력 즉시 미리보기 (debounce) ===
    var debounceTimer = null;
    $('#FontPreview').on('input', function() {
        enforceCharLimit($(this));
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(updatePreview, 200);
    });

    // 엔터로도 미리보기
    $('form').on('submit', function(e) {
        e.preventDefault();
        e.stopPropagation();
        updatePreview();
        return false;
    });

    // === 2. 폰트 크기 조절 슬라이더 ===
    $('#FontSize').on('input', function() {
        var size = $(this).val();
        $('#FontSizeValue').text(size + 'px');
        $('.font_box>li:nth-child(2)>h6').css('font-size', size + 'px');
    });

    // 폰트 크기 초기화
    function resetFontSize() {
        $('#FontSize').val(20);
        $('#FontSizeValue').text('20px');
        $('.font_box>li:nth-child(2)>h6').css('font-size', '20px');
        // 입력 텍스트 초기화 + 팬그램 복원
        $('#FontPreview').val('');
        updateCharCount('');
        updatePreview();
    }
    $('#FontSizeReset').on('click', resetFontSize);
    $('#FontSizeValue').on('click', resetFontSize);

    // === 3. 다크모드 토글 ===
    $('#DarkModeToggle').on('click', function() {
        $('body').toggleClass('dark-mode');
        if ($('body').hasClass('dark-mode')) {
            $(this).text('밝은 화면');
        } else {
            $(this).text('어두운 화면');
        }
    });

    // === 서체 분류 버튼 ===
    $('#Button_Box>ul>li').click(function() {
        var index = $(this).index();

        $('#Button_Box>ul>li').removeClass('active');
        $(this).addClass('active');

        $('#Preview_Box>ul').hide();
        $('#Preview_Box>ul').eq(index).show();
    });

    // === 서체 번호 복사 버튼 ===
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

    // === 담기 버튼 동적 삽입 ===
    $('.font_box>li:first-child>h5:first-child').each(function() {
        var $h5 = $(this);
        var $addBtn = $('<button class="btn-add-engrave">담기</button>');
        $h5.append($addBtn);
    });

    // === 다중 각인 미리보기 ===
    var engraveList = [];
    var engraveIdCounter = 0;

    // 폰트 번호 추출 헬퍼
    function getFontNum($fontBox) {
        var classList = $fontBox.attr('class').split(/\s+/);
        for (var i = 0; i < classList.length; i++) {
            var match = classList[i].match(/^font_box(\d+)$/);
            if (match) return match[1];
        }
        return '';
    }

    // 담기 버튼 클릭
    $(document).on('click', '.btn-add-engrave', function(e) {
        e.stopPropagation();
        var $fontBox = $(this).closest('.font_box');
        var fontNum = getFontNum($fontBox);
        if (!fontNum) return;

        var text = $('#FontPreview').val();
        engraveIdCounter++;
        engraveList.push({ id: engraveIdCounter, fontNum: fontNum, text: text });
        renderEngravePanel();
        $('#EngraveFAB').show();
    });

    function renderEngravePanel() {
        var $list = $('#EngraveList');
        $list.empty();
        $('#EngraveCount').text(engraveList.length);
        $('#EngraveFABCount').text(engraveList.length);

        if (engraveList.length === 0) {
            $list.html('<p class="engrave-empty">카드의 \'담기\' 버튼으로 각인을 추가해 주세요.</p>');
            $('#EngraveFAB').hide();
            return;
        }

        engraveList.forEach(function(item) {
            var limit = getCharLimit(item.text);
            var len = item.text.length;
            var warningClass = (limit - len <= 2 && len > 0) ? ' warning' : '';
            var $row = $('<div class="engrave-item" data-id="' + item.id + '">' +
                '<div class="engrave-item-header">' +
                    '<span class="engrave-font-num">' + item.fontNum + '번</span>' +
                    '<div class="engrave-item-actions">' +
                        '<button class="engrave-copy-one">복사</button>' +
                        '<button class="engrave-delete">삭제</button>' +
                    '</div>' +
                '</div>' +
                '<div class="engrave-item-body">' +
                    '<input type="text" class="engrave-text-input" value="' + $('<span>').text(item.text).html() + '" placeholder="각인 문구 입력">' +
                    '<span class="engrave-char-count' + warningClass + '">' + len + '/' + limit + '</span>' +
                '</div>' +
                '<div class="engrave-preview" style="font-family:\'' + item.fontNum + '\'">' + $('<span>').text(item.text).html() + '</div>' +
            '</div>');
            $list.append($row);
        });
    }

    // 각인 개별 텍스트 입력
    $(document).on('input', '.engrave-text-input', function() {
        var $row = $(this).closest('.engrave-item');
        var id = parseInt($row.data('id'));
        var text = $(this).val();
        var limit = getCharLimit(text);
        if (text.length > limit) {
            text = text.substring(0, limit);
            $(this).val(text);
        }
        var len = text.length;
        var $counter = $row.find('.engrave-char-count');
        $counter.text(len + '/' + limit);
        if (limit - len <= 2 && len > 0) {
            $counter.addClass('warning');
        } else {
            $counter.removeClass('warning');
        }
        for (var i = 0; i < engraveList.length; i++) {
            if (engraveList[i].id === id) {
                engraveList[i].text = text;
                break;
            }
        }
        $row.find('.engrave-preview').text(text);
    });

    // 각인 개별 복사
    $(document).on('click', '.engrave-copy-one', function() {
        var $row = $(this).closest('.engrave-item');
        var id = parseInt($row.data('id'));
        for (var i = 0; i < engraveList.length; i++) {
            if (engraveList[i].id === id) {
                navigator.clipboard.writeText(engraveList[i].fontNum + ') ' + engraveList[i].text);
                break;
            }
        }
    });

    // 각인 삭제
    $(document).on('click', '.engrave-delete', function() {
        var $row = $(this).closest('.engrave-item');
        var id = parseInt($row.data('id'));
        engraveList = engraveList.filter(function(item) { return item.id !== id; });
        renderEngravePanel();
    });

    // 전체 복사
    $('#EngraveCopyAll').on('click', function() {
        var lines = engraveList.map(function(item) {
            return item.fontNum + ') ' + item.text;
        });
        navigator.clipboard.writeText(lines.join('\n'));
    });

    // FAB 토글
    $('#EngraveFAB').on('click', function() {
        $('#EngravePanel').slideToggle(200);
    });
    $('#EngravePanelClose').on('click', function() {
        $('#EngravePanel').slideUp(200);
    });

    // === 언어 컬러 뱃지 생성 ===
    $('.font_box').each(function() {
        var $box = $(this);
        var $langLabel = $box.find('> li:first-child > h5:nth-child(2)');
        var badges = [];
        if ($box.hasClass('ko')) badges.push('<span class="lang-badge lang-ko">한글</span>');
        if ($box.hasClass('en')) badges.push('<span class="lang-badge lang-en">영어</span>');
        if ($box.hasClass('han')) badges.push('<span class="lang-badge lang-han">한문</span>');
        if ($box.hasClass('jp')) badges.push('<span class="lang-badge lang-jp">일본어</span>');
        $langLabel.html(badges.join(''));
    });
});
