import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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

export const ContactForm = ({ onSubmit }: ContactFormProps) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    onSubmit({
      name: formData.get("name") as string,
      whatsapp: formData.get("whatsapp") as string,
      state: formData.get("state") as string,
      city: formData.get("city") as string,
      zipCode: formData.get("zipCode") as string,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white/90 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Informações para contato</h2>
      
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Empresa ou Nome</Label>
          <Input id="name" name="name" required />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="whatsapp">WhatsApp (com DDD)</Label>
          <Input id="whatsapp" name="whatsapp" required />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="state">Estado</Label>
          <Input id="state" name="state" required />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="city">Cidade</Label>
          <Input id="city" name="city" required />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="zipCode">CEP</Label>
          <Input id="zipCode" name="zipCode" required />
        </div>
      </div>
    </form>
  );
};