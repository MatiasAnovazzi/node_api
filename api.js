import express from 'express';
import { buscarProductos_tiendamovil, buscarProductos_celuphone, buscarProductos_evophone } from './script.js';

const app = express();
const PORT = 3000;

// Middleware para parsear JSON y permitir CORS
app.use(express.json());
app.use(cors());
app.get('/', (req, res) => {
    res.send('<h6>¡Funcionando!</h6>');
});
// Endpoint para buscar productos en todas las tiendas
app.post('/buscar', async (req, res) => {
    try {
        const { tienda, producto } = req.body;

        if (!producto) {
            return res.status(400).json({ error: 'Debes enviar "producto"' });
        }

        console.log(`🔍 Buscando "${producto}" en ${tienda || 'todas las tiendas'}...`);

        let resultados = {};

        if (tienda) {
            // Si el usuario elige una tienda específica
            switch (tienda.toLowerCase()) {
                case 'tiendamovil':
                    resultados.tiendamovil = await buscarProductos_tiendamovil(producto);
                    break;
                case 'celuphone':
                    resultados.celuphone = await buscarProductos_celuphone(producto);
                    break;
                case 'evophone':
                    resultados.evophone = await buscarProductos_evophone(producto);
                    break;
                default:
                    return res.status(400).json({ error: 'Tienda no soportada' });
            }
        } else {
            // Ejecutar todas las búsquedas en paralelo
            const [tm, cp, ep] = await Promise.all([
                buscarProductos_tiendamovil(producto),
                buscarProductos_celuphone(producto),
                buscarProductos_evophone(producto)
            ]);

            resultados = {
                tiendamovil: tm,
                celuphone: cp,
                evophone: ep
            };
        }

        res.json({ producto, resultados });

    } catch (error) {
        console.error('❌ Error en la API:', error);
        res.status(500).json({ error: 'Error al procesar la búsqueda' });
    }
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 API corriendo en http://localhost:${PORT}`);
});
