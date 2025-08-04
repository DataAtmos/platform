'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Banner, BannerAction, BannerClose, BannerIcon, BannerTitle } from '@/components/ui/banner';
import { BellIcon } from '@/components/ui/icons/bell';
import { CircleHelpIcon } from '@/components/ui/icons/circle-help';
import { BadgeAlertIcon } from '@/components/ui/icons/badge-alert';
import { CheckIcon } from '@/components/ui/icons/check';
import { getBannerConfig, type BannerConfig } from '@/lib/configs/banner-config';

type BannerProviderProps = {
  children: React.ReactNode;
};

type BannerContextType = {
  dismissBanner: (bannerId: string) => void;
  isBannerDismissed: (bannerId: string) => boolean;
};

const BannerContext = createContext<BannerContextType | undefined>(undefined);

const BANNER_STORAGE_KEY = 'dismissed-banners';

const getIconComponent = (icon: BannerConfig['icon']) => {
  switch (icon) {
    case 'info':
      return CircleHelpIcon;
    case 'warning':
      return BadgeAlertIcon;
    case 'success':
      return CheckIcon;
    case 'bell':
      return BellIcon;
    default:
      return CircleHelpIcon;
  }
};

export const BannerProvider = ({ children }: BannerProviderProps) => {
  const pathname = usePathname();
  const [dismissedBanners, setDismissedBanners] = useState<Set<string>>(new Set());
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const stored = localStorage.getItem(BANNER_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setDismissedBanners(new Set(parsed));
      } catch (error) {
        console.error('Failed to parse dismissed banners from localStorage:', error);
      }
    }
  }, []);

  const dismissBanner = (bannerId: string) => {
    const newDismissed = new Set(dismissedBanners).add(bannerId);
    setDismissedBanners(newDismissed);
    if (isClient) {
      localStorage.setItem(BANNER_STORAGE_KEY, JSON.stringify([...newDismissed]));
    }
  };

  const isBannerDismissed = (bannerId: string) => {
    return dismissedBanners.has(bannerId);
  };

  const bannerConfig = getBannerConfig(pathname);
  const shouldShowBanner = bannerConfig && !isBannerDismissed(bannerConfig.id);

  if (!isClient) {
    return <>{children}</>;
  }

  return (
    <BannerContext.Provider value={{ dismissBanner, isBannerDismissed }}>
      {shouldShowBanner && (
        <Banner
          className="sticky top-0 z-50 backdrop-blur-sm"
          onClose={() => dismissBanner(bannerConfig.id)}
        >
          <div className="flex items-center gap-2 flex-1">
            <BannerIcon icon={getIconComponent(bannerConfig.icon)} />
            <BannerTitle>{bannerConfig.title}</BannerTitle>
          </div>
          {bannerConfig.action && (
            <BannerAction onClick={bannerConfig.action.onClick}>
              {bannerConfig.action.label}
            </BannerAction>
          )}
          <BannerClose />
        </Banner>
      )}
      {children}
    </BannerContext.Provider>
  );
};

export const useBanner = () => {
  const context = useContext(BannerContext);
  if (context === undefined) {
    throw new Error('useBanner must be used within a BannerProvider');
  }
  return context;
};