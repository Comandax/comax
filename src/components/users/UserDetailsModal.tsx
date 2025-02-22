
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

interface UserDetailsModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string | null;
}

interface UserDetails {
  companyName: string | null;
  productsCount: number;
  ordersCount: number;
}

export function UserDetailsModal({ isOpen, onOpenChange, userId }: UserDetailsModalProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [details, setDetails] = useState<UserDetails | null>(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!userId) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // Fetch company information
        const { data: companies, error: companyError } = await supabase
          .from('companies')
          .select('id, name')
          .eq('owner_id', userId);

        if (companyError) throw companyError;
        
        const company = companies?.[0];
        
        if (company) {
          // Fetch products count
          const { count: productsCount } = await supabase
            .from('products')
            .select('*', { count: 'exact', head: true })
            .eq('company_id', company.id);

          // Fetch orders count
          const { count: ordersCount } = await supabase
            .from('orders')
            .select('*', { count: 'exact', head: true })
            .eq('company_id', company.id);

          setDetails({
            companyName: company.name,
            productsCount: productsCount || 0,
            ordersCount: ordersCount || 0,
          });
        } else {
          setDetails({
            companyName: null,
            productsCount: 0,
            ordersCount: 0,
          });
        }
      } catch (err: any) {
        console.error('Error fetching user details:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen && userId) {
      fetchUserDetails();
    }
  }, [isOpen, userId]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gradient-to-br from-primary/5 to-primary/10 border-2 border-primary/20">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary flex items-center gap-2">
            <div className="h-6 w-1 bg-primary rounded-full" />
            Detalhes do Usuário
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 p-6">
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Empresa</h3>
                <p className="text-lg font-medium">
                  {details?.companyName || "Empresa não cadastrada"}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Produtos Cadastrados</h3>
                  <p className="text-lg font-medium">{details?.productsCount}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Pedidos Recebidos</h3>
                  <p className="text-lg font-medium">{details?.ordersCount}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
