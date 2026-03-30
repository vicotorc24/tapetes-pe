export const initialSeedData = [
  { id: 1, title: 'Camino de Mesa Laguna La Cocha', price: 95.00, category: 'Mesa', description: 'Camino de mesa rectangular inspirado en los reflejos serenos de la Laguna La Cocha. Ideal para mesas de comedor grandes.', isPromoted: true, sellerName: 'Victoria', stock: 4, image: '/images/fb_2.jpg', images: ['/images/fb_2.jpg', '/images/fb_1.jpg', '/images/fb_3.jpg', '/images/hands.png', '/images/round.png'] },
  { id: 2, title: 'Tapete Redondo Mirador La Ermita', price: 65.00, category: 'Mesa', description: 'Tapete redondo tejido a crochet que rinde homenaje a la majestuosa vista del Mirador La Ermita de Contumazá.', isPromoted: false, sellerName: 'Rosa', stock: 10, image: '/images/fb_1.jpg', images: ['/images/fb_1.jpg', '/images/fb_3.jpg'] },
  { id: 3, title: 'Centro de Mesa Bosque de Cachil', price: 80.00, category: 'Decoración', description: 'Centro de mesa con diseño de hojas inspirado en el exuberante Bosque de Cachil. Perfecto para mesas de vidrio.', isPromoted: true, sellerName: 'Victoria', stock: 3, image: '/images/fb_3.jpg', images: ['/images/fb_3.jpg', '/images/hands.png'] },
  { id: 4, title: 'Individuales El Pino Soñador', price: 45.00, category: 'Mesa', description: 'Juego de individuales ovalados con bordes que evocan la forma del mítico Pino Soñador. Set de 6 piezas.', isPromoted: false, sellerName: 'Carmen', stock: 8, image: '/images/fb_1.jpg' },
  { id: 5, title: 'Tapete Flores del Trigo', price: 50.00, category: 'Decoración', description: 'Tapete rectangular formado por unión de flores evocando los campos de trigo locales. Uso versátil.', isPromoted: false, sellerName: 'Rosa', stock: 5, image: '/images/fb_2.jpg' },
  { id: 6, title: 'Tapete Cielos Andinos 3D', price: 70.00, category: 'Decoración', description: 'Tapete blanco con relieves 3D que captura la inmensidad de los cielos andinos, ideal para centros de mesa elegantes.', isPromoted: true, sellerName: 'Victoria', stock: 2, image: '/images/fb_3.jpg' },
  { id: 7, title: 'Camino Imperial de Contumazá', price: 120.00, category: 'Mesa', description: 'Camino largo con medallones grandes que narra el talento ancestral en cada hebra. Una pieza de lujo.', isPromoted: true, sellerName: 'Carmen', stock: 1, image: '/images/fb_2.jpg' },
];

export const initialUsersData = [
  { id: 1, name: 'Victoria', email: 'victoria@tapetes.pe', role: 'seller', status: 'active', productsCount: 12, photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Victoria' },
  { id: 2, name: 'Rosa', email: 'rosa@tapetes.pe', role: 'seller', status: 'active', productsCount: 8, photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rosa' },
  { id: 3, name: 'Carmen', email: 'carmen@tapetes.pe', role: 'seller', status: 'inactive', productsCount: 5, photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carmen' },
  { id: 99, name: 'Admin', email: 'admin@tapetes.pe', role: 'superadmin', status: 'active', productsCount: 0, photo: 'https://api.dicebear.com/7.x/initials/svg?seed=AD' }
];
