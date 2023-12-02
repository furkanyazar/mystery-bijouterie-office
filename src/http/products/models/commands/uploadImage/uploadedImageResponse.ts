import UploadedImageResponseCategoryCategoryPartnerListItemDto from "./uploadedImageResponseCategoryCategoryPartnerListItemDto";
import UploadedImageResponseProductMaterialListItemDto from "./uploadedImageResponseProductMaterialListItemDto";

export default interface UploadedImageResponse {
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
  categoryCategoryPartners: UploadedImageResponseCategoryCategoryPartnerListItemDto[];
  productMaterials: UploadedImageResponseProductMaterialListItemDto[];
}
