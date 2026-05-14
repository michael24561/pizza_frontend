import { useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import api from '../api';
import toast from 'react-hot-toast';

/**
 * Hook global que verifica si hay un checkout pendiente de Mercado Pago.
 * Se ejecuta en App.jsx para que funcione sin importar en qué página aterrice el usuario.
 */
export default function useCheckoutVerifier() {
  const { user, authLoading } = useContext(AuthContext);
  const isProcessing = useRef(false); // Prevenir ejecuciones simultáneas

  useEffect(() => {
    if (authLoading || !user?.id_cliente) return;

    const verifyPendingCheckout = async () => {
      const pendingCheckout = localStorage.getItem('pending_checkout');
      if (!pendingCheckout) return;

      // Prevenir doble ejecución
      if (isProcessing.current) {
        console.log('[CheckoutVerifier] Ya hay una verificación en curso, ignorando.');
        return;
      }

      try {
        const { preference_id, timestamp } = JSON.parse(pendingCheckout);

        // Expirar checkouts de más de 1 hora
        const oneHour = 60 * 60 * 1000;
        if (Date.now() - timestamp > oneHour) {
          console.log('[CheckoutVerifier] Checkout expirado, limpiando.');
          localStorage.removeItem('pending_checkout');
          return;
        }

        isProcessing.current = true;
        console.log('[CheckoutVerifier] 🔄 Verificando checkout pendiente:', preference_id);

        const response = await api.post('/mercadopago/verificar-checkout/', {
          preference_id
        });

        console.log('[CheckoutVerifier] Respuesta:', response.data);

        if (response.data.status === 'approved' || response.data.status === 'already_processed') {
          console.log('[CheckoutVerifier] ✅ Pago confirmado! Pedido:', response.data.id_pedido);
          toast.success(`¡Pedido #${response.data.codigo} confirmado!`, { id: 'checkout-verify' });
          localStorage.removeItem('pending_checkout');
        } else if (response.data.status === 'pending') {
          console.log('[CheckoutVerifier] ⏳ Pago aún pendiente.');
        }
      } catch (error) {
        console.error('[CheckoutVerifier] Error:', error?.response?.data || error.message);
      } finally {
        isProcessing.current = false;
      }
    };

    verifyPendingCheckout();
  }, [user, authLoading]);
}
