import mongoose from "mongoose";
import User from "./user.model";
import { Request, Response } from "express";

export const createUser = async (req: Request, res: Response) => {
  try {
    const { user, role, reportsTo } = req.body;
    const newUser = await User.create({ user, role, reportsTo });
    return res.status(200).json({
      success: true,
      message: "User created",
      user: newUser,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: "Cannot create User",
    });
  }
};


export const getUserWithReportees = async (req: Request, res: Response) => {
  try {
    const ObjectId = mongoose.Types.ObjectId;
    const { id } = req.params;
    const level = 3;
    const UsersInfo = await User.aggregate([
      {
        $match: { _id: new ObjectId(id) },
      },
      {
        $graphLookup: {
          from: "users",
          startWith: "$_id",
          connectFromField: "_id",
          connectToField: "reportsTo",
          as: "reportees",
          maxDepth: 10,
        },
      },
      {
        $project: {
          _id: "$_id",
          user: "$user",
          role: "$role",
          reportsTo: "$reportsTo",
          reportees: {
            $map: {
              input: {
                $filter: {
                  input: "$reportees",
                  as: "reportee",
                  cond: { $eq: ["$$reportee.reportsTo", "$_id"] },
                },
              },
              as: "reportee",
              in: {
                _id: "$$reportee._id",
                user: "$$reportee.user",
                role: "$$reportee.role",
                reportsTo: "$$reportee.reportsTo",
                reportees: {
                  $map: {
                    input: {
                      $filter: {
                        input: "$reportees",
                        as: "subreportee",
                        cond: {
                          $eq: ["$$subreportee.reportsTo", "$$reportee._id"],
                        },
                      },
                    },
                    as: "subreportee",
                    in: {
                      _id: "$$subreportee._id",
                      user: "$$subreportee.user",
                      role: "$$subreportee.role",
                      reportsTo: "$$subreportee.reportsTo",
                      reportees: {
                        $map: {
                          input: {
                            $filter: {
                              input: "$reportees",
                              as: "subsubreportee",
                              cond: {
                                $eq: ["$$subsubreportee.reportsTo","$$subreportee._id"],
                              },
                            },
                          },
                          as: "subsubreportee",
                          in: {
                            _id: "$$subsubreportee._id",
                            user: "$$subsubreportee.user",
                            role: "$$subsubreportee.role",
                            reportsTo: "$$subsubreportee.reportsTo",
                            reportees: [], // Add more levels if needed
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    ]);
    return res.status(200).json({
      success: true,
      message: "User fetched",
      user: UsersInfo,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: "Cannot fetch User",
    });
  }
};

// export const getUserWithReportees = async (req : Request, res:Response) => {
//     try {
//         const {id} = req.params;
//         const UsersInfo = await User.findById(id).populate({
//             path : 'reportsTo',
//             populate : {
//                 path : 'reportsTo',
//                 populate : {
//                     path : 'reportsTo'
//                 }
//             }
//         }) .exec();
//         return res.status(200).json({
//             success : true,
//             message : "User fetched",
//             user : UsersInfo
//         })
//     } catch (error) {
//         console.log(error);
//         return res.status(400).json({
//             success : false,
//             message : "Cannot fetch User",
//         })
//     }
// }
