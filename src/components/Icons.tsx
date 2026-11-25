import {
  AppWindow,
  Code2,
  Compass,
  Cpu,
  Globe,
  Headphones,
  Layout,
  Network,
  Palette,
  PenTool,
  Router,
  Server,
  Sparkles,
  Terminal,
} from 'lucide-react';
import type {DivisionIconName, ServiceIconName} from '../types';

export function DivisionIcon({
  name,
  className = 'w-5 h-5',
}: {
  name: DivisionIconName;
  className?: string;
}) {
  switch (name) {
    case 'Code2':
      return <Code2 className={className} aria-hidden="true" />;
    case 'Server':
      return <Server className={className} aria-hidden="true" />;
    case 'Palette':
      return <Palette className={className} aria-hidden="true" />;
    case 'Compass':
      return <Compass className={className} aria-hidden="true" />;
  }
}

export function ServiceIcon({
  name,
  className = 'w-5 h-5',
}: {
  name: ServiceIconName;
  className?: string;
}) {
  switch (name) {
    case 'Globe':
      return <Globe className={className} aria-hidden="true" />;
    case 'AppWindow':
      return <AppWindow className={className} aria-hidden="true" />;
    case 'Terminal':
      return <Terminal className={className} aria-hidden="true" />;
    case 'Network':
      return <Network className={className} aria-hidden="true" />;
    case 'Router':
      return <Router className={className} aria-hidden="true" />;
    case 'Headphones':
      return <Headphones className={className} aria-hidden="true" />;
    case 'Cpu':
      return <Cpu className={className} aria-hidden="true" />;
    case 'Layout':
      return <Layout className={className} aria-hidden="true" />;
    case 'PenTool':
      return <PenTool className={className} aria-hidden="true" />;
    case 'Sparkles':
      return <Sparkles className={className} aria-hidden="true" />;
  }
}
