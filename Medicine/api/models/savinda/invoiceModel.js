import mongoose from "mongoose";

const invoiceSchema = mongoose.Schema({
    customerName:String,
    customerEmail:String,
    Items: [{
        itemId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'item',
          required: true
        },
        quantity: Number,
        price: Number,
      }],
      total:Number,

})



const invoiceModel = mongoose.model("Sinvoice", invoiceSchema);

export default invoiceModel;
