$(function(){
    // //엔터로 텍스트값 가져와서 미리보기 박스에 넣음
    $('form').on('submit', function(e){
    e.preventDefault();//form이 sumit될 때 페이지 새로고침 막음
    e.stopPropagation();//이벤트가 부모 요소에게 전달되는 이벤트 중복 차단

    //사용자 입력값
    let TextV = $('#FontPreview').val();
    
    //font_box 하나씩 검사
    $('.font_box').each(function () {
        let $this = $(this);
        let canShow = true; // 기본값을 true로 두고, 지원 안 하는 글자 발견 시 false로 변경

        // 문자열 -> 배열로 반환, 입력된 텍스트의 모든 글자를 하나씩 검사
        [...TextV].forEach(char => {
            const code = char.codePointAt(0); //해당 문자의 유니코드 반환
            let isSupported = false;

            // 해당 박스에서 ko/en/han/jp/num/sp라는 클래스를 가지고 있을 때 'isSupported=true'로 받음.
            if ($this.hasClass('ko') && ((code >= 0xAC00 && code <= 0xD7A3) || (code >= 0x3131 && code <= 0x318E))) isSupported = true;
            else if ($this.hasClass('en') && ((code >= 0x41 && code <= 0x5A) || (code >= 0x61 && code <= 0x7A))) isSupported = true;
            else if ($this.hasClass('han') && (code >= 0x4E00 && code <= 0x9FFF)) isSupported = true;
            else if ($this.hasClass('jp') && ((code >= 0x3040 && code <= 0x309F) || (code >= 0x30A0 && code <= 0x30FF))) isSupported = true;
            else if ($this.hasClass('num') && (code >= 0x30 && code <= 0x39)) isSupported = true;
            else if ($this.hasClass('sp') && (code >= 0x20 && code <= 0x2F || code >= 0x3A && code <= 0x40 || code >= 0x5B && code <= 0x60 || code >= 0x7B && code <= 0x7E)) isSupported = true;
            
            // 공백(Space) *허용하지 않으려면 false로 변경
            if (code === 0x20) isSupported = true;

            // 한 글자라도 지원 범위를 벗어나면 이 폰트 박스는 출력 불가
            if (!isSupported) {
                canShow = false;
            }
        });

        // 최종 결과 반영
        // 지원하지 않는 언어의 글자가 섞여 있다면 canShow가 fale, 입력창이 비어있다면 length가 0으로 실행.
        if(canShow && TextV.length > 0){
            $this.find('h6').text(TextV);
        } else {
            $this.find('h6').text('');
        }
        });

        return false;
    });

    //미리보기 버튼 눌렀을 때 값 불러오기 엔터 내용과 동일함.
    $('button').on('click',function(e){
    e.preventDefault();
    e.stopPropagation();

    let TextV = $('#FontPreview').val();
    
    $('.font_box').each(function () {
        let $this = $(this);
        let canShow = true;

        // 입력된 텍스트의 모든 글자를 하나씩 검사
        [...TextV].forEach(char => {
            const code = char.codePointAt(0);
            let isSupported = false;

            // 해당 박스가 지원하는 언어 규칙 확인
            if ($this.hasClass('ko') && ((code >= 0xAC00 && code <= 0xD7A3) || (code >= 0x3131 && code <= 0x318E))) isSupported = true;
            else if ($this.hasClass('en') && ((code >= 0x41 && code <= 0x5A) || (code >= 0x61 && code <= 0x7A))) isSupported = true;
            else if ($this.hasClass('han') && (code >= 0x4E00 && code <= 0x9FFF)) isSupported = true;
            else if ($this.hasClass('jp') && ((code >= 0x3040 && code <= 0x309F) || (code >= 0x30A0 && code <= 0x30FF))) isSupported = true;
            else if ($this.hasClass('num') && (code >= 0x30 && code <= 0x39)) isSupported = true;
            else if ($this.hasClass('sp') && (code >= 0x20 && code <= 0x2F || code >= 0x3A && code <= 0x40 || code >= 0x5B && code <= 0x60 || code >= 0x7B && code <= 0x7E)) isSupported = true;
            
            // 공백(Space)
            if (code === 0x20) isSupported = true;

            // 한 글자라도 지원 범위를 벗어나면 이 폰트 박스는 출력 불가
            if (!isSupported) {
                canShow = false;
            }
        });

        // 최종 결과 반영
        if(canShow && TextV.length > 0){
            $this.find('h6').text(TextV);
        } else {
            $this.find('h6').text('');
        }
        });

        return false;        
    })

    //서체 분류 버튼을 누르면 색상이 바뀌는 이벤트
    $('#Button_Box>ul>li').click(function(){
        let index = $(this).index();

        //버튼 색상 변경
        $('#Button_Box>ul>li').css('background-color','');
        $(this).css('background-color','orange');
        
        $('#Preview_Box>ul').hide();
        $('#Preview_Box>ul').eq(index).show();
    });

    //서체 번호+배송메세지 첨부 가능한 내용 복사 버튼
    $('.font_box>li>h5>button').click(function(){
        let H6num = $(this).closest('.font_box>li>h5')
                            .clone()
                            .children()
                            .remove()
                            .end()
                            .text()
                            .trim();
        let UserText = $('#FontPreview').val(); //사용자 입력값

        navigator.clipboard.writeText(H6num+') '+UserText) //클립보드에 특정 텍스트 복사
        //복사 처리가 되면 팝업으로 복사 완료 안내 멘트 명령 실행
        .then(function(){
            alert('"'+H6num+') '+UserText+'"'+' 복사되었습니다. 배송메세지에 첨부해 주세요.');});
        });
});