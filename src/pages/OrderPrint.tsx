import { useParams, Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { Order } from "@/types/order";

const formatPhoneNumber = (phone: string) => {
  const cleaned = phone.replace(/\\D/g, '');
  if (cleaned.length === 11) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 3)} ${cleaned.slice(3, 7)}-${cleaned.slice(7)}`;
  } else if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
};

const formatZipCode = (zipCode: string) => {
  const cleaned = zipCode.replace(/\\D/g, '');
  if (cleaned.length === 8) {
    return `${cleaned.slice(0, 5)}-${cleaned.slice(5)}`;
  }
  return zipCode;
};

const formatDate = (dateStr: string) => {
  try {
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day, 12, 0, 0);
    return format(date, "dd/MM/yyyy", { locale: ptBR });
  } catch (error) {
    console.error('Erro ao formatar data:', error, 'Data recebida:', dateStr);
    return dateStr;
  }
};

const formatTime = (timeStr: string) => {
  return timeStr.split(':').slice(0, 2).join(':');
};

const OrderPrint = () => {
  const { orderId } = useParams();
  
  const { data: order, isLoading, error } = useQuery({
    queryKey: ['order-print', orderId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();
      
      if (error) {
        console.error('Error fetching order:', error);
        throw error;
      }
      
      // Transformar os dados no formato esperado
      const transformedOrder: Order = {
        _id: data.id,
        customerName: data.customer_name,
        customerPhone: data.customer_phone,
        customerCity: data.customer_city,
        customerState: data.customer_state,
        customerZipCode: data.customer_zip_code,
        date: data.date,
        time: data.time,
        items: Array.isArray(data.items) 
          ? data.items.map((item: any) => ({
              productId: item.productId,
              reference: item.reference,
              name: item.name,
              sizes: Array.isArray(item.sizes) 
                ? item.sizes.map((size: any) => ({
                    size: size.size,
                    price: size.price,
                    quantity: size.quantity,
                    subtotal: size.subtotal
                  }))
                : []
            }))
          : [],
        total: data.total,
        companyId: data.company_id,
        notes: data.notes || undefined
      };
      
      return transformedOrder;
    }
  });

  // Efeito para acionar a impressão automaticamente quando os dados carregarem
  useEffect(() => {
    if (order && !isLoading) {
      // Pequeno atraso para garantir que o DOM esteja renderizado
      const timer = setTimeout(() => {
        window.print();
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [order, isLoading]);

  // Adiciona estilo específico para impressão no carregamento
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @media print {
        @page { margin: 0.8cm; }
        body { font-size: 10pt; }
        .print-header { margin-bottom: 15px; }
        .print-container { width: 100%; }
        .no-print { display: none !important; }
        h1 { font-size: 16pt; }
        h2 { font-size: 12pt; }
        table { font-size: 9pt; }
        .compact-spacing { margin-bottom: 0.5rem; }
        td, th { padding: 0.3rem !important; }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  if (error) {
    return <Navigate to="/orders" replace />;
  }
  
  if (isLoading || !order) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando detalhes do pedido...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="print-container p-4 max-w-4xl mx-auto">
      <div className="print-header flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold">Detalhes do Pedido</h1>
          <p className="text-gray-600">Código: {order._id}</p>
        </div>
        <button 
          onClick={() => window.print()} 
          className="no-print px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
        >
          Imprimir
        </button>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="border p-4 rounded-lg">
          <h2 className="font-semibold text-md mb-1 border-b pb-1">Informações do Pedido</h2>
          <div className="space-y-1">
            <p><span className="font-medium">Data:</span> {formatDate(order.date)}</p>
            <p><span className="font-medium">Hora:</span> {formatTime(order.time)}</p>
            {order.notes && (
              <div>
                <p className="font-medium">Observações:</p>
                <p className="text-gray-700 whitespace-pre-wrap bg-gray-50 p-2 rounded">{order.notes}</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="border p-4 rounded-lg">
          <h2 className="font-semibold text-md mb-1 border-b pb-1">Informações do Cliente</h2>
          <div className="space-y-1">
            <p><span className="font-medium">Nome:</span> {order.customerName}</p>
            <p><span className="font-medium">Telefone:</span> {formatPhoneNumber(order.customerPhone)}</p>
            <p><span className="font-medium">Cidade/Estado:</span> {order.customerCity}/{order.customerState}</p>
            <p><span className="font-medium">CEP:</span> {formatZipCode(order.customerZipCode)}</p>
          </div>
        </div>
      </div>
      
      <h2 className="font-semibold text-md mb-2 border-b pb-1">Itens do Pedido</h2>
      
      {order.items.map((item, index) => (
        <div key={`${item.productId}-${index}`} className="mb-3 border rounded-lg overflow-hidden">
          <div className="bg-gray-100 p-2 font-semibold text-sm">
            {item.reference} - {item.name}
          </div>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 text-xs">
                <th className="border p-1 text-left">Tamanho</th>
                <th className="border p-1 text-left">Quantidade</th>
                <th className="border p-1 text-right">Preço Unit.</th>
                <th className="border p-1 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {item.sizes.map((size, sizeIndex) => (
                <tr key={`${item.productId}-${size.size}-${sizeIndex}`} className={sizeIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="border p-1 text-xs">{size.size}</td>
                  <td className="border p-1 text-xs">{size.quantity}</td>
                  <td className="border p-1 text-xs text-right">R$ {size.price.toFixed(2)}</td>
                  <td className="border p-1 text-xs text-right">R$ {size.subtotal.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
      
      <div className="mt-6 text-right">
        <div className="inline-block border rounded-lg overflow-hidden">
          <div className="bg-gray-100 p-3 text-lg font-bold">
            Total do Pedido: R$ {order.total.toFixed(2)}
          </div>
        </div>
      </div>
      
      <div className="mt-12 text-center text-gray-500 text-sm no-print">
        <p>Este documento é apenas um resumo do pedido para impressão.</p>
      </div>
    </div>
  );
};

export default OrderPrint;
