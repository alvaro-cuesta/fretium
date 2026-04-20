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
