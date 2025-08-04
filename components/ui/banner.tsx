'use client';

import { useControllableState } from '@radix-ui/react-use-controllable-state';
import {
  type ComponentProps,
  createContext,
  type HTMLAttributes,
  type MouseEventHandler,
  useContext,
} from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { XIcon } from '@/components/ui/icons/x';

type BannerContextProps = {
  show: boolean;
  setShow: (show: boolean) => void;
};

export const BannerContext = createContext<BannerContextProps>({
  show: true,
  setShow: () => {},
});

export type BannerProps = HTMLAttributes<HTMLDivElement> & {
  visible?: boolean;
  defaultVisible?: boolean;
  onClose?: () => void;
  inset?: boolean;
};

export const Banner = ({
  children,
  visible,
  defaultVisible = true,
  onClose,
  className,
  inset = false,
  ...props
}: BannerProps) => {
  const [show, setShow] = useControllableState({
    defaultProp: defaultVisible,
    prop: visible,
    onChange: onClose,
  });

  if (!show) {
    return null;
  }

  return (
    <BannerContext.Provider value={{ show, setShow }}>
      <div
        className={cn(
          'relative flex w-full items-center justify-between gap-2 px-4 sm:px-6 lg:px-8 py-1.5 text-white overflow-hidden',
          // Main background layer
          'bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950',
          inset && 'rounded-lg',
          className
        )}
        {...props}
      >
        {/* Bottom shadow layer */}
        <div className="absolute inset-0 bg-black/20 blur-sm" />
        
        {/* Middle texture layer */}
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.03)_25%,rgba(255,255,255,0.03)_50%,transparent_50%,transparent_75%,rgba(255,255,255,0.03)_75%)] bg-[length:12px_12px]" />
        
        {/* Spotlight layer */}
        <div className="absolute left-0 top-0 h-full w-2/5 bg-gradient-to-r from-blue-400/25 via-blue-300/15 to-transparent blur-[2px]" />
        
        {/* Top highlight layer */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        
        {/* Side accent layers */}
        <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-blue-400/40 via-transparent to-blue-400/40" />
        <div className="absolute right-0 top-0 h-full w-px bg-gradient-to-b from-slate-600/40 via-transparent to-slate-600/40" />
        
        {/* Floating particles layer */}
        <div className="absolute inset-0">
          <div className="absolute left-[20%] top-[30%] h-1 w-1 rounded-full bg-blue-300/30 blur-[0.5px]" />
          <div className="absolute left-[60%] top-[70%] h-0.5 w-0.5 rounded-full bg-white/20 blur-[0.5px]" />
          <div className="absolute left-[80%] top-[20%] h-1.5 w-1.5 rounded-full bg-blue-200/20 blur-[1px]" />
        </div>
        
        {/* Content layer */}
        <div className="relative z-10 flex w-full items-center justify-between gap-2">
          {children}
        </div>
      </div>
    </BannerContext.Provider>
  );
};

export type BannerIconProps = HTMLAttributes<HTMLDivElement> & {
  icon: React.ComponentType<{ size?: number; className?: string }>;
};

export const BannerIcon = ({
  icon: Icon,
  className,
  ...props
}: BannerIconProps) => (
  <div
    className={cn(
      'relative rounded-full border border-background/20 bg-background/10 p-1 shadow-sm backdrop-blur-sm',
      // Add subtle layered depth to icon
      'before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-t before:from-black/10 before:to-white/5',
      className
    )}
    {...props}
  >
    <Icon size={16} className="relative z-10" />
  </div>
);

export type BannerTitleProps = HTMLAttributes<HTMLParagraphElement>;

export const BannerTitle = ({ className, ...props }: BannerTitleProps) => (
  <p 
    className={cn(
      'relative flex-1 text-xs',
      // Add subtle text shadow for depth
      'drop-shadow-sm',
      className
    )} 
    {...props} 
  />
);

export type BannerActionProps = ComponentProps<typeof Button>;

export const BannerAction = ({
  variant = 'outline',
  size = 'sm',
  className,
  ...props
}: BannerActionProps) => (
  <Button
    className={cn(
      'relative shrink-0 bg-transparent hover:bg-background/10 hover:text-background text-xs backdrop-blur-sm',
      // Add layered button depth
      'before:absolute before:inset-0 before:rounded-md before:bg-gradient-to-t before:from-black/10 before:to-white/5 before:opacity-0 hover:before:opacity-100 before:transition-opacity',
      className
    )}
    size={size}
    variant={variant}
    {...props}
  />
);

export type BannerCloseProps = ComponentProps<typeof Button>;

export const BannerClose = ({
  variant = 'ghost',
  size = 'icon',
  onClick,
  className,
  ...props
}: BannerCloseProps) => {
  const { setShow } = useContext(BannerContext);

  const handleClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    setShow(false);
    onClick?.(e);
  };

  return (
    <Button
      className={cn(
        'relative shrink-0 bg-transparent hover:bg-background/10 hover:text-background backdrop-blur-sm',
        // Add layered close button depth
        'before:absolute before:inset-0 before:rounded-md before:bg-gradient-to-t before:from-black/10 before:to-white/5 before:opacity-0 hover:before:opacity-100 before:transition-opacity',
        className
      )}
      onClick={handleClick}
      size={size}
      variant={variant}
      {...props}
    >
      <XIcon size={18} className="relative z-10" />
    </Button>
  );
};