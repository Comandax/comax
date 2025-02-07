
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleInputChange = (field: keyof ContactFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleStateChange = (value: string) => {
    const state = states.find(s => s.id.toString() === value);
    setSelectedState(value);
    handleInputChange("state", state?.nome || "");
    handleInputChange("city", "");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white/90 p-6 rounded-lg shadow-md">
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
            value={formData.whatsapp}
            onChange={(e) => handleInputChange("whatsapp", e.target.value)}
            required 
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="state">Estado</Label>
          <Select 
            value={selectedState} 
            onValueChange={handleStateChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione um estado" />
            </SelectTrigger>
            <SelectContent>
              {states.map((state) => (
                <SelectItem key={state.id} value={state.id.toString()}>
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
            value={formData.zipCode}
            onChange={(e) => handleInputChange("zipCode", e.target.value)}
            required 
          />
        </div>
      </div>
    </form>
  );
};
