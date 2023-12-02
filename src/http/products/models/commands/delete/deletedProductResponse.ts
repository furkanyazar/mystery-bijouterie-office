import DeletedProductResponseCategoryCategoryPartnerListItemDto from "./deletedProductResponseCategoryCategoryPartnerListItemDto";
import DeletedProductResponseProductMaterialListItemDto from "./deletedProductResponseProductMaterialListItemDto";

export default interface DeletedProductResponse {
  id: number;
  categoryId?: number;
  name: string;
  barcodeNumber: string;
  purchasePrice: number;
  salePrice: number;
  categoryName?: string;
  modelNumber: string;
  description?: string;
  imageUrl?: string;
  status: boolean;
  categoryCategoryPartners: DeletedProductResponseCategoryCategoryPartnerListItemDto[];
  productMaterials: DeletedProductResponseProductMaterialListItemDto[];
}
