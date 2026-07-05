export const LogoMark = ({ size = 20, stroke = 1.8 }: { size?: number; stroke?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden style={{ color: "#ffffff" }}>
    <rect x="3" y="3" width="18" height="18" rx="5.5" stroke="currentColor" strokeWidth={stroke} />
    <path d="M10 8.8l5.2 3.2L10 15.2V8.8z" fill="currentColor" />
  </svg>
);

export const DownloadIcon = ({ size = 15, color = "currentColor" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
    <path d="M12 3v12m0 0l-4.5-4.5M12 15l4.5-4.5M4 20h16" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PlayIcon = ({ size = 17, fill = "#A9822C" }: { size?: number; fill?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} aria-hidden style={{ marginLeft: 2 }}>
    <path d="M7 5.5l11 6.5-11 6.5v-13z" />
  </svg>
);

export const StarIcon = ({ size = 12, fill = "currentColor" }: { size?: number; fill?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} aria-hidden>
    <path d="M12 2l2.4 7.2H22l-6 4.6 2.3 7.2-6.3-4.5-6.3 4.5L8 13.8 2 9.2h7.6z" />
  </svg>
);

export const LinkIcon = ({ size = 17 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
    <path d="M10 14a5 5 0 007.5.5l2-2a5 5 0 00-7-7l-1.2 1.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M14 10a5 5 0 00-7.5-.5l-2 2a5 5 0 007 7l1.2-1.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);
