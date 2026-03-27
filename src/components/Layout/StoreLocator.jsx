import React, { useState, useEffect } from 'react';
import api from '../../api';
import { useSucursal } from '../../contexts/SucursalContext';

const StoreLocator = ({ isOpen, onClose }) => {
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const { setSucursalSeleccionada } = useSucursal();

    useEffect(() => {
        if (isOpen) {
            fetchStores();
        }
    }, [isOpen]);

    const fetchStores = async () => {
        try {
            setLoading(true);
            const res = await api.get('/sucursales/');
            setStores(res.data);
        } catch (error) {
            console.error("Error fetching stores:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectStore = (store) => {
        setSucursalSeleccionada(store);
        onClose();
    };

    const filteredStores = stores.filter(s =>
        s.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.direccion.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            ></div>

            {/* Modal Container */}
            <div className="relative bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] animate-in fade-in zoom-in duration-300">

                {/* Close Button Mob */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 md:hidden bg-gray-100 p-2 rounded-full z-10"
                >
                    ✕
                </button>

                {/* Left Panel: Promo/Search */}
                <div className="w-full md:w-2/5 p-8 md:p-12 bg-gray-50 flex flex-col justify-center border-r border-gray-100">
                    <h2 className="text-4xl font-black text-gray-900 leading-tight mb-6">
                        Encuentra el local <span className="text-red-600">Happy Pizza</span> más cercano
                    </h2>
                    <p className="text-gray-600 font-medium mb-8">
                        Las ofertas especiales y los precios pueden variar según tu ubicación.
                    </p>

                    <div className="relative mb-8">
                        <input
                            type="text"
                            placeholder="Ingresa nombre de tienda o dirección"
                            className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:border-red-500 focus:outline-none transition-all text-gray-800 font-semibold"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl">🔍</span>
                    </div>

                    <button
                        onClick={onClose}
                        className="flex items-center justify-center gap-3 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-black py-4 rounded-2xl shadow-lg transform hover:scale-105 transition-all text-lg uppercase tracking-wider"
                    >
                        <span>🍕</span> IR A MENÚ
                    </button>
                </div>

                {/* Right Panel: Store List */}
                <div className="w-full md:w-3/5 flex flex-col">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
                        <h3 className="text-xl font-black text-gray-800 uppercase tracking-tight">Nuestras Tiendas</h3>
                        <button
                            onClick={onClose}
                            className="hidden md:block text-gray-400 hover:text-red-500 text-2xl font-bold transition-colors"
                        >
                            ✕
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20">
                                <span className="text-4xl animate-bounce mb-4">🍕</span>
                                <p className="text-gray-500 font-bold animate-pulse">Buscando el mejor sabor...</p>
                            </div>
                        ) : filteredStores.length > 0 ? (
                            filteredStores.map((store) => (
                                <div key={store.id_sucursal} className="group bg-white border-2 border-gray-100 hover:border-red-200 rounded-2xl p-6 transition-all hover:shadow-xl hover:-translate-y-1">
                                    <div className="flex flex-col md:flex-row justify-between gap-6">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="bg-red-600 text-white text-xs font-black px-2 py-1 rounded-md">
                                                    ({store.id_sucursal})
                                                </span>
                                                <h4 className="text-xl font-black text-gray-900 group-hover:text-red-600 transition-colors uppercase">
                                                    {store.nombre}
                                                </h4>
                                            </div>
                                            <p className="text-gray-500 font-medium text-sm mb-1">{store.direccion}</p>
                                            <p className="text-gray-400 font-bold text-xs uppercase mb-4">Teléfono: {store.telefono}</p>

                                            <button
                                                onClick={() => handleSelectStore(store)}
                                                className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-black px-8 py-2.5 rounded-full text-sm uppercase tracking-widest transition-all shadow-md active:scale-95"
                                            >
                                                VER LOCAL
                                            </button>
                                        </div>

                                        <div className="w-full md:w-auto border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
                                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Tipo de Despacho</p>
                                            <div className="flex flex-col gap-4">
                                                <div className={`flex items-center gap-3 font-bold text-sm ${store.ofrece_delivery ? 'text-gray-800' : 'text-gray-300'}`}>
                                                    <span className={`text-xl ${!store.ofrece_delivery && 'grayscale opacity-50'}`}>🛵</span>
                                                    <span className={!store.ofrece_delivery ? 'line-through' : ''}>Envío a domicilio</span>
                                                </div>
                                                <div className={`flex items-center gap-3 font-bold text-sm ${store.ofrece_recojo ? 'text-gray-800' : 'text-gray-300'}`}>
                                                    <span className={`text-xl ${!store.ofrece_recojo && 'grayscale opacity-50'}`}>📍</span>
                                                    <span className={!store.ofrece_recojo ? 'line-through' : ''}>Retiro en Tienda</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                                <span className="text-5xl mb-4 block">🔍</span>
                                <p className="text-gray-500 font-black">No encontramos tiendas con ese nombre.</p>
                                <p className="text-gray-400 text-sm">¡Intenta con otra palabra!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StoreLocator;
