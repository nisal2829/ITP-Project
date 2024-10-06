import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    petId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    userId: {
      type: String,
      required: true,
      trim: true,
    },
    namee: {
      type: String,
      required: true,
      trim: true,
    },
    brand: {
      type: String,
      required: true,
      trim: true,
    },
    suppliername: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: String,
      required: true,
      trim: true,
    },

    quentity: {
      type: String,
      required: true,
      trim: true,
    },
    returndate: {
      type: String,
      required: true,
      trim: true,
    },
    manufacturedate: {
      type: String,
      required: true,
      trim: true,
    },
    purchasedate: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    percriptionrequired: {
      type: String,
      required: true,
      trim: true,
    },

    profilePicture: {
      type: String,
      default:
        "https://media.istockphoto.com/id/1294866141/vector/picture-reload.jpg?s=612x612&w=is&k=20&c=Ei6q4n6VkP3B0R30d1VdZ4i11CFbyaEoAFy6_WEbArE=",
    },
  },
  { timestamps: true }
);

const Item = mongoose.model("SItems", itemSchema);

export default Item;
