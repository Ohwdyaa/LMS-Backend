const { ZodError, z } = require("zod");

const fileSizeLimit = 5 * 1024 * 1024;

function validateEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return emailRegex.test(email);
}

const fileSchema = z.object({
  originalname: z.string(),
  mimetype: z.string().regex(/^(image\/(jpeg|png|jpg)|application\/pdf)$/),
  size: z.number().max(fileSizeLimit),
});

const loginSchema = z.object({
  body: z.object({
    email: z
      .string()
      .email("Invalid email format")
      .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format"),
    password: z
      .string()
      .regex(
        /^[\S]{6,}$/,
        "Password should be at least 6 characters with no spaces"
      ),
  }),
});

const userSchema = z.object({
  body: z.object({
    email: z
      .string()
      .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format")
      .email("Invalid email format")
      .min(1, "Email cannot be empty"),
    fullname: z
      .string()
      .regex(/^[a-zA-Z\s]+$/, "Fullname should contain only alphabets")
      .min(1, "Fullname cannot be empty"),
    phone_number: z
      .string()
      .regex(
        /^0\d{10,}$/,
        "Phone number must be at least 11 digits starting with 0"
      )
      .optional(),
    address: z.string().optional(),
    institute: z.string().optional(),
    date_of_birth: z.string().date().optional(),
    roleId: z
      .string()
      .uuid("Invalid UUID format")
      .min(1, "Role cannot be empty"),
    genderId: z.string().uuid("Invalid UUID format").optional(),
  }),
});

const updateUserSchema = z.object({
  body: z.object({
    email: z
      .string()
      .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format")
      .email("Invalid email format")
      .min(1, "Email cannot be empty"),
    fullname: z
      .string()
      .regex(/^[a-zA-Z\s]+$/, "Fullname should contain only alphabets")
      .min(1, "Fullname cannot be empty"),
    phone_number: z
      .string()
      .regex(
        /^0\d{10,}$/,
        "Phone number must be at least 11 digits starting with 0"
      )
      .optional(),
    address: z.string().optional(),
    institute: z.string().optional(),
    date_of_birth: z.string().date().optional(),
    genderId: z.string().uuid("Invalid UUID format").optional(),
  }),
});

const mentorSchema = z.object({
  files: z.object({
    profileImage: z.array(fileSchema).optional(),
    contract: z.array(fileSchema),
    cv: z.array(fileSchema),
  }),
  body: z.object({
    fullname: z
      .string()
      .regex(/^[a-zA-Z\s]+$/, "Fullname should contain only alphabets")
      .min(1, "Fullname cannot be empty"),
    email: z
      .string()
      .email("Invalid email format")
      .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format")
      .min(1, "Email cannot be empty"),
    phoneNumber: z
      .string()
      .regex(
        /^0\d{10,15}$/,
        "Phone number must be at least 11 digits start with 0"
      )
      .min(1, "Phone number cannot be empty"),
    dateOfBirth: z.string().date(),
    nik: z
      .string()
      .regex(/^\d{16}$/, "NIK must be exactly 16 digits")
      .min(1, "NIK cannot be empty"),
    linkedin: z
      .string()
      .regex(
        /^https?:\/\/(www\.)?linkedin\.com\/in\/.*$/,
        "Invalid Linkedin URL"
      )
      .min(1, "Linkedin URL cannot be empty"),
    bpjsKesehatan: z
      .string()
      .regex(/^\d+$/, "BPJS Kesehatan number must contain only digits")
      .min(1, "BPJS Kesehatan number cannot be empty"),
    bpjsTenagakerja: z
      .string()
      .regex(/^\d+$/, "BPJS Tenagakerja number must contain only digits")
      .min(1, "BPJS Tenagakerja number cannot be empty"),
    npwp: z
      .string()
      .regex(/^\d+$/, "NPWP must be a numeric string")
      .min(15, "NPWP must be at least 15 digits")
      .max(20, "NPWP must be at most 20 digits"),
    contractStart: z.string().date(),
    contractEnd: z.string().date().optional(),
    roleId: z
      .string()
      .uuid("Invalid UUID format")
      .min(1, "Role cannot be empty"),
    subCategoryId: z
      .string()
      .uuid("Invalid UUID format")
      .min(1, "Category cannot be empty"),
  }),
});
const updateMentorSchema = z.object({
  body: z.object({
    fullname: z
      .string()
      .min(1, "Fullname cannot be empty")
      .regex(
        /^[a-zA-Z\s]+$/,
        "Fullname should only contain letters and spaces"
      ),
    email: z
      .string()
      .email("Invalid email format")
      .min(1, "Email cannot be empty"),
    phoneNumber: z
      .string()
      .regex(
        /^0\d{10,15}$/,
        "Phone number must be at least 11 digits starting with 0"
      ),
    dateOfBirth: z.string().date(),
    nik: z
      .string()
      .regex(/^\d{16}$/, "NIK must be 16 digits")
      .min(1, "NIK cannot be empty"),
    linkedin: z
      .string()
      .regex(
        /^https?:\/\/(www\.)?linkedin\.com\/in\/.*$/,
        "Invalid Linkedin URL"
      )
      .min(1, "Linkedin URL cannot be empty"),
    bpjsKesehatan: z
      .string()
      .regex(/^\d+$/, "BPJS Kesehatan number must be numeric")
      .min(1, "BPJS Kesehatan number cannot be empty"),
    bpjsTenagakerja: z
      .string()
      .regex(/^\d+$/, "BPJS Tenagakerja number must be numeric")
      .min(1, "BPJS Tenagakerja number cannot be empty"),
    npwp: z
      .string()
      .regex(/^\d+$/, "NPWP must be a numeric string")
      .min(15, "NPWP must be at least 15 digits")
      .max(20, "NPWP must be at most 20 digits"),
    contractStart: z.string().date(),
    contractEnd: z.string().date().optional(),
    roleId: z
      .string()
      .uuid("Invalid UUID format for role ID")
      .min(1, "Role cannot be empty"),
    subCategoryId: z
      .string()
      .uuid("Invalid UUID format for sub-category ID")
      .min(1, "Category cannot be empty"),
  }),
});
const deleteMentorSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid UUID format"),
  }),
});

const changeRoleSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid UUID format"),
  }),
  body: z.object({
    roleId: z.string().uuid("Invalid UUID format"),
  }),
});

const roleSchema = z.object({
  body: z.object({
    name: z
      .string()
      .regex(/^[a-zA-Z0-9\s]+$/, "Role name should not contain by symbols")
      .min(1, "Role cannot be empty"),
  }),
});

const updateRoleSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid UUID format"),
  }),
  body: z.object({
    name: z
      .string()
      .regex(/^[a-zA-Z0-9\s]+$/, "Role name should not contain by symbols")
      .min(1, "Role cannot be empty"),
  }),
});

const permissionSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid UUID format"),
  }),
  body: z.object({
    listModules: z
      .array(
        z.object({
          moduleId: z.number().min(1, "Module ID cannot be empty"),
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
            .max(1, "Let user delete the module must be 0 or 1"),
        })
      )
      .nonempty("Permission cannot be empty"),
  }),
});

const courseCategorySchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(1, "Category cannot be empty")
      .max(100, "Category name cannot exceed 100 characters")
      .regex(
        /^[\w\s!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+$/,
        "Title contains invalid characters"
      ),
  }),
});

const deleteCourseCategorySchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid UUID format"),
  }),
});

const subCourseCategorySchema = z.object({
  body: z.object({
    name: z
      .string()
      .regex(
        /^[\w\s!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+$/,
        "Title contains invalid characters"
      )
      .min(1, "Name cannot be empty")
      .max(100, "Subcategory name cannot exceed 100 characters"),
    // categoriesId: z
    //   .string()
    //   .uuid("Invalid UUID format for categoriesId"),
  }),
});

const courseSchema = z.object({
  files: z.object({
    thumbnail: z.array(fileSchema).optional(),
  }),
  body: z.object({
    title: z.string().min(1, "Title cannot be empty"),
    description: z.string().min(1, "Description cannot be empty"),
    startDate: z.string().date(),
    endDate: z.string().date().optional(),
  }),
});

const updateCourseSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid UUID format"),
  }),
  files: z.object({
    thumbnail: z.array(fileSchema).optional(),
  }),
  body: z.object({
    title: z.string().min(1, "Title cannot be empty"),
    description: z.string().min(1, "Description cannot be empty"),
  }),
});

const moduleCourseSchema = z.object({
  body: z.object({
    title: z
      .string()
      .regex(
        /^[\w\s!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+$/,
        "Title contains invalid characters"
      )
      .min(1, "Module title cannot be empty")
      .max(200, "Module title cannot exceed 200 characters"),
    description: z
      .string()
      .max(
        65535,
        "Description cannot exceed the TEXT limit of 65535 characters" 
      )
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
      .regex(
        /^[\w\s!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+$/,
        "Title contains invalid characters"
      )
      .min(1, "Module title cannot be empty")
      .max(200, "Module title cannot exceed 200 characters")
      .optional(),
    description: z
      .string()
      .max(
        65535,
        "Description cannot exceed the TEXT limit of 65535 characters"
      )
      .optional(),
  }),
});

const subModuleCourseSchema = z.object({
  body: z.object({
    title: z
      .string()
      .regex(
        /^[\w\s!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+$/,
        "Title contains invalid characters"
      )
      .min(1, "Sub-module title cannot be empty")
      .max(200, "Sub-module title cannot exceed 200 characters"),
    contentTypeId: z.string().uuid().min(1, "Content type is required"),
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
      .regex(
        /^[\w\s!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+$/,
        "Title contains invalid characters"
      ),
    description: z
      .string()
      .max(16000, "Description cannot exceed 16000 characters")
      .optional(),
  }),
});

const materialsSchema = z.object({
  body: z.object({
    content: z
      .string()
      .min(1, "Content cannot be empty")
      .max(7000, "Content cannot exceed 7000 characters")
      .regex(
        /^[\w\s!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+$/,
        "Title contains invalid characters"
      ),
  }),
});

const updateMaterialSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid UUID format"),
  }),
  body: z.object({
    content: z.string().optional(),
  }),
});

const deleteMaterialSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid UUID format"),
  }),
});

function validateMiddleware(schema) {
  return (req, res, next) => {
    try {
      if (req.files) {
        schema.parse({
          params: req.params,
          files: req.files,
          body: req.body,
        });
      } else {
        schema.parse({
          params: req.params,
          body: req.body,
        });
      }
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((issue) => ({
          field: issue.path[1],
          message: issue.message,
        }));
        res
          .status(400)
          .json({ message: "Invalid data", details: errorMessages });
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  };
}

module.exports = {
  validateEmail,
  validateMiddleware,
  loginSchema,
  userSchema,
  updateUserSchema,
  changeRoleSchema,
  roleSchema,
  updateRoleSchema,
  permissionSchema,
  courseCategorySchema,
  deleteCourseCategorySchema,
  subCourseCategorySchema,
  courseSchema,
  updateCourseSchema,
  moduleCourseSchema,
  subModuleCourseSchema,
  materialsSchema,
  updateMaterialSchema,
  deleteMaterialSchema,
  moduleCourseSchema,
  updateModuleCourseSchema,
  subModuleCourseSchema,
  updateSubModuleCourseSchema,
  mentorSchema,
  updateMentorSchema,
  deleteMentorSchema,
};
