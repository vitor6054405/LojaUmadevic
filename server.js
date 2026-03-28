const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.post('/api/checkout', (req, res) => {
  const payload = req.body;
  // validação mínima
  if(!payload || !payload.customer || !Array.isArray(payload.items) || payload.items.length === 0){
    return res.status(400).json({ message: 'Pedido inválido' });
  }

  // Aqui você integraria com Mercado Pago / Stripe / gateway local
  // Simulação: gerar ID de pedido e retornar
  const orderId = uuidv4();
  console.log('=== Novo pedido ===');
  console.log({ orderId, payload });
  // Em produção: salvar no DB, enviar e-mail de confirmação, chamar gateway de pagamento etc.

  return res.json({ orderId, message: 'Pedido recebido (simulado)' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>console.log('Server rodando na porta', PORT));