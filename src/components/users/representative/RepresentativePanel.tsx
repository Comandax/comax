import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Edit, CreditCard, XCircle, Link2, CreditCard as PixIcon } from "lucide-react";
import { RepresentativePixModal } from "./RepresentativePixModal";
import { RepresentativeIdentifierModal } from "./RepresentativeIdentifierModal";

interface RepresentativePanelProps {
  referralLink: string;
  onCopyLink: () => void;
  representativeData: {
    id: string;
    identifier: string;
    pix_key: string | null;
  } | null;
  showIdentifierModal: boolean;
  setShowIdentifierModal: (show: boolean) => void;
  showPixModal: boolean;
  setShowPixModal: (show: boolean) => void;
  newIdentifier: string;
  setNewIdentifier: (value: string) => void;
  newPixKey: string;
  setNewPixKey: (value: string) => void;
  onUpdateIdentifier: () => Promise<void>;
  onUpdatePixKey: () => Promise<void>;
  isUpdating: boolean;
}

export function RepresentativePanel({
  referralLink,
  onCopyLink,
  representativeData,
  showIdentifierModal,
  setShowIdentifierModal,
  showPixModal,
  setShowPixModal,
  newIdentifier,
  setNewIdentifier,
  newPixKey,
  setNewPixKey,
  onUpdateIdentifier,
  onUpdatePixKey,
  isUpdating,
}: RepresentativePanelProps) {
  return (
    <div className="grid md:grid-cols-2 gap-6 mb-8">
      <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-2 border-primary/20 hover:border-primary/30 transition-all duration-300">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Link2 className="h-5 w-5 text-onSurfaceVariant" />
              <h2 className="text-xl font-semibold text-onSurfaceVariant">Seu Link de Indicação</h2>
            </div>
            <p className="text-sm text-muted-foreground">
              Compartilhe este link para convidar novos usuários. Você poderá acompanhar todos os usuários que se cadastrarem através dele.
            </p>
            <div className="flex gap-2">
              <Input
                value={referralLink}
                readOnly
                className="flex-1 bg-white/80 border-primary/30 focus:border-primary"
              />
              <Button 
                onClick={onCopyLink}
                className="bg-primary hover:bg-primary/90 text-white"
              >
                Copiar Link
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowIdentifierModal(true)}
                className="border-primary text-primary hover:bg-primary/10"
              >
                <Edit className="h-4 w-4 mr-2" />
                Editar ID
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-2 border-primary/20 hover:border-primary/30 transition-all duration-300">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <PixIcon className="h-5 w-5 text-onSurfaceVariant" />
              <h2 className="text-xl font-semibold text-onSurfaceVariant">Chave PIX</h2>
            </div>
            {representativeData?.pix_key ? (
              <>
                <p className="text-sm text-muted-foreground">
                  Sua chave PIX cadastrada para recebimento de comissões:
                </p>
                <div className="flex gap-2 items-center p-3 bg-white/80 rounded-lg border border-primary/30">
                  <CreditCard className="text-primary h-5 w-5" />
                  <span className="flex-1 font-medium text-foreground">{representativeData.pix_key}</span>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setNewPixKey(representativeData.pix_key || "");
                      setShowPixModal(true);
                    }}
                    className="border-primary text-primary hover:bg-primary/10"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 text-destructive p-3 bg-destructive/5 rounded-lg">
                  <XCircle className="h-5 w-5" />
                  <p>Nenhuma chave PIX cadastrada</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Cadastre uma chave PIX para receber suas comissões de forma automática.
                </p>
                <Button
                  variant="outline"
                  onClick={() => setShowPixModal(true)}
                  className="border-primary text-primary hover:bg-primary/10"
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Cadastrar Chave PIX
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <RepresentativeIdentifierModal
        isOpen={showIdentifierModal}
        onOpenChange={setShowIdentifierModal}
        identifier={newIdentifier}
        onIdentifierChange={setNewIdentifier}
        onSave={onUpdateIdentifier}
        isLoading={isUpdating}
      />

      <RepresentativePixModal
        isOpen={showPixModal}
        onOpenChange={setShowPixModal}
        pixKey={newPixKey}
        onPixKeyChange={setNewPixKey}
        onSave={onUpdatePixKey}
        isLoading={isUpdating}
        hasExistingKey={!!representativeData?.pix_key}
      />
    </div>
  );
}
