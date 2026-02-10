'use client';

import { IKContext } from 'imagekitio-react';
import type { PropsWithChildren } from 'react';

interface ImageKitProviderProps extends PropsWithChildren {
    publicKey: string;
    urlEndpoint: string;
}

export function ImageKitProvider({ children, publicKey, urlEndpoint }: ImageKitProviderProps) {
  if (!publicKey || !urlEndpoint) {
    return <>{children}</>;
  }

  const authenticator = async () => {
    try {
      const response = await fetch('/api/imagekit/auth');

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Request failed with status ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      const { signature, expire, token } = data;
      return { signature, expire, token };
    } catch (error: any) {
      throw new Error(`Authentication request failed: ${error.message}`);
    }
  };

  return (
    <IKContext
      publicKey={publicKey}
      urlEndpoint={urlEndpoint}
      authenticator={authenticator}
    >
      {children}
    </IKContext>
  );
}
