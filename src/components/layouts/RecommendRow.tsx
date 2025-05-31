import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { ContentsResponse } from '../../api/contentsApi.tsx';
import ContentContainer from './ContentContainer';

interface RecommendRowProps {
  description: string;
  contentsList: ContentsResponse[];
}

const RecommendRow: React.FC<RecommendRowProps> = ({ description, contentsList }) => {
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const checkScrollNeeded = () => {
      const container = containerRef.current;
      if (!container) return;

      const firstChild = container.firstElementChild;
      const lastChild = container.lastElementChild;


      if (firstChild && lastChild) {
          const screenRight = window.innerWidth;
          const lastChildLength = lastChild.getBoundingClientRect().right ;

          const isScrollNeeded = screenRight < lastChildLength;

          console.log('firstChildLength:', screenRight);
          console.log('lastChildLength:', lastChildLength);
          setShowRightArrow(isScrollNeeded);
      }
  };

  useEffect(() => {
    // 컴포넌트 마운트 후 스크롤 필요 여부 체크
    const timer = setTimeout(() => {
      checkScrollNeeded();
    }, 100); // DOM 렌더링 완료 후 실행

    // 윈도우 리사이즈 이벤트 리스너
    const handleResize = () => {
      checkScrollNeeded();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    // contentsList 변경 시 스크롤 필요 여부 다시 체크
    const timer = setTimeout(() => {
      checkScrollNeeded();
    }, 100);

    return () => clearTimeout(timer);
  }, [contentsList]);

  const handleScroll = (direction: 'left' | 'right') => {
      const container = containerRef.current;
      if (!container) return;

      // 모든 자식들의 실제 위치 확인
      const children = Array.from(container.children) as HTMLElement[];
      if (children.length === 0) return;

      let gap = 0;

      if (children.length >= 2) {
          const firstChildRect = children[0].getBoundingClientRect();
          const secondChildRect = children[1].getBoundingClientRect();

          const calculatedGap = secondChildRect.left - firstChildRect.right;

          gap = Math.max(0, calculatedGap);
      }

      const containerRect = container.getBoundingClientRect();
      const containerLeft = containerRect.left;
      const containerRight = containerRect.right;

      const visibleChildren = children.filter(child => {
          const childRect = child.getBoundingClientRect();
          return childRect.right > containerLeft && childRect.left < containerRight;
      });


      if (visibleChildren.length == 0) return;

      // --- 스크롤할 아이템 개수 결정 로직 ---
      let numItemsToScroll = visibleChildren.length;

      const lastVisibleChildInArray = visibleChildren[visibleChildren.length - 1];
      const lastVisibleChildRect = lastVisibleChildInArray.getBoundingClientRect();

      if (lastVisibleChildRect.left < containerRight && lastVisibleChildRect.right > containerRight) {
          const childTotalWidth = lastVisibleChildInArray.offsetWidth; // 아이템의 전체 너비
          if (childTotalWidth > 0) { // 너비가 0보다 클 때만 계산 (0으로 나누기 방지)
              // 컨테이너 내부에 보이는 부분의 너비
              const visibleWidthOfLastChild = containerRight - lastVisibleChildRect.left;
              const visibilityRatio = visibleWidthOfLastChild / childTotalWidth;

              // 마지막에 있는 요소의 80%를 보이는지 여부 검사
              // 단, 최소 1개는 스크롤하도록 보장
              if (visibilityRatio < 0.8) {
                  numItemsToScroll = Math.max(1, visibleChildren.length - 1);
              }
          }
      }

      const firstActuallyVisibleChild = visibleChildren[0];
      const childWidth = firstActuallyVisibleChild.offsetWidth;

      // 최종 스크롤할 양 계산
      const scrollAmount = numItemsToScroll * (childWidth + gap);

      const currentScroll = container.scrollLeft;
      const newPosition = direction === 'left'
          ? Math.max(0, currentScroll - scrollAmount) // 왼쪽으로 스크롤 시 0 미만으로 가지 않도록
          : currentScroll + scrollAmount;

      container.scrollTo({
          left: newPosition,
          behavior: 'smooth'
      });
      // setScrollPosition(newPosition);
      // setShowLeftArrow(newPosition > 0);
      setTimeout(() => {
          checkScrollNeeded();
      }, 300); // 500ms 후에 체크
  };

  return (
      <Box sx={{
          mb: 4,
          position: 'relative',
          overflow: 'hidden',
          width: '100%',
          // maxWidth: `calc(100vw - calc(${theme.spacing(7)} + 11px))`,
          maxWidth: '100%',
          height: '100%'
      }}>
      {/* Row Title */}
      <Typography
        variant="h4"
        sx={{
          ml: 2,
          mb: 1.5,
          fontWeight: 'bold',
          color: 'text.primary',
          textAlign: 'left'
        }}
      >
        {description}
      </Typography>

      {/* Left Navigation Arrow */}
      {showLeftArrow && (
        <IconButton
          sx={{
              position: 'absolute',
              left: '5%',
              top: '60%',
              transform: 'translateY(-50%)',
              zIndex: 3,
              minWidth : 50,
              minHeight : 50,
              height: '4vw',
              width: '4vw',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              color: 'white',
              '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.7)' },
          }}
          onClick={() => handleScroll('left')}
          size="large"
        >
          <ChevronLeft
              sx={{
                  fontSize: '3vw',  // 뷰포트 너비의 3%
                  minFontSize: '50px',  // 최소 크기
              }} />
        </IconButton>
      )}

      {/* Content Cards Container */}
      <Box
        ref={containerRef}
        sx={{
          display: 'flex',
            overflow: 'hidden',        // auto → hidden으로 변경
          gap: 2,
          pl: 2,
          pr: 2,
          paddingY: 1,
          height: '100%',  // 제목 높이 제외
        }}
        onScroll={(e) => {
          const target = e.target as HTMLElement;
          setShowLeftArrow(target.scrollLeft > 0);
        }}
      >
        {contentsList.map((content) => (
          <Box key={content.contentsId}
               sx={{ flexShrink: 0,
                     height: '100%',
                     width: {
                         xs: '30vw',
                         sm: '25vw',
                         md: '20vw',
                         lg: '15vw' } }}>
            <ContentContainer
              contentsId={content.contentsId}
              title={content.title}
              description={content.description}
              thumbnailUrl={content.thumbnailUrl}
              posterUrl={content.posterUrl}
              type={content.type}
              folderId={content.folderId}
            />
          </Box>
        ))}
      </Box>

      {/* Right Navigation Arrow */}
      {showRightArrow && (
        <IconButton
          sx={{
              position: 'absolute',
              right: '5%',
              top: '60%',
              minWidth : 50,
              minHeight : 50,
              height: '4vw',
              width: '4vw',
              transform: 'translateY(-50%)',
              zIndex: 3,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              color: 'white',
              '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.7)' },
            }}
            onClick={() => handleScroll('right')}
            size="large"
          >
          <ChevronRight
              sx={{
                  fontSize: '3vw',  // 뷰포트 너비의 3%
                  minFontSize: '50px',  // 최소 크기
              }}/>
        </IconButton>
      )}
    </Box>
  );
};

export default RecommendRow;