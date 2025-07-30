const mongoose = require("mongoose");
const inventoryModel = require("../models/inventoryModel");
const userModel = require("../models/userModel");


const createInventoryController = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      throw new Error("User Not Found Please enter valid email address");
    }

    if (req.body.inventoryType == "out") {
      const requestedBloodGroup = req.body.bloodGroup;
      console.log(requestedBloodGroup);
      const requestedQuantityOfBlood = req.body.quantity;
      const organisation = new mongoose.Types.ObjectId(req.body.userId);
      console.log(organisation);

      const totalInOfRequestedBlood = await inventoryModel.aggregate([
        {
          $match: {
            organisation,
            inventoryType: "in",
            bloodGroup: requestedBloodGroup,
          },
        },
        {
          $group: {
            _id: "$bloodGroup",
            total: { $sum: "$quantity" },
          },
        },
      ]);
      const toatlIn = totalInOfRequestedBlood[0]?.total || 0;
      console.log("totalInOfRequestedBlood" + toatlIn);

      const totalOutOfRequestedBloodGroup = await inventoryModel.aggregate([
        {
          $match: {
            organisation,
            inventoryType: "out",
            bloodGroup: requestedBloodGroup,
          },
        },
        {
          $group: {
            _id: "bloodGroup",
            total: { $sum: "$quantity" },
          },
        },
      ]);
      const toatlOut = totalOutOfRequestedBloodGroup[0]?.total || 0;
      console.log("totalOutOfRequestedBloodGroup" + toatlOut);


      const availableQuanityOfBloodGroup = toatlIn - toatlOut;
      console.log("Avilable" + availableQuanityOfBloodGroup);


      if (availableQuanityOfBloodGroup < requestedQuantityOfBlood) {
        return res.status(500).send({
          success: false,
          message: `Only ${availableQuanityOfBloodGroup} ML of ${requestedBloodGroup.toUpperCase()} is avilable`,
        });
      }
      req.body.hospital = user?._id;
    } else if (req.body.inventoryType == "in") {
      req.body.donar = user?._id;
    }

    const inventory = new inventoryModel(req.body);
    await inventory.save();
    return res.status(201).send({
      success: true,
      message: "New Record Created successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: error.message,
      error,
    });
  }
};


const getInventoryHospitalController = async (req, res) => {
  try {
    const inventory = await inventoryModel
      .find(req.body.filters)
      .populate("donar")
      .populate("hospital")
      .populate("organisation")
      .sort({ createdAt: -1 });
    return res.status(200).send({
      success: true,
      message: "get hospitals consumers recodes successfully ",
      inventory,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "error in get consumer inventory ",
      error,
    });
  }
};


const getInventoryController = async (req, res) => {
  try {
    const inventory = await inventoryModel
      .find({
        organisation: req.body.userId,
      })
      .populate("donar")
      .populate("hospital")
      .sort({ createdAt: -1 });
    return res.status(200).send({
      success: true,
      message: "get all records successfully",
      inventory,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "error in get All inventory ",
      error,
    });
  }
};


const getRecentInventoryController = async (req, res) => {
  try {
    const inventory = await inventoryModel
      .find({
        organisation: req.body.userId,
      })
      .limit(3)
      .sort({ createdAt: -1 });

    return res.status(200).send({
      success: true,
      message: "Recent Inventory Data",
      inventory,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error in recent inventory API ",
      error,
    });
  }
};


const getDonarsController = async (req, res) => {
  try {
    const organisation = req.body.userId;

    const donarId = await inventoryModel.distinct("donar", { organisation });

    const donars = await userModel.find({ _id: { $in: donarId } });

    return res.status(200).send({
      success: true,
      message: "Donar Record Fetched Successfully",
      donars,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in Donar records",
      error,
    });
  }
};


const getHospitalsController = async (req, res) => {
  try {
    const organisation = req.body.userId;

    const hospitalId = await inventoryModel.distinct("hospital", {
      organisation,
    });
    const hospitals = await userModel.find({ _id: { $in: hospitalId } });
    return res.status(200).send({
      success: true,
      message: "Hospital Record Fetched Successfully",
      hospitals,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in hospitals records",
      error,
    });
  }
};


const getOrganisationController = async (req, res) => {
  try {
    const donar = req.body.userId;

    const organisationId = await inventoryModel.distinct("organisation", {
      donar,
    });

    const organisations = await userModel.find({
      _id: { $in: organisationId },
    });

    return res.status(200).send({
      success: true,
      message: "organisation Record Fetched Successfully",
      organisations,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in organisation records",
      error,
    });
  }
};


const getOrganisationForHospitalController = async (req, res) => {
  try {
    const hospital = req.body.userId;

    const organisationId = await inventoryModel.distinct("organisation", {
      hospital,
    });

    const organisations = await userModel.find({
      _id: { $in: organisationId },
    });

    return res.status(200).send({
      success: true,
      message: "organisation Record for hospital Fetched Successfully",
      organisations,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in organisation records",
      error,
    });
  }
};

module.exports = {
  createInventoryController,
  getInventoryController,
  getDonarsController,
  getHospitalsController,
  getOrganisationController,
  getOrganisationForHospitalController,
  getInventoryHospitalController,
  getRecentInventoryController,
};
