
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UserForm } from "./UserForm";
import { ProfileFormData } from "@/types/profile";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface UserEditModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserEditModal({ isOpen, onOpenChange }: UserEditModalProps) {
  const { user, refreshUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: ProfileFormData) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          phone: data.phone,
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      if (data.password && data.password.trim() !== '') {
        const { error: passwordError } = await supabase.auth.updateUser({
          password: data.password,
        });

        if (passwordError) throw passwordError;
      }

      await refreshUser();
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-gradient-to-br from-primary/5 to-primary/10 border-2 border-primary/20">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary flex items-center gap-2">
            <div className="h-6 w-1 bg-primary rounded-full" />
            Editar Perfil
          </DialogTitle>
        </DialogHeader>
        <div className="p-6">
          <UserForm
            initialData={{
              first_name: user.first_name,
              last_name: user.last_name,
              email: user.email || '',
              phone: user.phone || '',
              password: '',
              confirmPassword: '',
            }}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
