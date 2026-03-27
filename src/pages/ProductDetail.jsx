import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productoService, promocionService } from '../api/productoService';
import api from '../api';
import { AuthContext } from '../contexts/AuthContext';
import './ProductDetail.css';

const ProductDetail = () => {
    const { type, id } = useParams();
    const navigate = useNavigate();

    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [adding, setAdding] = useState(false);

    // For single product selections
    const [selectedVariant, setSelectedVariant] = useState(null);

    // For combo selections
    const [selections, setSelections] = useState({});
    const [pizzaOptions, setPizzaOptions] = useState([]);
    const [drinkOptions, setDrinkOptions] = useState([]);
    const [salsaOptions, setSalsaOptions] = useState([]);
    const [extraOptions, setExtraOptions] = useState([]);

    useEffect(() => {
        loadDetail();
    }, [type, id]);

    const loadDetail = async () => {
        try {
            setLoading(true);
            let currentItem;

            // 1. Fetch exact item
            if (type === 'promo') {
                const res = await promocionService.getAll();
                currentItem = res.data.find(p => p.id_promocion == id);
            } else {
                const res = await productoService.getAll();
                currentItem = res.data.find(p => p.id_producto == id);
            }
            setItem(currentItem);

            if (!currentItem) {
                setLoading(false);
                return;
            }

            // 2. Setup options
            const allRes = await productoService.getAll();
            const products = allRes.data;

            let pizzas = [];
            let drinks = [];
            let salsas = [];
            let extras = [];

            // A. Global Extras and Salsas (available for everyone)
            products.forEach(p => {
                const catName = p.categoria_nombre ? p.categoria_nombre.toLowerCase() : '';
                if (p.variantes && p.variantes.length > 0) {
                    p.variantes.forEach(v => {
                        const tamano = v.tamaño ? v.tamaño.toLowerCase() : '';
                        if (catName.includes('salsa') || catName.includes('crema')) {
                            if (!salsas.find(s => s.id === v.id_variante)) {
                                salsas.push({ id: v.id_variante, name: p.nombre, price: v.precio, img: p.imagen || '🥣' });
                            }
                        }
                        else if (catName.includes('extra') || catName.includes('adicional')) {
                            if (!extras.find(e => e.id === v.id_variante)) {
                                extras.push({ id: v.id_variante, name: p.nombre, size: tamano, price: v.precio, img: p.imagen || '🍟' });
                            }
                        }
                    });
                }
            });

            setSalsaOptions(salsas);
            setExtraOptions(extras);

            // B. Promo specific items (Pizzas and Drinks)
            if (type === 'producto') {
                if (currentItem.variantes && currentItem.variantes.length > 0) {
                    setSelectedVariant(currentItem.variantes[0].id_variante);
                }
            } else {
                // Use the details populated in the backend
                if (currentItem.detalles && currentItem.detalles.length > 0) {
                    currentItem.detalles.forEach(det => {
                        const v = det.variante_info;
                        if (!v) return;

                        const catName = (v.producto_categoria_nombre || '').toLowerCase();
                        // Also check the category of the variant itself if not provided directly
                        const isPizza = v.producto_nombre?.toLowerCase().includes('pizza') || (v.categoria_info?.nombre || '').toLowerCase().includes('pizza');
                        const isDrink = v.producto_nombre?.toLowerCase().includes('bebida') || (v.categoria_info?.nombre || '').toLowerCase().includes('bebida') || v.producto_nombre?.toLowerCase().includes('gaseosa');

                        if (isPizza) {
                            if (!pizzas.find(p => p.id === v.id_variante)) {
                                pizzas.push({ id: v.id_variante, name: v.producto_nombre, size: v.tamaño, price: v.precio, img: v.producto_imagen || '🍕' });
                            }
                        } else if (isDrink) {
                            if (!drinks.find(d => d.id === v.id_variante)) {
                                drinks.push({ id: v.id_variante, name: v.producto_nombre, size: v.tamaño, price: v.precio, img: v.producto_imagen || '🥤' });
                            }
                        }
                    });
                }

                setPizzaOptions(pizzas);
                setDrinkOptions(drinks);

                // Auto select logic
                const newSelections = {};
                if (pizzas.length > 0) {
                    const defaultPizza = pizzas.find(p => p.name.toLowerCase().includes('americana')) || pizzas[0];
                    newSelections['pizza1'] = defaultPizza.id;

                    const itemDesc = (currentItem?.descripcion || '').toLowerCase();
                    if (itemDesc.includes('2 pizza')) {
                        newSelections['pizza2'] = pizzas[1] ? pizzas[1].id : defaultPizza.id;
                    }
                }

                if (drinks.length > 0) {
                    newSelections['bebida1'] = drinks[0].id;
                }
                setSelections(newSelections);
            }

        } catch (err) {
            console.error('Error fetching details', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectPromo = (sectionId, variantId) => {
        setSelections(prev => {
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

    const { user } = useContext(AuthContext); // Cleaned up AuthContext usage

    const handleAddToCart = async () => {
        if (!user) {
            alert("⚠️ Debes iniciar sesión para agregar productos al carrito.");
            navigate('/login');
            return;
        }

        setAdding(true);
        try {
            // 1. Obtener o Crear Carrito para el cliente
            let carritoId;
            const cartRes = await api.get('/carritos/', { params: { cliente_id: user.id_cliente } });

            if (cartRes.data.length > 0) {
                carritoId = cartRes.data[0].id_carrito;
            } else {
                const newCartRes = await api.post('/carritos/', { cliente: user.id_cliente });
                carritoId = newCartRes.data.id_carrito;
            }

            // 2. Preparar el item según el tipo
            const payload = {
                carrito: carritoId,
                cantidad: 1,
            };

            if (type === 'producto') {
                payload.variante = selectedVariant;
            } else {
                payload.promocion = id;
            }

            // Capturar TODAS las opciones seleccionadas (extras, salsas, combos, etc.)
            const opciones = [];
            Object.entries(selections).forEach(([key, val]) => {
                if (val) opciones.push({ variante: val, cantidad: 1 });
            });
            payload.opciones_promocion = opciones;

            // 3. Agregar al backend
            await api.post('/carritos-items/', payload);

            alert("✅ ¡Producto agregado al carrito!");
            navigate('/carrito');
        } catch (error) {
            console.error("Error al agregar al carrito:", error);
            alert("❌ Hubo un error al agregar el producto. Inténtalo de nuevo.");
        } finally {
            setAdding(false);
        }
    };

    if (loading) return <div className="product-detail-loading">Cargando...</div>;
    if (!item) return <div className="product-detail-error">Producto no encontrado</div>;

    const itemName = item.nombre || item.titulo;
    const itemDesc = item.descripcion;
    let basePrice = item.precio || 0;

    if (type === 'producto' && item.variantes && selectedVariant) {
        const v = item.variantes.find(v => v.id_variante === selectedVariant);
        if (v) basePrice = v.precio;
    }

    // CALCULAR PRECIO DINÁMICO (Base + Extras/Salsas)
    let totalPrice = parseFloat(basePrice);
    Object.values(selections).forEach(variantId => {
        // Buscar el precio de la variante seleccionada en las listas de opciones
        // Solo sumamos el precio si es un extra o salsa (en combos el precio base ya incluye lo principal)
        const option = [...salsaOptions, ...extraOptions].find(o => o.id === variantId);
        if (option && option.price) {
            totalPrice += parseFloat(option.price);
        }
    });

    return (
        <div className="product-detail-page">
            <div className="container">
                <div className="breadcrumb">
                    <span onClick={() => navigate('/')}>Inicio</span> &gt;
                    <span onClick={() => navigate('/menu')}> Menú</span> &gt;
                    <span className="current">{itemName}</span>
                </div>

                <div className="product-detail-content">
                    {/* LEFT: Image */}
                    <div className="product-image-col">
                        <div className="image-wrapper">
                            {item.imagen && (item.imagen.startsWith('http') || item.imagen.startsWith('/')) ? (
                                <img src={item.imagen} alt={itemName} />
                            ) : (
                                <div className="emoji-placeholder">{item.imagen || '🍕'}</div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT: Info & Selections */}
                    <div className="product-info-col">
                        <div className="product-header">
                            <h1>{itemName}</h1>
                            <button className="heart-btn">♡</button>
                        </div>

                        <p className="product-description">{itemDesc}</p>

                        <div className="product-price">
                            S/ {parseFloat(totalPrice).toFixed(2)}
                        </div>

                        {/* SELECTIONS */}
                        <div className="selections-container">

                            {/* CASE 1: Single Product (e.g. Pizza) */}
                            {type === 'producto' && item.variantes && item.variantes.length > 0 && (
                                <div className="selection-group">
                                    <div className="group-header">
                                        <h3>Elige el tamaño <span className="req">(Obligatorio)</span></h3>
                                    </div>
                                    <div className="options-list">
                                        {item.variantes.map(v => (
                                            <div
                                                key={v.id_variante}
                                                className={`option-row ${selectedVariant === v.id_variante ? 'selected' : ''}`}
                                                onClick={() => setSelectedVariant(v.id_variante)}
                                            >
                                                <div className="option-info">
                                                    <span className="radio-circle">
                                                        {selectedVariant === v.id_variante && <span className="inner-dot"></span>}
                                                    </span>
                                                    <div className="option-texts">
                                                        <span className="option-title">{itemName}</span>
                                                        <span className="option-subtitle capitalize">{v.tamaño}</span>
                                                    </div>
                                                </div>
                                                <div className="option-price">
                                                    + S/ {v.precio}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* CASE 2: Combo/Promo */}
                            {type === 'promo' && (
                                <>
                                    {/* 1st Pizza */}
                                    {pizzaOptions.length > 0 && (
                                        <div className="selection-group">
                                            <div className="group-header">
                                                <h3>{itemDesc.toLowerCase().includes('2 pizza') ? '1era Pizza' : 'Pizza'} <span className="req">(Obligatorio)</span></h3>
                                            </div>
                                            <div className="options-list">
                                                {pizzaOptions.map(p => (
                                                    <div
                                                        key={p.id}
                                                        className={`option-row ${selections['pizza1'] === p.id ? 'selected' : ''}`}
                                                        onClick={() => handleSelectPromo('pizza1', p.id)}
                                                    >
                                                        <div className="option-info">
                                                            <span className="radio-circle">
                                                                {selections['pizza1'] === p.id && <span className="inner-dot"></span>}
                                                            </span>
                                                            <div className="option-texts">
                                                                <span className="option-title">{p.name}</span>
                                                                <span className="option-subtitle capitalize">{p.size}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* 2nd Pizza (if applies) */}
                                    {itemDesc.toLowerCase().includes('2 pizza') && pizzaOptions.length > 0 && (
                                        <div className="selection-group">
                                            <div className="group-header">
                                                <h3>2da Pizza <span className="req">(Obligatorio)</span></h3>
                                            </div>
                                            <div className="options-list">
                                                {pizzaOptions.map(p => (
                                                    <div
                                                        key={p.id}
                                                        className={`option-row ${selections['pizza2'] === p.id ? 'selected' : ''}`}
                                                        onClick={() => handleSelectPromo('pizza2', p.id)}
                                                    >
                                                        <div className="option-info">
                                                            <span className="radio-circle">
                                                                {selections['pizza2'] === p.id && <span className="inner-dot"></span>}
                                                            </span>
                                                            <div className="option-texts">
                                                                <span className="option-title">{p.name}</span>
                                                                <span className="option-subtitle capitalize">{p.size}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Drink */}
                                    {drinkOptions.length > 0 && (
                                        <div className="selection-group">
                                            <div className="group-header">
                                                <h3>Bebida <span className="req">(Obligatorio)</span></h3>
                                            </div>
                                            <div className="options-list">
                                                {drinkOptions.map(d => (
                                                    <div
                                                        key={d.id}
                                                        className={`option-row ${selections['bebida1'] === d.id ? 'selected' : ''}`}
                                                        onClick={() => handleSelectPromo('bebida1', d.id)}
                                                    >
                                                        <div className="option-info">
                                                            <span className="radio-circle">
                                                                {selections['bebida1'] === d.id && <span className="inner-dot"></span>}
                                                            </span>
                                                            <div className="option-texts">
                                                                <span className="option-title">{d.name}</span>
                                                                {d.size && <span className="option-subtitle capitalize">{d.size}</span>}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}

                            {/* Extras (Opcional) - Available for both Single and Promo */}
                            {extraOptions.length > 0 && (
                                <div className="selection-group">
                                    <div className="group-header">
                                        <h3>Añade un Extra <span className="optional" style={{ color: '#666', fontSize: '0.9rem', marginLeft: '5px' }}>(Opcional)</span></h3>
                                    </div>
                                    <div className="options-list">
                                        {extraOptions.map(e => (
                                            <div
                                                key={e.id}
                                                className={`option-row ${selections['extra1'] === e.id ? 'selected' : ''}`}
                                                onClick={() => handleSelectPromo('extra1', e.id)}
                                            >
                                                <div className="option-info">
                                                    <span className="radio-circle">
                                                        {selections['extra1'] === e.id && <span className="inner-dot"></span>}
                                                    </span>
                                                    <div className="option-texts">
                                                        <span className="option-title">{e.name}</span>
                                                    </div>
                                                </div>
                                                {e.price > 0 && (
                                                    <div className="option-price">
                                                        + S/ {e.price}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Salsas (Opcional) - Available for both Single and Promo */}
                            {salsaOptions.length > 0 && (
                                <div className="selection-group">
                                    <div className="group-header">
                                        <h3>Elige tus Salsas <span className="optional" style={{ color: '#666', fontSize: '0.9rem', marginLeft: '5px' }}>(Opcional)</span></h3>
                                    </div>
                                    <div className="options-list">
                                        {salsaOptions.map(s => (
                                            <div
                                                key={s.id}
                                                className={`option-row ${selections['salsa1'] === s.id ? 'selected' : ''}`}
                                                onClick={() => handleSelectPromo('salsa1', s.id)}
                                            >
                                                <div className="option-info">
                                                    <span className="radio-circle">
                                                        {selections['salsa1'] === s.id && <span className="inner-dot"></span>}
                                                    </span>
                                                    <div className="option-texts">
                                                        <span className="option-title">{s.name}</span>
                                                    </div>
                                                </div>
                                                {s.price > 0 && (
                                                    <div className="option-price">
                                                        + S/ {s.price}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                        </div>

                        <div className="add-to-cart-wrapper">
                            <button
                                className="btn-final-add"
                                onClick={handleAddToCart}
                                disabled={adding}
                            >
                                {adding ? 'Agregando...' : 'Agregar a mi pedido'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
