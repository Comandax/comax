
import { useState, useEffect } from "react";
import { Plus, ChevronUp, ChevronDown, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Switch } from "@/components/ui/switch";
import { Company } from "@/types/company";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

type SortField = "name" | "responsible" | "created_at";
type SortOrder = "asc" | "desc";

export default function Companies() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [newCompany, setNewCompany] = useState<Partial<Company>>({});
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [expandedCompanyId, setExpandedCompanyId] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [editMode, setEditMode] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Company>>({});
  const { toast } = useToast();

  useEffect(() => {
    fetchCompanies();
  }, [sortField, sortOrder]);

  const fetchCompanies = async () => {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .order(sortField, { ascending: sortOrder === 'asc' });

    if (error) {
      toast({
        title: "Erro",
        description: "Erro ao carregar empresas",
        variant: "destructive",
      });
      return;
    }

    setCompanies(data);
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogoFile(e.target.files[0]);
    }
  };

  const uploadLogo = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('company-logos')
        .upload(fileName, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('company-logos')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading logo:', error);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompany.name || !newCompany.responsible || !newCompany.email || !newCompany.phone) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    let logoUrl = null;
    if (logoFile) {
      logoUrl = await uploadLogo(logoFile);
      if (!logoUrl) {
        toast({
          title: "Erro",
          description: "Falha ao fazer upload da logo.",
          variant: "destructive",
        });
        return;
      }
    }

    const { error } = await supabase
      .from('companies')
      .insert([{
        name: newCompany.name,
        responsible: newCompany.responsible,
        email: newCompany.email,
        phone: newCompany.phone,
        logo_url: logoUrl,
      }]);

    if (error) {
      toast({
        title: "Erro",
        description: "Erro ao cadastrar empresa",
        variant: "destructive",
      });
      return;
    }

    setNewCompany({});
    setLogoFile(null);
    toast({
      title: "Sucesso",
      description: "Empresa cadastrada com sucesso!",
    });
    fetchCompanies();
  };

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const startEdit = (company: Company) => {
    setEditMode(company.id);
    setEditData(company);
  };

  const handleUpdate = async () => {
    if (!editMode || !editData.name || !editData.responsible || !editData.email || !editData.phone) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    let logoUrl = editData.logo_url;
    if (logoFile) {
      logoUrl = await uploadLogo(logoFile);
      if (!logoUrl) {
        toast({
          title: "Erro",
          description: "Falha ao fazer upload da logo.",
          variant: "destructive",
        });
        return;
      }
    }

    const { error } = await supabase
      .from('companies')
      .update({
        name: editData.name,
        responsible: editData.responsible,
        email: editData.email,
        phone: editData.phone,
        logo_url: logoUrl,
        active: editData.active,
      })
      .eq('id', editMode);

    if (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar empresa",
        variant: "destructive",
      });
      return;
    }

    setEditMode(null);
    setEditData({});
    setLogoFile(null);
    toast({
      title: "Sucesso",
      description: "Empresa atualizada com sucesso!",
    });
    fetchCompanies();
  };

  const toggleCompanyStatus = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('companies')
      .update({ active: !currentStatus })
      .eq('id', id);

    if (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar status da empresa",
        variant: "destructive",
      });
      return;
    }

    fetchCompanies();
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortOrder === 'asc' ? <ChevronUp className="inline w-4 h-4" /> : <ChevronDown className="inline w-4 h-4" />;
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
              <div className="space-y-2">
                <Label htmlFor="logo">Logo da Empresa</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="logo"
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/80"
                  />
                  {logoFile && (
                    <span className="text-sm text-gray-500">
                      {logoFile.name}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <Button type="submit" className="w-full">
              <Plus className="mr-2 h-4 w-4" /> Adicionar Empresa
            </Button>
          </form>
        </Card>

        <Card className="p-4">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2 cursor-pointer" onClick={() => toggleSort('name')}>
                    Nome <SortIcon field="name" />
                  </th>
                  <th className="text-left p-2 cursor-pointer" onClick={() => toggleSort('responsible')}>
                    Responsável <SortIcon field="responsible" />
                  </th>
                  <th className="text-left p-2 cursor-pointer" onClick={() => toggleSort('created_at')}>
                    Data de Criação <SortIcon field="created_at" />
                  </th>
                  <th className="text-right p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {companies.map((company) => (
                  <>
                    <tr
                      key={company.id}
                      className="border-b hover:bg-gray-50 cursor-pointer"
                      onClick={() => setExpandedCompanyId(expandedCompanyId === company.id ? null : company.id)}
                    >
                      <td className="p-2">{company.name}</td>
                      <td className="p-2">{company.responsible}</td>
                      <td className="p-2">{format(new Date(company.created_at), 'dd/MM/yyyy HH:mm')}</td>
                      <td className="p-2 text-right">
                        <div className="flex items-center justify-end space-x-2" onClick={(e) => e.stopPropagation()}>
                          <Label htmlFor={`status-${company.id}`}>
                            {company.active ? "Ativo" : "Inativo"}
                          </Label>
                          <Switch
                            id={`status-${company.id}`}
                            checked={company.active}
                            onCheckedChange={() => toggleCompanyStatus(company.id, company.active)}
                          />
                        </div>
                      </td>
                    </tr>
                    {expandedCompanyId === company.id && (
                      <tr>
                        <td colSpan={4} className="p-4 bg-gray-50">
                          {editMode === company.id ? (
                            <div className="space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor="edit-name">Nome da Empresa</Label>
                                  <Input
                                    id="edit-name"
                                    value={editData.name || ""}
                                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit-responsible">Responsável</Label>
                                  <Input
                                    id="edit-responsible"
                                    value={editData.responsible || ""}
                                    onChange={(e) => setEditData({ ...editData, responsible: e.target.value })}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit-email">Email</Label>
                                  <Input
                                    id="edit-email"
                                    type="email"
                                    value={editData.email || ""}
                                    onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit-phone">Telefone</Label>
                                  <Input
                                    id="edit-phone"
                                    value={editData.phone || ""}
                                    onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit-logo">Logo da Empresa</Label>
                                  <div className="flex items-center gap-2">
                                    <Input
                                      id="edit-logo"
                                      type="file"
                                      accept="image/*"
                                      onChange={handleLogoChange}
                                      className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/80"
                                    />
                                    {(logoFile || editData.logo_url) && (
                                      <span className="text-sm text-gray-500">
                                        {logoFile ? logoFile.name : "Logo atual"}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="flex justify-end gap-2">
                                <Button variant="outline" onClick={() => {
                                  setEditMode(null);
                                  setEditData({});
                                  setLogoFile(null);
                                }}>
                                  Cancelar
                                </Button>
                                <Button onClick={handleUpdate}>
                                  Salvar
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              <div className="flex gap-4">
                                {company.logo_url && (
                                  <img
                                    src={company.logo_url}
                                    alt={`Logo ${company.name}`}
                                    className="w-24 h-24 object-cover rounded"
                                  />
                                )}
                                <div className="flex-1">
                                  <p><strong>Email:</strong> {company.email}</p>
                                  <p><strong>Telefone:</strong> {company.phone}</p>
                                  <p><strong>Status:</strong> {company.active ? "Ativo" : "Inativo"}</p>
                                </div>
                              </div>
                              <div className="flex justify-end">
                                <Button onClick={() => startEdit(company)}>
                                  Editar
                                </Button>
                              </div>
                            </div>
                          )}
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
