import React, { PropsWithChildren } from 'react';
import { LinkProps } from 'react-router-dom';
export declare const LinkWithPrefetch: React.ForwardRefExoticComponent<Omit<PropsWithChildren<{
    prefetch?: boolean | 'intent' | 'render' | 'viewport' | 'none';
    prefetchTimeout?: number;
} & LinkProps & React.RefAttributes<HTMLAnchorElement>>, "ref"> & React.RefAttributes<unknown>>;
