"use client";

import { useRef, useState, useEffect, useCallback } from "react";

interface ReelsCarouselProps {
  embeds: string[];
}

export default function ReelsCarousel({ embeds }: ReelsCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [slidesPerView, setSlidesPerView] = useState(3);

  const totalPages = Math.ceil(embeds.length / slidesPerView);
  const activePage = Math.min(Math.floor(activeIndex / slidesPerView), totalPages - 1);

  const updateSlidesPerView = useCallback(() => {
    const width = window.innerWidth;
    if (width < 600) setSlidesPerView(1);
    else if (width < 900) setSlidesPerView(2);
    else setSlidesPerView(3);
  }, []);

  useEffect(() => {
    updateSlidesPerView();
    window.addEventListener("resize", updateSlidesPerView);
    return () => window.removeEventListener("resize", updateSlidesPerView);
  }, [updateSlidesPerView]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const slides = track.querySelectorAll(".reel-slide");
            const index = Array.from(slides).indexOf(entry.target as Element);
            if (index >= 0) setActiveIndex(index);
          }
        });
      },
      { threshold: 0.7, root: track }
    );

    const slides = track.querySelectorAll(".reel-slide");
    slides.forEach((slide) => observer.observe(slide));

    const checkScroll = () => {
      if (!track) return;
      setCanScrollLeft(track.scrollLeft > 10);
      setCanScrollRight(track.scrollLeft < track.scrollWidth - track.clientWidth - 10);
    };

    track.addEventListener("scroll", checkScroll, { passive: true });
    checkScroll();

    return () => {
      slides.forEach((slide) => observer.unobserve(slide));
      track.removeEventListener("scroll", checkScroll);
    };
  }, [embeds]);

  function scrollTo(index: number) {
    const track = trackRef.current;
    if (!track) return;
    const slide = track.querySelectorAll(".reel-slide")[index] as HTMLElement;
    if (!slide) return;

    const slideLeft = slide.offsetLeft;
    const trackWidth = track.clientWidth;
    const slideWidth = slide.offsetWidth;
    const scrollTarget = slideLeft - (trackWidth - slideWidth) / 2;

    track.scrollTo({ left: scrollTarget, behavior: "smooth" });
  }

  function goNext() {
    const nextIndex = Math.min(activeIndex + slidesPerView, embeds.length - 1);
    scrollTo(nextIndex);
  }

  function goPrev() {
    const prevIndex = Math.max(activeIndex - slidesPerView, 0);
    scrollTo(prevIndex);
  }

  function goToPage(page: number) {
    scrollTo(page * slidesPerView);
  }

  return (
    <div className="reels-carousel">
      {canScrollLeft && (
        <button className="carousel-btn prev" onClick={goPrev} aria-label="Anterior">
          &#10094;
        </button>
      )}
      {canScrollRight && (
        <button className="carousel-btn next" onClick={goNext} aria-label="Próximo">
          &#10095;
        </button>
      )}

      <div className="reels-track" ref={trackRef}>
        {embeds.map((html, i) => (
          <div
            key={i}
            className="reel-slide"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="carousel-dots">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              className={`carousel-dot${i === activePage ? " active" : ""}`}
              onClick={() => goToPage(i)}
              aria-label={`Página ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
