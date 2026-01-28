import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {ConfigProvider, App as AntApp, theme} from 'antd';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5,
            retry: 1,
        },
    },
});

export const AppProviders = ({ children }: { children: React.ReactNode }) => {
    return (
        <QueryClientProvider client={queryClient}>
            <ConfigProvider
                theme={{
                    algorithm: theme.darkAlgorithm,
                    token: {
                        colorPrimary: '#d4af37',
                        borderRadius: 0,
                        fontFamily: 'system-ui, -apple-system, sans-serif',
                    },
                    components: {
                        Layout: {
                            headerBg: '#000000',
                        },
                        Tabs: {
                            itemColor: '#888888',
                            itemSelectedColor: '#d4af37',
                            itemHoverColor: '#ffffff',
                            inkBarColor: '#d4af37',
                            titleFontSize: 16
                        }
                    }
                }}
            >
                <AntApp>
                    {children}
                </AntApp>
            </ConfigProvider>
        </QueryClientProvider>
    );
};