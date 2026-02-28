import { createContext, useState, useContext, useEffect } from 'react';

const SucursalContext = createContext();

export const SucursalProvider = ({ children }) => {
    const [sucursalSeleccionada, setSucursalSeleccionada] = useState(() => {
        const saved = localStorage.getItem('sucursal_id');
        return saved ? JSON.parse(saved) : null;
    });

    useEffect(() => {
        if (sucursalSeleccionada) {
            localStorage.setItem('sucursal_id', JSON.stringify(sucursalSeleccionada));
        } else {
            localStorage.removeItem('sucursal_id');
        }
    }, [sucursalSeleccionada]);

    return (
        <SucursalContext.Provider value={{ sucursalSeleccionada, setSucursalSeleccionada }}>
            {children}
        </SucursalContext.Provider>
    );
};

export const useSucursal = () => {
    const context = useContext(SucursalContext);
    if (!context) {
        throw new Error('useSucursal debe usarsse dentro de un SucursalProvider');
    }
    return context;
};
