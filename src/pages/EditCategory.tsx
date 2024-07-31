import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { getCategoryById, updateCategory } from "../services/categoryService";
import { Category } from "@/interface/Category";

const EditCategory = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { register, handleSubmit, setValue } = useForm<Category>();

  const { data: category } = useQuery<Category>({
    queryKey: ["category", id],
    queryFn: () => getCategoryById(Number(id)),
  });

  const updateCategoryMutation = useMutation({
    mutationFn: (updatedCategory: Category) =>
      updateCategory(Number(id), updatedCategory),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category updated successfully!");
      navigate("/dashboard");
    },
    onError: () => {
      toast.error("Failed to update category.");
    },
  });

  useEffect(() => {
    if (category) {
      setValue("name", category.name);
    }
  }, [category, setValue]);

  const onSubmit = (data: Category) => {
    updateCategoryMutation.mutate(data);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl mb-4">Edit Category</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label className="block mb-2">Name</label>
          <input {...register("name")} className="border p-2 w-full" />
        </div>
        <button type="submit" className="bg-blue-500 text-white p-2">
          Save
        </button>
      </form>
    </div>
  );
};

export default EditCategory;
