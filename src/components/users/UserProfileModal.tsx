
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { Profile } from "@/types/profile";

interface UserProfileModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  profile: Profile | null;
  onEditClick: () => void;
}

export function UserProfileModal({ isOpen, onOpenChange, profile, onEditClick }: UserProfileModalProps) {
  if (!profile) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gradient-to-br from-primary/5 to-primary/10 border-2 border-primary/20">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary flex items-center gap-2">
            <div className="h-6 w-1 bg-primary rounded-full" />
            Meu Perfil
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 p-6">
          <div className="grid gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Nome Completo</h3>
              <p className="text-lg font-medium">{`${profile.first_name} ${profile.last_name}`}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Email</h3>
              <p className="text-lg">{profile.email}</p>
            </div>

            {profile.phone && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Telefone</h3>
                <p className="text-lg">{profile.phone}</p>
              </div>
            )}
          </div>

          <div className="flex justify-end mt-6">
            <Button 
              onClick={() => {
                onOpenChange(false);
                onEditClick();
              }}
              className="gap-2 text-onPrimary"
            >
              <User className="w-4 h-4" />
              Editar Perfil
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
