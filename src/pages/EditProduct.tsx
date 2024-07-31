import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { getProductById, updateProduct } from "../services/productService";
import { getAllCategories } from "../services/categoryService";
import { Product } from "@/interface/Product";
import { Category } from "@/interface/Category";

const EditProduct = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { register, handleSubmit, setValue } = useForm<Product>();

  const { data: product } = useQuery<Product>({
    queryKey: ["product", id],
    queryFn: () => getProductById(Number(id)),
  });

  const { data: categories } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: getAllCategories,
  });

  const updateProductMutation = useMutation({
    mutationFn: (updatedProduct: Product) =>
      updateProduct(Number(id), updatedProduct),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product updated successfully!");
      navigate("/dashboard");
    },
    onError: () => {
      toast.error("Failed to update product.");
    },
  });

  useEffect(() => {
    if (product) {
      setValue("name", product.name);
      setValue("price", product.price);
      setValue("category", product.category);
    }
  }, [product, setValue]);

  const onSubmit = (data: Product) => {
    updateProductMutation.mutate(data);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl mb-4">Edit Product</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label className="block mb-2">Name</label>
          <input {...register("name")} className="border p-2 w-full" />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Price</label>
          <input
            type="number"
            {...register("price")}
            className="border p-2 w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Category</label>
          <select {...register("category")} className="border p-2 w-full">
            {categories?.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="bg-blue-500 text-white p-2">
          Save
        </button>
      </form>
    </div>
  );
};

export default EditProduct;
