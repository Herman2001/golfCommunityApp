/**
 * Gör om ett datum från APIet till en kort text
 * t.ex: "10 min sedan" eller "3 okt "
 */

export function formatRelativeDate(isoString) {
  const date = new Date(isoString);
  const minutes = Math.floor((Date.now() - date.getTime()) / 60000);

  if (minutes < 1) {
    return 'nyss';
  }
  if (minutes < 60) {
    return `${minutes} min sedan`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours} h sedan`;
  }

  const days = Math.floor(hours / 24);
  if (days < 7) {
    return days === 1 ? '1 dag sedan' : `${days} dagar sedan`;
  }

  return date.toLocaleDateString('sv-SE', { day: 'numeric', month: 'short' });
}

/**
 * Gör om ett pris till svenskt format, t.ex. 2500 → "2 500 kr".
 */
export function formatPrice(price) {
  return `${price.toLocaleString('sv-SE')} kr`;
}