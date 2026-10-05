// Lightweight vector illustrations; labels are rendered as translated HTML.
const rays='<path d="M32 4v5M32 55v5M4 32h5M55 32h5M12 12l4 4M48 48l4 4M12 52l4-4M48 16l4-4"/>';
const drawings=[
 '<path d="M7 32s9-15 25-15 25 15 25 15-9 15-25 15S7 32 7 32Z"/><circle cx="32" cy="32" r="9" fill="currentColor"/><circle cx="34" cy="29" r="2.5" fill="white" stroke="none"/><path d="M32 5v5M32 54v5M12 12l4 4M48 48l4 4M12 52l4-4M48 16l4-4"/>',
 '<circle cx="39" cy="11" r="6" fill="currentColor" stroke="none"/><path d="m26 25 10-5 9 11 9-7M29 25l-9 1-7 9M35 23l-7 17 12 8v11M29 38l-10 13-11 2" stroke-width="8"/>',
 '<path d="M32 15c-5-9-17-6-18 3-9 1-12 12-6 18-5 8 1 17 9 17 3 8 15 5 15-1V15Zm0 0c5-9 17-6 18 3 9 1 12 12 6 18 5 8-1 17-9 17-3 8-15 5-15-1V15Z"/><path d="M17 24h5M14 37c7 2 10-2 10-5M19 47h5M47 24h-5M50 37c-7 2-10-2-10-5M45 47h-5M32 2v4M5 14l4 3M59 14l-4 3M5 58l4-3M59 58l-4-3"/>',
 '<path d="M32 51 13 33C-4 16 18 5 32 22 46 5 68 16 51 33L32 51Z"/>'+rays
];
export const valueIcon=index=>`<svg viewBox="0 0 64 64" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">${drawings[index]}</svg>`;
