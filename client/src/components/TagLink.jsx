// Reusable clickable tag/badge with internal/external link and WhatsApp support
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { buildWhatsAppUrl } from '../utils/phoneUtils';

function isExternal(href) {
  return /^https?:\/\//i.test(href);
}

const WhatsAppIcon = (props) => (
  <svg className={props.className || 'h-3.5 w-3.5'} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20.52 3.48A11.86 11.86 0 0 0 12.06 0C5.46 0 .12 5.34.12 11.94c0 2.1.54 4.14 1.56 5.94L0 24l6.3-1.62c1.74.96 3.72 1.46 5.76 1.46h.01c6.6 0 11.94-5.34 11.94-11.94 0-3.18-1.26-6.18-3.49-8.42ZM12.06 22.02h-.01c-1.86 0-3.66-.48-5.25-1.38l-.38-.21-3.75.96 1-3.66-.25-.39a10.03 10.03 0 0 1-1.56-5.4c0-5.52 4.5-10.02 10.06-10.02 2.68 0 5.2 1.05 7.1 2.94a9.95 9.95 0 0 1 2.96 7.08c0 5.52-4.5 10.02-10.02 10.02Zm5.77-7.49c-.32-.16-1.86-.92-2.15-1.03-.29-.11-.5-.16-.72.16-.21.32-.82 1.03-1.01 1.25-.19.22-.37.25-.69.09-.32-.16-1.34-.49-2.55-1.57-.94-.84-1.57-1.87-1.75-2.19-.18-.32-.02-.5.14-.66.14-.14.32-.37.48-.56.16-.19.21-.32.32-.53.11-.21.05-.4-.02-.56-.07-.16-.72-1.74-.99-2.39-.26-.63-.52-.55-.72-.56-.19-.01-.4-.01-.62-.01-.21 0-.56.08-.86.4-.29.32-1.13 1.11-1.13 2.71 0 1.6 1.16 3.14 1.32 3.35.16.21 2.27 3.47 5.5 4.86.77.33 1.37.53 1.84.68.77.24 1.48.21 2.03.13.62-.09 1.86-.76 2.12-1.49.26-.73.26-1.36.18-1.49-.08-.13-.29-.21-.6-.37Z"/>
  </svg>
);

// TagLink component
// Props:
// - type: 'whatsapp' | 'link'
// - value: phone (whatsapp) or path/url (link)
// - label: visible text
// - message: optional WA message
// - defaultCountryCode: default phone country code for WA
// - className/title/showIcon/icon/stopPropagation: styling and behavior
export default function TagLink({
  type = 'link',
  value,
  label,
  message,
  defaultCountryCode = '54',
  className = 'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium',
  title,
  showIcon = true,
  stopPropagation = true,
  icon,
}) {
  const navigate = useNavigate();

  const onClick = (e) => {
    if (stopPropagation) e.stopPropagation?.();

    if (type === 'whatsapp') {
      const url = buildWhatsAppUrl(value, { message, defaultCountryCode });
      if (!url) return;
      window.open(url, '_blank', 'noopener,noreferrer');
      return;
    }

    const href = String(value || '');
    if (!href) return;

    if (isExternal(href)) {
      window.open(href, '_blank', 'noopener,noreferrer');
    } else {
      try {
        navigate(href);
      } catch {
        window.location.href = href;
      }
    }
  };

  const styleClasses =
    type === 'whatsapp'
      ? 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200'
      : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200';

  const Icon = icon || (type === 'whatsapp' ? WhatsAppIcon : null);

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${className} ${styleClasses}`}
      title={title || (type === 'whatsapp' ? 'Contactar por WhatsApp' : 'Abrir enlace')}
    >
      {showIcon && Icon ? <Icon /> : null}
      <span className="tag-truncate">{label ?? String(value ?? '')}</span>
    </button>
  );
}
