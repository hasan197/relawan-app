"use client";

import { Toaster as Sonner, ToasterProps } from "sonner@2.0.3";

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      position="top-center"
      toastOptions={{
        style: {
          backgroundColor: 'white',
          color: '#1f2937',
          border: '1px solid #e5e7eb',
          borderRadius: '0.5rem',
          padding: '1rem',
          fontSize: '0.875rem',
          lineHeight: '1.25rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          zIndex: 9999,
        },
        success: {
          style: {
            backgroundColor: '#ecfdf5',
            color: '#065f46',
            border: '1px solid #a7f3d0',
          },
          iconTheme: {
            primary: '#10b981',
            secondary: 'white',
          },
        },
        error: {
          style: {
            backgroundColor: '#fef2f2',
            color: '#991b1b',
            border: '1px solid #fecaca',
          },
          iconTheme: {
            primary: '#ef4444',
            secondary: 'white',
          },
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
