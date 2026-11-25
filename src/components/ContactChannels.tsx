import {ArrowUpRight, Mail, MessageCircle, Share2} from 'lucide-react';
import {useLanguage} from '../context/LanguageContext';
import {OFFICIAL_CONTACT} from '../data/contact';

export function ContactChannels({compact = false}: {compact?: boolean}) {
  const {t} = useLanguage();

  const channels = [
    {
      id: 'whatsapp',
      title: t.contact.whatsappTitle,
      value: OFFICIAL_CONTACT.whatsappDisplay,
      action: t.contact.whatsappAction,
      href: OFFICIAL_CONTACT.whatsappUrl,
      icon: MessageCircle,
      external: true,
    },
    {
      id: 'email',
      title: t.contact.emailTitle,
      value: OFFICIAL_CONTACT.email,
      action: t.contact.emailAction,
      href: OFFICIAL_CONTACT.emailUrl,
      icon: Mail,
      external: false,
    },
    {
      id: 'tiktok',
      title: t.contact.tiktokTitle,
      value: OFFICIAL_CONTACT.tiktokHandle,
      action: t.contact.tiktokAction,
      href: OFFICIAL_CONTACT.tiktokUrl,
      icon: Share2,
      external: true,
    },
  ];

  return (
    <div
      className={`grid grid-cols-1 ${
        compact ? 'md:grid-cols-3' : 'sm:grid-cols-3 lg:grid-cols-1'
      } gap-4`}
    >
      {channels.map((channel) => {
        const Icon = channel.icon;
        return (
          <a
            key={channel.id}
            href={channel.href}
            target={channel.external ? '_blank' : undefined}
            rel={channel.external ? 'noopener noreferrer' : undefined}
            className="group bg-white border border-slate-200 rounded-xl p-5 flex items-start justify-between gap-4 transition-colors duration-150 hover:border-[#2563EB] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB]"
          >
            <div className="flex items-start gap-4 min-w-0">
              <div className="w-10 h-10 rounded-lg bg-[#0B1428] text-[#60A5FA] flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-[#64748B]">{channel.title}</p>
                <p className="mt-1 font-display text-base font-bold text-[#0F172A] truncate">
                  {channel.value}
                </p>
                <p className="mt-2 text-xs font-semibold text-[#2563EB] group-hover:text-[#1D4ED8]">
                  {channel.action}
                </p>
              </div>
            </div>
            <ArrowUpRight
              className="w-4 h-4 text-[#64748B] group-hover:text-[#2563EB] transition-colors shrink-0 mt-1"
              aria-hidden="true"
            />
          </a>
        );
      })}
    </div>
  );
}
