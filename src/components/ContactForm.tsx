
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";

interface ContactFormProps {
  onSubmit: (data: ContactFormData) => void;
}

export interface ContactFormData {
  name: string;
  whatsapp: string;
  state: string;
  city: string;
  zipCode: string;
}

interface State {
  id: number;
  sigla: string;
  nome: string;
}

interface City {
  id: number;
  nome: string;
}

const fetchStates = async (): Promise<State[]> => {
  const response = await fetch(
    "https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome"
  );
  return response.json();
};

const fetchCities = async (stateId: string): Promise<City[]> => {
  if (!stateId) return [];
  const response = await fetch(
    `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${stateId}/municipios?orderBy=nome`
  );
  return response.json();
};

export const ContactForm = ({ onSubmit }: ContactFormProps) => {
  const [selectedState, setSelectedState] = useState("");
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    whatsapp: "",
    state: "",
    city: "",
    zipCode: "",
  });

  const { data: states = [] } = useQuery({
    queryKey: ["states"],
    queryFn: fetchStates,
  });

  const { data: cities = [] } = useQuery({
    queryKey: ["cities", selectedState],
    queryFn: () => fetchCities(selectedState),
    enabled: !!selectedState,
  });

  const formatWhatsApp = (value: string) => {
    // Remove todos os caracteres não numéricos
    const numbers = value.replace(/\D/g, '');
    
    // Aplica a máscara
    if (numbers.length <= 2) {
      return numbers;
    } else if (numbers.length <= 3) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    } else if (numbers.length <= 7) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 3)} ${numbers.slice(3)}`;
    } else if (numbers.length <= 11) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 3)} ${numbers.slice(3, 7)}-${numbers.slice(7)}`;
    } else {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 3)} ${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
    }
  };

  const formatCEP = (value: string) => {
    // Remove todos os caracteres não numéricos
    const numbers = value.replace(/\D/g, '');
    
    // Aplica a máscara
    if (numbers.length <= 2) {
      return numbers;
    } else if (numbers.length <= 5) {
      return `${numbers.slice(0, 2)}.${numbers.slice(2)}`;
    } else if (numbers.length <= 8) {
      return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}-${numbers.slice(5)}`;
    } else {
      return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}-${numbers.slice(5, 8)}`;
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
    } else if (field === 'zipCode') {
      // Para o CEP, aplicamos a formatação
      const formattedValue = formatCEP(value);
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

  const handleStateChange = (value: string) => {
    const state = states.find(s => s.sigla === value);
    setSelectedState(state?.id.toString() || "");
    handleInputChange("state", value);
    handleInputChange("city", "");
  };

  // Update effect to automatically submit form data when it changes
  useEffect(() => {
    if (formData.name && formData.whatsapp && formData.city && formData.zipCode) {
      // Ao enviar o formulário, remova a formatação do WhatsApp e CEP
      const cleanFormData = {
        ...formData,
        whatsapp: formData.whatsapp.replace(/\D/g, ''),
        zipCode: formData.zipCode.replace(/\D/g, '')
      };
      onSubmit(cleanFormData);
    }
  }, [formData, onSubmit]);

  return (
    <div className="space-y-4 bg-white/90 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Informações para contato</h2>
      
      <div className="grid gap-4 md:grid-cols-2">
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
        
        <div className="space-y-2">
          <Label htmlFor="whatsapp">WhatsApp (com DDD)</Label>
          <Input
            id="whatsapp"
            name="whatsapp"
            type="tel"
            inputMode="numeric"
            value={formData.whatsapp}
            onChange={(e) => handleInputChange("whatsapp", e.target.value)}
            placeholder="(00) 0 0000-0000"
            required
            className="md:text-sm"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="state">Estado</Label>
          <Select 
            value={formData.state} 
            onValueChange={handleStateChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione um estado" />
            </SelectTrigger>
            <SelectContent>
              {states.map((state) => (
                <SelectItem key={state.id} value={state.sigla}>
                  {state.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="city">Cidade</Label>
          <Select 
            value={formData.city} 
            onValueChange={(value) => handleInputChange("city", value)}
            disabled={!selectedState}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma cidade" />
            </SelectTrigger>
            <SelectContent>
              {cities.map((city) => (
                <SelectItem key={city.id} value={city.nome}>
                  {city.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="zipCode">CEP</Label>
          <Input
            id="zipCode"
            name="zipCode"
            type="tel"
            inputMode="numeric"
            value={formData.zipCode}
            onChange={(e) => handleInputChange("zipCode", e.target.value)}
            placeholder="00.000-000"
            required
            className="md:text-sm"
          />
        </div>
      </div>
    </div>
  );
};
