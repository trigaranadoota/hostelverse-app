
import getConfig from 'next/config';

export const getFirebaseConfig = () => {
    const { publicRuntimeConfig } = getConfig();
    return publicRuntimeConfig.firebaseConfig;
}
