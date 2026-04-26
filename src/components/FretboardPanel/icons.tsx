type IconProps = {
  className?: string;
  'aria-hidden'?: boolean | 'true' | 'false';
};

const COMMON_PROPS = {
  width: '1em',
  height: '1em',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const;

export function ArrowUpIcon(props: IconProps) {
  return (
    <svg
      {...COMMON_PROPS}
      className={props.className}
      aria-hidden={props['aria-hidden'] ?? true}
    >
      <path d="M12 19V5" />
      <path d="m6 11 6-6 6 6" />
    </svg>
  );
}

export function ArrowDownIcon(props: IconProps) {
  return (
    <svg
      {...COMMON_PROPS}
      className={props.className}
      aria-hidden={props['aria-hidden'] ?? true}
    >
      <path d="M12 5v14" />
      <path d="m6 13 6 6 6-6" />
    </svg>
  );
}

export function TrashIcon(props: IconProps) {
  return (
    <svg
      {...COMMON_PROPS}
      className={props.className}
      aria-hidden={props['aria-hidden'] ?? true}
    >
      <path d="M3 6h18" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
    </svg>
  );
}

export function SaveIcon(props: IconProps) {
  return (
    <svg
      {...COMMON_PROPS}
      className={props.className}
      aria-hidden={props['aria-hidden'] ?? true}
    >
      <path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
      <path d="M17 21v-7H7v7" />
      <path d="M7 3v4h7" />
    </svg>
  );
}

export function XIcon(props: IconProps) {
  return (
    <svg
      {...COMMON_PROPS}
      className={props.className}
      aria-hidden={props['aria-hidden'] ?? true}
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

export function PrinterIcon(props: IconProps) {
  return (
    <svg
      {...COMMON_PROPS}
      className={props.className}
      aria-hidden={props['aria-hidden'] ?? true}
    >
      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
      <path d="M6 9V3h12v6" />
      <rect
        x="6"
        y="14"
        width="12"
        height="8"
        rx="1"
      />
    </svg>
  );
}

export function ExternalLinkIcon(props: IconProps) {
  return (
    <svg
      {...COMMON_PROPS}
      className={props.className}
      aria-hidden={props['aria-hidden'] ?? true}
    >
      <path d="M15 3h6v6" />
      <path d="M10 14 21 3" />
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    </svg>
  );
}

export function DownloadIcon(props: IconProps) {
  return (
    <svg
      {...COMMON_PROPS}
      className={props.className}
      aria-hidden={props['aria-hidden'] ?? true}
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <path d="m7 10 5 5 5-5" />
      <path d="M12 15V3" />
    </svg>
  );
}

// Apple devices use a box-with-upward-arrow share icon; everyone else uses
// the nodes-connected-by-lines variant.
const IS_APPLE =
  typeof navigator !== 'undefined' &&
  /Mac|iPhone|iPad|iPod/i.test(navigator.userAgent);

export function ShareIcon(props: IconProps) {
  return IS_APPLE ? (
    <svg
      {...COMMON_PROPS}
      className={props.className}
      aria-hidden={props['aria-hidden'] ?? true}
    >
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <path d="m16 6-4-4-4 4" />
      <path d="M12 2v13" />
    </svg>
  ) : (
    <svg
      {...COMMON_PROPS}
      className={props.className}
      aria-hidden={props['aria-hidden'] ?? true}
    >
      <circle
        cx="18"
        cy="5"
        r="3"
      />
      <circle
        cx="6"
        cy="12"
        r="3"
      />
      <circle
        cx="18"
        cy="19"
        r="3"
      />
      <path d="m8.59 13.51 6.83 3.98" />
      <path d="m8.59 10.49 6.83-3.98" />
    </svg>
  );
}

export function ClipboardIcon(props: IconProps) {
  return (
    <svg
      {...COMMON_PROPS}
      className={props.className}
      aria-hidden={props['aria-hidden'] ?? true}
    >
      <rect
        x="8"
        y="2"
        width="8"
        height="4"
        rx="1"
        ry="1"
      />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    </svg>
  );
}

export function PlusIcon(props: IconProps) {
  return (
    <svg
      {...COMMON_PROPS}
      className={props.className}
      aria-hidden={props['aria-hidden'] ?? true}
    >
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );
}
