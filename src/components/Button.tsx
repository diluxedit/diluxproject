import React from 'react';
import {Link} from 'react-router-dom';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'outlineLight' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    'bg-[#2563EB]/95 text-white hover:bg-[#1D4ED8] border border-white/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_10px_24px_-8px_rgba(37,99,235,0.55)] backdrop-blur-md',
  secondary:
    'bg-[#0B1428]/95 text-white hover:bg-[#142B4D] border border-white/15 shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_10px_22px_-10px_rgba(11,20,40,0.45)] backdrop-blur-md',
  outline:
    'bg-white/75 text-[#0F172A] border border-white/90 ring-1 ring-slate-900/5 hover:bg-white shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_4px_14px_-4px_rgba(15,23,42,0.08)] backdrop-blur-md',
  outlineLight:
    'bg-white/10 text-white border border-white/25 hover:border-white/45 hover:bg-white/18 shadow-[inset_0_1px_0_rgba(255,255,255,0.22)] backdrop-blur-md',
  ghost:
    'bg-transparent text-[#0F172A] hover:bg-white/60 border border-transparent',
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'px-3.5 py-2 text-xs',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-6 py-3 text-sm sm:text-base',
};

const BASE_CLASSES =
  'inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-200 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB] disabled:opacity-50 disabled:cursor-not-allowed';

interface CommonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: React.ReactNode;
}

type ButtonAsButton = CommonProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    to?: never;
    href?: never;
  };

type ButtonAsLink = CommonProps & {
  to: string;
  href?: never;
  onClick?: () => void;
};

type ButtonAsAnchor = CommonProps &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
    to?: never;
  };

export type ButtonProps = ButtonAsButton | ButtonAsLink | ButtonAsAnchor;

export function Button(props: ButtonProps) {
  const {variant = 'primary', size = 'md', className = '', children} = props;
  const classes = `${BASE_CLASSES} ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${className}`;

  if ('to' in props && props.to !== undefined) {
    return (
      <Link to={props.to} onClick={props.onClick} className={classes}>
        {children}
      </Link>
    );
  }

  if ('href' in props && props.href !== undefined) {
    const {variant: _v, size: _s, className: _c, children: _ch, href, ...anchorProps} = props;
    return (
      <a href={href} className={classes} {...anchorProps}>
        {children}
      </a>
    );
  }

  const {variant: _v, size: _s, className: _c, children: _ch, type = 'button', ...buttonProps} =
    props;
  return (
    <button type={type} className={classes} {...buttonProps}>
      {children}
    </button>
  );
}
