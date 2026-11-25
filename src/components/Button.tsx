import React from 'react';
import {Link} from 'react-router-dom';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'outlineLight' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    'bg-[#2563EB] text-white hover:bg-[#1D4ED8] border border-transparent shadow-sm',
  secondary:
    'bg-[#0B1428] text-white hover:bg-[#142B4D] border border-transparent',
  outline:
    'bg-white text-[#0F172A] border border-slate-200 hover:border-slate-300 hover:bg-[#F1F5F9]',
  outlineLight:
    'bg-transparent text-white border border-white/25 hover:border-white/50 hover:bg-white/10',
  ghost:
    'bg-transparent text-[#0F172A] hover:bg-[#F1F5F9] border border-transparent',
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'px-3.5 py-2 text-xs',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-6 py-3 text-sm sm:text-base',
};

const BASE_CLASSES =
  'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB] disabled:opacity-50 disabled:cursor-not-allowed';

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
