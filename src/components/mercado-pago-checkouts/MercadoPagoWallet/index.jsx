import React, { useEffect, useState } from 'react';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import api from '../../../api';

// RECUERDA: Cambiar por tu Public Key de Mercado Pago
const MERCADOPAGO_PUBLIC_KEY = 'APP_USR-da1d9098-8dac-4cca-964b-c120d6e1d91d'; // REEMPLAZAR AQUÍ

const MercadoPagoWallet = ({ pedidoId, onPaymentSuccess }) => {
  const [preferenceId, setPreferenceId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (MERCADOPAGO_PUBLIC_KEY.includes('REEMPLAZAR')) {
      setError("Error: No se ha configurado la Public Key de Mercado Pago en MercadoPagoWallet/index.js");
      setLoading(false);
      return;
    }
    // Inicializar Mercado Pago
    initMercadoPago(MERCADOPAGO_PUBLIC_KEY, {
      locale: 'es-PE'
    });
  }, []);

  useEffect(() => {
    const createPreference = async () => {
      if (!pedidoId) return;
      
      setLoading(true);
      try {
        const response = await api.post('/mercadopago/preference/', {
          id_pedido: pedidoId
        });
        setPreferenceId(response.data.preference_id);
      } catch (err) {
        console.error("Error al crear preferencia:", err);
        setError("No se pudo iniciar el proceso de pago. Intenta de nuevo.");
      } finally {
        setLoading(false);
      }
    };

    createPreference();
  }, [pedidoId]);

  if (loading) return <div className="text-center p-4">Cargando métodos de pago...</div>;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

  return (
    <div id="walletBrick_container" className="my-4">
      {preferenceId && (
        <Wallet 
          initialization={{ preferenceId }} 
          customization={{ texts: { valueProp: 'smart_option' } }}
        />
      )}
    </div>
  );
};

export default MercadoPagoWallet;
