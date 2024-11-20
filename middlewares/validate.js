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
      .regex(/^[a-zA-Z0-9 ]+$/, "Username cannot contain symbols"),
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
      .regex(/^[a-zA-Z\s]+$/, "Username should contain only alphabets")
      .min(1, "Username cannot be empty"),
    fullname: z
      .string()
      .regex(/^[a-zA-Z\s]+$/, "Fullname should contain only alphabets")
      .min(1, "Fullname cannot be empty"),
    phone_number: z
      .string()
      .regex(/^0\d{10,}$/, "Phone number must be at least 11 digits starting with 0"),
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
const mentorSchema = z.object({
  body: z.object({
    fullname: z
      .string()
      .regex(/^[a-zA-Z\s]+$/, "Fullname should contain only alphabets")
      .min(1, "Fullname cannot be empty"),
    username: z
      .string()
      .regex(/^[a-zA-Z0-9]+$/, "Username cannot contain symbols or spaces")
      .min(1, "Username cannot be empty"),
    email: z
      .string()
      .email("Invalid email format")
      .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format")
      .min(1, "Email cannot be empty"),
    phoneNumber: z
      .string()
      .regex(/^0\d{10,15}$/, "Phone number must be at least 11 digits start with 0")
      .min(1, "Phone number cannot be empty"),
    dateOfBirth: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
      .min(1, "Date of Birth cannot be empty"),
    nik: z
      .string()
      .regex(/^\d{16}$/, "NIK must be exactly 16 digits")
      .min(1, "NIK cannot be empty"),
    linkedin: z
      .string()
      .url("Invalid LinkedIn URL")
      .min(1, "Linkedin URL cannot be empty"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters long"),
    bpjsKesehatan: z
      .string()
      .regex(/^\d+$/, "BPJS Kesehatan number must contain only digits")
      .min(1, "BPJS Kesehatan number cannot be empty"),
    bpjsTenagakerja: z
      .string()
      .regex(/^\d+$/, "BPJS Tenagakerja number must contain only digits")
      .min(1, "BPJS Tenagakerja number cannot be empty"),
    cv: z
      .string(),
    npwp: z
      .string()
      .regex(/^\d{15}$/, "NPWP must be exactly 15 digits")
      .min(1, "NPWP cannot be empty"),
    contract: z
      .string()
      .min(1, "contract cannot be empty"),
    contractStart: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Contract start date must be in YYYY-MM-DD format")
      .min(1, "Contract start date cannot be empty"),
    contractEnd: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Contract end date must be in YYYY-MM-DD format")
      .optional(), 
    roleId: z
      .string()
      .uuid("Invalid UUID format"),
    subCategoryId: z
      .string()
      .uuid("Invalid UUID format")
  }),
});
const updateMentorSchema = z.object({
  body: z
    .object({
      fullname: z
        .string()
        .min(1, "Fullname cannot be empty")
        .regex(/^[a-zA-Z\s]+$/, "Fullname should only contain letters and spaces")
        .optional(),
      username: z
        .string()
        .min(1, "Username cannot be empty")
        .regex(/^[a-zA-Z0-9]+$/, "Username can only contain letters and numbers")
        .optional(),
      email: z
        .string()
        .email("Invalid email format")
        .min(1, "Email cannot be empty")
        .optional(),
      phoneNumber: z
        .string()
        .regex(/^0\d{10,15}$/, "Phone number must be at least 11 digits starting with 0")
        .optional(),
      dateOfBirth: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Date of birth must be in YYYY-MM-DD format")
        .min(1, "Date of birth cannot be empty")
        .optional(),
      nik: z
        .string()
        .regex(/^\d{16}$/, "NIK must be 16 digits")
        .min(1, "NIK cannot be empty")
        .optional(),
      linkedin: z
        .string()
        .min(1, "Linkedin URL cannot be empty")
        .optional(),
      password: z
        .string()
        .min(6, "Password must be at least 6 characters")
        .optional(),
      bpjsKesehatan: z
        .string()
        .regex(/^\d+$/, "BPJS Kesehatan number must be numeric")
        .min(1, "BPJS Kesehatan number cannot be empty")
        .optional(),
      bpjsTenagakerja: z
        .string()
        .regex(/^\d+$/, "BPJS Tenagakerja number must be numeric")
        .min(1, "BPJS Tenagakerja number cannot be empty")
        .optional(),
      cv: z
        .string()
        .min(1, "cv cannot be empty")
        .optional(),
      npwp: z
        .string()
        .regex(/^\d{15}$/, "NPWP must be 15 digits")
        .min(1, "NPWP cannot be empty")
        .optional(),
      contract: z
        .string()
        .min(1, "NPWP cannot be empty")
        .optional(),
      contractStart: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Contract start date must be in YYYY-MM-DD format")
        .min(1, "Contract start date cannot be empty")
        .optional(),
      contractEnd: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Contract end date must be in YYYY-MM-DD format")
        .optional(),
      roleId: z
        .string()
        .uuid("Invalid UUID format for role ID")
        .optional(),
      subCategoryId: z
        .string()
        .uuid("Invalid UUID format for sub-category ID")
        .optional(),
    })
});
const deleteMentorSchema = z.object({
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
      .regex(/^[a-zA-Z0-9]+$/, "Role name should not contain by symbols")
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

const courseCategorySchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(1, "Category cannot be empty")
      .max(100, "Category name cannot exceed 100 characters")
      .regex(/^[\w\s!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+$/, "Title contains invalid characters"),
  }),
});

