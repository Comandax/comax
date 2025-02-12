
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Company } from "@/types/company";

interface CompanyEditFormProps {
  company: Company;
  onCancel: () => void;
  onSave: (editData: Partial<Company>, logoFile: File | null) => Promise<void>;
}

export function CompanyEditForm({ company, onCancel, onSave }: CompanyEditFormProps) {
  const [editData, setEditData] = useState<Partial<Company>>(company);
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogoFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    await onSave(editData, logoFile);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <Label htmlFor="edit-name">Nome da Empresa</Label>
          <Input
            id="edit-name"
            value={editData.name || ""}
            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
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
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button onClick={handleSubmit}>
          Salvar
        </Button>
      </div>
    </div>
  );
}
