
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Login form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const user = await login(email, password);
      toast({
        title: "Login realizado com sucesso",
        description: "Você será redirecionado para o painel.",
      });
      
      // Se for superusuário, redireciona para a página de usuários
      if (user?.roles?.includes('superuser')) {
        navigate("/users");
      } else {
        navigate("/admin");
      }
    } catch (error: any) {
      // Verificar se é um erro de credenciais inválidas
      const errorMessage = error?.message || "";
      const errorBody = error?.body ? JSON.parse(error.body) : null;
      
      if (errorBody?.code === "invalid_credentials" || errorMessage.includes("Invalid login credentials")) {
        toast({
          variant: "destructive",
          title: "Credenciais inválidas",
          description: "E-mail ou senha incorretos. Por favor, verifique suas credenciais e tente novamente.",
        });
      } else if (errorMessage.includes("confirme seu email")) {
        toast({
          variant: "destructive",
          title: "E-mail não confirmado",
          description: "Por favor, confirme seu e-mail antes de fazer login. Verifique sua caixa de entrada.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Erro ao fazer login",
          description: "Ocorreu um erro inesperado. Por favor, tente novamente.",
        });
      }
      console.error("Erro de login:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-[#1A1F2C] p-4">
      <div className={`${isMobile ? 'mt-8' : 'mt-16'} mb-8`}>
        <img 
          src="/lovable-uploads/02adcbae-c4a2-4a37-8214-0e48d6485253.png" 
          alt="COMAX Logo" 
          className="h-20 w-auto"
        />
      </div>
      
      <Card className="w-full max-w-md mx-auto shadow-lg animate-fade-in bg-white/95">
        <CardHeader>
          <h2 className="text-2xl font-bold text-center text-gray-900">
            Acesse sua conta
          </h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Input
                  type="email"
                  required
                  placeholder="E-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full"
                />
              </div>
              <div>
                <Input
                  type="password"
                  required
                  placeholder="Senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
