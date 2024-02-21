import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";


@Schema({
    timestamps: true
})
export class User extends Document{
    @Prop()
    username:string

    @Prop()
    name:string

    @Prop({unique: [true, "Duplicate email! Please enter unique email..."]})
    email:string

    @Prop()
    password:string
}

export const userSchema = SchemaFactory.createForClass(User);

