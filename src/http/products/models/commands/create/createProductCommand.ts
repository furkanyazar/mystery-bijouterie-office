import CreateProductCommandProductMaterialListItemDto from "./createProductCommandProductMaterialListItemDto";

export default interface CreateProductCommand {
  categoryId?: number;
  name: string;
  barcodeNumber: string;
  purchasePrice: number;
  modelNumber: string;
  description?: string;
  unitsInStock: number;
  productMaterials: CreateProductCommandProductMaterialListItemDto[];
  stockCode: string;
}
