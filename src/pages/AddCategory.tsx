import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Category } from "@/interface/Category";
import { addCategory } from "@/services/categoryService";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

const AddCategory = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Category>();
  const navigate = useNavigate();

  const addProductMutation = useMutation({
    mutationFn: (newCategory: Category) => addCategory(newCategory),
    onSuccess: () => {
      toast.success("Product created successfully!");
      navigate("/");
    },
    onError: (error) => {
      toast.error(`Failed to create product: ${(error as Error).message}`);
    },
  });

  const onSubmit = (data: Category) => {
    addProductMutation.mutate(data);
  };
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl mb-4">Add Category</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label className="block mb-2">Name</label>
          <input
            type="text"
            {...register("name", { required: true, minLength: 3 })}
            className="border p-2 w-full"
          />
          {errors.name && (
            <span className="text-red-700 text-[12px]">
              Tên không được để trống và trên 3 ký tự
            </span>
          )}
        </div>
        <button type="submit" className="bg-blue-500 text-white p-2">
          Add Category
        </button>
      </form>
    </div>
  );
};

export default AddCategory;
