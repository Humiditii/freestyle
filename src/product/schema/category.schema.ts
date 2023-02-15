import {Prop,Schema,SchemaFactory} from '@nestjs/mongoose';
import {Document} from 'mongoose';

export type CategoryDocument = Category & Document;

@Schema()
export class Category {

    @Prop({required:true})
    adminId:string

    @Prop({required:true})
    categoryName:string

    @Prop({default: new Date()})
    createdAt:Date

    @Prop({default: new Date()})
    updatedAt:Date

}


export const CategorySchema = SchemaFactory.createForClass(Category)