const deleteCourseCategorySchema = z.object({
  params: z.object({
    id: z
      .string()
      .uuid("Invalid UUID format"),
  }),
});

const subCourseCategorySchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(1, "Subcategory name cannot be empty")
      .max(100, "Subcategory name cannot exceed 100 characters")
      .regex(/^[\w\s!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+$/, "Title contains invalid characters"),
    categoriesId: z
      .string()
      .uuid("Invalid UUID format for categoriesId"),
  }),
});

const deleteSubCourseCategorySchema = z.object({
  params: z.object({
    id: z
      .string()
      .uuid("Invalid UUID format"),
  }),
});

const courseSchema = z.object({
  body: z.object({
    title : z
      .string()
      .min(1, "Course name cann be empty")
      .max(200, "Course name cannot exceed 200 characters")
      .regex(/^[\w\s!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+$/, "Title contains invalid characters"),
    description: z
      .string()
      .max(65535, "Description cannot exceed the TEXT limit of 65535 characters")
      .optional(),
  }),
});

const updateCourseSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid UUID format") 
  }),
  body: z.object({
    title : z
      .string()
      .min(1, "Course name cannot be empty")
      .max(200, "Course name cannot exceed 200 characters")
      .regex(/^[\w\s!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+$/, "Title contains invalid characters")
      .optional(), 
    description: z
      .string()
      .max(65535, "Description cannot exceed the TEXT limit of 65535 characters")
      .optional(),
  })
});

const deleteCourseSchema = z.object({
  params: z.object({
    id: z
      .string()
      .uuid("Invalid UUID format") 
  })
});

const moduleCourseSchema = z.object({
  body: z.object({
    title: z
      .string()
      .min(1, "Module title cannot be empty")
      .max(200, "Module title cannot exceed 200 characters")
      .regex(/^[\w\s!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+$/, "Title contains invalid characters"),
    description: z
      .string()
      .max(65535, "Description cannot exceed the TEXT limit of 65535 characters")
      .optional(),
  }),
});

const updateModuleCourseSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid UUID format for Module ID"),
  }),
  body: z.object({
    title: z
      .string()
      .min(1, "Module title cannot be empty")
      .max(200, "Module title cannot exceed 200 characters")
      .regex(/^[\w\s!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+$/, "Title contains invalid characters")
      .optional(),
    description: z
      .string()
      .max(65535, "Description cannot exceed the TEXT limit of 65535 characters")
      .optional(),
  })
});

const deleteModuleCourseSchema = z.object({
  params: z.object({
    id: z
      .string()
      .uuid("Invalid UUID format") 
  })
});

const subModuleCourseSchema = z.object({
  body: z.object({
    title: z
      .string()
      .min(1, "Sub-module title cannot be empty")
      .max(200, "Sub-module title cannot exceed 200 characters")
      .regex(/^[\w\s!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+$/, "Title contains invalid characters"),
    description: z
      .string()
      .max(16000, "Description cannot exceed 16000 characters")
      .optional(),
  }),
});

const updateSubModuleCourseSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid UUID format for Sub-module ID"),
  }),
  body: z.object({
    title: z
      .string()
      .min(1, "Sub-module title cannot be empty")
      .max(200, "Sub-module title cannot exceed 200 characters")
      .regex(/^[\w\s!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+$/, "Title contains invalid characters")
      .optional(),
    description: z
      .string()
      .max(16000, "Description cannot exceed 16000 characters")
      .optional()
  })
});

const deleteSubModuleCourseSchema = z.object({
  params: z.object({
    id: z
      .string()
      .uuid("Invalid UUID format") 
  })
});

const materialsSchema = z.object({
  body: z.object({
    content: z
      .string()
      .min(1, "Content cannot be empty")  
      .max(7000, "Content cannot exceed 7000 characters")
      .regex(/^[\w\s!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+$/, "Title contains invalid characters"),
  }),
});

const updateMaterialSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid UUID format"),
  }),
  body: z.object({
    content: z
      .string()
      .optional() 
  })
});

const deleteMaterialSchema = z.object({
  params: z.object({
    id: z
      .string()
      .uuid("Invalid UUID format") 
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
          field : issue.path[1],
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
  courseCategorySchema,
  deleteCourseCategorySchema,
  subCourseCategorySchema,
  deleteSubCourseCategorySchema,
  courseSchema,
  updateCourseSchema,
  deleteCourseSchema,
  moduleCourseSchema,
  subModuleCourseSchema,
  materialsSchema,
  updateMaterialSchema, 
  deleteMaterialSchema,
  moduleCourseSchema,
  updateModuleCourseSchema,
  deleteModuleCourseSchema,
  subModuleCourseSchema,
  updateSubModuleCourseSchema,
  deleteSubModuleCourseSchema,
  mentorSchema, 
  updateMentorSchema,
  deleteMentorSchema
};
