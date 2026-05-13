import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { motion } from "framer-motion";

import { useQuery } from "@tanstack/react-query";

import toast from "react-hot-toast";

import {
  productoService,
  promocionService,
} from "../api/productoService";

/* ─────────────────────────────────────────
   UI HELPERS
───────────────────────────────────────── */

const categories = [
  {
    id: "todo",
    name: "Todo",
  },
  {
    id: "pizzas",
    name: "Pizzas",
  },
  {
    id: "bebidas",
    name: "Bebidas",
  },
  {
    id: "postres",
    name: "Postres",
  },
  {
    id: "combos",
    name: "Combos",
  },
  {
    id: "extras",
    name: "Salsas",
  },
];

/* ─────────────────────────────────────────
   SKELETON
───────────────────────────────────────── */

function SkeletonCard() {
  return (
    <div className="bg-white rounded-[28px] overflow-hidden border border-gray-100 animate-pulse">
      <div className="h-64 bg-gray-200" />

      <div className="p-6">
        <div className="h-6 bg-gray-200 rounded-full w-2/3 mb-4" />

        <div className="h-4 bg-gray-100 rounded-full mb-2" />

        <div className="h-4 bg-gray-100 rounded-full w-4/5 mb-8" />

        <div className="h-12 bg-gray-200 rounded-2xl" />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   MENU
───────────────────────────────────────── */

export default function Menu() {
  const navigate = useNavigate();

  const [activeCategory, setActiveCategory] =
    useState("todo");

  /* ─────────────────────────────────────────
     QUERIES
  ───────────────────────────────────────── */

  const {
    data: productos = [],
    isLoading: loadingProductos,
    error: errorProductos,
  } = useQuery({
    queryKey: ["productos"],
    queryFn: async () => {
      const res =
        await productoService.getAll();

      return res.data || [];
    },
    staleTime: 1000 * 60 * 5,
  });

  const {
    data: promociones = [],
    isLoading: loadingPromos,
    error: errorPromos,
  } = useQuery({
    queryKey: ["promociones"],
    queryFn: async () => {
      const res =
        await promocionService.getAll();

      return res.data || [];
    },
    staleTime: 1000 * 60 * 5,
  });

  const loading =
    loadingProductos || loadingPromos;

  /* ─────────────────────────────────────────
     MAP DATA
  ───────────────────────────────────────── */

  const menuItems = useMemo(() => {
    const data = {
      pizzas: [],
      bebidas: [],
      postres: [],
      extras: [],
      combos: [],
      todo: [],
    };

    /* PROMOS */

    data.combos = promociones.map((promo) => ({
      ...promo,
      id: promo.id_promocion,
      type: "promo",
      name: promo.titulo,
      description:
        promo.descripcion ||
        "Promoción especial",
      image: promo.imagen,
      price: parseFloat(promo.precio || 0),
    }));

    /* PRODUCTOS */

    productos.forEach((p) => {
      const cat =
        p.categoria_nombre?.toLowerCase() || "";

      const item = {
        ...p,
        id: p.id_producto,
        type: "producto",
        name: p.nombre,
        description: p.descripcion,
        image: p.imagen,
        price:
          p.variantes?.[0]?.precio || 0,
        sizes:
          p.variantes?.map(
            (v) => v.tamaño
          ) || [],
      };

      if (cat.includes("pizza")) {
        data.pizzas.push(item);
      } else if (
        cat.includes("bebida") ||
        cat.includes("gaseosa")
      ) {
        data.bebidas.push(item);
      } else if (
        cat.includes("postre")
      ) {
        data.postres.push(item);
      } else if (
        cat.includes("salsa") ||
        cat.includes("crema")
      ) {
        data.extras.push(item);
      }
    });

    data.todo = [
      ...data.combos,
      ...data.pizzas,
      ...data.bebidas,
      ...data.postres,
    ];

    return data;
  }, [productos, promociones]);

  /* ─────────────────────────────────────────
     NAVIGATE
  ───────────────────────────────────────── */

  const handleNavigateToDetail = (
    item
  ) => {
    navigate(
      `/detalle/${item.type}/${item.id}`
    );
  };

  /* ─────────────────────────────────────────
     ERROR
  ───────────────────────────────────────── */

  if (errorProductos || errorPromos) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="bg-white border border-red-100 rounded-[32px] p-10 max-w-lg w-full text-center shadow-xl">
          <div className="w-16 h-16 rounded-full bg-red-100 mx-auto mb-6 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-red-500" />
          </div>

          <h2 className="text-3xl font-black text-gray-900 mb-4">
            No pudimos cargar el menú
          </h2>

          <p className="text-gray-500 mb-8">
            Ocurrió un problema al obtener
            los productos.
          </p>

          <button
            onClick={() =>
              window.location.reload()
            }
            className="bg-gray-900 text-white px-8 py-4 rounded-2xl font-semibold hover:opacity-90 transition"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  /* ─────────────────────────────────────────
     RENDER
  ───────────────────────────────────────── */

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* HERO */}

      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1600"
            alt="Happy Pizza"
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-black/70" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 min-h-[420px] flex items-center">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-3 bg-white/10 border border-white/10 backdrop-blur-md rounded-full px-5 py-2 mb-8">
              <div className="w-2 h-2 rounded-full bg-red-500" />

              <span className="text-white text-sm font-medium uppercase tracking-wider">
                Happy Pizza
              </span>
            </div>

            <h1 className="text-white text-5xl md:text-7xl font-black leading-tight mb-6">
              Menú artesanal
              <span className="block text-red-500">
                moderno y delicioso
              </span>
            </h1>

            <p className="text-lg text-gray-300 leading-relaxed max-w-2xl">
              Explora pizzas premium,
              promociones y bebidas con
              una experiencia visual más
              limpia y profesional.
            </p>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}

      <section className="sticky top-20 z-30 bg-[#fafafa]/90 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-5 overflow-x-auto">
          <div className="flex gap-4 min-w-max">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() =>
                  setActiveCategory(
                    category.id
                  )
                }
                className={`
                  px-6
                  py-3
                  rounded-2xl
                  text-sm
                  font-semibold
                  transition-all
                  duration-300
                  whitespace-nowrap
                  ${
                    activeCategory ===
                    category.id
                      ? "bg-gray-900 text-white shadow-lg"
                      : "bg-white border border-gray-200 text-gray-700 hover:border-gray-900"
                  }
                `}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* MENU */}

      <section className="py-20 px-6 lg:px-10">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : (
            <>
              {(activeCategory === "todo"
                ? [
                    "combos",
                    "pizzas",
                    "bebidas",
                    "postres",
                  ]
                : [activeCategory]
              ).map((catKey) => {
                const items =
                  menuItems[catKey];

                if (
                  !items ||
                  items.length === 0
                ) {
                  return null;
                }

                const category =
                  categories.find(
                    (c) =>
                      c.id === catKey
                  );

                return (
                  <div
                    key={catKey}
                    className="mb-20"
                  >
                    {activeCategory ===
                      "todo" && (
                      <div className="mb-10">
                        <h2 className="text-4xl font-black text-gray-900">
                          {
                            category?.name
                          }
                        </h2>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
                      {items.map(
                        (
                          item,
                          index
                        ) => (
                          <motion.div
                            key={
                              item.id
                            }
                            initial={{
                              opacity: 0,
                              y: 40,
                            }}
                            whileInView={{
                              opacity: 1,
                              y: 0,
                            }}
                            transition={{
                              duration: 0.4,
                              delay:
                                index *
                                0.05,
                            }}
                            viewport={{
                              once: true,
                            }}
                            className="group bg-white rounded-[32px] overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-500"
                          >
                            {/* IMAGE */}

                            <div
                              className="relative overflow-hidden h-72 cursor-pointer"
                              onClick={() =>
                                handleNavigateToDetail(
                                  item
                                )
                              }
                            >
                              <img
                                src={
                                  item.image
                                    ? item.image
                                    : "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800"
                                }
                                alt={
                                  item.name
                                }
                                loading="lazy"
                                decoding="async"
                                className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                              />

                              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                              <div className="absolute top-5 left-5 bg-white text-gray-900 px-4 py-2 rounded-full font-bold shadow-xl">
                                S/{" "}
                                {parseFloat(
                                  item.price
                                ).toFixed(
                                  2
                                )}
                              </div>

                              {item.type ===
                                "promo" && (
                                <div className="absolute top-5 right-5 bg-red-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-xl">
                                  Promo
                                </div>
                              )}
                            </div>

                            {/* CONTENT */}

                            <div className="p-7">
                              <h3 className="text-2xl font-black text-gray-900 mb-3">
                                {
                                  item.name
                                }
                              </h3>

                              <p className="text-gray-500 leading-relaxed text-sm mb-8 line-clamp-2">
                                {
                                  item.description
                                }
                              </p>

                              {item.sizes &&
                                item
                                  .sizes
                                  .length >
                                  0 && (
                                  <div className="flex flex-wrap gap-2 mb-8">
                                    {item.sizes.map(
                                      (
                                        size
                                      ) => (
                                        <span
                                          key={
                                            size
                                          }
                                          className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold"
                                        >
                                          {
                                            size
                                          }
                                        </span>
                                      )
                                    )}
                                  </div>
                                )}

                              <button
                                onClick={() => {
                                  handleNavigateToDetail(
                                    item
                                  );

                                  toast.success(
                                    "Abriendo producto"
                                  );
                                }}
                                className="w-full bg-gray-900 hover:bg-black text-white py-4 rounded-2xl font-semibold transition-all duration-300"
                              >
                                Ver producto
                              </button>
                            </div>
                          </motion.div>
                        )
                      )}
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </section>
    </div>
  );
}