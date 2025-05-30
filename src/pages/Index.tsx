
import { LoadingState } from "@/components/index/LoadingState";
import { NotFoundState } from "@/components/index/NotFoundState";
import { IndexContent } from "./index/components/IndexContent";
import { useOrderCalculations } from "@/components/index/hooks/useOrderCalculations";
import { useIndexData } from "./index/hooks/useIndexData";
import { useOrderState } from "./index/hooks/useOrderState";
import { useOrderSubmission } from "./index/hooks/useOrderSubmission";

const Index = () => {
  const { company, products, isLoading, isLoadingProducts, error, shortName } = useIndexData();
  
  const {
    isModalOpen,
    setIsModalOpen,
    selectedItems,
    setSelectedItems,
    contactData,
    setContactData,
    resetItem,
    handleQuantitySelect,
    handleContactSubmit,
    handleRemoveItem
  } = useOrderState();

  const { total, orderItems } = useOrderCalculations(selectedItems, products);

  const { handleSubmitOrder } = useOrderSubmission({
    company,
    contactData,
    selectedItems,
    orderItems,
    total,
    shortName,
    setSelectedItems,
    setContactData,
    setIsModalOpen
  });

  if (isLoading) return <LoadingState />;
  if (error || !company) return <NotFoundState error={error} />;

  return (
    <IndexContent
      company={company}
      products={products}
      isLoadingProducts={isLoadingProducts}
      total={total}
      orderItems={orderItems}
      isModalOpen={isModalOpen}
      setIsModalOpen={setIsModalOpen}
      resetItem={resetItem}
      onQuantitySelect={handleQuantitySelect}
      onContactSubmit={handleContactSubmit}
      onSubmitOrder={handleSubmitOrder}
      onRemoveItem={handleRemoveItem}
    />
  );
};

export default Index;
