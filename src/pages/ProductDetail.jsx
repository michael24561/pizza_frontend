import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productoService, promocionService } from '../api/productoService';
import './ProductDetail.css';

const ProductDetail = () => {
    const { type, id } = useParams();
    const navigate = useNavigate();

    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);

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

            // Helper to get all options
            products.forEach(p => {
                const catName = p.categoria_nombre ? p.categoria_nombre.toLowerCase() : '';
                if (p.variantes && p.variantes.length > 0) {
                    p.variantes.forEach(v => {
                        const tamano = v.tamaño ? v.tamaño.toLowerCase() : '';
                        if (catName.includes('salsa') || catName.includes('crema')) {
                            salsas.push({ id: v.id_variante, name: p.nombre, price: v.precio, img: p.imagen || '🥣' });
                        }
                        else if (catName.includes('extra') || catName.includes('adicional')) {
                            extras.push({ id: v.id_variante, name: p.nombre, size: tamano, price: v.precio, img: p.imagen || '🍟' });
                        }
                    });
                }
            });

            setSalsaOptions(salsas);
            setExtraOptions(extras);

            if (type === 'producto') {
                if (currentItem.variantes && currentItem.variantes.length > 0) {
                    setSelectedVariant(currentItem.variantes[0].id_variante);
                }
            } else {
                const promoDesc = (currentItem?.descripcion || '').toLowerCase();
                const isFamiliar = promoDesc.includes('familiar') || promoDesc.includes('grande');
                const isMediana = promoDesc.includes('mediana');
                const isPersonal = promoDesc.includes('personal') || promoDesc.includes('pequeña');

                const reqDrink500 = promoDesc.includes('500ml') || promoDesc.includes('personal');
                const reqDrink1L = promoDesc.includes('1l') || promoDesc.includes('1.5l') || promoDesc.includes('litro');

                products.forEach(p => {
                    const catName = p.categoria_nombre ? p.categoria_nombre.toLowerCase() : '';
                    if (p.variantes && p.variantes.length > 0) {
                        p.variantes.forEach(v => {
                            const tamano = v.tamaño ? v.tamaño.toLowerCase() : '';

                            if (catName.includes('pizza')) {
                                const esFamiliar = tamano.includes('familiar');
                                const esMediana = tamano.includes('mediana');
                                const esPersonal = tamano.includes('personal') || tamano.includes('chica');

                                if ((isFamiliar && esFamiliar) || (isMediana && esMediana) || (isPersonal && esPersonal) || (!isFamiliar && !isMediana && !isPersonal)) {
                                    pizzas.push({ id: v.id_variante, name: p.nombre, size: v.tamaño, price: v.precio, img: p.imagen || '🍕' });
                                }
                            }
                            else if (catName.includes('bebida') || catName.includes('gaseosa')) {
                                const es500 = tamano.includes('500');
                                const es1L = tamano.includes('1') || tamano.includes('2l');

                                if ((reqDrink500 && es500) || (reqDrink1L && es1L) || (!reqDrink500 && !reqDrink1L)) {
                                    drinks.push({ id: v.id_variante, name: p.nombre, size: v.tamaño, price: v.precio, img: p.imagen || '🥤' });
                                }
                            }
                        });
                    }
                });

                setPizzaOptions(pizzas);
                setDrinkOptions(drinks);

                // Auto select logic
                const newSelections = {};
                const defaultPizza = pizzas.find(p => p.name.toLowerCase().includes('americana')) || pizzas[0];
                if (defaultPizza) newSelections['pizza1'] = defaultPizza.id;

                if (promoDesc.includes('2 pizzas')) {
                    newSelections['pizza2'] = pizzas[1] ? pizzas[1].id : defaultPizza?.id;
                }

                if (drinks[0]) newSelections['bebida1'] = drinks[0].id;
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

    const handleAddToCart = () => {
        // Here you would connect logic to save into local cart or send API to cart
        navigate('/menu');
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
                            S/ {parseFloat(basePrice).toFixed(2)}
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
                            <button className="btn-final-add" onClick={handleAddToCart}>
                                Agregar a mi pedido
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
