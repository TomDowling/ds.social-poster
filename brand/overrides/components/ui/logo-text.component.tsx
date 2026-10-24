import React from 'react';

// Digital Space Social Poster: replaces Postiz's logo + wordmark (ds.social-poster/brand).
export const LogoTextComponent = () => {
  return (
    <div className="flex items-center gap-[12px]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/ds-logo.png"
        width={40}
        height={40}
        alt=""
        className="rounded-[8px]"
      />
      <div className="text-[20px] font-[600] leading-tight text-white">
        Digital Space Social Poster
      </div>
    </div>
  );
};
