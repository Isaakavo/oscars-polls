import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider, App as AntApp } from 'antd';

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
                    token: {
                        colorPrimary: '#d4af37', // Gold Oscar
                        borderRadius: 6,
                        fontFamily: 'system-ui, -apple-system, sans-serif',
                    },
                    components: {
                        Layout: {
                            headerBg: '#000000', // Header negro elegante
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