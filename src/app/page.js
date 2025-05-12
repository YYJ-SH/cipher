"use client";
import React, { useState, useEffect, useRef } from 'react';

const LuxuryWoodenCaesarCipher = () => {
  const [shift, setShift] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const [startShift, setStartShift] = useState(0);
  const clickSoundRef = useRef(null);

  useEffect(() => {
    clickSoundRef.current = new Audio("/gear.mp3");
    return () => {
      if (clickSoundRef.current) {
        clickSoundRef.current.pause();
        clickSoundRef.current = null;
      }
    };
  }, []);
  const [answer, setAnswer] = useState("");
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState(0);
  const slideRef = useRef(null);
  const problemContainerRef = useRef(null);
  
  // 클릭 소리 효과음
  const clickSound = new Audio("/gear.mp3");
  const slideSoundRef = useRef(null);
  if (!slideSoundRef.current) {
    slideSoundRef.current = new Audio("/gear.mp3");
  }
  // 문제 목록
  const problems = [
    { 
      text: "[문제1] 평문 \"HELLO\"를 시저 암호로 3만큼 오른쪽으로 밀어 암호화하시오.", 
      hint: "각 알파벳을 3칸씩 이동하면 A는 D, B는 E, C는 F가 됩니다." 
    },
    { 
      text: "[문제2] - 난이도 하 시저 암호 \"VHFXULWB\"는 시프트 3만큼 오른쪽으로 이동한 평문이다. 원래의 문장을 복원하시오.", 
      hint: "복호화는 암호화의 반대 방향으로 시프트합니다." 
    },
    { 
      text: "[문제3] 시저 암호 \"lezi e rmgi hec\"는 어떤 평문을 암호화한 것이다. 시프트 4를 적용하여 원래 평문을 구하시오.", 
      hint: "모든 알파벳이 소문자인 경우에도 동일한 규칙이 적용됩니다." 
    }
  ];
  
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const shiftedAlphabet = alphabet.slice(shift) + alphabet.slice(0, shift);

  // 드래그 시작 처리
  const handleDragStart = (e) => {
    setIsDragging(true);
    if (e.type === 'touchstart') {
      setDragStart(e.touches[0].clientX);
    } else {
      setDragStart(e.clientX);
    }
    setStartShift(shift);
    
    // 이벤트 리스너 등록
    if (e.type === 'touchstart') {
      document.addEventListener('touchmove', handleDragMove);
      document.addEventListener('touchend', handleDragEnd);
    } else {
      document.addEventListener('mousemove', handleDragMove);
      document.addEventListener('mouseup', handleDragEnd);
    }
  };

  // 드래그 중 처리
  const handleDragMove = (e) => {
    if (!isDragging) return;
    
    let currentX;
    if (e.type === 'touchmove') {
      currentX = e.touches[0].clientX;
      e.preventDefault(); // 모바일 스크롤 방지
    } else {
      currentX = e.clientX;
    }
    
    const containerWidth = slideRef.current ? slideRef.current.offsetWidth : 300;
    const letterWidth = containerWidth / 26;
    const dragDelta = currentX - dragStart;
    const shiftDelta = Math.round(dragDelta / letterWidth);
    
    let newShift = (startShift - shiftDelta) % 26;
    if (newShift < 0) newShift += 26;
    
    // 이전 값과 다를 때만 소리 재생
    if (newShift !== shift) {
      playClickSound();
    }
    
    setShift(newShift);
  };

  // 드래그 종료 처리
  const handleDragEnd = () => {
    setIsDragging(false);
    
    // 이벤트 리스너 제거
    document.removeEventListener('mousemove', handleDragMove);
    document.removeEventListener('mouseup', handleDragEnd);
    document.removeEventListener('touchmove', handleDragMove);
    document.removeEventListener('touchend', handleDragEnd);
  };

  // 소리 재생 함수
  const playClickSound = () => {
    clickSound.currentTime = 0;
    clickSound.volume = 0.3;
    clickSound.play().catch(e => console.log("오디오 재생 오류:", e));
  };
  
  const playSlideSound = () => {
    slideSoundRef.current.currentTime = 0;
    slideSoundRef.current.volume = 0.5;
    slideSoundRef.current.play().catch(e => console.log("오디오 재생 오류:", e));
  };

  // 시프트 버튼으로 정확하게 한 글자씩 조정
  const adjustShift = (amount) => {
    setShift((prevShift) => {
      let newShift = (prevShift + amount) % 26;
      if (newShift < 0) newShift += 26;
      playClickSound();
      return newShift;
    });
  };
  
  // 문제 스와이프 처리 시작
  const handleTouchStartProblem = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };
  
  // 문제 스와이프 처리 종료
  const handleTouchEndProblem = (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diffX = touchEndX - touchStartX;
    
    // 스와이프 거리가 충분히 클 때만 처리
    if (Math.abs(diffX) > 50) {
      if (diffX > 0 && currentProblemIndex > 0) {
        // 오른쪽 스와이프 (이전 문제)
        setCurrentProblemIndex(prev => prev - 1);
        playSlideSound();
      } else if (diffX < 0 && currentProblemIndex < problems.length - 1) {
        // 왼쪽 스와이프 (다음 문제)
        setCurrentProblemIndex(prev => prev + 1);
        playSlideSound();
      }
    }
  };
  
  // 버튼으로 문제 이동
  const navigateProblem = (direction) => {
    if (direction === 'prev' && currentProblemIndex > 0) {
      setCurrentProblemIndex(prev => prev - 1);
      playSlideSound();
    } else if (direction === 'next' && currentProblemIndex < problems.length - 1) {
      setCurrentProblemIndex(prev => prev + 1);
      playSlideSound();
    }
  };

  // 이벤트 리스너 정리
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleDragMove);
      document.removeEventListener('mouseup', handleDragEnd);
      document.removeEventListener('touchmove', handleDragMove);
      document.removeEventListener('touchend', handleDragEnd);
    };
  }, []);

  // 알파벳 첫 번째 줄 (A-M) 원본
  const renderFirstRowAlphabet = () => {
    return alphabet.slice(0, 13).split('').map((letter, index) => (
      <div 
        key={`first-${index}`} 
        className="w-8 h-10 md:w-10 md:h-12 flex items-center justify-center font-serif border-r border-amber-700 last:border-r-0"
      >
        {letter}
      </div>
    ));
  };

  // 알파벳 첫 번째 줄 (A-M) 시프트
  const renderFirstRowShifted = () => {
    return shiftedAlphabet.slice(0, 13).split('').map((letter, index) => (
      <div 
        key={`first-shifted-${index}`} 
        className="w-8 h-10 md:w-10 md:h-12 flex items-center justify-center font-serif border-r border-amber-700 last:border-r-0"
      >
        {letter}
      </div>
    ));
  };

  // 알파벳 두 번째 줄 (N-Z) 원본
  const renderSecondRowAlphabet = () => {
    return alphabet.slice(13).split('').map((letter, index) => (
      <div 
        key={`second-${index}`} 
        className="w-8 h-10 md:w-10 md:h-12 flex items-center justify-center font-serif border-r border-amber-700 last:border-r-0"
      >
        {letter}
      </div>
    ));
  };

  // 알파벳 두 번째 줄 (N-Z) 시프트
  const renderSecondRowShifted = () => {
    return shiftedAlphabet.slice(13).split('').map((letter, index) => (
      <div 
        key={`second-shifted-${index}`} 
        className="w-8 h-10 md:w-10 md:h-12 flex items-center justify-center font-serif border-r border-amber-700 last:border-r-0"
      >
        {letter}
      </div>
    ));
  };

  return (
    <div 
      className="min-h-screen p-4 bg-cover bg-center flex flex-col items-center justify-center" 
      style={{
        backgroundImage: "url('/wood-texture.jpg')",
        backgroundColor: "#4B3621"
      }}
    >
      {/* 폰트 스타일 추가 */}
      <style jsx global>{`
        @font-face {
          font-family: 'Danjo-bold-Regular';
          src: url('https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_2307-1@1.1/Danjo-bold-Regular.woff2') format('woff2');
          font-weight: normal;
          font-style: normal;
        }
        
        .korean-font {
          font-family: 'Danjo-bold-Regular', serif;
        }
        
        .gold-text {
          color: #D4AF37;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.6), 0 0 10px rgba(218, 165, 32, 0.4);
        }
      `}</style>
      
      <div 
        className="w-full max-w-3xl p-6 rounded-lg shadow-2xl" 
        style={{
          backgroundImage: "url('/image.png')",
          backgroundColor: "#5E4532",
          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.5)"
        }}
      >
        <h1 className="text-3xl md:text-4xl font-serif mb-6 text-center gold-text">
          YUNGBOGONG CAESAR CIPHER DECODER
        </h1>
        
        {/* 문제 표시 영역 */}
        <div 
          ref={problemContainerRef}
          className="w-full mb-6 p-5 rounded-lg shadow-inner relative overflow-hidden"
          style={{
            backgroundImage: "url('/wood-texture.jpg')",
            backgroundColor: "#3D2E22",
            boxShadow: "inset 0 0 15px rgba(0, 0, 0, 0.5)"
          }}
          onTouchStart={handleTouchStartProblem}
          onTouchEnd={handleTouchEndProblem}
        >
          {/* 문제 번호 표시 */}
          <div className="flex justify-between items-center mb-3">
            <div className="text-amber-200 font-bold korean-font">
              문제 {currentProblemIndex + 1}/{problems.length}
            </div>
            
            {/* 문제 이동 버튼 */}
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => navigateProblem('prev')} 
                className="px-3 py-1 bg-amber-800 text-amber-100 rounded hover:bg-amber-700 disabled:opacity-50"
                disabled={currentProblemIndex === 0}
              >
                ◀
              </button>
              <button 
                onClick={() => navigateProblem('next')} 
                className="px-3 py-1 bg-amber-800 text-amber-100 rounded hover:bg-amber-700 disabled:opacity-50"
                disabled={currentProblemIndex === problems.length - 1}
              >
                ▶
              </button>
            </div>
          </div>
          
          {/* 문제 내용 - 나무에 새겨진 것처럼 */}
          <div 
            className="p-4 rounded text-amber-100 min-h-20"
          >
            <p className="text-lg mb-2 font-bold korean-font gold-text">
              {problems[currentProblemIndex].text}
            </p>
            <p className="text-sm text-amber-300 italic mt-4 korean-font">
              힌트: {problems[currentProblemIndex].hint}
            </p>
          </div>
          
          {/* 메모 입력 칸 */}
          <div className="mt-4">
            <div className="flex items-center">
              <span className="korean-font text-amber-200 mr-2">메모하기:</span>
              <input
                type="text"
                className="flex-1 p-3 bg-amber-100 border-2 border-amber-800 rounded font-mono text-amber-900"
                placeholder="여기에 메모할 내용을 입력하세요..."
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
              />
            </div>
          </div>
          

          
          {/* 스와이프 힌트 */}
          <div className="text-amber-400/50 text-xs italic text-center mt-2 korean-font">
            ← 좌우로 스와이프하여 다른 문제 보기 →
          </div>
        </div>
        
        {/* 시저 암호 슬라이더 - 교대로 원본/시프트 배치 */}
        <div 
          className="w-full bg-amber-800 rounded-lg p-5 shadow-lg mb-6 border-4 border-amber-900" 
          style={{
            backgroundImage: "url('/wood-texture.jpg')",
            boxShadow: "inset 0 0 15px rgba(0, 0, 0, 0.5), 0 5px 15px rgba(0, 0, 0, 0.3)"
          }}
        >
          {/* 시프트 정보 */}
          <div className="flex justify-between items-center mb-4">
            <div className="text-amber-100 font-bold korean-font">
              현재 시프트: {shift} {shift === 0 ? "" : `(A > ${shiftedAlphabet[0]})`}
            </div>
            
            {/* 시프트 조절 버튼 */}
            <div className="flex items-center">
              <button 
                onClick={() => adjustShift(-1)} 
                className="px-3 py-1 bg-amber-950 text-amber-100 rounded-l hover:bg-amber-900"
              >
                ◀
              </button>
              <button 
                onClick={() => adjustShift(1)} 
                className="px-3 py-1 bg-amber-950 text-amber-100 rounded-r hover:bg-amber-900"
              >
                ▶
              </button>
            </div>
          </div>
          
          {/* 시저 암호 회전판 (4줄 교대 배치) */}
          <div className="relative w-full overflow-hidden py-2">
            {/* 첫 번째 줄: 원본 알파벳 (A-M) */}
            <div className="flex flex-row justify-center text-amber-100 py-2 relative border border-amber-900 rounded-t bg-amber-700 overflow-hidden">
              {renderFirstRowAlphabet()}
            </div>
            
            {/* 두 번째 줄: 시프트된 알파벳 (A-M) */}
            <div 
              ref={slideRef}
              className="flex flex-row justify-center text-amber-200 py-2 cursor-grab active:cursor-grabbing relative border-l border-r border-amber-900 bg-amber-800 overflow-hidden"
              onMouseDown={handleDragStart}
              onTouchStart={handleDragStart}
              style={{
                transition: isDragging ? 'none' : 'transform 0.2s ease'
              }}
            >
              {renderFirstRowShifted()}
            </div>
            
            {/* 세 번째 줄: 원본 알파벳 (N-Z) */}
            <div className="flex flex-row justify-center text-amber-100 py-2 relative border-l border-r border-amber-900 bg-amber-700 overflow-hidden">
              {renderSecondRowAlphabet()}
            </div>
            
            {/* 네 번째 줄: 시프트된 알파벳 (N-Z) */}
            <div 
              className="flex flex-row justify-center text-amber-200 py-2 cursor-grab active:cursor-grabbing relative border border-amber-900 rounded-b bg-amber-800 overflow-hidden"
              onMouseDown={handleDragStart}
              onTouchStart={handleDragStart}
              style={{
                transition: isDragging ? 'none' : 'transform 0.2s ease'
              }}
            >
              {renderSecondRowShifted()}
            </div>
            
            {/* 장식용 나사 */}
            <div className="w-full flex justify-between mt-3">
              {[...Array(4)].map((_, i) => (
                <div 
                  key={`screw-${i}`} 
                  className="w-3 h-3 rounded-full bg-amber-950 border border-amber-700"
                  style={{
                    backgroundImage: "radial-gradient(#654321, #3D2E22)"
                  }}
                ></div>
              ))}
            </div>
          </div>
        </div>
        
        {/* 설명 */}
        <div 
          className="w-full p-4 rounded-lg shadow-md text-amber-100"
          style={{
            backgroundImage: "url('/wood-texture.jpg')",
            backgroundColor: "#3D2E22",
            boxShadow: "inset 0 0 10px rgba(0, 0, 0, 0.3)"
          }}
        >
          <h2 className="font-bold text-lg mb-2 text-amber-200 korean-font">사용 방법:</h2>
          <ol className="list-decimal pl-5 space-y-1 korean-font">
            <li>하단 알파벳 바를 좌우로 드래그하여 회전시킵니다.</li>
            <li>정확한 시프트는 좌우 화살표 버튼으로 조절할 수 있습니다.</li>
            <li>암호문의 각 글자를 위쪽 원본 알파벳에서 찾고, 바로 아래 시프트된 알파벳에서 대응하는 글자를 확인합니다.</li>
            <li>문제를 좌우로 스와이프하여 다른 문제로 이동할 수 있습니다.</li>
            <li>해독한 메시지를 정답란에 입력하세요.</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default LuxuryWoodenCaesarCipher;