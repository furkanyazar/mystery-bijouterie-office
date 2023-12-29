import UpdateProductCommandProductMaterialListItemDto from "./updateProductCommandProductMaterialListItemDto";

export default interface UpdateProductCommand {
  id: number;
  categoryId?: number;
  name: string;
  barcodeNumber: string;
  purchasePrice: number;
  modelNumber: string;
  description?: string;
  unitsInStock: number;
  productMaterials: UpdateProductCommandProductMaterialListItemDto[];
  stockCode?: string;
}
