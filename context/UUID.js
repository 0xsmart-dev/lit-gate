import { v4 as uuid } from 'uuid';
import { createContext, useState } from 'react';

const UUIDContext = createContext();

export const UUIDProvider = ({ children }) => {
    const [uuidCurrent, setUuidCurrent] = useState(uuid());
    const setUuid = () => setUuidCurrent(uuid());

    return (
        <UUIDContext.Provider value={[uuidCurrent, setUuid]}>
            {children}
        </UUIDContext.Provider>
    );
};

export default UUIDContext