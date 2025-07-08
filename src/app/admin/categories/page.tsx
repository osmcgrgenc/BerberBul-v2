"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/app/lib/supabase";
import { useRouter } from "next/navigation";

import { BusinessCategory } from "@/app/types";
import ErrorMessage from "@/app/components/ErrorMessage";
import LoadingSpinner from "@/app/components/LoadingSpinner";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<BusinessCategory[]>([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategorySlug, setNewCategorySlug] = useState("");
  const [editingCategory, setEditingCategory] =
    useState<BusinessCategory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAdmin = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        router.push("/auth/login");
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profileError || !profile || profile.role !== "admin") {
        router.push("/"); // Redirect to home or unauthorized page
        return;
      }
      fetchCategories();
    };
    checkAdmin();
  }, [router]);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from("business_categories")
      .select("id, name, slug");

    if (error) {
      console.error("Error fetching categories:", error);
      setError("Kategoriler yüklenirken bir hata oluştu.");
    } else {
      setCategories(data);
    }
    setLoading(false);
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!newCategoryName || !newCategorySlug) {
      setError("İsim ve slug boş bırakılamaz.");
      return;
    }

    const { data, error } = await supabase
      .from("business_categories")
      .insert({ name: newCategoryName, slug: newCategorySlug })
      .select()
      .single();

    if (error) {
      console.error("Error adding category:", error);
      setError("Kategori eklenirken bir hata oluştu.");
    } else {
      setCategories([...categories, data]);
      setNewCategoryName("");
      setNewCategorySlug("");
    }
  };

  const handleEditCategory = (category: BusinessCategory) => {
    setEditingCategory(category);
    setNewCategoryName(category.name);
    setNewCategorySlug(category.slug);
  };

  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!editingCategory || !newCategoryName || !newCategorySlug) {
      setError("İsim ve slug boş bırakılamaz.");
      return;
    }

    const { data, error } = await supabase
      .from("business_categories")
      .update({ name: newCategoryName, slug: newCategorySlug })
      .eq("id", editingCategory.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating category:", error);
      setError("Kategori güncellenirken bir hata oluştu.");
    } else {
      setCategories(categories.map((cat) => (cat.id === data.id ? data : cat)));
      setEditingCategory(null);
      setNewCategoryName("");
      setNewCategorySlug("");
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (
      !confirm(
        "Bu kategoriyi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz."
      )
    )
      return;

    setError(null);
    const { error } = await supabase
      .from("business_categories")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting category:", error);
      setError("Kategori silinirken bir hata oluştu.");
    } else {
      setCategories(categories.filter((cat) => cat.id !== id));
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Kategori Yönetimi
      </h1>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          {editingCategory ? "Kategori Düzenle" : "Yeni Kategori Ekle"}
        </h2>
        <form
          onSubmit={editingCategory ? handleUpdateCategory : handleAddCategory}
          className="space-y-4"
        >
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Kategori Adı
            </label>
            <input
              type="text"
              id="name"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              required
            />
          </div>
          <div>
            <label
              htmlFor="slug"
              className="block text-sm font-medium text-gray-700"
            >
              Slug (URL Dostu İsim)
            </label>
            <input
              type="text"
              id="slug"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={newCategorySlug}
              onChange={(e) => setNewCategorySlug(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <div className="flex space-x-4">
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {editingCategory ? "Kategoriyi Güncelle" : "Kategori Ekle"}
            </button>
            {editingCategory && (
              <button
                type="button"
                onClick={() => {
                  setEditingCategory(null);
                  setNewCategoryName("");
                  setNewCategorySlug("");
                }}
                className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                İptal
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Mevcut Kategoriler
        </h2>
        {categories.length === 0 ? (
          <p className="text-gray-600">Henüz kategori bulunmamaktadır.</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {categories.map((category) => (
              <li
                key={category.id}
                className="py-4 flex justify-between items-center"
              >
                <div>
                  <p className="text-lg font-medium text-gray-900">
                    {category.name}
                  </p>
                  <p className="text-sm text-gray-500">Slug: {category.slug}</p>
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() => handleEditCategory(category)}
                    className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                  >
                    Düzenle
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category.id)}
                    className="text-red-600 hover:text-red-900 text-sm font-medium"
                  >
                    Sil
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
