import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";

interface ContactFormProps {
  onSubmit: (data: ContactFormData) => void;
}

export interface ContactFormData {
  name: string;
  whatsapp: string;
  city: string;
}

export const ContactForm = ({ onSubmit }: ContactFormProps) => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    whatsapp: "",
    city: "",
  });

  const formatWhatsApp = (value: string) => {
    // Remove todos os caracteres não numéricos
    const numbers = value.replace(/\D/g, '');
    
    // Aplica a máscara
    if (numbers.length <= 2) {
      return numbers;
    } else if (numbers.length <= 6) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    } else if (numbers.length <= 10) {
      // Formato para telefone fixo: (XX) XXXX-XXXX
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
    } else {
      // Formato para celular: (XX) X XXXX-XXXX
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 3)} ${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
    }
  };

  const handleInputChange = (field: keyof ContactFormData, value: string) => {
    if (field === 'whatsapp') {
      // Para o WhatsApp, primeiro formatamos o valor
      const formattedValue = formatWhatsApp(value);
      // Salvamos o valor formatado para exibição
      setFormData(prev => ({
        ...prev,
        [field]: formattedValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  // Update effect to automatically submit form data when it changes
  useEffect(() => {
    if (formData.name && formData.whatsapp && formData.city) {
      // Ao enviar o formulário, remova a formatação do WhatsApp
      const cleanFormData = {
        ...formData,
        whatsapp: formData.whatsapp.replace(/\D/g, ''),
      };
      onSubmit(cleanFormData);
    }
  }, [formData, onSubmit]);

  return (
    <div className="space-y-4 bg-white/90 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Informações para contato</h2>
      
      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Empresa ou Nome</Label>
          <Input 
            id="name" 
            name="name" 
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            required 
          />
        </div>
        
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="whatsapp">WhatsApp ou Telefone (com DDD)</Label>
            <Input
              id="whatsapp"
              name="whatsapp"
              type="tel"
              inputMode="numeric"
              value={formData.whatsapp}
              onChange={(e) => handleInputChange("whatsapp", e.target.value)}
              required
              className="md:text-sm"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="city">Cidade</Label>
            <Input
              id="city"
              name="city"
              value={formData.city}
              onChange={(e) => handleInputChange("city", e.target.value)}
              placeholder="Digite sua cidade"
              required
            />
          </div>
        </div>
      </div>
    </div>
  );
};