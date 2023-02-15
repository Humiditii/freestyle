export class CreateProductDto {
    adminId:string
    readonly productName:string
    readonly productDesc:string
    readonly productPrice:number
    readonly productQuantity:number
    readonly productImage:string
    readonly productCategory:string
}

export class GetProductsDto  extends CreateProductDto {
    readonly search:string
    readonly batch:number
    adminId:string
}

export class EditProductDto extends CreateProductDto{
    productId:string
}

export class QuantityDto {
    readonly amount:number
    productId:string
}