export type BannerConfig = {
  id: string;
  title: string;
  icon: "info" | "warning" | "success" | "bell";
  action?: {
    label: string;
    onClick: () => void;
  };
};

export type BannerConfigs = {
  [pathname: string]: BannerConfig;
};

export const bannerConfigs: BannerConfigs = {
  "/": {
    id: "notice",
    title: "Home SQL server in use; performance might be slow.",
    icon: "info",
    action: {
      label: "Learn More",
      onClick: () =>
        window.open(
          "https://raghu.app/writings/homelab",
          "_blank",
          "noopener,noreferrer"
        ),
    },
  },
  "/profile": {
    id: "sso-notice",
    title:
      "If you signed up with Google or another SSO provider, you cannot enable MFA or change your password through this interface.",
    icon: "warning",
    action: {
      label: "Learn More",
      onClick: () =>
        window.open(
          "https://www.okta.com/products/single-sign-on-workforce-identity/",
          "_blank",
          "noopener,noreferrer"
        ),
    },
  },
};

export const getBannerConfig = (pathname: string): BannerConfig | null => {
  if (bannerConfigs[pathname]) {
    return bannerConfigs[pathname];
  }

  for (const [pattern, config] of Object.entries(bannerConfigs)) {
    if (pattern.endsWith("*")) {
      const basePattern = pattern.slice(0, -1);
      if (pathname.startsWith(basePattern)) {
        return config;
      }
    }
  }

  return null;
};
