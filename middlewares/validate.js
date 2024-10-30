const { ZodError, z } = require("zod");

const loginSchema = z.object({
  body: z.object({
    email: z
      .string()
      .email("Invalid email format")
      .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format"),
    password: z
      .string()
      .regex(/^[\S]{6,}$/, "Password should be at least 6 characters with no spaces")
  })
});

const userSchema = z.object({
  body: z.object({
    username: z
      .string()
      .regex(/^[a-zA-Z0-9]+$/, "Username cannot field by symbols"),
    email: z 
      .string()
      .email("Invalid email format")
      .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format"),
    fullname: z
      .string()
      .regex(/^[a-zA-Z\s]+$/, "Fullname should contain only alphabets")
      .min(1, "Fullname cannot be empty"),
    roleId: z
      .string()
      .uuid("Invalid UUID format")
  })
});

const updateUserSchema = z.object({
  body: z.object({
    username: z
      .string()
      .regex(/^[a-zA-Z]+$/, "Username should contain only alphabets")
      .min(1, "Username cannot be empty"),
    fullname: z
      .string()
      .regex(/^[a-zA-Z\s]+$/, "Fullname should contain only alphabets")
      .min(1, "Fullname cannot be empty"),
    phone_number: z
      .string()
      .regex(/^0\d{10}$/, "Phone number must be 11 digits starting with 0"),
    address: z
      .string()
      .optional()
      .refine(val => val === undefined || /^[a-zA-Z0-9\s,.-]+$/.test(val), "Address format is invalid"),
    institute: z
      .string()
      .optional()
      .refine(val => val === undefined || /^[a-zA-Z0-9\s,.-]+$/.test(val), "Institute name should contain only with alphabets and spaces"),
    date_of_birth: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
    genderId: z
      .string()
      .uuid("Invalid UUID format"),
    ReligionId: z
      .string()
      .uuid("Invalid UUID format")
  }).partial()
});

const deleteUserSchema = z.object({
  params: z.object({
    id: z
      .string()
      .uuid("Invalid UUID format")
  })
});

const changeRoleSchema = z.object({
  params: z.object({
    id: z
      .string()
      .uuid("Invalid UUID format")
  }),
  body: z.object({
    roleId: z
      .string()
      .uuid("Invalid UUID format")
  })
});

const roleSchema = z.object({
  body: z.object({
    name: z
      .string()
      .regex(/^[a-zA-Z]+$/, "Role name should contain only alphabets")
      .min(1, "Role cannot be empty")
  })
});

const updateRoleSchema = z.object({
  params: z.object({
    id: z
      .string()
      .uuid("Invalid UUID format")
  }),
  body: z.object({
    name: z
      .string()
      .regex(/^[\w\s]+$/, "Role name should contain only alphanumeric characters and spaces")
      .min(1, "Role cannot be empty")
  })
});

const deleteRoleSchema = z.object({
  params: z.object({
    id: z
      .string()
      .uuid("Invalid UUID format")
  })
});

const permissionSchema = z.object({
  params: z.object({
    id: z
      .string()
      .uuid("Invalid UUID format")
  }),
  body: z.object({
    listModules: z
      .array(
        z.object({
          moduleId: z
            .number()
            .min(1, "Module ID cannot be empty"),
          canRead: z
            .number()
            .int() 
            .min(0, "Let this module read must be 0 or 1")
            .max(1, "Let this module read must be 0 or 1"),
          canCreate: z
            .number()
            .int()
            .min(0, "Let user create the module must be 0 or 1")
            .max(1, "Let user create the module must be 0 or 1"),
          canEdit: z
            .number()
            .int() 
            .min(0, "Let user edit the module must be 0 or 1")
            .max(1, "Let user edit the module must be 0 or 1"),
          canDelete: z
            .number()
            .int() 
            .min(0, "Let user delete the module must be 0 or 1")
            .max(1, "Let user delete the module must be 0 or 1")
        })
      )
      .nonempty("Permission cannot be empty")
  })
});

