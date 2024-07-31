import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { getAllCategories } from "../services/categoryService";
import { Product } from "@/interface/Product";
import { Category } from "@/interface/Category";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { addProduct } from "@/services/productService";

const AddProduct = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Product>();
  const [categories, setCategories] = useState<Category[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const fetchedCategories = await getAllCategories();
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const addProductMutation = useMutation({
    mutationFn: (newProduct: Product) => addProduct(newProduct),
    onSuccess: () => {
      toast.success("Product created successfully!");
      navigate("/");
    },
    onError: (error) => {
      toast.error(`Failed to create product: ${(error as Error).message}`);
    },
  });

  const onSubmit = (data: Product) => {
    addProductMutation.mutate(data);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl mb-4">Add Product</h1>
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
        <div className="mb-4">
          <label className="block mb-2">Image</label>
          <input
            type="text"
            {...register("image", { required: true })}
            className="border p-2 w-full"
          />
          {errors.image && (
            <span className="text-red-700 text-[12px]">
              Ảnh không được để trống
            </span>
          )}
        </div>
        <div className="mb-4">
          <label className="block mb-2">Price</label>
          <input
            type="number"
            {...register("price", { required: true, pattern: /^\d*$/ })}
            className="border p-2 w-full"
          />
          {errors.price && (
            <span className="text-red-700 text-[12px]">Giá phải lớn hơn 0</span>
          )}
        </div>
        <div className="mb-4">
          <label className="block mb-2">Category</label>
          <select
            {...register("category", { required: true })}
            className="border p-2 w-full"
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          {errors.category && (
            <span className="text-red-700 text-[12px]">
              Danh mục không được để trống
            </span>
          )}
        </div>
        <button type="submit" className="bg-blue-500 text-white p-2">
          Add Product
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
