'use client'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter';
import { ReactNode } from 'react';

type Props = {
    children : ReactNode
}

export default function MuiProvider({children}:Props){
    return (
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
            {children}
        </AppRouterCacheProvider>
    )
}