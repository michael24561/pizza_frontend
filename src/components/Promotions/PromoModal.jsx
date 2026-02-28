import React, { useState, useEffect } from 'react';
import './PromoModal.css';
import { productoService } from '../../api/productoService';

const PromoModal = ({ isOpen, onClose, promo, onConfirm }) => {
    // Aquí almacenaríamos las opciones elegidas por el usuario
    const [selections, setSelections] = useState({});
    const [pizzaOptions, setPizzaOptions] = useState([]);
    const [drinkOptions, setDrinkOptions] = useState([]);
    const [salsaOptions, setSalsaOptions] = useState([]);
    const [extraOptions, setExtraOptions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isOpen) {
            loadOptions();
            setSelections({}); // Reset selections when modal opens
        }
    }, [isOpen]);

    const loadOptions = async () => {
        try {
            setLoading(true);
            const res = await productoService.getAll();
            const products = res.data;

            let pizzas = [];
            let drinks = [];
            let salsas = [];
            let extras = [];

            // Analizar la descripción real de la BD o mock
            const promoDesc = (promo?.descripcion || promo?.description || '').toLowerCase();
            const isFamiliar = promoDesc.includes('familiar') || promoDesc.includes('grande');
            const isMediana = promoDesc.includes('mediana');
            const isPersonal = promoDesc.includes('personal') || promoDesc.includes('pequeña');

            const reqDrink500 = promoDesc.includes('500ml') || promoDesc.includes('personal');
            const reqDrink1L = promoDesc.includes('1l') || promoDesc.includes('1.5l');

            products.forEach(p => {
                const catName = p.categoria_nombre ? p.categoria_nombre.toLowerCase() : '';
                if (p.variantes && p.variantes.length > 0) {
                    p.variantes.forEach(v => {
                        const tamano = v.tamaño ? v.tamaño.toLowerCase() : '';

                        // Filtrar por tamaño si la promoción es restrictiva!
                        if (catName.includes('pizza')) {
                            const esFamiliar = tamano.includes('familiar');
                            const esMediana = tamano.includes('mediana');
                            const esPersonal = tamano.includes('personal') || tamano.includes('chica');

                            // Solo agregamos la pizza si calza con el requisito del combo
                            if ((isFamiliar && esFamiliar) || (isMediana && esMediana) || (isPersonal && esPersonal) || (!isFamiliar && !isMediana && !isPersonal)) {
                                pizzas.push({ id: v.id_variante, name: `${p.nombre}`, img: p.imagen || '🍕' });
                            }
                        }
                        else if (catName.includes('bebida') || catName.includes('gaseosa')) {
                            const es500 = tamano.includes('500');
                            const es1L = tamano.includes('1') || tamano.includes('2l');

                            if ((reqDrink500 && es500) || (reqDrink1L && es1L) || (!reqDrink500 && !reqDrink1L)) {
                                drinks.push({ id: v.id_variante, name: `${p.nombre} ${v.tamaño}`, img: p.imagen || '🥤' });
                            }
                        }
                        else if (catName.includes('salsa') || catName.includes('crema')) {
                            salsas.push({ id: v.id_variante, name: `${p.nombre}`, img: p.imagen || '🥣' });
                        }
                        else if (catName.includes('extra') || catName.includes('adicional')) {
                            extras.push({ id: v.id_variante, name: `${p.nombre}`, img: p.imagen || '🍟' });
                        }
                    });
                } else {
                    const fallbackImg = catName.includes('pizza') ? '🍕' : (catName.includes('extra') ? '🍟' : (catName.includes('salsa') ? '🥣' : '🥤'));
                    const option = { id: p.id_producto, name: p.nombre, img: p.imagen || fallbackImg };

                    if (catName.includes('pizza')) pizzas.push(option);
                    else if (catName.includes('bebida') || catName.includes('gaseosa')) drinks.push(option);
                    else if (catName.includes('salsa') || catName.includes('crema')) salsas.push(option);
                    else if (catName.includes('extra') || catName.includes('adicional')) extras.push(option);
                }
            });

            setPizzaOptions(pizzas);
            setDrinkOptions(drinks);
            setSalsaOptions(salsas);
            setExtraOptions(extras);

            // Pre-selección inteligente
            const newSelections = {};
            if (pizzas[0]) newSelections['pizza1'] = pizzas[0].id;

            // Si el combo menciona 2 pizzas
            if (promoDesc.includes('2 pizzas')) {
                newSelections['pizza2'] = pizzas.length > 1 ? pizzas[1].id : pizzas[0]?.id;
            }

            if (drinks[0]) newSelections['bebida1'] = drinks[0].id;

            setSelections(newSelections);

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen || !promo) return null;

    // Supongamos que la promo tiene "requisitos", por ejemplo: 2 pizzas y 2 gaseosas
    // Esto dependerá de la estructura de PromocionDetalle de tu backend
    // Por ahora lo simularemos basado en la info del frontend

    const handleSelect = (categoryIndex, sectionId, variantId) => {
        setSelections(prev => {
            // Permitir deseleccionar si la opción es opcional (como extras o salsas)
            if (prev[sectionId] === variantId && (sectionId.includes('extra') || sectionId.includes('salsa'))) {
                const updated = { ...prev };
                delete updated[sectionId];
                return updated;
            }
            return {
                ...prev,
                [sectionId]: variantId
            };
        });
    };

    const handleConfirm = () => {
        // Build array of chosen sub-items depending on the selections
        const subItems = Object.keys(selections).map(key => ({
            variante: selections[key],
            cantidad: 1 // Si hay secciones que piden 2, puedes añadir lógica adicional.
        }));

        // Pass as array to the parent Menu component
        onConfirm(promo, subItems);
        onClose();
    };

    return (
        <div className="modal-overlay">
            <div className="promo-modal">
                <div className="modal-header">
                    <h2>Personaliza tu {promo.name}</h2>
                    <button className="close-button" onClick={onClose}>×</button>
                </div>

                <div className="modal-content">
                    <p className="promo-description">{promo.description}</p>

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '20px' }}>Cargando opciones disponibles...</div>
                    ) : (
                        <>
                            {/* Ejemplo de sección de elección: 1ra Pizza */}
                            <div className="selection-section">
                                <h3>Elige tu 1era Pizza</h3>
                                <div className="options-grid">
                                    {pizzaOptions.map(p => (
                                        <div
                                            key={p.id}
                                            className={`option-card ${selections['pizza1'] === p.id ? 'selected' : ''}`}
                                            onClick={() => handleSelect('pizzas', 'pizza1', p.id)}
                                        >
                                            {p.img && (p.img.startsWith('http') || p.img.startsWith('/')) ? (
                                                <div className="option-image-container">
                                                    <img src={p.img} alt={p.name} />
                                                </div>
                                            ) : (
                                                <span className="option-img-emoji">{p.img}</span>
                                            )}
                                            <span className="option-name">{p.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Ejemplo de sección de elección: 2da Pizza */}
                            {(promo.includes && promo.includes.some(i => i.includes('2 Pizzas'))) && (
                                <div className="selection-section">
                                    <h3>Elige tu 2da Pizza</h3>
                                    <div className="options-grid">
                                        {pizzaOptions.map(p => (
                                            <div
                                                key={p.id}
                                                className={`option-card ${selections['pizza2'] === p.id ? 'selected' : ''}`}
                                                onClick={() => handleSelect('pizzas', 'pizza2', p.id)}
                                            >
                                                {p.img && (p.img.startsWith('http') || p.img.startsWith('/')) ? (
                                                    <div className="option-image-container">
                                                        <img src={p.img} alt={p.name} />
                                                    </div>
                                                ) : (
                                                    <span className="option-img-emoji">{p.img}</span>
                                                )}
                                                <span className="option-name">{p.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Ejemplo de sección de elección: Bebidas */}
                            <div className="selection-section">
                                <h3>Elige tu Bebida</h3>
                                <div className="options-grid">
                                    {drinkOptions.map(d => (
                                        <div
                                            key={d.id}
                                            className={`option-card ${selections['bebida1'] === d.id ? 'selected' : ''}`}
                                            onClick={() => handleSelect('bebidas', 'bebida1', d.id)}
                                        >
                                            {d.img && (d.img.startsWith('http') || d.img.startsWith('/')) ? (
                                                <div className="option-image-container drink">
                                                    <img src={d.img} alt={d.name} />
                                                </div>
                                            ) : (
                                                <span className="option-img-emoji">{d.img}</span>
                                            )}
                                            <span className="option-name">{d.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Extras list (Si hay disponibles) */}
                            {extraOptions.length > 0 && (
                                <div className="selection-section">
                                    <h3>Añade un Extra (Opcional)</h3>
                                    <div className="options-grid">
                                        {extraOptions.map(e => (
                                            <div
                                                key={e.id}
                                                className={`option-card ${selections['extra1'] === e.id ? 'selected' : ''}`}
                                                onClick={() => handleSelect('extras', 'extra1', e.id)}
                                            >
                                                {e.img && (e.img.startsWith('http') || e.img.startsWith('/')) ? (
                                                    <div className="option-image-container drink">
                                                        <img src={e.img} alt={e.name} />
                                                    </div>
                                                ) : (
                                                    <span className="option-img-emoji">{e.img}</span>
                                                )}
                                                <span className="option-name">{e.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Salsas list (Si hay disponibles) */}
                            {salsaOptions.length > 0 && (
                                <div className="selection-section">
                                    <h3>Elige tus Salsas (Opcional)</h3>
                                    <div className="options-grid">
                                        {salsaOptions.map(s => (
                                            <div
                                                key={s.id}
                                                className={`option-card ${selections['salsa1'] === s.id ? 'selected' : ''}`}
                                                onClick={() => handleSelect('salsas', 'salsa1', s.id)}
                                            >
                                                {s.img && (s.img.startsWith('http') || s.img.startsWith('/')) ? (
                                                    <div className="option-image-container">
                                                        <img src={s.img} alt={s.name} />
                                                    </div>
                                                ) : (
                                                    <span className="option-img-emoji">{s.img}</span>
                                                )}
                                                <span className="option-name">{s.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>

                <div className="modal-footer">
                    <span className="promo-total">Total: S/. {promo.price}</span>
                    <button
                        className="btn-confirm"
                        onClick={handleConfirm}
                        disabled={loading}
                    >
                        Agregar al Carrito 🛒
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PromoModal;
