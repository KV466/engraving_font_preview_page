$(function(){
    //엔터로 텍스트값 가져와서 미리보기 박스에 넣음.
    $('form').on('submit', function(e){
        
        //페이지 이동 막기
        e.preventDefault();
        //중복 실행 방지
        e.stopPropagation();

        let TextValue = $('#FontPreview').val();
        $('.intext>h6').text(TextValue);

        //사용자 입력 언어 판별하여 텍스트 검열
        let TextV = $('#FontPreview').val();
        let korean = false;
        let english = false;
        let japan = false;
        let hanja = false;
        let number = false;
        let special = false;
    

       [...TextV].forEach(char => {
            const code = char.codePointAt(0);
            if (
                (code >= 0xAC00 && code <= 0xD7A3) || (code >= 0x3131 && code <= 0x318E)
                )
                {
                    korean = true;
                }; // 한글 자모

            if (
                (code >= 0x41 && code <= 0x5A) || (code >= 0x61 && code <= 0x7A)
                )
                {
                    english = true;
                }; //영어
            if (
                (code >= 0x4E00 && code <= 0x9FFF)
                )
                {
                    hanja = true;
                }; //한자      
            if (
                (code >= 0x3040 && code <= 0x309F) || (code >= 0x30A0 && code <= 0x30FF)
                )
                {
                    japan = true;
                }; //일본어
            if (
                (code >= 0x30 && code <= 0x39)
                )
                {
                    number = true;
                }; //숫자
            if (
                (code >= 0x20 && code <= 0x2F || code >= 0x3A && code <= 0x40 || code >= 0x5B && code <= 0x60 || code >= 0x7B && code <= 0x7E)
                )
                {
                    special = true;
                }; //특수문자
        });

        $('.font_box').each(function () {
            let show = false;

            if (korean && $(this).hasClass('ko')) {
                $(this).find('h6').text(TextV);
                show = true;
            }
            if (english && $(this).hasClass('en')) {
                $(this).find('h6').text(TextV);
                show = true;
            }
            if (hanja && $(this).hasClass('han')) {
                $(this).find('h6').text(TextV);
                show = true;
            }
            if (japan && $(this).hasClass('jp')) {
                $(this).find('h6').text(TextV);
                show = true;
            }
            if (number && $(this).hasClass('num')) {
                $(this).find('h6').text(TextV);
                show = true;
            }                                    
            if (special && $(this).hasClass('sp')) {
                $(this).find('h6').text(TextV);
                show = true;
            }            
            
            if(show){
                $(this).find('h6').text(TextV);
            } else{
                $(this).find('h6').text('');
            }
        });
        return false;
    })
    
    //버튼 눌렀을 때 값 가져오기
    $('button').on('click',function(){
        let TextV = $('#FontPreview').val();
        let korean = false;
        let english = false;
        let japan = false;
        let hanja = false;
        let number = false;
        let special = false;
    

       [...TextV].forEach(char => {
            const code = char.codePointAt(0);
            if (
                (code >= 0xAC00 && code <= 0xD7A3) || (code >= 0x3131 && code <= 0x318E)
                )
                {
                    korean = true;
                }; // 한글 자모

            if (
                (code >= 0x41 && code <= 0x5A) || (code >= 0x61 && code <= 0x7A)
                )
                {
                    english = true;
                }; //영어
            if (
                (code >= 0x4E00 && code <= 0x9FFF)
                )
                {
                    hanja = true;
                }; //한자      
            if (
                (code >= 0x3040 && code <= 0x309F) || (code >= 0x30A0 && code <= 0x30FF)
                )
                {
                    japan = true;
                }; //일본어
            if (
                (code >= 0x30 && code <= 0x39)
                )
                {
                    number = true;
                }; //숫자
            if (
                (code >= 0x20 && code <= 0x2F || code >= 0x3A && code <= 0x40 || code >= 0x5B && code <= 0x60 || code >= 0x7B && code <= 0x7E)
                )
                {
                    special = true;
                }; //특수문자
        });

        $('.font_box').each(function () {
            let show = false;

            if (korean && $(this).hasClass('ko')) {
                $(this).find('h6').text(TextV);
                show = true;
            }
            if (english && $(this).hasClass('en')) {
                $(this).find('h6').text(TextV);
                show = true;
            }
            if (hanja && $(this).hasClass('han')) {
                $(this).find('h6').text(TextV);
                show = true;
            }
            if (japan && $(this).hasClass('jp')) {
                $(this).find('h6').text(TextV);
                show = true;
            }
            if (number && $(this).hasClass('num')) {
                $(this).find('h6').text(TextV);
                show = true;
            }                                    
            if (special && $(this).hasClass('sp')) {
                $(this).find('h6').text(TextV);
                show = true;
            }            
            
            if(show){
                $(this).find('h6').text(TextV);
            } else{
                $(this).find('h6').text('');
            }
        });
    });

    //서체 버튼 이벤트
    $('#Button_Box>ul>li').click(function(){
        let index = $(this).index();

        //버튼 색상 변경
        $('#Button_Box>ul>li').css('background-color','');
        $(this).css('background-color','orange');
        
        $('#Preview_Box>ul').hide();
        $('#Preview_Box>ul').eq(index).show();
    });

    //서체 번호 복사 버튼
    $('.font_box>li>h5>button').click(function(){
        let H6num = $(this).closest('.font_box>li>h5')
                            .clone()
                            .children()
                            .remove()
                            .end()
                            .text()
                            .trim();
        let UserText = $('#FontPreview').val();

        navigator.clipboard.writeText(H6num+') '+UserText)
        .then(function(){
            alert('"'+H6num+') '+UserText+'"'+' 복사되었습니다. 배송메세지에 첨부해주세요.');});
        });
});