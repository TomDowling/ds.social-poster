'use client';

// Digital Space Social Poster: replaces Postiz's sidebar logo (ds.social-poster/brand).
export const Logo = () => {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/ds-logo.png"
      width={60}
      height={60}
      alt="Digital Space Social Poster"
      className="mt-[8px] min-w-[60px] min-h-[60px] rounded-[12px]"
    />
  );
};
