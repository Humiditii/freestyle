import { HttpException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Product, ProductDocument } from "./schema/product.schema";
import { CategoryDto, CreateProductDto, EditProductDto, GetProductsDto, QuantityDto } from "./dto/product.dto";
import { Model } from "mongoose";
import { Err } from "src/common/interfaces/interfaces";
import { Category, CategoryDocument } from "./schema/category.schema";

@Injectable()
export class ProductService {

    constructor(
        @InjectModel(Product.name) private productModel:Model<ProductDocument>,
        @InjectModel(Category.name) private categoryModel:Model<CategoryDocument>
    ){}

    private readonly ISE: string = 'Internal server error';
    private readonly limit: number = 10;

    async createProduct(createProductDto:CreateProductDto):Promise<Product>{
        try {
            return await this.productModel.create(createProductDto)
        } catch (error) {
            throw new HttpException(error?.message ? error.message : this.ISE,
                error?.status ? error.status : 500)
        }
    }

    async viewProducts(getProductsDto:Partial<GetProductsDto>):Promise<Product[]>{
        try {

            const regex = new RegExp(getProductsDto.search)

            // this is a filter object used to filter/narrow selection
            const filter = {
                ...( getProductsDto?.search ? {productName: {$regex:regex}} : null ),
                ...( getProductsDto?.productCategory ? {productCategory: getProductsDto.productCategory } : null)
            }
            // return the products with limits
            return await this.productModel.find(filter).
            lean().
            skip( this.skipperFunc(this.limit,getProductsDto.batch) ).
            limit(this.limit).
            sort({createdAt:-1})

        } catch (error) {
            throw new HttpException(error?.message ? error.message : this.ISE,
                error?.status ? error.status : 500)
        }
    }

    async viewSingleProduct(productId:string):Promise<Product>{
        try {
            return await this.productModel.findById(productId).lean()
        } catch (error) {
            throw new HttpException(error?.message ? error.message : this.ISE,
                error?.status ? error.status : 500)
        }
    }

    async editProduct(editProductDto:EditProductDto):Promise<Product>{
        try {
            // update product and return the updated version
            return await this.productModel.findByIdAndUpdate(editProductDto.productId, editProductDto, {new: true})
        } catch (error) {
            throw new HttpException(error?.message ? error.message : this.ISE,
                error?.status ? error.status : 500)
        }
    }

    async deleteProduct(productId:string):Promise<void>{
        try {
            await this.productModel.findByIdAndDelete(productId).exec()
        } catch (error) {
            throw new HttpException(error?.message ? error.message : this.ISE,
                error?.status ? error.status : 500)
        }
    }

    async updatePrductQuantity(quantityDto:QuantityDto):Promise<any>{
        try {
            // validate the productId passed
            if( !await this.productModel.findById(quantityDto.productId) ){
                
                const err:Err = {
                    message: 'Invalid product selected!',
                    status: 400
                }
          
                throw new HttpException(err.message, err.status)
            }

            // increase or reduce the productQuantity
            return await this.productModel.findByIdAndUpdate(quantityDto.productId, {$inc : {'productQuantity' : quantityDto.amount}}, {new: true})

        } catch (error) {
            throw new HttpException(error?.message ? error.message : this.ISE,
                error?.status ? error.status : 500)
        }
    }

    async createProductCategory(categoryDto:CategoryDto):Promise<Category>{
        try {
            if( await this.categoryModel.findOne(categoryDto).exec() ){
                const err:Err = {
                    message: 'Invalid category, category exist for this admin!',
                    status: 400
                }
                throw new HttpException(err.message, err.status)
            }
            return await this.categoryModel.create(categoryDto)
        } catch (error) {
            throw new HttpException(error?.message ? error.message : this.ISE,
                error?.status ? error.status : 500)
        }
    }

    async viewCategory(adminId:string):Promise<any>{
        try {
            return await this.categoryModel.find({ adminId: adminId }).lean()
        } catch (error) {
            throw new HttpException(error?.message ? error.message : this.ISE,
                error?.status ? error.status : 500)
        }
    }

    async deleteCategory(categoryId:string):Promise<void>{
        try {
            await this.categoryModel.findByIdAndDelete(categoryId)
        } catch (error) {
            throw new HttpException(error?.message ? error.message : this.ISE,
                error?.status ? error.status : 500)   
        }
    }

    // this is used to calculate the pagination
    private skipperFunc(unit:number,batch:number=1):number{
        // ReLU function
        return Math.max(0, (unit*batch) - unit )
    }

}