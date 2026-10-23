// Decorative, original illustrations — not photographs or likenesses of reviewers.
export function reviewAvatar(index){
 const hair=[
  '<path d="M17 30V23c0-19 30-19 30 0v7l-6-10c-7 6-15 3-18 1z"/>',
  '<path d="M16 32V23c0-18 32-18 32 0v9l-7-10-6-6c-3 7-9 10-14 9z"/>',
  '<path d="M16 32V22c0-18 32-18 32 0v10l-5-9c-9 2-17-1-22-4z"/>',
  '<path d="M17 34V22c0-17 30-17 30 0v12l-6-12c-4 0-7-3-9-7-3 7-8 10-12 10z"/>'
 ][index%4];
 const shirt=['var(--red)','var(--ink)','var(--muted)','var(--red)'][index%4];
 return `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><circle cx="32" cy="32" r="32" fill="${index%2?'var(--warm)':'var(--blue)'}"/><path d="M8 64c0-17 11-23 24-23s24 6 24 23" fill="${shirt}"/><path d="M26 39h12v9c-3 5-9 5-12 0z" fill="#e6ae8c"/><ellipse cx="32" cy="29" rx="13" ry="16" fill="#f3c6a5"/><g fill="var(--ink)">${hair}</g><g fill="var(--ink)"><circle cx="27" cy="30" r="1.2"/><circle cx="37" cy="30" r="1.2"/></g><path d="M28 37q4 4 8 0" fill="none" stroke="var(--ink)" stroke-width="1.4" stroke-linecap="round"/></svg>`;
}
