"use client";

// AlignUI FancyButton v1.2 (https://alignui.com/docs/v1.2/ui/fancy-button), as shipped.
// Local changes, all invisible at rest:
// - AlignUI theme tokens are mapped to this project's tokens; the shadow tokens live in
//   globals.css with their source values (tinted shadow ink neutralized to #141414).
// - A :focus-visible ring replaces `focus:outline-none`, so keyboard users see focus
//   (outline-solid is needed: in Tailwind v4, outline-none zeroes the style outline-2 reads).

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";

import { PolymorphicComponentProps } from "@/lib/polymorphic";
import { recursiveCloneChildren } from "@/lib/recursive-clone-children";
import { tv, type VariantProps } from "@/lib/tv";

const FANCY_BUTTON_ROOT_NAME = "FancyButtonRoot";
const FANCY_BUTTON_ICON_NAME = "FancyButtonIcon";

export const fancyButtonVariants = tv({
  slots: {
    root: [
      // base (text-label-sm: 14px / 20px, 500, -0.006em)
      "group relative inline-flex items-center justify-center whitespace-nowrap text-sm font-medium leading-5 tracking-[-0.006em] outline-none",
      "transition duration-200 ease-out",
      // focus
      "focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-[var(--foreground)]",
      // disabled
      "disabled:pointer-events-none disabled:text-muted-foreground",
      "disabled:bg-muted disabled:bg-none disabled:shadow-none disabled:before:hidden disabled:after:hidden",
    ],
    icon: "relative z-10 size-5 shrink-0",
  },
  variants: {
    variant: {
      neutral: {
        root: "bg-foreground text-background shadow-[var(--shadow-fancy-buttons-neutral)]",
      },
      primary: {
        root: "bg-[var(--fancy-orange)] text-white shadow-[var(--shadow-fancy-buttons-primary)]",
      },
      destructive: {
        root: "bg-destructive text-white shadow-[var(--shadow-fancy-buttons-error)]",
      },
      basic: {
        root: [
          // base
          "bg-background text-muted-foreground shadow-[var(--shadow-fancy-buttons-stroke)]",
          // hover
          "hover:bg-muted hover:text-foreground hover:shadow-none",
        ],
      },
    },
    size: {
      medium: {
        root: "h-10 gap-3 rounded-[10px] px-3.5",
        icon: "-mx-1",
      },
      small: {
        root: "h-9 gap-3 rounded-lg px-3",
        icon: "-mx-1",
      },
      xsmall: {
        root: "h-8 gap-3 rounded-lg px-2.5",
        icon: "-mx-1",
      },
    },
  },
  compoundVariants: [
    {
      variant: ["neutral", "primary", "destructive"],
      class: {
        root: [
          // before
          "before:pointer-events-none before:absolute before:inset-0 before:z-10 before:rounded-[inherit]",
          "before:bg-gradient-to-b before:p-px",
          "before:from-white/[.12] before:to-transparent",
          // before mask
          "before:[mask-clip:content-box,border-box] before:[mask-composite:exclude] before:[mask-image:linear-gradient(#fff_0_0),linear-gradient(#fff_0_0)]",
          // after
          "after:absolute after:inset-0 after:rounded-[inherit] after:bg-gradient-to-b after:from-white after:to-transparent",
          "after:pointer-events-none after:opacity-[.16] after:transition after:duration-200 after:ease-out",
          // hover
          "hover:after:opacity-[.24]",
        ],
      },
    },
  ],
  defaultVariants: {
    variant: "neutral",
    size: "medium",
  },
});

type FancyButtonSharedProps = VariantProps<typeof fancyButtonVariants>;

type FancyButtonProps = VariantProps<typeof fancyButtonVariants> &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    asChild?: boolean;
  };

const FancyButtonRoot = React.forwardRef<HTMLButtonElement, FancyButtonProps>(
  ({ asChild, children, variant, size, className, ...rest }, forwardedRef) => {
    const uniqueId = React.useId();
    const Component = asChild ? Slot : "button";
    const { root } = fancyButtonVariants({ variant, size });

    const sharedProps: FancyButtonSharedProps = {
      variant,
      size,
    };

    const extendedChildren = recursiveCloneChildren(
      children as React.ReactElement[],
      sharedProps,
      [FANCY_BUTTON_ICON_NAME],
      uniqueId,
      asChild
    );

    return (
      <Component ref={forwardedRef} className={root({ class: className })} {...rest}>
        {extendedChildren}
      </Component>
    );
  }
);
FancyButtonRoot.displayName = FANCY_BUTTON_ROOT_NAME;

function FancyButtonIcon<T extends React.ElementType>({
  className,
  variant,
  size,
  as,
  ...rest
}: PolymorphicComponentProps<T, FancyButtonSharedProps>) {
  const Component = as || "div";
  const { icon } = fancyButtonVariants({ variant, size });

  return <Component className={icon({ class: className })} {...rest} />;
}
FancyButtonIcon.displayName = FANCY_BUTTON_ICON_NAME;

export { FancyButtonRoot as Root, FancyButtonIcon as Icon };
