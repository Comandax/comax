
import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Switch } from "@/components/ui/switch";
import { Company } from "@/types/company";

const mockCompanies: Company[] = [
  {
    id: "1",
    name: "Empresa Teste",
    responsible: "João Silva",
    email: "joao@empresa.com",
    phone: "(11) 99999-9999",
    active: true,
  },
];

export default function Companies() {
  const [companies, setCompanies] = useState<Company[]>(mockCompanies);
  const [newCompany, setNewCompany] = useState<Partial<Company>>({});
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompany.name || !newCompany.responsible || !newCompany.email || !newCompany.phone) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    const company: Company = {
      id: Date.now().toString(),
      name: newCompany.name,
      responsible: newCompany.responsible,
      email: newCompany.email,
      phone: newCompany.phone,
      active: true,
    };

    setCompanies([...companies, company]);
    setNewCompany({});
    toast({
      title: "Sucesso",
      description: "Empresa cadastrada com sucesso!",
    });
  };

  const toggleCompanyStatus = (id: string) => {
    setCompanies(companies.map(company => 
      company.id === id ? { ...company, active: !company.active } : company
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-primary to-secondary p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-8">Administração de Empresas</h1>
        </div>

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome da Empresa</Label>
                <Input
                  id="name"
                  value={newCompany.name || ""}
                  onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
                  placeholder="Nome da empresa"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="responsible">Responsável</Label>
                <Input
                  id="responsible"
                  value={newCompany.responsible || ""}
                  onChange={(e) => setNewCompany({ ...newCompany, responsible: e.target.value })}
                  placeholder="Nome do responsável"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newCompany.email || ""}
                  onChange={(e) => setNewCompany({ ...newCompany, email: e.target.value })}
                  placeholder="email@empresa.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  value={newCompany.phone || ""}
                  onChange={(e) => setNewCompany({ ...newCompany, phone: e.target.value })}
                  placeholder="(00) 00000-0000"
                />
              </div>
            </div>
            <Button type="submit" className="w-full">
              <Plus className="mr-2 h-4 w-4" /> Adicionar Empresa
            </Button>
          </form>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {companies.map((company) => (
            <Card key={company.id} className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{company.name}</h3>
                  <p className="text-sm text-gray-600">Responsável: {company.responsible}</p>
                  <p className="text-sm text-gray-600">Email: {company.email}</p>
                  <p className="text-sm text-gray-600">Telefone: {company.phone}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Label htmlFor={`status-${company.id}`}>
                    {company.active ? "Ativo" : "Inativo"}
                  </Label>
                  <Switch
                    id={`status-${company.id}`}
                    checked={company.active}
                    onCheckedChange={() => toggleCompanyStatus(company.id)}
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
