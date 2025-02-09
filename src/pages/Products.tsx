import { useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useQuery } from "@tanstack/react-query";
import type { Product, ProductFormData } from "@/types/product";

// Mock data function to simulate API calls
const mockData = {
  products: [
    {
      _id: "65c14c53ebe1ad654f459e81",
      reference: "3001",
      name: "Calcinha Infantil com botão",
      sizes: [
        { size: "P", value: 5.76 },
        { size: "M", value: 5.76 },
        { size: "G", value: 5.76 },
        { size: "GG", value: 5.76 },
      ],
      quantities: [6, 12, 18, 24, 36, 48, 60, 72, 84, 96, 108, 120],
      disabled: false,
      companyId: "1",
    },
    {
      _id: "65c14c98ebe1ad654f459e82",
      reference: "3002",
      name: "Cueca Feminina Infantil (algodão)",
      sizes: [
        { size: "P", value: 7.54 },
        { size: "M", value: 7.54 },
        { size: "G", value: 7.54 },
        { size: "GG", value: 7.54 },
      ],
      quantities: [6, 12, 18, 24, 36, 48, 60, 72, 84, 96, 108, 120],
      disabled: false,
      companyId: "1",
    },
    {
      _id: "65c14cceebe1ad654f459e84",
      reference: "3003",
      name: "Calcinha Infantil Acapulco (sainha)",
      sizes: [
        { size: "PP", value: 12.5 },
        { size: "P", value: 12.5 },
        { size: "M", value: 12.5 },
        { size: "G", value: 12.5 },
      ],
      quantities: [6, 12, 18, 24, 36, 48, 60, 72, 84, 96, 108, 120],
      disabled: false,
      companyId: "1",
    },
    {
      _id: "65c14d05ebe1ad654f459e85",
      reference: "3004",
      name: "Calcinha Infantil Babadinho Perna",
      sizes: [
        { size: "PP", value: 5.96 },
        { size: "P", value: 5.96 },
        { size: "M", value: 5.96 },
        { size: "G", value: 5.96 },
        { size: "GG", value: 5.96 },
      ],
      quantities: [6, 12, 18, 24, 36, 48, 60, 72, 84, 96, 108, 120],
      disabled: false,
      companyId: "1",
    },
    {
      _id: "65c14d42ebe1ad654f459e87",
      reference: "3005",
      name: "Calcinha Infantil Cós Personalizado",
      sizes: [
        { size: "PP", value: 5.86 },
        { size: "P", value: 5.86 },
        { size: "M", value: 5.86 },
        { size: "G", value: 5.86 },
        { size: "GG", value: 5.86 },
      ],
      quantities: [6, 12, 18, 24, 36, 48, 60, 72, 84, 96, 108, 120],
      disabled: false,
      companyId: "1",
    },
    {
      _id: "65c14d59ebe1ad654f459e88",
      reference: "3006",
      name: "Calcinha Infantil Babadinho no Cós",
      sizes: [
        { size: "PP", value: 5.76 },
        { size: "P", value: 5.76 },
        { size: "M", value: 5.76 },
        { size: "G", value: 5.76 },
        { size: "GG", value: 5.76 },
      ],
      quantities: [6, 12, 18, 24, 36, 48, 60, 72, 84, 96, 108, 120],
      disabled: false,
      companyId: "1",
    },
    {
      _id: "65c14d73ebe1ad654f459e89",
      reference: "3008",
      name: "Calcinha Infantil Babadinho nas Costas",
      sizes: [
        { size: "P", value: 6.96 },
        { size: "M", value: 6.96 },
        { size: "G", value: 6.96 },
      ],
      quantities: [6, 12, 18, 24, 36, 48, 60, 72, 84, 96, 108, 120],
      disabled: false,
      companyId: "1",
    },
    {
      _id: "65c14db4ebe1ad654f459e8b",
      reference: "3011",
      name: "Calcinha Infantil Sophia",
      sizes: [
        { size: "P", value: 7.1 },
        { size: "M", value: 7.1 },
        { size: "G", value: 7.1 },
      ],
      quantities: [6, 12, 18, 24, 36, 48, 60, 72, 84, 96, 108, 120],
      disabled: true,
      companyId: "1",
    },
  ],
};

const fetchProducts = async (companyId: string = "1"): Promise<Product[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const products = mockData.products.filter(
        (product) => product.companyId === companyId
      );
      resolve(products);
    }, 500);
  });
};

const formSchema = z.object({
  reference: z.string().min(4, "Referência deve ter no mínimo 4 caracteres"),
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  sizes: z.array(
    z.object({
      size: z.string(),
      value: z.number().min(0),
    })
  ),
  quantities: z.array(z.number()),
});

const Products = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { toast } = useToast();

  const { data: products = [], refetch } = useQuery({
    queryKey: ["products", "1"], // Hardcoded companyId for now
    queryFn: () => fetchProducts("1"),
  });

  const form = useForm<ProductFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reference: "",
      name: "",
      sizes: [],
      quantities: [6, 12, 18, 24, 36, 48, 60, 72, 84, 96, 108, 120],
    },
  });

  const onSubmit = async (data: ProductFormData) => {
    try {
      console.log("Form submitted:", data);
      // Aqui você implementaria a chamada real para a API
      toast({
        title: selectedProduct
          ? "Produto atualizado com sucesso!"
          : "Produto criado com sucesso!",
      });
      form.reset();
      refetch();
    } catch (error) {
      toast({
        title: "Erro ao salvar produto",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    form.reset({
      reference: product.reference,
      name: product.name,
      sizes: product.sizes,
      quantities: product.quantities,
    });
  };

  const handleDelete = async (productId: string) => {
    try {
      // Aqui você implementaria a chamada real para a API
      console.log("Deleting product:", productId);
      toast({
        title: "Produto excluído com sucesso!",
      });
      refetch();
    } catch (error) {
      toast({
        title: "Erro ao excluir produto",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Produtos</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2" />
              Novo Produto
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selectedProduct ? "Editar Produto" : "Novo Produto"}
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="reference"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Referência</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Salvar</Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Referência</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product._id}>
              <TableCell>{product.reference}</TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell>
                {product.disabled ? "Inativo" : "Ativo"}
              </TableCell>
              <TableCell className="text-right">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(product)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Editar Produto</DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                      <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                      >
                        <FormField
                          control={form.control}
                          name="reference"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Referência</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nome</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button type="submit">Salvar</Button>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Excluir Produto</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tem certeza que deseja excluir este produto? Esta ação não
                        pode ser desfeita.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(product._id)}
                      >
                        Excluir
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Products;
