import React from 'react';

interface SectionHeaderProps {
  kicker?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  dark?: boolean;
  action?: React.ReactNode;
}

export function SectionHeader({
  kicker,
  title,
  subtitle,
  align = 'left',
  dark = false,
  action,
}: SectionHeaderProps) {
  const alignmentClass = align === 'center' ? 'text-center mx-auto max-w-2xl' : 'max-w-2xl';

  return (
    <div
      className={`flex flex-col ${
        align === 'center' ? 'items-center' : 'md:flex-row md:items-end md:justify-between'
      } gap-6 mb-10 sm:mb-12`}
    >
      <div className={alignmentClass}>
        {kicker && (
          <p
            className={`text-xs font-semibold tracking-wider mb-2 ${
              dark ? 'text-[#60A5FA]' : 'text-[#2563EB]'
            }`}
          >
            {kicker}
          </p>
        )}
        <h2
          className={`font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight ${
            dark ? 'text-white' : 'text-[#0F172A]'
          }`}
        >
          {title}
        </h2>
        {subtitle && (
          <p
            className={`mt-3 text-base leading-relaxed ${
              dark ? 'text-slate-300' : 'text-[#64748B]'
            }`}
          >
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