function validateMiddleware(schema) {
  return (req, res, next) => {
    try {
      schema.parse({
        params: req.params,
        body: req.body
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((issue) => ({
          message: issue.message,
        }));
        res.status(400).json({ error: "Invalid data", details: errorMessages });
      } else {
        res.status(500).json({ error: "Internal Server Error" });
      }
    }
  };
}

module.exports = {
  validateMiddleware,
  loginSchema,
  userSchema,
  updateUserSchema,
  deleteUserSchema,
  changeRoleSchema,
  roleSchema,
  updateRoleSchema,
  deleteRoleSchema,
  permissionSchema,
};


// const { ZodError, z } = require("zod");

// const loginSchema = z.object({
//   body: z.object({
//     email: z
//       .string()
//       .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format")
//       .email(),
//     password: z
//       .string()
//       .regex(/^[\S]{6,}$/, "Password should be at least 6 characters with no spaces")
//   })
// });

// const userSchema = z.object({
//   body: z.object({
//     username: z
//       .string()
//       .regex(/^[a-zA-Z]+$/, "Username should contain only with alphabets"),
//     email: z
//       .string()
//       .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format")
//       .email(),
//     fullname: z
//       .string()
//       .regex(/^[a-zA-Z]+$/, "Fullname should contain only with alphabets")
//       .min(1, "Fullname cannot be empty"),
//     roleId: z
//       .string()
//       .regex(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/, "Invalid UUID format")
//   })
// });

// const updateUserSchema = z.object({
//   body: z.object({
//     username: z
//       .string()
//       .regex(/^[a-zA-Z]+$/, "Username should contain only alphabets")
//       .min(1, "Username cannot be empty"),
//     fullname: z
//       .string()
//       .regex(/^[a-zA-Z]+$/, "Fullname should contain only with alphabets")
//       .min(1, "Fullname cannot be empty"),
//     phone_number: z
//       .string()
//       .regex(/^0\d{10}$/, "Phone number must be 11 digits starting with 0"),
//     address: z
//       .string()
//       .optional()
//       .regex(/^[\w\s,.-]{1,}$/, "Address format is invalid"),
//     institute: z
//       .string()
//       .optional()
//       .regex(/^[a-zA-Z\s]+$/, "Institute name should contain only with alphabets and spaces"),
//     date_of_birth: z
//       .string()
//       .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
//     genderId: z
//       .string()
//       .regex(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/, "Invalid UUID format"),
//     ReligionId: z
//       .string()
//       .regex(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/, "Invalid UUID format")
//   }).partial()
// });

// const deleteUserSchema = z.object({
//   params: z.object({
//     id: z
//       .string()
//       .regex(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/, "Invalid UUID format")
//   })
// });

// const changeRoleSchema = z.object({
//   params: z.object({
//     id: z
//       .string().uuid
//   }),
//   body: z.object({
//     roleId: z
//       .string().uuid()
//   })
// });

// const roleSchema = z.object({
//   body: z.object({
//     name: z
//       .string()
//       .regex(/^[a-zA-Z]+$/, "Role name should contain only alphabets")
//       .min(1, "Role cannot be empty")
//   })
// });

// const updateRoleSchema = z.object({
//   params: z.object({
//     id: z
//       .string()
//       .regex(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/, "Invalid UUID format")
//   }),
//   body: z.object({
//     name: z
//       .string()
//       .regex(/^[\w\s]+$/, "Role name should contain only alphanumeric characters and spaces")
//       .min(1, "Role cannot be empty")
//   })
// });

// const deleteRoleSchema = z.object({
//   params: z.object({
//     id: z
//       .string()
//       .regex(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/, "Invalid UUID format")
//   })
// });

// const permissionSchema = z.object({
//   params: z.object({
//     id: z
//       .string()
//       .regex(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/, "Invalid UUID format")
//   }),
//   body: z.object({
//     listModules: z
//       .array(
//         z.object({
//           moduleId: z
//             .number()
//             .min(1, "Module ID cannot be empty"),
//           canRead: z
//             .number()
//             .regex(/^[01]$/, "Let this module read"),
//           canCreate: z
//             .number()
//             .regex(/^[01]$/, "Let user create the module"),
//           canEdit: z
//             .number()
//             .regex(/^[01]$/, "Let user Edit the module"),
//           canDelete: z
//             .number()
//             .regex(/^[01]$/, "Let user delete the module")
//         })
//       )
//       .nonempty("Permission cannot be empty")
//   })
// });

// function validateMiddleware(schema) {
//   return (req, res, next) => {
//     try {
//       schema.parse({
//         params: req.params,
//         body: req.body
//       });
//       next();
//     } catch (error) {
//       if (error instanceof ZodError) {
//         const errorMessages = error.errors.map((issue) => ({
//           message: `${issue.message}`,
//         }));
//         res.status(400).json({ error: "Invalid data", details: errorMessages });
//       } else {
//         res.status(500).json({ error: "Internal Server Error" });
//       }
//     }
//   };
// }

// module.exports = {
//   validateMiddleware,
//   loginSchema,
//   userSchema,
//   updateUserSchema,
//   deleteUserSchema,
//   changeRoleSchema,
//   roleSchema,
//   updateRoleSchema,
//   deleteRoleSchema,
//   permissionSchema,
// };



