import CreatedProductResponseCategoryCategoryPartnerListItemDto from "./createdProductResponseCategoryCategoryPartnerListItemDto";
import CreatedProductResponseProductMaterialListItemDto from "./createdProductResponseProductMaterialListItemDto";

export default interface CreatedProductResponse {
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
  categoryCategoryPartners: CreatedProductResponseCategoryCategoryPartnerListItemDto[];
  productMaterials: CreatedProductResponseProductMaterialListItemDto[];
}
