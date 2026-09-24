"use client";
import * as React from "react";
import {Slot} from "@radix-ui/react-slot";
import {cva,type VariantProps} from "class-variance-authority";
import {cn} from "@/lib/utils";
import {useI18n} from "@/providers/i18n-provider";
const variants=cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50 disabled:pointer-events-none min-h-10 px-4 py-2",{variants:{variant:{default:"bg-primary text-primary-foreground hover:opacity-90",outline:"border border-border bg-card hover:bg-muted",ghost:"hover:bg-muted",destructive:"bg-destructive text-white"}},defaultVariants:{variant:"default"}});
export function Button({className,variant,asChild=false,children,...props}:React.ComponentProps<"button">&VariantProps<typeof variants>&{asChild?:boolean}){const{t}=useI18n();const Comp=asChild?Slot:"button";return <Comp className={cn(variants({variant}),className)} {...props}>{typeof children==="string"?t(children):children}</Comp>;}
