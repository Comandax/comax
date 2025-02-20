
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createRepresentative } from "@/services/representativeService";
import { RepresentativeForm } from "@/components/representatives/RepresentativeForm";
import { RepresentativeFormData } from "@/types/representative";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function RepresentativeCreate() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { mutate: createNewRepresentative, isPending: isCreating } = useMutation({
    mutationFn: createRepresentative,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['representatives'] });
      toast({
        title: "Cadastro realizado com sucesso!",
        description: "Por favor, faça login para acessar sua conta.",
      });
      navigate('/login');
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Erro ao criar representante",
        description: error.message,
      });
    },
  });

  const handleSubmit = async (data: RepresentativeFormData) => {
    return new Promise<void>((resolve, reject) => {
      createNewRepresentative(data, {
        onSuccess: () => resolve(),
        onError: (error) => reject(error),
      });
    });
  };

  return (
    <div className="min-h-screen bg-[#1A1F2C]">
      <div className="bg-gray-900/50 shadow-md">
        <div className="container mx-auto">
          <div className="max-w-2xl mx-auto px-4">
            <div className="py-1.5">
              <img 
                src="/lovable-uploads/02adcbae-c4a2-4a37-8214-0e48d6485253.png" 
                alt="COMAX Logo" 
                className="h-8 w-auto"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-8">
        <Card className="w-full max-w-2xl mx-auto shadow-lg bg-white/95 p-6">
          <h1 className="text-2xl font-bold mb-6 text-gray-900">Cadastro de Representante</h1>
          
          <Alert className="mb-6" variant="default">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Importante</AlertTitle>
            <AlertDescription>
              Ao se cadastrar como representante, você terá acesso às funcionalidades específicas para representantes.
            </AlertDescription>
          </Alert>

          <RepresentativeForm
            onSubmit={handleSubmit}
            isLoading={isCreating}
          />
        </Card>
      </div>
    </div>
  );
}
