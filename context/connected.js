import { createContext, useState } from 'react';

const ConnectToLit = createContext();

export const ConnectProvider = ({ children }) => {
    const [connected, setConnected] = useState(false);
    const setConnect = () => setConnected(!connected);

    return (
        <ConnectToLit.Provider value={[connected, setConnect]}>
            {children}
        </ConnectToLit.Provider>
    );
};

export default ConnectToLit;