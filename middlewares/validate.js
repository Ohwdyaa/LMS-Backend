const { ZodError, z } = require("zod");

const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(10)
  })
});

const userSchema = z.object({
  body: z.object({
    username: z.string().min(5),
    email: z.string().email(),
    fullname: z.string().min(1, "require"),
    roleId: z.string().uuid()
  })
});

const updateUserSchema = z.object({
  body: z.object({
    username: z.string().min(5),
    fullname: z.string().min(1, "require")  ,
    phone_number: z.string().regex(/^0\d{11}$/),
    address: z.string().optional(),
    institute: z.string().optional(),
    date_of_birth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/)
  }).partial()
});

const deleteUserSchema = z.object({
  params: z.object({
    id: z.string().uuid()
  })
});

const changeRoleSchema = z.object({
  params: z.object({
    id: z.string().uuid()
  }),
  body: z.object({
    roleId: z.string().uuid()
  })
});

const roleSchema = z.object({
  body: z.object({
    name: z.string().min(1, "require")
  })
})
const updateRoleSchema = z.object({
  params: z.object({
    id: z.string().uuid()
  }),
  body: z.object({
    name: z.string().min(1, "require")
  })
})

function validateMiddleware(schema) {
  return (req, res, next) => {
    try {
      schema.parse({
        body: req.body, 
        params: req.params
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((issue) => ({
          message: `${issue.path.join(".")} is ${issue.message}`,
        }));
        res.status(400).json({ error: "Invalid data", details: errorMessages});
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
};

// function validateEmail(email) {
//   const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   return re.test(String(email).toLowerCase());
// }